require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require('cors');

// --- FIXED INITIALIZATION FOR YAHOO-FINANCE2 V3 (CommonJS) ---
const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();

const { HoldingsModel } = require('./Models/HoldingsModel');
const { PositionsModel } = require('./Models/PositionsModel');
const { OrdersModel } = require("./Models/OrdersModel");
const AuthRouter = require('./Routes/AuthRouter');
const UserModel = require('./Models/user'); 

const app = express();
const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

app.use(cors());
app.use(bodyParser.json());

app.use('/auth', AuthRouter);

// 1. GET: Fetch User Balance and Details
app.get("/userDetails/:userId", async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        
        res.status(200).json({
            balance: user.balance,
            name: user.name,
            email: user.email
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching user details", error: err.message });
    }
});

// 2. GET: Dynamic Portfolio Calculation with LIVE Prices
app.get("/allHoldings/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await OrdersModel.find({ user: userId });

    const holdingsMap = {};
    orders.forEach(order => {
      if (!holdingsMap[order.name]) {
        holdingsMap[order.name] = { name: order.name, qty: 0, totalCost: 0 };
      }
      const qty = Number(order.qty);
      const price = Number(order.price);

      if (order.mode === "BUY") {
        holdingsMap[order.name].qty += qty;
        holdingsMap[order.name].totalCost += (qty * price);
      } else {
        holdingsMap[order.name].qty -= qty;
      }
    });

    const activeHoldings = Object.values(holdingsMap).filter(h => h.qty > 0);

    const finalHoldings = await Promise.all(activeHoldings.map(async (h) => {
      const avg = h.totalCost / h.qty;
      let livePrice = avg;

      try {
        const ticker = `${h.name.toUpperCase()}.NS`;
        const quote = await yahooFinance.quote(ticker);
        livePrice = quote.regularMarketPrice || avg;
      } catch (err) {
        console.error(`Live price fetch failed for ${h.name}:`, err.message);
      }

      const netChange = ((livePrice - avg) / avg) * 100;

      return {
        name: h.name,
        qty: h.qty,
        avg: avg,
        price: livePrice,
        net: (netChange >= 0 ? "+" : "") + netChange.toFixed(2) + "%",
        isLoss: netChange < 0
      };
    }));

    res.status(200).json(finalHoldings);
  } catch (err) {
    res.status(500).json({ message: "API Error", error: err.message });
  }
});

// 3. POST: Fetch live prices for Watchlist
app.post("/livePrices", async (req, res) => {
  const { symbols } = req.body;
  try {
    const priceData = await Promise.all(symbols.map(async (symbol) => {
      try {
        const ticker = `${symbol.toUpperCase()}.NS`;
        const quote = await yahooFinance.quote(ticker);
        
        const price = quote.regularMarketPrice || 0;
        const changePercent = quote.regularMarketChangePercent || 0;

        return {
          name: symbol,
          price: price,
          percent: (changePercent >= 0 ? "+" : "") + changePercent.toFixed(2) + "%",
          isDown: changePercent < 0
        };
      } catch (err) {
        console.error(`Error fetching ${symbol}:`, err.message);
        return { name: symbol, price: 0, percent: "0%", isDown: false };
      }
    }));
    res.status(200).json(priceData);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// 4. GET: Fetch All Positions
app.get("/allPositions", async (req, res) => {
    try {
        let allPositions = await PositionsModel.find({});
        res.status(200).json(allPositions);
    } catch (err) {
        res.status(500).json({ message: "Error fetching positions", error: err });
    }
});

// 5. GET: Fetch Specific User Orders
app.get("/allOrders/:userId", async (req, res) => {
    try {
        const orders = await OrdersModel.find({ user: req.params.userId }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: "Error fetching orders", error: err.message });
    }
});

// 6. POST: Place a Buy/Sell Order (UPDATED TO REMOVE POSITION ON EXIT)
app.post("/buyStock", async (req, res) => {
    const { userId, stockSymbol, qty, price, mode } = req.body;
    const totalAmount = Number(qty) * Number(price);

    try {
        const user = await UserModel.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Fund logic
        if (mode === "BUY") {
            if (user.balance < totalAmount) return res.status(400).json({ message: "Insufficient Funds!" });
            user.balance -= totalAmount;
        } else {
            // SELL mode: Add money back to balance
            user.balance += totalAmount;
        }
        await user.save();

        // 1. Save Order (History)
        await new OrdersModel({ user: userId, name: stockSymbol, qty, price, mode }).save();

        // 2. Manage Position
        if (mode === "BUY") {
            // Check if position already exists to avoid duplicates
            const existingPos = await PositionsModel.findOne({ user: userId, name: stockSymbol });
            
            if (existingPos) {
                // Average out or update existing position logic could go here
                existingPos.qty += Number(qty);
                await existingPos.save();
            } else {
                const newPosition = new PositionsModel({
                    user: userId,
                    product: "MIS",
                    name: stockSymbol,
                    qty: Number(qty),
                    avg: Number(price),
                    price: Number(price),
                    net: "+0.00%",
                    day: "+0.00%",
                    isLoss: false
                });
                await newPosition.save();
            }
        } else if (mode === "SELL") {
            // ✅ REMOVE position from DB when squaring off
            await PositionsModel.deleteOne({ user: userId, name: stockSymbol });
        }

        res.status(200).json({ success: true, message: "Transaction successful!", newBalance: user.balance });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 7. POST: Add Funds
app.post("/addFunds", async (req, res) => {
    const { userId, amount } = req.body;
    try {
        const user = await UserModel.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.balance += Number(amount);
        await user.save();

        res.status(200).json({ 
            success: true, 
            message: "Funds Added!", 
            newBalance: user.balance 
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to add funds" });
    }
});

// 8. POST: Withdraw Funds
app.post("/withdrawFunds", async (req, res) => {
    const { userId, amount } = req.body;
    try {
        const user = await UserModel.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.balance < Number(amount)) {
            return res.status(400).json({ message: "Insufficient balance!" });
        }

        user.balance -= Number(amount);
        await user.save();

        res.status(200).json({ 
            success: true, 
            message: "Withdrawal Successful!", 
            newBalance: user.balance 
        });
    } catch (err) {
        res.status(500).json({ message: "Withdrawal failed", error: err.message });
    }
});

mongoose.set("strictQuery", true);
mongoose.connect(uri)
    .then(() => {
        console.log("✅ MongoDB connected successfully");
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ MongoDB connection failed:", err.message);
        process.exit(1);
    });