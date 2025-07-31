import React, { useEffect, useState } from "react";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        } else {
          setMessage("Failed to load profile");
        }
      } catch {
        setMessage("Network error");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <p>Loading profile...</p>;
  if (message) return <p>{message}</p>;

  return (
    <div>
      <h2>User Profile</h2>
      <p>
        Name: {profile.firstName} {profile.lastName}
      </p>
      <p>Email: {profile.email}</p>
      <p>Phone: {profile.phoneNumber}</p>
      <p>KYC Status: {profile.kycStatus}</p>
    </div>
  );
}
