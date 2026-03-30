import React from "react";

function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-grid">
            {/* Brand */}
            <div className="footer-brand">
              <div className="brand-logo">📈 InsightTrade</div>
              <p className="copyright">
                © 2010 – 2026, Not InsightTrade Broking Ltd.
                <br />
                All rights reserved.
              </p>
            </div>

            {/* Company */}
            <div className="footer-col">
              <h5>Company</h5>
              <a href="#">About</a>
              <a href="#">Products</a>
              <a href="#">Pricing</a>
              <a href="#">Referral programme</a>
              <a href="#">Careers</a>
            </div>

            {/* Support */}
            <div className="footer-col">
              <h5>Support</h5>
              <a href="#">Contact</a>
              <a href="#">Support portal</a>
              <a href="#">I-Connect blog</a>
              <a href="#">List of charges</a>
            </div>

            {/* Account */}
            <div className="footer-col">
              <h5>Account</h5>
              <a href="#">Open an account</a>
              <a href="#">Fund transfer</a>
              <a href="#">60 day challenge</a>
            </div>
          </div>

          {/* Legal Section */}
          <div className="footer-legal">
            <p>
              <strong>Disclaimer:</strong> This is a simulation tool for educational purposes. 
              InsightTrade Broking Ltd.: Member of NSE & BSE – SEBI Registration
              no.: INZ000031633. Depository services through InsightTrade
              Securities Pvt. Ltd. – SEBI Registration no.: IN-DP-100-2015.
            </p>

            <p>
              Investments in securities market are subject to market risks; read
              all related documents carefully before investing. Prevent unauthorised 
              transactions by updating your mobile number/email with your broker.
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        .footer {
          background: #ffffff;
          border-top: 1px solid #e2e8f0;
          padding: 80px 0 40px;
          font-family: 'Inter', sans-serif;
          width: 100%;
        }

        .footer-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 40px;
          margin-bottom: 60px;
        }

        .brand-logo {
          font-size: 1.25rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 16px;
          letter-spacing: -0.025em;
        }

        .copyright {
          font-size: 0.85rem;
          color: #64748b;
          line-height: 1.6;
        }

        .footer-col h5 {
          font-size: 0.95rem;
          margin-bottom: 20px;
          color: #0f172a;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .footer-col a {
          display: block;
          font-size: 0.9rem;
          color: #64748b;
          text-decoration: none;
          margin-bottom: 12px;
          transition: color 0.2s ease;
        }

        .footer-col a:hover {
          color: #3b82f6;
        }

        .footer-legal {
          border-top: 1px solid #f1f5f9;
          padding-top: 32px;
          font-size: 0.75rem;
          color: #94a3b8;
          line-height: 1.8;
          text-align: justify;
        }

        .footer-legal p {
          margin-bottom: 16px;
        }

        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
          }
          .footer-brand {
            grid-column: span 2;
            margin-bottom: 20px;
          }
        }

        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }
          .footer-brand {
            grid-column: span 1;
          }
          .footer {
            padding: 60px 0 30px;
          }
        }
      `}</style>
    </>
  );
}

export default Footer;