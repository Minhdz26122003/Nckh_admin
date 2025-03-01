import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Button,
  Box,
  theme,
} from "@mui/material";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNavigate } from "react-router-dom";

const TopBar = ({
  username,
  onLogout,
  title,
  isSidebarOpen,
  onToggleSidebar,
}) => {
  const navigate = useNavigate();
  const profile = () => {
    navigate("/profile");
  };
  return (
    <AppBar
      position="fixed"
      sx={(theme) => ({
        background: "#fff",
        color: "#333",
        boxShadow: 1,
        width: isSidebarOpen ? "calc(100% - 222px)" : "calc(100% - 72px)",
        ml: isSidebarOpen ? "240px" : "80px",
        transition: "width 0.5s, margin-left 0.5s",
        zIndex: theme.zIndex.drawer + 1,
      })}
    >
      <Toolbar>
        {/* Nút thu gọn/mở rộng sidebar */}
        <IconButton color="inherit" onClick={onToggleSidebar} edge="start">
          <FormatAlignLeftIcon sx={{ color: "#333" }} />
        </IconButton>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, fontWeight: "bold", color: "#333" }}
        >
          {title}
        </Typography>

        {/* Icon thông báo */}
        <IconButton color="inherit">
          <NotificationsIcon sx={{ color: "#666" }} />
        </IconButton>

        {/* Hiển thị tên và avatar */}
        <Button
          onClick={profile}
          sx={{ display: "flex", alignItems: "center", marginLeft: 2 }}
        >
          <Typography
            sx={{
              marginRight: 1,
              fontWeight: "500",
              color: "#666",
              fontWeight: "bold",
            }}
          >
            {username}
          </Typography>
          <Avatar alt={username} sx={{ width: 36, height: 36 }} />
        </Button>

        {/* Nút đăng xuất */}
        <IconButton color="inherit" onClick={onLogout}>
          <LogoutIcon sx={{ color: "#666" }} />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
