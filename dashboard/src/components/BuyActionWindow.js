import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";

import axios from "axios";

import GeneralContext from "./GeneralContext";

import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid }) => {
  const { walletBalance, setWalletBalance, closeBuyWindow, addOrder } =
    useContext(GeneralContext);

  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);

  const quantity = Number(stockQuantity);
  const price = Number(stockPrice);
  const totalCost = quantity * price;

  const isInvalidQuantity = isNaN(quantity) || quantity <= 0;
  const isInvalidPrice = isNaN(price) || price <= 0;
  const exceedsWallet = totalCost > walletBalance;
  const hasNoWallet = walletBalance <= 0;

  const isBuyDisabled =
    isInvalidQuantity || isInvalidPrice || hasNoWallet || exceedsWallet;

  const errorMessage =
    exceedsWallet || hasNoWallet ? "Insufficient wallet balance" : "";

  const handleBuyClick = () => {
    if (isBuyDisabled) {
      return;
    }

    const newBalance = walletBalance - totalCost;

    if (newBalance < 0) {
      return;
    }

    // Deduct only the total cost from the wallet
    setWalletBalance(newBalance);

    const order = {
      name: uid,
      quantity,
      price,
      totalCost,
      mode: "BUY",
    };

    // Add order to global orders list
    addOrder(order);

    // Complete the order on backend
    axios.post("http://localhost:3002/newOrder", {
      name: uid,
      qty: quantity,
      price,
      mode: "BUY",
    });

    closeBuyWindow();
  };

  const handleCancelClick = () => {
    closeBuyWindow();
  };

  return (
    <div className="container" id="buy-window" draggable="true">
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              min="1"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              min="0"
              value={stockPrice}
              onChange={(e) => setStockPrice(e.target.value)}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>
          Margin required ₹{isNaN(totalCost) ? 0 : totalCost.toFixed(2)}
        </span>
        <div>
          <button
            className="btn btn-blue"
            onClick={handleBuyClick}
            disabled={isBuyDisabled}
          >
            Buy
          </button>
          <Link to="" className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </Link>
        </div>
        {errorMessage && <div className="error-text">{errorMessage}</div>}
      </div>
    </div>
  );
};

export default BuyActionWindow;

