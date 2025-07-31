import React, { useState } from "react";

export default function SubmitKYC() {
  const [nationalId, setNationalId] = useState("");
  const [documentFile, setDocumentFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!documentFile || !nationalId) {
      setMessage("Please provide all required info.");
      return;
    }

    // Here ideally upload documentFile to S3 or similar first, get URL
    // For example purpose, assume uploadDocument() returns a URL string

    setMessage("Submitting KYC...");
    try {
      const uploadedUrl = await uploadDocument(documentFile); // implement uploadDocument()
      const token = localStorage.getItem("accessToken");

      const res = await fetch("/api/users/me/kyc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nationalId,
          documentUrl: uploadedUrl,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("KYC submitted successfully.");
      } else {
        setMessage(data.message || "Submission failed.");
      }
    } catch {
      setMessage("Network or upload error.");
    }
  };

  // Dummy upload function for example
  async function uploadDocument(file) {
    // implement your file upload logic here (S3, Firebase, etc)
    // return uploaded file url string
    return "https://fake-storage.com/document.jpg";
  }

  return (
    <div>
      <h2>Submit KYC Verification</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="National ID"
          value={nationalId}
          onChange={(e) => setNationalId(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => setDocumentFile(e.target.files[0])}
          required
        />
        <button type="submit">Submit KYC</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
