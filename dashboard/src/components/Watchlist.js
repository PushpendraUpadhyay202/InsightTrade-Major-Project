import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import { BarChartOutlined, KeyboardArrowDown, KeyboardArrowUp, AddCircleOutline } from "@mui/icons-material";
import { watchlist as initialWatchlist } from "../data/data";

const WatchList = () => {
  const [liveWatchlist, setLiveWatchlist] = useState([]);

  useEffect(() => {
    const fetchLivePrices = async () => {
      try {
        const symbols = initialWatchlist.map((s) => s.name);
        const res = await axios.post("http://localhost:3002/livePrices", { symbols });
        setLiveWatchlist(res.data);
      } catch (err) {
        console.error("Watchlist sync failed:", err);
        setLiveWatchlist(initialWatchlist);
      }
    };

    fetchLivePrices();
    const interval = setInterval(fetchLivePrices, 60000); // Sync every 1 minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.watchlistContainer}>
      <div className="custom-scroll" style={styles.scrollArea}>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {liveWatchlist.map((stock, index) => (
            <WatchListItem stock={stock} key={index} />
          ))}
        </ul>
      </div>
    </div>
  );
};

const WatchListItem = ({ stock }) => {
  const [isHovered, setIsHovered] = useState(false);
  const generalContext = useContext(GeneralContext);

  // Safety: Fallback to 0 if price is undefined/null to prevent crash
  const currentPrice = stock.price ?? 0;
  const priceColor = stock.isDown ? "var(--accent-red)" : "var(--accent-green)";

  return (
    <li 
      className="stock-row" 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)} 
      style={{
        ...styles.stockRow,
        borderLeft: isHovered ? `4px solid ${priceColor}` : "4px solid transparent",
        backgroundColor: isHovered ? "rgba(0,0,0,0.02)" : "transparent"
      }}
    >
      <div style={styles.itemMain}>
        <div style={styles.symbolRow}>
          <p style={{ ...styles.symbol, color: priceColor }}>{stock.name}</p>
          <span className="data-number" style={{...styles.priceText, color: isHovered ? priceColor : "var(--text-main)"}}>
            {/* ✅ Fixed: Added fallback to prevent toLocaleString error */}
            {currentPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        </div>
        
        <div style={styles.itemInfo}>
          <span style={styles.percentText}>{stock.percent || "0.00%"}</span>
          {stock.isDown ? 
            <KeyboardArrowDown style={{fontSize: "14px", color: "var(--accent-red)"}} /> : 
            <KeyboardArrowUp style={{fontSize: "14px", color: "var(--accent-green)"}} />
          }
        </div>
      </div>

      {isHovered && (
        <div className="animate-entry" style={styles.actionsBox}>
          <button 
            style={styles.buyBtn} 
            onClick={() => generalContext.openBuyWindow(stock.name, currentPrice)}
          >
            BUY
          </button>
          {/* <button style={styles.sellBtn}>SELL</button> */}
          {/* <button style={styles.iconBtn}><BarChartOutlined style={{fontSize: "18px"}}/></button> */}
          {/* <button style={styles.iconBtn}><AddCircleOutline style={{fontSize: "18px"}}/></button> */}
        </div>
      )}
    </li>
  );
};

const styles = {
  watchlistContainer: { 
    width: "100%", height: "100%", background: "transparent", 
    display: "flex", flexDirection: "column", borderRight: "1px solid rgba(0,0,0,0.05)"
  },
  scrollArea: { flex: 1, overflowY: "auto", background: "#fff" },
  stockRow: { 
    display: "flex", flexDirection: "column", padding: "14px 20px", 
    borderBottom: "1px solid rgba(0,0,0,0.03)", cursor: "pointer", 
    position: "relative", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
  },
  symbolRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  symbol: { fontSize: "13px", fontWeight: "700", margin: 0, letterSpacing: "-0.01em" },
  itemInfo: { display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" },
  percentText: { fontSize: "11px", color: "var(--text-muted)", fontWeight: "500" },
  priceText: { fontSize: "14px", fontWeight: "600", transition: "color 0.2s ease" },
  actionsBox: { 
    position: "absolute", top: 0, bottom: 0, right: 0, display: "flex", 
    alignItems: "center", gap: "4px", background: "linear-gradient(to left, #fff 85%, transparent)", 
    padding: "0 15px 0 40px", zIndex: 2
  },
  buyBtn: { border: "none", borderRadius: "4px", padding: "6px 12px", background: "var(--accent-blue)", color: "#fff", fontWeight: "800", fontSize: "10px", cursor: "pointer" },
  sellBtn: { border: "none", borderRadius: "4px", padding: "6px 12px", background: "var(--accent-red)", color: "#fff", fontWeight: "800", fontSize: "10px", cursor: "pointer" },
  iconBtn: { background: "rgba(0,0,0,0.03)", border: "none", borderRadius: "4px", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", cursor: "pointer" }
};

export default WatchList;