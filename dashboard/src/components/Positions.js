import React, { useEffect, useState } from "react";
import axios from "axios";

const Positions = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await axios.get("http://localhost:3002/buyOrders");
        setPositions(response.data || []);
      } catch (err) {
        console.error("Failed to fetch positions", err);
        setError("Failed to load positions");
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
  }, []);

  if (loading) {
    return <p>Loading positions...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!positions || positions.length === 0) {
    return <p>No positions yet. Buy a stock to see it here.</p>;
  }

  return (
    <>
      <h3 className="title">Positions ({positions.length})</h3>

      <div className="order-table">
        <table className="positions-table">
          <thead>
            <tr>
              <th>Stock Name</th>
              <th>Qty.</th>
              <th>Buy Price</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((pos, index) => (
              <tr key={index}>
                <td>{pos.name}</td>
                <td>{pos.qty}</td>
                <td>{pos.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Positions;