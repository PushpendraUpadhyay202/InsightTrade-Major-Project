import React from "react";

function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="row footer-top">
            {/* Brand */}
            <div className="col-md-3 footer-brand">
              <img src="/media/images/log.svg" alt="InsightTrade" />
              <p className="copyright">
                © 2010 – 2024, Not InsightTrade Broking Ltd.
                <br />
                All rights reserved.
              </p>
            </div>

            {/* Company */}
            <div className="col-md-3 footer-col">
              <h5>Company</h5>
              <a href="#">About</a>
              <a href="#">Products</a>
              <a href="#">Pricing</a>
              <a href="#">Referral programme</a>
              <a href="#">Careers</a>
              <a href="#">InsightTrade.tech</a>
              <a href="#">Press & media</a>
              <a href="#">InsightTrade cares (CSR)</a>
            </div>

            {/* Support */}
            <div className="col-md-3 footer-col">
              <h5>Support</h5>
              <a href="#">Contact</a>
              <a href="#">Support portal</a>
              <a href="#">I-Connect blog</a>
              <a href="#">List of charges</a>
              <a href="#">Downloads & resources</a>
            </div>

            {/* Account */}
            <div className="col-md-3 footer-col">
              <h5>Account</h5>
              <a href="#">Open an account</a>
              <a href="#">Fund transfer</a>
              <a href="#">60 day challenge</a>
            </div>
          </div>

          {/* Legal */}
          <div className="footer-legal">
            <p>
              InsightTrade Broking Ltd.: Member of NSE & BSE – SEBI Registration
              no.: INZ000031633. Depository services through InsightTrade
              Securities Pvt. Ltd. – SEBI Registration no.: IN-DP-100-2015.
            </p>

            <p>
              Procedure to file a complaint on SEBI SCORES: Register on SCORES
              portal. Mandatory details: Name, PAN, Address, Mobile Number,
              E-mail ID.
            </p>

            <p>
              Investments in securities market are subject to market risks; read
              all related documents carefully before investing.
            </p>

            <p>
              Prevent unauthorised transactions. Update your mobile number/email
              with your broker. KYC is a one-time process.
            </p>
          </div>
        </div>
      </footer>

      {/* ✨ Styles */}
      <style>{`
        .footer {
          background: #fafafa;
          border-top: 1px solid #e5e5e5;
          padding: 60px 0 30px;
          margin-left:150px;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .footer-top {
          margin-bottom: 40px;
        }

        .footer-brand img {
          width: 160px;
          margin-bottom: 14px;
        }

        .copyright {
          font-size: 14px;
          color: #666;
          line-height: 1.6;
        }

        .footer-col h5 {
          font-size: 18px;
          margin-bottom: 14px;
          color: #222;
          font-weight: 600;
        }

        .footer-col a {
          display: block;
          font-size: 15px;
          color: #666;
          text-decoration: none;
          margin-bottom: 8px;
          transition: all 0.2s ease;
        }

        .footer-col a:hover {
          color: #387ed1;
          transform: translateX(4px);
        }

        .footer-legal {
          border-top: 1px solid #eaeaea;
          padding-top: 25px;
          font-size: 14px;
          color: #777;
          line-height: 1.7;
        }

        .footer-legal p {
          margin-bottom: 12px;
        }

        @media (max-width: 768px) {
          .footer {
            padding: 40px 20px;
          }

          .footer-col {
            margin-bottom: 30px;
          }

          .footer-brand img {
            width: 140px;
          }
        }
      `}</style>
    </>
  );
}

export default Footer;
