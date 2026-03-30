import React, { useState, useEffect } from "react";
import axios from "axios";

const BuyActionWindow = ({ stockSymbol, stockPrice, closeWindow }) => {
  const [qty, setQty] = useState(1);
  const [stopLoss, setStopLoss] = useState("");
  const [availableFunds, setAvailableFunds] = useState(0);
  const [showGuide, setShowGuide] = useState(false); // New: State for the guide overlay
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchFunds = async () => {
      try {
        const res = await axios.get(`http://localhost:3002/userDetails/${userId}`);
        setAvailableFunds(Number(res.data.balance));
      } catch (err) { console.error("Funds fetch failed"); }
    };
    fetchFunds();
  }, [userId]);

  const totalCost = Number(qty) * stockPrice;
  const isOverBudget = totalCost > availableFunds;
  
  const riskAmount = stopLoss ? (stockPrice - Number(stopLoss)) * Number(qty) : 0;
  const concentrationRisk = availableFunds > 0 ? (totalCost / availableFunds) * 100 : 0;

  const handleBuyClick = async () => {
    if (qty <= 0) return alert("Please enter a valid quantity");
    if (isOverBudget) return alert("Insufficient Funds!");

    try {
      const response = await axios.post("http://localhost:3002/buyStock", {
        userId,
        stockSymbol,
        qty: Number(qty),
        price: stockPrice,
        mode: "BUY",
      });

      if (response.data.success) {
        closeWindow();
        window.location.reload();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Transaction Failed");
    }
  };

  return (
    <div className="buy-modal-overlay">
      <div className="buy-modal">
        {/* Header Section */}
        <div className="modal-header" style={{ background: isOverBudget ? "#ef4444" : "#1e293b" }}>
          <div className="title-group">
            <span className="buy-tag">SIMULATOR ORDER</span>
            <h2>{stockSymbol} <span>Market Buy</span></h2>
          </div>
          {/* New: Subtle Guide Toggle */}
          <button className="how-it-works-link" onClick={() => setShowGuide(true)}>
             💡 Guide
          </button>
        </div>

        {/* Input Section */}
        <div className="modal-body">
          <div className="input-row">
            <div className="input-group">
              <label>Quantity</label>
              <input 
                type="number" 
                value={qty} 
                onChange={(e) => setQty(e.target.value)} 
                autoFocus
              />
            </div>
            <div className="input-group">
              <label>Stop Loss (Optional)</label>
              <input 
                type="number" 
                placeholder="Set Price"
                value={stopLoss} 
                onChange={(e) => setStopLoss(e.target.value)} 
              />
            </div>
          </div>

          <div className="risk-analysis-box">
             <div className="risk-metric">
                <span>Buying Power:</span>
                <span style={{ color: isOverBudget ? "#ef4444" : "#10b981", fontWeight: '700' }}>
                    ₹{availableFunds.toLocaleString()}
                </span>
             </div>
             {stopLoss && riskAmount > 0 && (
                <div className="risk-metric">
                    <span>Virtual Cash at Risk:</span>
                    <span style={{ color: "#ef4444" }}>₹{riskAmount.toLocaleString()}</span>
                </div>
             )}
             {concentrationRisk > 50 && !isOverBudget && (
                <p className="risk-warning">
                    ⚠️ <strong>Concentration Risk:</strong> This trade uses {concentrationRisk.toFixed(0)}% of your capital. Consider diversifying!
                </p>
             )}
          </div>
        </div>

        {/* Footer / Summary Section */}
        <div className="modal-footer">
          <div className="margin-info">
            <span className="label">Total Margin Required</span>
            <span className="value" style={{ color: isOverBudget ? "#ef4444" : "#1e293b" }}>
                ₹{totalCost.toLocaleString()}
            </span>
          </div>
          
          <div className="button-group">
            <button 
                className="btn-buy-main" 
                onClick={handleBuyClick}
                disabled={isOverBudget}
                style={{ opacity: isOverBudget ? 0.5 : 1, background: isOverBudget ? "#64748b" : "#1e293b" }}
            >
              {isOverBudget ? "Insufficient Funds" : "Execute Trade"}
            </button>
            <button className="btn-cancel-main" onClick={closeWindow}>Cancel</button>
          </div>
        </div>

        {/* --- SIMULATOR GUIDE OVERLAY ('samyak Story) --- */}
        {showGuide && (
          <div className="guide-inner-overlay">
             <div className="guide-card">
                <h3>Trading Coach</h3>
                <p className="guide-context">Meet Samyak. He's buying {stockSymbol} shares. Here is how he stays safe:</p>
                
                <div className="guide-point">
                   <div className="point-icon">1</div>
                   <div className="point-text">
                      <strong>The Safety Rail:</strong> If Samyak types 1000 shares but only has cash for 100, the header turns <strong>Red</strong> immediately.
                   </div>
                </div>

                <div className="guide-point">
                   <div className="point-icon">2</div>
                   <div className="point-text">
                      <strong>The Seatbelt:</strong> He sets a Stop-Loss at ₹95. The simulator calculates his "Cash at Risk" so he's never surprised by a loss.
                   </div>
                </div>

                <div className="guide-point">
                   <div className="point-icon">3</div>
                   <div className="point-text">
                      <strong>The Basket Rule:</strong> If he puts all his money into {stockSymbol}, we warn him. It's safer to spread money across different stocks.
                   </div>
                </div>

                <button className="guide-close-btn" onClick={() => setShowGuide(false)}>Got it, let's trade!</button>
             </div>
          </div>
        )}
      </div>

      <style>{`
        .buy-modal-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(8px);
          display: flex; justify-content: center; align-items: center;
          z-index: 9999;
          font-family: 'Inter', sans-serif;
        }

        .buy-modal {
          background: #ffffff;
          width: 420px;
          border-radius: 24px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          overflow: hidden;
          position: relative;
        }

        .modal-header {
          padding: 24px;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: background 0.3s ease;
        }

        .how-it-works-link {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .how-it-works-link:hover { background: rgba(255,255,255,0.2); }

        .buy-tag {
          background: rgba(255,255,255,0.15);
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 10px;
          font-weight: 700;
          display: block;
          margin-bottom: 8px;
          width: fit-content;
        }

        .modal-body { padding: 24px; }
        .input-row { display: flex; gap: 16px; margin-bottom: 16px; }
        .input-group { flex: 1; }
        .input-group label { display: block; font-size: 12px; color: #64748b; margin-bottom: 8px; font-weight: 600; }
        .input-group input {
          width: 100%; padding: 12px; border: 1px solid #e2e8f0;
          border-radius: 12px; font-size: 16px; font-weight: 600;
          box-sizing: border-box; outline: none;
        }

        .risk-analysis-box {
          background: #f8fafc;
          border-radius: 12px;
          padding: 16px;
          margin-top: 8px;
        }

        .risk-metric {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          margin-bottom: 8px;
          color: #475569;
        }

        .risk-warning {
          font-size: 11px;
          color: #b45309;
          margin: 12px 0 0 0;
          line-height: 1.4;
          padding-top: 10px;
          border-top: 1px solid #e2e8f0;
        }

        .modal-footer { padding: 24px; border-top: 1px solid #f1f5f9; }
        .margin-info { display: flex; justify-content: space-between; margin-bottom: 20px; }
        .margin-info .label { color: #64748b; font-size: 13px; font-weight: 500; }
        .margin-info .value { font-weight: 800; font-size: 18px; }

        .btn-buy-main {
          flex: 2; color: white; border: none;
          padding: 16px; border-radius: 12px; font-weight: 700; cursor: pointer;
          font-size: 15px; transition: all 0.2s;
        }

        .btn-cancel-main {
          flex: 1; background: none; color: #94a3b8; border: none;
          cursor: pointer; font-weight: 600;
        }

        /* Guide Overlay Styles */
        .guide-inner-overlay {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(4px);
          z-index: 100; display: flex; align-items: center; justify-content: center;
          padding: 30px; animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .guide-card { color: white; text-align: left; }
        .guide-card h3 { color: #38bdf8; margin: 0 0 10px 0; font-size: 20px; }
        .guide-context { font-size: 13px; color: #94a3b8; margin-bottom: 25px; line-height: 1.4; }
        
        .guide-point { display: flex; gap: 15px; margin-bottom: 20px; }
        .point-icon { 
          min-width: 24px; height: 24px; background: #38bdf8; color: #0f172a; 
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 12px;
        }
        .point-text { font-size: 13px; color: #cbd5e1; line-height: 1.5; }
        .point-text strong { color: white; }

        .guide-close-btn {
          width: 100%; padding: 14px; background: white; color: #0f172a;
          border: none; border-radius: 12px; font-weight: 700; cursor: pointer;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default BuyActionWindow;