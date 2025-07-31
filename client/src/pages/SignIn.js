import React, { useState } from "react";

const SignIn = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const generateSignInUrl = () => {
    const params = new URLSearchParams({
      client_id: process.env.REACT_APP_CLIENT_ID,
      redirect_uri: process.env.REACT_APP_REDIRECT_URI,
      response_type: "code",
      scope: "openid profile email",
      acr_values:
        "mosip:idp:acr:generated-code mosip:idp:acr:linked-wallet mosip:idp:acr:biometrics",
      claims:
        '{"userinfo":{"name":{"essential":true},"phone":{"essential":true},"email":{"essential":true},"picture":{"essential":true},"gender":{"essential":true},"birthdate":{"essential":true},"address":{"essential":true}},"id_token":{}}',
      code_challenge: "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM",
      code_challenge_method: "S256",
      display: "page",
      nonce: "g4DEuje5Fx57Vb64dO4oqLHXGT8L8G7g",
      state: "ptOO76SD",
      ui_locales: "en",
    });
    return `${
      process.env.REACT_APP_AUTHORIZATION_ENDPOINT
    }?${params.toString()}`;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        // Redirect or update UI on success
        window.location.href = "/dashboard";
      } else {
        const data = await res.json();
        setError(data.message || "Login failed");
      }
    } catch {
      setError("Network error");
    }
    setLoading(false);
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h1 style={styles.heading}>
          Welcome to Fayda Mock Relying Party Portal
        </h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            required
            value={form.username}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={form.password}
            onChange={handleChange}
            style={styles.input}
          />
          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
        <p>or</p>
        <a href={generateSignInUrl()} style={styles.link}>
          Sign in with Fayda E-Signet
        </a>
      </div>
      <footer style={styles.footer}>
        &copy; 2025 National ID. All Rights Reserved.
      </footer>
    </div>
  );
};

const styles = {
  // your styles here (same as original)
};

export default SignIn;
