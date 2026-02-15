// import React from "react";
// import { Link } from "react-router-dom";

// const Funds = () => {
//   return (
//     <>
//       <div className="funds">
//         <p>Let's Start trading </p>
//         <Link className="btn btn-green">Add funds</Link>
//         <Link className="btn btn-blue">Withdraw</Link>
//       </div>

//       <div className="row">
//         <div className="col">
//           <span>
//             <p>Equity</p>
//           </span>

//           <div className="table">
//             <div className="data">
//               <p>Available margin</p>
//               <p className="imp colored">4,043.10</p>
//             </div>
//             <div className="data">
//               <p>Used margin</p>
//               <p className="imp">3,757.30</p>
//             </div>
//             <div className="data">
//               <p>Available cash</p>
//               <p className="imp">4,043.10</p>
//             </div>
//             <hr />
//             <div className="data">
//               <p>Opening Balance</p>
//               <p>4,043.10</p>
//             </div>
//             <div className="data">
//               <p>Opening Balance</p>
//               <p>3736.40</p>
//             </div>
//             <div className="data">
//               <p>Payin</p>
//               <p>4064.00</p>
//             </div>
//             <div className="data">
//               <p>SPAN</p>
//               <p>0.00</p>
//             </div>
//             <div className="data">
//               <p>Delivery margin</p>
//               <p>0.00</p>
//             </div>
//             <div className="data">
//               <p>Exposure</p>
//               <p>0.00</p>
//             </div>
//             <div className="data">
//               <p>Options premium</p>
//               <p>0.00</p>
//             </div>
//             <hr />
//             <div className="data">
//               <p>Collateral (Liquid funds)</p>
//               <p>0.00</p>
//             </div>
//             <div className="data">
//               <p>Collateral (Equity)</p>
//               <p>0.00</p>
//             </div>
//             <div className="data">
//               <p>Total Collateral</p>
//               <p>0.00</p>
//             </div>
//           </div>
//         </div>

//         <div className="col">
//           <div className="commodity">
//             <p>You don't have a commodity account</p>
//             <Link className="btn btn-blue">Open Account</Link>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Funds;

import React, { useState, useContext } from "react";
import "./Funds.css";
import GeneralContext from "./GeneralContext";

const Funds = () => {
  const { walletBalance, setWalletBalance } = useContext(GeneralContext);

  const [amount, setAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const handleAddBalance = () => {
    const amountValue = Number(amount);

    if (isNaN(amountValue) || amountValue <= 0) {
      alert("Enter a valid amount");
      return;
    }

    setWalletBalance(walletBalance + amountValue);
    setAmount("");
  };

  const handleWithdrawBalance = () => {
    const withdrawValue = Number(withdrawAmount);

    if (isNaN(withdrawValue) || withdrawValue <= 0) {
      alert("Enter a valid amount");
      return;
    }

    if (withdrawValue > walletBalance) {
      alert("Insufficient balance");
      return;
    }

    setWalletBalance(walletBalance - withdrawValue);
    setWithdrawAmount("");
  };

  return (
    <div className="funds-container">
      <div className="funds-card">
        <h3>Wallet Balance</h3>
        <h2>₹ {walletBalance}</h2>

        <input
          type="number"
          placeholder="Enter balance to start trading"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button onClick={handleAddBalance}>Add Balance</button>
      </div>
      {/* {withdraw funds card} */}
      <div className="funds-card">
        <h3>Withdraw funds</h3>
        <h2>₹</h2>
        <input
          type="number"
          placeholder="Enter amount"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
        />
        <button
          className="withdraw-btn"
          onClick={handleWithdrawBalance}
          disabled={walletBalance <= 0}
        >
          Withdraw
        </button>
      </div>
    </div>
  );
};

export default Funds;
