import React, { useState } from 'react';
import { registerUser } from "./services/api";

const SignupPage = ({ onSignup, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (e) => {
    // Strip non-digits
    let d = e.target.value.replace(/\D/g, '');

    // First digit must be 6, 7, 8, or 9
    if (d.length > 0 && !/^[6-9]/.test(d)) return;

    // Cap at 10 digits
    d = d.slice(0, 10);

    setFormData(prev => ({ ...prev, phone: d }));
  };

  const handlePhoneKeyDown = (e) => {
    const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];
    if (allowed.includes(e.key)) return;

    // Block non-digit keys
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
      return;
    }

    // Block if first digit typed is not 6-9
    if (formData.phone.length === 0 && !/^[6-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");

  // Validation
  if (!formData.fullName || !formData.phone || !formData.password) {
    setError("All fields are required");
    return;
  }

  if (formData.phone.length !== 10) {
    setError("Enter a valid 10-digit mobile number");
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  if (formData.password.length < 6) {
    setError("Password must be at least 6 characters");
    return;
  }

  try {

    // API Call
    const response = await registerUser({
      name: formData.fullName,
      phone: formData.phone,
      password: formData.password,
    });

    // Success Message
    alert(response.message || "Registration successful");

    // Clear form
    setFormData({
      fullName: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });

    // Optional: switch to login page
    onSignup(response);

  } catch (error) {

    console.log(error);

    // Proper error handling
    const errorMessage =
      error?.message ||
      "Registration failed";

    setError(errorMessage);
  }
};

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <div className="logo">SummarAI</div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Start summarizing with AI intelligence</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-group">
              <label>Phone Number</label>
              {/* Split into static +91 prefix + digit input */}
              <div style={{ display: 'flex' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0 10px',
                  border: '1px solid #ccc',
                  borderRight: 'none',
                  borderRadius: '6px 0 0 6px',
                  background: '#f0f0f0',
                  fontSize: '14px',
                  color: '#555',
                  whiteSpace: 'nowrap',
                }}>
                  +91
                </span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  onKeyDown={handlePhoneKeyDown}
                  placeholder="98765 43210"
                  maxLength={10}
                  style={{ borderRadius: '0 6px 6px 0' }}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Create Account
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <a onClick={onSwitchToLogin}>Sign In</a>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;