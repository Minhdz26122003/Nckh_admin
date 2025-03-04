// Sidebar.js
import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
} from "@mui/material";
import "./sidebar.css";
import DashboardIcon from "@mui/icons-material/Dashboard";

import PersonIcon from "@mui/icons-material/Person";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import TopicIcon from "@mui/icons-material/Topic";
import LibraryBooksRoundedIcon from "@mui/icons-material/LibraryBooksRounded";
import HelpCenterRoundedIcon from "@mui/icons-material/HelpCenterRounded";
import DynamicFeedRoundedIcon from "@mui/icons-material/DynamicFeedRounded";
import DisplaySettingsIcon from "@mui/icons-material/DisplaySettings";
import EditNoteIcon from "@mui/icons-material/EditNote";
import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt";
import { Link, useLocation } from "react-router-dom";
import img from "../../assets/image/logo-ct.png";

const Sidebar = ({ onMenuClick, isSidebarOpen }) => {
  const location = useLocation();

  const items = [
    { text: "Tổng quan", icon: <DashboardIcon />, link: "/" },
    { text: "Tài khoản", icon: <PersonIcon />, link: "/account" },
    { text: "Chủ đề bài học", icon: <TopicIcon />, link: "/topic" },
    { text: "Bài học", icon: <LibraryBooksRoundedIcon />, link: "/lesson" },
    { text: "Câu hỏi", icon: <HelpCenterRoundedIcon />, link: "/question" },
    {
      text: "Bài học & câu hỏi",
      icon: <DynamicFeedRoundedIcon />,
      link: "/lessques",
    },

    // { text: "Câu hỏi của bài kiểm tra", icon: <PaidIcon />, link: "/payment" },
    { text: "Option", icon: <DisplaySettingsIcon />, link: "/option" },
    { text: "Test", icon: <EditNoteIcon />, link: "/test" },
    { text: "Test Question", icon: <PsychologyAltIcon />, link: "/testquest" },
  ];
  return (
    <Drawer
      classes={{ paper: "sidebar-container" }}
      variant="permanent"
      sx={{
        width: isSidebarOpen ? 220 : 70, // Chiều rộng thay đổi
        flexShrink: 0,
        whiteSpace: "nowrap",
        transition: "width 0.3s",
        "& .MuiDrawer-paper": {
          width: isSidebarOpen ? 220 : 70,
          overflowX: "hidden",
          transition: "width 0.3s",
          backgroundColor: "#1e2023",
          color: "#fff",
        },
      }}
    >
      {/* logo */}
      <div className="sidebar-logo">
        <span
          style={{ display: isSidebarOpen ? "block" : "none" }}
          className="dashboard-text"
        >
          Dashboard
        </span>
        <img
          src={img}
          alt="Logo"
          className="logo-image"
          style={{
            width: isSidebarOpen ? "53px" : "25px",
            transition: "width 0.3s",
          }}
        />
      </div>

      <List className="siderbar">
        {items.map((item, index) => (
          <ListItem
            button
            component={Link}
            to={item.link}
            key={index}
            className={`sidebar-item ${
              location.pathname === item.link ? "active" : ""
            }`}
            onClick={() => onMenuClick(item.text)}
            sx={{
              display: "flex",
              justifyContent: isSidebarOpen ? "flex-start" : "center",
              px: 2,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: isSidebarOpen ? 2 : "auto",
                color: "inherit",
                justifyContent: "center",
              }}
            >
              {item.icon}
            </ListItemIcon>
            {/* Ẩn/Hiện text theo trạng thái sidebar */}
            {isSidebarOpen && <ListItemText primary={item.text} />}
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
