import React from "react";

function Hero() {
  return (
    <section className="container-fluid" id="supportHero">
      <div className="p-5" id="supportWrapper">
        <h4>Support Portal</h4>
        <a href="#">Track Tickets</a>
      </div>

      <div className="row p-5 m-3">
        <div className="col-6 p-3">
          <h1 className="fs-3">
            Search for an answer or browse help topics to create a ticket
          </h1>
          <input placeholder="Eg. how do I activate F&O" />
          <br />
          <div className="links mt-3 d-flex flex-wrap gap-3">
            <a href="#">Track account opening</a>
            <a href="#">Track segment activation</a>
            <a href="#">Intraday margins</a>
            <a href="#">Kite user manual</a>
          </div>
        </div>

        <div className="col-6 p-3">
          <h1 className="fs-3">Featured</h1>
          <ol>
            <li>
              <a href="#">Current Takeovers and Delisting - January 2024</a>
            </li>
            <li>
              <a href="#">Latest Intraday leverages - MIS & CO</a>
            </li>
          </ol>
        </div>
      </div>

      {/* Embedded CSS styles */}
      <style>{`
      #supportHero {
          background-color: rgb(56, 126, 209);
          color: white; } 
          
      #supportHero a {
        color: white; } 
        
      #supportWrapper {
          display: flex; 
          justify-content: space-between;
          margin: 0 150px; }
          
      #supportHero input {
          padding: 20px 50px;
          width: 100%;
          font-size: 20px;
          border-radius: 10px;
          border: none; }`}</style>
    </section>
  );
}

export default Hero;