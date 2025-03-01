import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import url from "../../ipconfixad";
import "./Login.css"; // Import CSS mới

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(
    JSON.parse(localStorage.getItem("rememberMe")) || false
  );
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (rememberMe) {
      setUsername(localStorage.getItem("username") || "");
      setPassword(localStorage.getItem("password") || "");
    }
  }, [rememberMe]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${url}myapi/dangnhapad.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error("Không thể kết nối đến server.");
      const data = await response.json();

      if (data.success) {
        onLogin(data.user, rememberMe);
        localStorage.setItem("rememberMe", rememberMe);
        if (rememberMe) {
          localStorage.setItem("username", username);
          localStorage.setItem("password", password);
        }
        navigate("/");
      } else {
        setError(data.message || "Đăng nhập thất bại.");
      }
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  return (
    <div className="login-container">
      {/* Form đăng nhập ở giữa */}
      <Box component="form" onSubmit={handleSubmit} className="login-box">
        <Typography variant="h5" className="login-title">
          Đăng nhập
        </Typography>

        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          margin="normal"
          className="login-input"
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          className="login-input"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
          }
          label="Ghi nhớ đăng nhập"
          className="login-remember"
        />

        {error && <Typography className="login-error">{error}</Typography>}

        <Button type="submit" variant="contained" className="login-button">
          Đăng nhập
        </Button>
      </Box>

      {/* Footer tùy chọn */}
      <div className="login-footer">
        © 2025, made with ♥ by Creative Minh for a better web.
      </div>
    </div>
  );
};

export default LoginPage;
