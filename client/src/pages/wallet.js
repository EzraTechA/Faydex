import React, { useEffect, useState } from "react";

export default function WalletBalances() {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchWallets() {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch("/api/wallets", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setWallets(data.wallets);
        } else {
          setError("Failed to fetch wallets.");
        }
      } catch {
        setError("Network error.");
      } finally {
        setLoading(false);
      }
    }
    fetchWallets();
  }, []);

  if (loading) return <p>Loading wallets...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Your Wallet Balances</h2>
      <ul>
        {wallets.map(({ currency, balance, available }) => (
          <li key={currency}>
            <strong>{currency}:</strong> Balance: {balance} (Available:{" "}
            {available})
          </li>
        ))}
      </ul>
    </div>
  );
}
