import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import url from "../../ipconfixad";
import "../Login/Login.css"; // Import CSS riêng

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
  }, []);

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
    <div className="signin">
      {/* Hiệu ứng nền */}
      <section>
        {Array.from({ length: 300 }).map((_, index) => (
          <span key={index}></span>
        ))}
      </section>

      {/* Box đăng nhập */}
      <Box component="form" onSubmit={handleSubmit} className="login-box">
        <Typography variant="h5" className="login-title">
          Đăng Nhập
        </Typography>
        <TextField
          label="Tên đăng nhập"
          variant="outlined"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          margin="normal"
          className="login-input"
        />
        <TextField
          label="Mật khẩu"
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
          Đăng Nhập
        </Button>
      </Box>
    </div>
  );
};

export default LoginPage;
