import React, { useState } from 'react';
import { loginUser } from './services/api';

const isValidIndianPhone = (val) => {
  return val.length === 10 && /^[6-9]/.test(val);
};

const LoginPage = ({ onLogin, onSwitchToSignup }) => {
  const [formData, setFormData] = useState({ phone: '', password: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [globalError, setGlobalError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setGlobalError('');
  };

  const handlePhoneChange = (e) => {
    let d = e.target.value.replace(/\D/g, '');
    if (d.length > 0 && !/^[6-9]/.test(d)) return;
    d = d.slice(0, 10);
    setFormData((prev) => ({ ...prev, phone: d }));
    setErrors((prev) => ({ ...prev, phone: '' }));
    setGlobalError('');
  };

  const handlePhoneKeyDown = (e) => {
    const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];
    if (allowed.includes(e.key)) return;
    if (!/^\d$/.test(e.key)) { e.preventDefault(); return; }
    if (formData.phone.length === 0 && !/^[6-9]$/.test(e.key)) e.preventDefault();
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, formData[name]);
  };

  const validateField = (name, value) => {
    let msg = '';
    switch (name) {
      case 'phone':
        if (!value) msg = 'Phone number is required';
        else if (!isValidIndianPhone(value))
          msg = 'Enter a valid 10-digit number starting with 6–9';
        break;
      case 'password':
        if (!value) msg = 'Password is required';
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: msg }));
    return msg;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  setGlobalError('');

  const fields = ['phone', 'password'];

  const newErrors = {};

  fields.forEach((f) => {
    newErrors[f] = validateField(f, formData[f]);
  });

  setTouched({
    phone: true,
    password: true
  });

  if (Object.values(newErrors).some(Boolean)) return;

  try {

    const response = await loginUser({
      phone: formData.phone,
      password: formData.password
    });

    console.log("Login Success:", response);

    // 🔥 Save user data locally
    localStorage.setItem("user", JSON.stringify(response));

    // 🔥 Optional callback
    if (onLogin) {
      onLogin(response);
    }

    alert("Login successful!");

  } catch (error) {

    console.error(error);

    setGlobalError(error.message);
  }
};
const fieldState = (name) => {
  if (!touched[name]) return '';

  return errors[name] ? 'input-error' : 'input-ok';
};

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <div className="logo">SummarAI</div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Access your AI tools</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>

          {globalError && (
            <div className="error-message">{globalError}</div>
          )}

          {/* Phone */}
          <div className="form-group">
            <div className="input-group">
              <label>Phone Number</label>
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
                  onBlur={handleBlur}
                  placeholder="98765 43210"
                  className={fieldState('phone')}
                  maxLength={10}
                  autoComplete="tel"
                  style={{ borderRadius: '0 6px 6px 0' }}
                />
              </div>
              {touched.phone && errors.phone && (
                <span className="field-error">{errors.phone}</span>
              )}
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="••••••••"
                className={fieldState('password')}
                maxLength={64}
                autoComplete="current-password"
              />
              {touched.password && errors.password && (
                <span className="field-error">{errors.password}</span>
              )}
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Sign In
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{' '}
          <a onClick={onSwitchToSignup}>Create one</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;