// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Register from "./pages/signup";
import Login from "./pages/SignIn";
import Profile from "./pages/profile";
import SubmitKYC from "./pages/kyc";
import WalletBalances from "./pages/wallet";
import MarketTickers from "./pages/marketTickers";
import PlaceOrder from "./pages/newOrder";

import SignIn from "./pages/SignIn";
import Callback from "./components/Callback";
// import Dashboard from "./pages/Dashboard"; // if you still want this
// import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/login"
          element={
            <Login
              onLogin={() => {
                /* handle login state here */
              }}
            />
          }
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/submit-kyc" element={<SubmitKYC />} />
        <Route path="/wallet-balances" element={<WalletBalances />} />
        <Route path="/market-tickers" element={<MarketTickers />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/callback" element={<Callback />} />
        {/* <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
