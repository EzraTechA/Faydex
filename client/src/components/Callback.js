import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import * as jose from "jose";

const Callback = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const fetchToken = async (code) => {
      try {
        const response = await axios.post("http://localhost:8000/api/token", {
          code,
        });
        const { access_token } = response.data;
        console.log("Access token:", access_token);

        const userInfoResponse = await axios.post(
          "http://localhost:8000/api/userinfo/",
          {
            access_token,
          }
        );

        console.log("User info response:", userInfoResponse.data);
        const decodedUserInfo = decodeUserInfoResponse(userInfoResponse.data);
        console.log("Decoded user info:", decodedUserInfo);

        if (isMounted) {
          setUserInfo(decodedUserInfo);
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching token or user info:", err);
        if (isMounted) {
          setError("Failed to fetch token or user info.");
          setUserInfo(null);
        }
      }
    };

    const query = new URLSearchParams(location.search);
    const code = query.get("code");

    if (code) {
      fetchToken(code);
    } else {
      setError("Authorization code missing in URL.");
    }

    return () => {
      isMounted = false;
    };
  }, [location.search]);

  return (
    <div
      className="container-fluid"
      style={{
        backgroundColor: "#1a1a2e",
        color: "white",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: "20px",
      }}>
      <header
        className="navbar navbar-dark w-100"
        style={{
          backgroundColor: "#0f3460",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          padding: "15px",
          textAlign: "center",
        }}>
        <h1
          className="navbar-brand"
          style={{
            color: "#f8c94e",
            fontSize: "1.75rem",
            display: "flex",
            alignItems: "center",
          }}>
          <img
            src="./national-id-logo.png"
            alt="Logo"
            width="50"
            height="50"
            style={{ marginRight: "15px" }}
          />
          Fayda Mock Relying Party - User Info
        </h1>
      </header>

      <main
        className="container my-5"
        style={{ width: "100%", maxWidth: "900px", textAlign: "center" }}>
        {error && <p style={{ color: "red" }}>{error}</p>}

        {userInfo ? (
          <div
            className="card my-4"
            style={{
              backgroundColor: "#162447",
              borderRadius: "15px",
              boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)",
              border: "none",
            }}>
            <div className="card-body" style={{ padding: "30px" }}>
              <h5
                className="card-title text-center"
                style={{ color: "#f8c94e", fontWeight: 600 }}>
                User Information
              </h5>
              <ul
                className="list-group list-group-flush"
                style={{ listStyleType: "none", padding: 0 }}>
                <li
                  className="list-group-item"
                  style={{
                    backgroundColor: "#0f3460",
                    borderColor: "#f8c94e",
                    color: "white",
                    textAlign: "left",
                    paddingLeft: "20px",
                  }}>
                  <strong>Name:</strong> {userInfo.name || "N/A"}
                </li>
                <li
                  className="list-group-item"
                  style={{
                    backgroundColor: "#0f3460",
                    borderColor: "#f8c94e",
                    color: "white",
                    textAlign: "left",
                    paddingLeft: "20px",
                  }}>
                  <strong>Email:</strong> {userInfo.email || "N/A"}
                </li>
                <li
                  className="list-group-item"
                  style={{
                    backgroundColor: "#0f3460",
                    borderColor: "#f8c94e",
                    color: "white",
                    textAlign: "left",
                    paddingLeft: "20px",
                  }}>
                  <strong>Gender:</strong> {userInfo.gender || "N/A"}
                </li>
                <li
                  className="list-group-item"
                  style={{
                    backgroundColor: "#0f3460",
                    borderColor: "#f8c94e",
                    color: "white",
                    textAlign: "left",
                    paddingLeft: "20px",
                  }}>
                  <strong>Phone:</strong> {userInfo.phone_number || "N/A"}
                </li>
                <li
                  className="list-group-item"
                  style={{
                    backgroundColor: "#0f3460",
                    borderColor: "#f8c94e",
                    color: "white",
                    textAlign: "left",
                    paddingLeft: "20px",
                  }}>
                  <strong>Nationality:</strong> {userInfo.nationality || "N/A"}
                </li>
                <li
                  className="list-group-item"
                  style={{
                    backgroundColor: "#0f3460",
                    borderColor: "#f8c94e",
                    color: "white",
                    textAlign: "left",
                    paddingLeft: "20px",
                  }}>
                  <strong>Date of Birth:</strong> {userInfo.birthdate || "N/A"}
                </li>
                <li
                  className="list-group-item"
                  style={{
                    backgroundColor: "#0f3460",
                    borderColor: "#f8c94e",
                    color: "white",
                    textAlign: "left",
                    paddingLeft: "20px",
                  }}>
                  <strong>Address:</strong>{" "}
                  {userInfo.address
                    ? `${userInfo.address.zone}, ${userInfo.address.woreda}, ${userInfo.address.region}`
                    : "N/A"}
                </li>
                {userInfo.picture && (
                  <li
                    className="list-group-item"
                    style={{
                      backgroundColor: "#0f3460",
                      borderColor: "#f8c94e",
                    }}>
                    <img
                      src={userInfo.picture}
                      alt="User"
                      className="img-fluid rounded-circle"
                      width="150"
                      style={{
                        border: "3px solid rgb(193, 160, 77)",
                        padding: "5px",
                      }}
                    />
                  </li>
                )}
              </ul>
            </div>
          </div>
        ) : !error ? (
          <p>Loading...</p>
        ) : null}
      </main>

      <footer
        className="w-100 text-center"
        style={{
          backgroundColor: "#0f3460",
          marginTop: "60px",
          padding: "20px 0",
          borderTop: "2px solid #f8c94e",
        }}>
        <p style={{ margin: 0, fontSize: "14px" }}>
          &copy; 2025 National ID. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

const decodeUserInfoResponse = (userinfoJwtToken) => {
  try {
    return jose.decodeJwt(userinfoJwtToken);
  } catch (error) {
    console.error("Error decoding JWT user info:", error);
    return null;
  }
};

export default Callback;
