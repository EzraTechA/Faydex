import React, { useEffect, useState } from "react";

export default function MarketTickers() {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMarkets() {
      const res = await fetch("/api/trading/markets");
      if (res.ok) {
        const data = await res.json();
        setMarkets(data.markets);
      }
      setLoading(false);
    }
    fetchMarkets();
  }, []);

  if (loading) return <p>Loading market data...</p>;

  return (
    <div>
      <h2>Market Prices</h2>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Pair</th>
            <th>Last Price</th>
            <th>24h Change (%)</th>
            <th>24h Volume</th>
          </tr>
        </thead>
        <tbody>
          {markets.map(({ pair, lastPrice, change24h, volume24h }) => (
            <tr key={pair}>
              <td>{pair}</td>
              <td>{lastPrice}</td>
              <td style={{ color: change24h >= 0 ? "green" : "red" }}>
                {change24h}%
              </td>
              <td>{volume24h}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
