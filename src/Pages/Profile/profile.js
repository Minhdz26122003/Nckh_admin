import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Typography,
  Box,
  TextField,
  Button,
  Avatar,
  Grid,
  Snackbar,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import bg from "../../assets/image/bg-profile.jpeg";
import avar from "../../assets/image/team-2.jpg";
import url from "../../ipconfixad";

const Profile = ({ user }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // State dialog, snackbar
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openEdit, setOpenEdit] = useState(false);

  // State đổi mật khẩu
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // State account được chọn để sửa
  const [selectedAccount, setSelectedAccount] = useState({
    username: "",
    email: "",
    sodienthoai: "",
    diachi: "",
  });

  useEffect(() => {
    if (user) {
      setUsername(user?.username || "");
      setEmail(user?.email || "");
      setPhone(user?.sodienthoai || "");
      setAddress(user?.diachi || "");
    }
  }, [user]);

  // Xử lý mở/đóng Dialog Sửa
  const handleEdit = () => {
    setSelectedAccount({
      username,
      email,
      sodienthoai: phone,
      diachi: address,
    });
    setOpenEdit(true);
  };
  const handleEditClose = () => {
    setOpenEdit(false);
  };

  // Submit sửa thông tin
  const handleEditSubmit = async () => {
    try {
      const response = await axios.put(`${url}myapi/Taikhoan/suataikhoan.php`, {
        iduser: user.id,
        ...selectedAccount,
      });

      if (response.data?.success) {
        setSnackbarMessage("Sửa tài khoản thành công!");
        handleLogout();
      } else {
        setSnackbarMessage(response.data?.message || "Sửa tài khoản thất bại!");
      }

      setSnackbarOpen(true);
    } catch (error) {
      console.error("Lỗi khi sửa tài khoản:", error);
      setSnackbarMessage("Có lỗi xảy ra. Vui lòng thử lại.");
      setSnackbarOpen(true);
    } finally {
      setOpenEdit(false);
    }
  };

  // Xử lý logout sau khi sửa
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("username");
    localStorage.removeItem("rememberMe");
  };

  // Dialog đổi mật khẩu
  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      setError("Mật khẩu mới phải ít nhất 6 ký tự.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    setError("");

    try {
      const response = await fetch(`${url}myapi/Taikhoan/dmk.php`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          iduser: user.id,
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSnackbarMessage("Đổi mật khẩu thành công!");
      } else {
        setSnackbarMessage(data.message || "Đổi mật khẩu thất bại!");
      }
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Lỗi khi đổi mật khẩu:", error);
      setSnackbarMessage("Có lỗi xảy ra. Vui lòng thử lại.");
      setSnackbarOpen(true);
    } finally {
      handleCloseDialog();
    }
  };

  if (!user) {
    return (
      <Typography>Vui lòng đăng nhập để xem thông tin cá nhân.</Typography>
    );
  }

  return (
    <Box sx={{ maxWidth: "1200px", margin: "0 auto", p: 2 }}>
      {/* Ảnh bìa (Cover Image) */}
      <Box
        sx={{
          position: "relative",
          height: 200,
          backgroundImage: `url(${bg})`, // Sử dụng url(...) kèm template literal
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        {/* Avatar chồng lên ảnh bìa */}
        <Box
          sx={{
            position: "absolute",
            bottom: "-120px",
            left: "10%",
            transform: "translateX(-50%)",
          }}
        >
          <Avatar
            sx={{ width: 150, height: 150, border: "3px solid white" }}
            src={avar}
          />
          {/* Tên người dùng */}
          <Box sx={{ textAlign: "start", ml: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {username || "User Name"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {email || "example@gmail.com"}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Khu vực thông tin chính */}
      <Paper
        sx={{
          mt: 8,
          p: 3,
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        {/* Nút Sửa & Đổi mật khẩu bên phải */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            mb: 2,
          }}
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#1976d2",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#1565c0",
              },
            }}
            onClick={handleEdit}
          >
            Sửa thông tin
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#2e7d32",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#1b5e20",
              },
            }}
            onClick={handleOpenDialog}
          >
            Đổi mật khẩu
          </Button>
        </Box>

        {/* Thông tin chi tiết */}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "normal", fontSize: 20 }}
            >
              Thông tin cơ bản
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Typography sx={{ mt: 2 }}>
                <strong>Tên đăng nhập:</strong> {username}
              </Typography>
              <Typography sx={{ mt: 1 }}>
                <strong>Địa chỉ:</strong> {address}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "normal", fontSize: 20 }}
            >
              Liên hệ
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Typography sx={{ mt: 2 }}>
                <strong>Email:</strong> {email}
              </Typography>
              <Typography sx={{ mt: 1 }}>
                <strong>Số điện thoại:</strong> {phone}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Dialog Đổi mật khẩu */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Đổi Mật Khẩu</DialogTitle>
        <DialogContent>
          <TextField
            label="Mật khẩu hiện tại"
            type="password"
            fullWidth
            margin="normal"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <TextField
            label="Mật khẩu mới"
            type="password"
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            label="Xác nhận mật khẩu mới"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error && <Typography color="error">{error}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="warning">
            Hủy
          </Button>
          <Button onClick={handleChangePassword} color="primary">
            Đổi Mật Khẩu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Sửa thông tin */}
      <Dialog open={openEdit} onClose={handleEditClose}>
        <DialogTitle>Sửa thông tin cá nhân</DialogTitle>
        <DialogContent>
          {selectedAccount && (
            <>
              <TextField
                label="Username"
                fullWidth
                margin="normal"
                value={selectedAccount.username || ""}
                onChange={(e) =>
                  setSelectedAccount({
                    ...selectedAccount,
                    username: e.target.value,
                  })
                }
              />
              <TextField
                label="Email"
                fullWidth
                margin="normal"
                value={selectedAccount.email || ""}
                onChange={(e) =>
                  setSelectedAccount({
                    ...selectedAccount,
                    email: e.target.value,
                  })
                }
              />
              <TextField
                label="Phone"
                fullWidth
                margin="normal"
                value={selectedAccount.sodienthoai || ""}
                onChange={(e) =>
                  setSelectedAccount({
                    ...selectedAccount,
                    sodienthoai: e.target.value,
                  })
                }
              />
              <TextField
                label="Address"
                fullWidth
                margin="normal"
                value={selectedAccount.diachi || ""}
                onChange={(e) =>
                  setSelectedAccount({
                    ...selectedAccount,
                    diachi: e.target.value,
                  })
                }
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="warning">
            Hủy
          </Button>
          <Button onClick={handleEditSubmit} color="primary">
            Lưu thông tin
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Thông báo */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          severity={
            snackbarMessage.includes("thành công") ? "success" : "error"
          }
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;
