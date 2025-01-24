import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const ForgetPassword = () => {
  const [step, setStep] = useState(1); // Step 1: Email, Step 2: OTP, Step 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // State for loading
  const navigate = useNavigate(); // Hook to navigate to another page

  const handleSendOtp = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("http://localhost:8080/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email }),
      });

      if (response.ok) {
        const data = await response.text();
        setOtp(data.split("otp is ")[1].split("\n")[0]); // Extract OTP
        setMessage("OTP sent to your email!");
        setStep(2); // Move to OTP verification step
      } else {
        setMessage("Failed to send OTP. Please check the email.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setMessage("An error occurred. Please try again.");
    }
    setLoading(false);
  };

  const handleVerifyOtp = () => {
    if (enteredOtp === otp) {
      setMessage("OTP verified successfully!");
      setStep(3); // Move to new password step
    } else {
      setMessage("Invalid OTP. Please try again.");
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match. Please try again.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email, password: newPassword }),
      });

      if (response.ok) {
        setMessage("Password updated successfully!");
        setStep(1); // Reset to Step 1
        setEmail("");
        setOtp("");
        setEnteredOtp("");
        setNewPassword("");
        setConfirmPassword("");
        navigate("/login");
        return; // Replace '/' with the route of your home page
      } else {
        setMessage("Failed to update password. Please check your details.");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setMessage("An error occurred. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>Forgot Password</h1>
      {message && <p>{message}</p>}

      {step === 1 && (
        <>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="input"
          />
          <button
            onClick={handleSendOtp}
            className="form-button"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <label>OTP:</label>
          <input
            type="text"
            value={enteredOtp}
            onChange={(e) => setEnteredOtp(e.target.value)}
            placeholder="Enter OTP"
            className="input"
          />
          <button
            onClick={handleVerifyOtp}
            className="form-button"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className="input"
          />
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="input"
          />
          <button
            onClick={handleUpdatePassword}
            className="form-button"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </>
      )}
    </div>
  );
};

export default ForgetPassword;
