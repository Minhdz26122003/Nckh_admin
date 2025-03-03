import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import Sidebar from "../src/components/sidebar/sidebar";
import TopBar from "../src/components/topbar/topbar";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Account from "./Pages/Account/Account";
import Topic from "./Pages/Topic/topic";
import Lesson from "./Pages/Lesson/Lesson";
import Profile from "./Pages/Profile/profile";
import Login from "./Pages/Login/Login";
import Lessques from "./Pages/Less_Ques/Less_Ques";
import Question from "./Pages/Questtion/Question";
import Option from "./Pages/Option/Option";
import Test from "./Pages/Test/Test";
import { Box } from "@mui/material";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("HỆ THỐNG QUẢN TRỊ APP");
  const [loggedInUser, setLoggedInUser] = useState(
    sessionStorage.getItem("username") || null
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const storedUser =
      sessionStorage.getItem("user") || localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  const handleMenuClick = (menuName) => {
    setTitle(menuName); // Cập nhật tiêu đề khi chọn menu
  };
  const handleLogin = (userData, rememberMe) => {
    setLoggedInUser(userData.username);
    setUser(userData);

    // Nếu "Ghi nhớ đăng nhập",  lưu vào localStorage
    if (rememberMe) {
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("username", userData.username);
      localStorage.setItem("rememberMe", rememberMe);
      sessionStorage.setItem("user", JSON.stringify(userData));
    } else {
      // Nếu không, lưu vào sessionStorage
      sessionStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("rememberMe", rememberMe);
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setUser(null);

    // Xóa thông tin đăng nhập khỏi localStorage nếu không có "Ghi nhớ đăng nhập"
    if (!JSON.parse(localStorage.getItem("rememberMe"))) {
      localStorage.removeItem("user");
      localStorage.removeItem("username");
      localStorage.removeItem("rememberMe");
      localStorage.removeItem("password");

      sessionStorage.removeItem("user");
      sessionStorage.removeItem("username");
    } else {
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("username");
    }
  };

  const PrivateRoute = ({ element }) => {
    return loggedInUser ? element : <Navigate to="/login" />;
  };

  return (
    <div className="App">
      <Router>
        {loggedInUser ? (
          /* ĐÃ đăng nhập => render layout chính */
          <div className="AppGlass">
            <Sidebar
              onMenuClick={handleMenuClick}
              isSidebarOpen={isSidebarOpen}
            />
            <TopBar
              username={loggedInUser}
              onLogout={handleLogout}
              title={title}
              isSidebarOpen={isSidebarOpen}
              onToggleSidebar={toggleSidebar}
            />
            <Box
              component="main"
              sx={{
                marginLeft: isSidebarOpen ? "120px" : "0px",
                transition: "margin-left 0.5s",
                p: 2,
              }}
            >
              <Routes>
                <Route
                  path="/login"
                  element={<Login onLogin={handleLogin} />}
                />
                <Route
                  path="/"
                  element={<PrivateRoute element={<Dashboard />} />}
                />
                <Route
                  path="/account"
                  element={<PrivateRoute element={<Account />} />}
                />
                <Route
                  path="/topic"
                  element={<PrivateRoute element={<Topic />} />}
                />
                <Route
                  path="/lesson"
                  element={<PrivateRoute element={<Lesson />} />}
                />
                <Route
                  path="/lessques"
                  element={<PrivateRoute element={<Lessques />} />}
                />
                <Route
                  path="/question"
                  element={<PrivateRoute element={<Question />} />}
                />
                <Route
                  path="/option"
                  element={<PrivateRoute element={<Option />} />}
                />
                <Route
                  path="/test"
                  element={<PrivateRoute element={<Test />} />}
                />
                <Route
                  path="/profile"
                  element={<PrivateRoute element={<Profile user={user} />} />}
                />{" "}
              </Routes>
            </Box>
          </div>
        ) : (
          /* CHƯA đăng nhập => chỉ render trang Login */
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            {/* Nếu cố gắng truy cập bất kỳ URL khác => chuyển về /login */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </Router>
    </div>
  );
}

export default App;
