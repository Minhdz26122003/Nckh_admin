import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Fab,
  Box,
  Select,
  MenuItem,
} from "@mui/material";

import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import axios from "axios";
import "./Accounts.css"; // Import style riêng
import url from "../../ipconfixad.js";
const Account = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState({
    username: "",
    email: "",
    password: "",
    sodienthoai: "",
    diachi: "",
    vaitro: 0,
  });
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAccounts();
  }, []);

  const roleMapping = {
    0: "Người dùng",
    1: "Nhân viên",
    2: "Quản lý",
  };

  const fetchAccounts = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const iduser = user?.id || null;

      if (!iduser) {
        console.error("Không tìm thấy iduser trong localStorage.");
        return;
      }
      const response = await axios.get(`${url}myapi/Taikhoan/getTK.php`, {
        params: {
          iduser: iduser,
        },
      });

      const data = response.data;
      if (Array.isArray(data)) {
        setAccounts(data);
      } else {
        console.error("Dữ liệu trả về không phải là mảng:", data);
        setAccounts([]);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  //TÌM KIẾM TÀI KHOẢN
  const searchAccounts = async (username) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const iduser = user?.id || null;
    try {
      const response = await axios.get(`${url}myapi/Taikhoan/tktaikhoan.php`, {
        params: {
          iduser: iduser,
          username: username,
        },
      });

      const accounts = response.data.accounts;
      console.log("API Response:", accounts);
      setAccounts(accounts);
    } catch (error) {
      console.error("Error searching accounts:", error);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      console.log("Searching for:", searchTerm);
      searchAccounts(searchTerm);
    } else {
      console.log("Fetching all accounts");
      fetchAccounts();
    }
  }, [searchTerm]);

  // Cập nhật từ khóa tìm kiếm
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  //  THÊM TÀI KHOẢN
  const handleAddSubmit = async (newAccount) => {
    try {
      await axios.post(`${url}myapi/Taikhoan/themtaikhoan.php`, newAccount);
      setOpenAdd(false);
      fetchAccounts();
    } catch (error) {
      console.error("Error adding account:", error);
    }
  };
  const handleAddClick = () => {
    setOpenAdd(true);
  };
  const handleAddClose = () => {
    setOpenAdd(false);
  };

  // SỬA TÀI KHOẢN
  const handleEditSubmit = async () => {
    try {
      // Gửi dữ liệu đã sửa về server
      await axios.put(`${url}myapi/Taikhoan/suataikhoan.php`, selectedAccount);

      setOpenEdit(false);
      fetchAccounts();
      console.log("thanhcong");
    } catch (error) {
      console.error("Error updating account:", error);
    }
  };
  const handleEdit = (account) => {
    setSelectedAccount(account);
    setOpenEdit(true);
  };
  const handleEditClose = (account) => {
    setOpenEdit(false);
    setSelectedAccount({
      username: "",
      email: "",
      password: "",
      sodienthoai: "",
      diachi: "",
      vaitro: 0,
    });
  };

  // XÓA TÀI KHOẢN
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa tài khoản này không?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`${url}myapi/Taikhoan/xoataikhoan.php`, {
        data: { iduser: id }, // Gửi ID trong body của yêu cầu DELETE
      });

      // Cập nhật danh sách sau khi xóa
      setAccounts(accounts.filter((account) => account.iduser !== id));
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  return (
    <div>
      {/* Thanh tìm kiếm */}
      <div className="account-search-container">
        <TextField
          className="account-search-bar"
          label="Tìm kiếm tài khoản"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Tìm kiếm theo tên tài khoản"
        />
      </div>
      <div className="account-table-container">
        <TableContainer component={Paper}>
          <Table className="account-table">
            {/* Tiêu đề bảng */}
            <TableHead className="head-account">
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tên tài khoản</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Mật khẩu</TableCell>
                <TableCell>Số điện thoại</TableCell>
                <TableCell>Địa chỉ</TableCell>
                <TableCell>Vai trò </TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {accounts && accounts.length > 0 ? (
                accounts.map((account) => (
                  <TableRow key={account.iduser}>
                    <TableCell>{account.iduser}</TableCell>
                    <TableCell>{account.username}</TableCell>
                    <TableCell>{account.email}</TableCell>
                    <TableCell>{account.password}</TableCell>
                    <TableCell>{account.sodienthoai}</TableCell>
                    <TableCell>{account.diachi}</TableCell>
                    <TableCell>{roleMapping[account.vaitro]}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(account)}
                      >
                        <EditIcon />
                      </IconButton>
                      {/* <IconButton
                      color="error"
                      // onClick={() => handleDelete(account.iduser)}
                    >
                      <DeleteIcon />
                    </IconButton> */}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Không có tài khoản nào được tìm thấy
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Dialog sửa*/}
      <Dialog open={openEdit} onClose={handleEditClose} fullWidth maxWidth="md">
        <DialogTitle>Sửa tài khoản</DialogTitle>
        <DialogContent>
          {selectedAccount && (
            <>
              <TextField
                label="Tên tài khoản"
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
                label="Mật khẩu"
                fullWidth
                margin="normal"
                value={selectedAccount.password || ""}
                onChange={(e) =>
                  setSelectedAccount({
                    ...selectedAccount,
                    password: e.target.value,
                  })
                }
              />
              <TextField
                label="Số điện thoại"
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
                label="Địa chỉ"
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

              <Select
                label="Vai trò"
                fullWidth
                margin="normal"
                value={selectedAccount.vaitro}
                onChange={(e) =>
                  setSelectedAccount({
                    ...selectedAccount,
                    vaitro: e.target.value, // Lưu giá trị vai trò là số 0, 1, hoặc 2
                  })
                }
              >
                <MenuItem value={0}>Người dùng</MenuItem>
                <MenuItem value={1}>Nhân viên</MenuItem>
                <MenuItem value={2}>Quản lý</MenuItem>
              </Select>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleEditClose}
            style={{ backgroundColor: "#ff0000", color: "#ffffff" }}
          >
            Trở lại
          </Button>
          <Button
            onClick={handleEditSubmit}
            style={{ backgroundColor: "#228b22", color: "#ffffff" }}
          >
            Lưu lại
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog thêm */}
      <Dialog open={openAdd} onClose={handleAddClose}>
        <DialogTitle>Thêm tài khoản</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên tài khoản"
            fullWidth
            margin="normal"
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
            onChange={(e) =>
              setSelectedAccount({
                ...selectedAccount,
                email: e.target.value,
              })
            }
          />
          <TextField
            label="Mật khẩu"
            fullWidth
            margin="normal"
            onChange={(e) =>
              setSelectedAccount({
                ...selectedAccount,
                password: e.target.value,
              })
            }
          />
          <TextField
            label="Số điện thoại"
            fullWidth
            margin="normal"
            onChange={(e) =>
              setSelectedAccount({
                ...selectedAccount,
                sodienthoai: e.target.value,
              })
            }
          />
          <TextField
            label="Địa chỉ"
            fullWidth
            margin="normal"
            onChange={(e) =>
              setSelectedAccount({
                ...selectedAccount,
                diachi: e.target.value,
              })
            }
          />

          <Select
            label="Vai trò"
            fullWidth
            margin="normal"
            value={selectedAccount.vaitro} // Giá trị hiện tại của vai trò
            onChange={(e) =>
              setSelectedAccount({
                ...selectedAccount,
                vaitro: e.target.value, // Lưu giá trị vai trò là số 0, 1, hoặc 2
              })
            }
          >
            <MenuItem value={0}>Người dùng</MenuItem>
            <MenuItem value={1}>Nhân viên</MenuItem>
            <MenuItem value={2}>Quản lý</MenuItem>
          </Select>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleAddClose}
            style={{ backgroundColor: "#ff0000", color: "#ffffff" }}
          >
            Trở lại
          </Button>
          <Button
            onClick={() => handleAddSubmit(selectedAccount)}
            style={{ backgroundColor: "#228b22", color: "#ffffff" }}
          >
            Thêm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Nút thêm tài khoản */}
      <Box sx={{ position: "fixed", bottom: 30, right: 50 }}>
        <Fab color="primary" aria-label="add" onClick={handleAddClick}>
          <AddIcon />
        </Fab>
      </Box>
    </div>
  );
};

export default Account;
