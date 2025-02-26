// Sidebar.js
import React from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
} from "@mui/material";
import "./sidebar.css";
import DashboardIcon from "@mui/icons-material/Dashboard";

import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import RoomServiceIcon from "@mui/icons-material/RoomService";
import PersonIcon from "@mui/icons-material/Person";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import PaidIcon from "@mui/icons-material/Paid";
import CommentIcon from "@mui/icons-material/Comment";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ onMenuClick }) => {
  const location = useLocation();

  const items = [
    { text: "Tổng quan", icon: <DashboardIcon />, link: "/" },
    { text: "Tài khoản", icon: <PersonIcon />, link: "/account" },
    { text: "Chủ đề bài học", icon: <RoomServiceIcon />, link: "/topic" },
    { text: "Bài học", icon: <MapsHomeWorkIcon />, link: "/lesson" },
    // {
    //   text: "Bài học & câu hỏi",
    //   icon: <FormatAlignCenterIcon />,
    //   link: "/sercen",
    // },
    // { text: "Bài kiểm tra", icon: <LoyaltyIcon />, link: "/sale" },

    // { text: "Câu hỏi của bài kiểm tra", icon: <PaidIcon />, link: "/payment" },
    // { text: "Option", icon: <CommentIcon />, link: "/review" },
  ];
  return (
    <Drawer classes={{ paper: "sidebar-container" }} variant="permanent">
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
          >
            <ListItemIcon
              className={`sidebar-icon ${
                location.pathname === item.link ? "active" : ""
              }`}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
