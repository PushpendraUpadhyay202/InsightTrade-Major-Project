import React, { useState, useEffect } from "react";
import axios from "axios";
import { DoughnutChart } from "./DoughnutChart"; 
import { VerticalGraph } from "./VerticalGraph"; 

const Summary = () => {
  const [userData, setUserData] = useState({ name: "User", balance: 0 });
  const [holdings, setHoldings] = useState([]);
  const [showGuide, setShowGuide] = useState(false);
  const [showPsychInfo, setShowPsychInfo] = useState(false); // New Psych Info State
  const [marketSentiment, setMarketSentiment] = useState(72); // Mock: Greed
  const [stats, setStats] = useState({
    count: 0, currentValue: 0, investment: 0, pnl: 0, pnlPercent: 0
  });

  const [calc, setCalc] = useState({ entry: 0, sl: 0, target: 0 });
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchAllData = async () => {
      if (!userId) return;
      try {
        const [userRes, holdingsRes] = await Promise.all([
          axios.get(`http://localhost:3002/userDetails/${userId}`),
          axios.get(`http://localhost:3002/allHoldings/${userId}`)
        ]);

        setUserData({ name: userRes.data.name, balance: Number(userRes.data.balance) });
        const data = holdingsRes.data;
        setHoldings(data);

        let totalInvestment = 0;
        let totalCurrentValue = 0;
        data.forEach(stock => {
          totalInvestment += (Number(stock.avg) * Number(stock.qty));
          totalCurrentValue += (Number(stock.price) * Number(stock.qty));
        });

        const totalPnL = totalCurrentValue - totalInvestment;
        setStats({
          count: data.length,
          currentValue: totalCurrentValue,
          investment: totalInvestment,
          pnl: totalPnL,
          pnlPercent: totalInvestment > 0 ? (totalPnL / totalInvestment) * 100 : 0
        });
      } catch (err) {
        console.error("Error updating summary:", err);
      }
    };
    fetchAllData();
    const interval = setInterval(fetchAllData, 30000); 
    return () => clearInterval(interval);
  }, [userId]);

  // --- LOGIC: RISK & SENTIMENT ---
  const riskPerTrade = userData.balance * 0.02; 
  const riskPerShare = calc.entry - calc.sl;
  const rewardPerShare = calc.target - calc.entry;
  const suggestedQty = riskPerShare > 0 ? Math.floor(riskPerTrade / riskPerShare) : 0;
  const rrRatio = riskPerShare > 0 ? (rewardPerShare / riskPerShare).toFixed(2) : 0;

  const getSentiment = (val) => {
    if (val < 25) return { text: "Extreme Fear", color: "#ef4444", advice: "Market is panicking. Look for value." };
    if (val < 45) return { text: "Fear", color: "#f97316", advice: "Caution is high. Stay disciplined." };
    if (val < 55) return { text: "Neutral", color: "#94a3b8", advice: "Balance in the force. Follow the trend." };
    if (val < 75) return { text: "Greed", color: "#10b981", advice: "Optimism is high. Tighten your stops." };
    return { text: "Extreme Greed", color: "#059669", advice: "Market is euphoric. Avoid FOMO!" };
  };

  const sentiment = getSentiment(marketSentiment);
  const totalAccountValue = userData.balance + stats.investment;

  const chartData = {
    labels: holdings.map(s => s.name),
    datasets: [{
      label: "Market Value",
      data: holdings.map(s => s.price * s.qty),
      backgroundColor: ["#38bdf8", "#10b981", "#fbbf24", "#ef4444", "#8b5cf6", "#6366f1"],
      borderWidth: 0,
      borderRadius: 8, 
    }]
  };

  return (
    <div style={styles.container} className="animate-entry">
      
      {/* 1. HEADER SECTION */}
      <header style={styles.welcomeHeader}>
        <div>
            <h2 style={styles.hiText}>Good day, {userData.name}</h2>
            <p style={styles.dateText}>
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
        </div>
        <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
            <button onClick={() => setShowGuide(true)} style={styles.guideBtn}>
                <span style={{fontSize: '14px'}}>💡</span> Portfolio Guide
            </button>
            <div style={styles.marketPulse}>
                <span style={styles.pulseDot} />
                <span style={styles.pulseText}>Market Live</span>
            </div>
        </div>
      </header>

      {/* 2. PORTFOLIO GUIDE MODAL */}
      {showGuide && (
        <div style={styles.modalOverlay} onClick={() => setShowGuide(false)}>
          <div className="bento-card animate-entry" style={styles.guideModal} onClick={e => e.stopPropagation()}>
            <span style={styles.cardTag}> Academy</span>
            <h2 style={{...styles.hiText, fontSize: '24px', color: '#1e293b', marginBottom: '20px'}}>Master Your Portfolio</h2>
            <div style={styles.lessonGrid}>
              <div style={styles.lessonItem}><div style={styles.lessonIcon}>💰</div><div><h4 style={styles.lessonTitle}>The 20% Rule</h4><p style={styles.lessonText}>Keep 20% cash in <strong>Available Margin</strong> to buy during crashes.</p></div></div>
              <div style={styles.lessonItem}><div style={styles.lessonIcon}>📉</div><div><h4 style={styles.lessonTitle}>Stop-Loss Reality</h4><p style={styles.lessonText}>Holdings P&L is "unrealized." Exit if it drops past your planned 10% limit.</p></div></div>
              <div style={styles.lessonItem}><div style={styles.lessonIcon}>🍕</div><div><h4 style={styles.lessonTitle}>Diversification</h4><p style={styles.lessonText}>If one sector is {'>'}30% of your pie, spread your risk immediately.</p></div></div>
            </div>
            <button onClick={() => setShowGuide(false)} style={styles.closeBtn}>Understood, Let's Analyze</button>
          </div>
        </div>
      )}

      {/* 3. TOP ROW: MARGIN & MARKET PSYCHOLOGY */}
      <div style={styles.bentoGridTop}>
        {/* Margin Card */}
        <div className="bento-card" style={styles.mainBalanceCard}>
          <div style={styles.cardHeader}><span style={styles.cardTag}>Available Margin</span><div style={styles.dotIndicator} /></div>
          <h1 className="data-number" style={styles.mainAmount}>₹{userData.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h1>
          <div style={styles.healthBarWrapper}><div style={{...styles.healthBarFill, width: '65%'}} /></div>
          <div style={styles.footerStats}>
            <div style={styles.statBox}><span style={styles.statLabel}>Used Margin</span><span className="data-number" style={styles.statValue}>₹{stats.investment.toLocaleString('en-IN')}</span></div>
            <div style={styles.statBox}><span style={styles.statLabel}>Account Value</span><span className="data-number" style={styles.statValue}>₹{totalAccountValue.toLocaleString('en-IN')}</span></div>
          </div>
        </div>

        {/* Fear & Greed Card */}
        <div className="bento-card" style={styles.fgCard}>
          <div style={styles.cardHeader}>
            <span style={styles.cardTag}>Market Psychology</span>
            <button onClick={() => setShowPsychInfo(true)} style={styles.infoTrigger}>ⓘ</button>
          </div>
          <div style={styles.gaugeContainer}>
            <div style={styles.gaugeTrack}><div style={{...styles.gaugeNeedle, left: `${marketSentiment}%`, background: sentiment.color}} /></div>
            <div style={styles.gaugeLabels}><span>Fear</span><span>Greed</span></div>
          </div>
          <h3 style={{...styles.fgStatus, color: sentiment.color}}>{sentiment.text} ({marketSentiment})</h3>
          <p style={styles.fgAdvice}>{sentiment.advice}</p>

          {/* Inline Psychology Guide (Logic Breakdown) */}
          {showPsychInfo && (
            <div style={styles.modalOverlay} onClick={() => setShowPsychInfo(false)}>
                <div className="bento-card" style={styles.psychModal} onClick={e => e.stopPropagation()}>
                    <h3 style={{...styles.lessonTitle, fontSize: '18px'}}>Why track Psychology?</h3>
                    <p style={styles.lessonText}>Most beginners lose money by buying in <strong>Greed</strong> and selling in <strong>Fear</strong>.</p>
                    <ul style={styles.psychList}>
                        <li>🔴 <strong>Extreme Fear:</strong> Everyone is panicking. Often the best time to buy.</li>
                        <li>🟢 <strong>Extreme Greed:</strong> Market is overheated. Time to take profits.</li>
                    </ul>
                    <button onClick={() => setShowPsychInfo(false)} style={{...styles.closeBtn, background: '#f1f5f9', color: '#1e293b'}}>Close</button>
                </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. MIDDLE ROW: POSITION SIZER (THE RISK LAB) */}
      <div className="bento-card" style={styles.riskCard}>
        <div style={styles.riskHeader}>
            <div><span style={styles.cardTag}>Risk Lab</span><h3 style={{...styles.chartTitle, color: '#1e293b', marginTop: '4px'}}>Trade Planner</h3></div>
            <div style={styles.rrBadge}>Target R:R {'>'} 2.0</div>
        </div>
        <div style={styles.calcGrid}>
            <div style={styles.calcInputGroup}><label style={styles.calcLabel}>Entry</label><input type="number" placeholder="0" style={styles.calcInput} onChange={(e) => setCalc({...calc, entry: e.target.value})} /></div>
            <div style={styles.calcInputGroup}><label style={styles.calcLabel}>Stop Loss</label><input type="number" placeholder="0" style={styles.calcInput} onChange={(e) => setCalc({...calc, sl: e.target.value})} /></div>
            <div style={styles.calcInputGroup}><label style={styles.calcLabel}>Target</label><input type="number" placeholder="0" style={styles.calcInput} onChange={(e) => setCalc({...calc, target: e.target.value})} /></div>
            <div style={styles.calcResultSection}>
                <div style={styles.resBox}><span style={styles.resLabel}>Sugg. Qty</span><span style={styles.resValue}>{suggestedQty}</span></div>
                <div style={styles.resBox}><span style={styles.resLabel}>R:R Ratio</span><span style={{...styles.resValue, color: rrRatio >= 2 ? '#10b981' : '#ef4444'}}>1 : {rrRatio}</span></div>
            </div>
        </div>
      </div>

      {/* 5. BOTTOM ROW: ANALYTICS */}
      <div style={styles.bentoGridBottom}>
        <div className="bento-card" style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Portfolio Exposure</h3>
          <div style={styles.chartWrapper}><DoughnutChart data={chartData} /></div>
        </div>
        <div className="bento-card" style={{ ...styles.chartCard, flex: 1.5 }}>
          <h3 style={styles.chartTitle}>Asset Weightage</h3>
          <div style={styles.graphWrapper}><VerticalGraph data={chartData} /></div>
        </div>
      </div>
    </div>
  );
};

/* ============================ STYLES ============================ */
const styles = {
  container: { maxWidth: "1400px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px", padding: '20px' },
  welcomeHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: "10px" },
  hiText: { fontSize: "32px", fontWeight: "900", color: "#1e293b", margin: 0, letterSpacing: "-0.04em" },
  dateText: { color: "#94a3b8", fontSize: "14px", fontWeight: "600", marginTop: "4px", textTransform: 'uppercase', letterSpacing: '0.05em' },
  
  guideBtn: { background: '#fff', border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '12px', fontSize: '12px', fontWeight: '800', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 },
  guideModal: { width: '100%', maxWidth: '500px', padding: '40px', background: '#fff' },
  psychModal: { width: '90%', maxWidth: '400px', padding: '30px', background: '#fff', borderRadius: '20px' },
  psychList: { listStyle: 'none', padding: 0, margin: '20px 0', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' },
  
  lessonGrid: { display: 'flex', flexDirection: 'column', gap: '24px', margin: '10px 0 30px 0' },
  lessonItem: { display: 'flex', gap: '20px', alignItems: 'flex-start' },
  lessonIcon: { fontSize: '24px', background: '#f8fafc', padding: '12px', borderRadius: '15px' },
  lessonTitle: { fontSize: '15px', fontWeight: '800', color: '#1e293b', margin: '0 0 4px 0' },
  lessonText: { fontSize: '13px', color: '#64748b', lineHeight: '1.6', margin: 0 },
  closeBtn: { width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: '#1e293b', color: '#fff', fontWeight: '800', cursor: 'pointer' },

  marketPulse: { display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', padding: '8px 16px', borderRadius: '20px', border: '1px solid #f1f5f9' },
  pulseDot: { width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' },
  pulseText: { fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' },
  infoTrigger: { background: 'none', border: 'none', color: '#94a3b8', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' },

  bentoGridTop: { display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "24px" },
  bentoGridBottom: { display: "flex", gap: "24px" },
  
  mainBalanceCard: { background: "#fff", padding: "32px", border: '1px solid #f1f5f9' },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  cardTag: { fontSize: "10px", fontWeight: "800", color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase" },
  dotIndicator: { width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" },
  mainAmount: { fontSize: "44px", fontWeight: "900", color: "#1e293b", margin: "0 0 4px 0", letterSpacing: "-0.05em" },
  healthBarWrapper: { height: '4px', width: '100%', background: '#f1f5f9', borderRadius: '2px', margin: '20px 0' },
  healthBarFill: { height: '100%', background: '#38bdf8', borderRadius: '2px' },
  footerStats: { display: "flex", gap: "48px" },
  statBox: { display: "flex", flexDirection: "column", gap: "4px" },
  statLabel: { fontSize: "10px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase" },
  statValue: { fontSize: "16px", fontWeight: "800", color: "#334155" },

  fgCard: { background: "#fff", padding: "32px", border: '1px solid #f1f5f9' },
  gaugeContainer: { margin: '20px 0', position: 'relative' },
  gaugeTrack: { height: '8px', width: '100%', background: 'linear-gradient(to right, #ef4444, #f97316, #eab308, #10b981, #059669)', borderRadius: '4px', position: 'relative' },
  gaugeNeedle: { position: 'absolute', top: '-4px', width: '4px', height: '16px', borderRadius: '2px', border: '2px solid #fff', transition: 'all 0.5s ease' },
  gaugeLabels: { display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '10px', fontWeight: '800', color: '#94a3b8' },
  fgStatus: { fontSize: '20px', fontWeight: '900', margin: '10px 0 4px 0' },
  fgAdvice: { fontSize: '12px', color: '#64748b', fontWeight: '600', margin: 0, lineHeight: '1.4' },

  riskCard: { background: "#fff", padding: "32px", border: '1px solid #f1f5f9' },
  riskHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  rrBadge: { background: '#f1f5f9', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '800', color: '#64748b' },
  calcGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.5fr', gap: '20px', alignItems: 'flex-end' },
  calcInputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  calcLabel: { fontSize: '11px', fontWeight: '800', color: '#94a3b8' },
  calcInput: { padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '14px', fontWeight: '700' },
  calcResultSection: { display: 'flex', gap: '15px', background: '#1e293b', padding: '12px', borderRadius: '12px' },
  resBox: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' },
  resLabel: { fontSize: '9px', color: 'rgba(255,255,255,0.5)', fontWeight: '800' },
  resValue: { fontSize: '18px', color: '#fff', fontWeight: '900' },

  chartCard: { flex: 1, padding: '32px', background: '#fff', border: '1px solid #f1f5f9' },
  chartTitle: { fontSize: "11px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "30px" },
  chartWrapper: { height: "280px", display: "flex", justifyContent: "center", alignItems: "center" },
  graphWrapper: { height: "280px" }
};

export default Summary;