import React, { useState } from "react";
import BuyActionWindow from "./BuyActionWindow";

const GeneralContext = React.createContext({
  openBuyWindow: (uid, price) => {}, // ✅ Added price here
  closeBuyWindow: () => {},
});

export const GeneralContextProvider = (props) => {
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [selectedStockUID, setSelectedStockUID] = useState("");
  const [selectedStockPrice, setSelectedStockPrice] = useState(0); // ✅ New state for price

  const handleOpenBuyWindow = (uid, price) => {
    setIsBuyWindowOpen(true);
    setSelectedStockUID(uid);
    setSelectedStockPrice(price); // ✅ Set the price when window opens
  };

  const handleCloseBuyWindow = () => {
    setIsBuyWindowOpen(false);
    setSelectedStockUID("");
    setSelectedStockPrice(0);
  };

  return (
    <GeneralContext.Provider
      value={{
        openBuyWindow: handleOpenBuyWindow,
        closeBuyWindow: handleCloseBuyWindow,
      }}
    >
      {props.children}
      {/* ✅ Pass both UID and Price to the BuyActionWindow */}
      {isBuyWindowOpen && (
        <BuyActionWindow 
          stockSymbol={selectedStockUID} 
          stockPrice={selectedStockPrice} 
          closeWindow={handleCloseBuyWindow} 
        />
      )}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;