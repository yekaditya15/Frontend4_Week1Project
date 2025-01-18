import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false"
        );
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const filteredData = data
    .filter((coin) =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortType === "marketCap") {
        return b.market_cap - a.market_cap;
      } else if (sortType === "percentageChange") {
        return b.price_change_percentage_24h - a.price_change_percentage_24h;
      }
      return 0;
    });

  return (
    <div className="app">
      <div className="container">
        <div className="controls">
          <input
            type="text"
            placeholder="Search By Name or Symbol"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={() => setSortType("marketCap")}>
            Sort By Mkt Cap
          </button>
          <button onClick={() => setSortType("percentageChange")}>
            Sort by percentage
          </button>
        </div>
        <div className="table">
          {filteredData.map((coin) => (
            <div key={coin.id} className="row">
              <div className="cell">
                <img src={coin.image} alt={coin.name} className="coin-image" />
                <span>{coin.name}</span>
              </div>
              <div className="cell">{coin.symbol.toUpperCase()}</div>
              <div className="cell">${coin.current_price.toLocaleString()}</div>
              <div className="cell">${coin.total_volume.toLocaleString()}</div>
              <div
                className={`cell ${
                  coin.price_change_percentage_24h >= 0
                    ? "positive"
                    : "negative"
                }`}
              >
                {coin.price_change_percentage_24h?.toFixed(2)}%
              </div>
              <div className="cell">
                Mkt Cap : ${coin.market_cap.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
