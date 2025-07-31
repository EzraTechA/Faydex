import React, { useState } from "react";

export default function PlaceOrder() {
  const [form, setForm] = useState({
    pair: "BTC/USDT",
    side: "buy",
    type: "limit",
    price: "",
    quantity: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("/api/trading/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Order placed successfully.");
      } else {
        setMessage(data.message || "Failed to place order.");
      }
    } catch {
      setMessage("Network error.");
    }
  };

  return (
    <div>
      <h2>Place New Order</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Pair:
          <select name="pair" value={form.pair} onChange={handleChange}>
            <option value="BTC/USDT">BTC/USDT</option>
            <option value="ETH/USDT">ETH/USDT</option>
            {/* Add more pairs as needed */}
          </select>
        </label>
        <br />
        <label>
          Side:
          <select name="side" value={form.side} onChange={handleChange}>
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </label>
        <br />
        <label>
          Type:
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="limit">Limit</option>
            <option value="market">Market</option>
          </select>
        </label>
        <br />
        {form.type === "limit" && (
          <label>
            Price:
            <input
              name="price"
              type="number"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              required={form.type === "limit"}
            />
          </label>
        )}
        <br />
        <label>
          Quantity:
          <input
            name="quantity"
            type="number"
            step="0.0001"
            value={form.quantity}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <button type="submit">Place Order</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
