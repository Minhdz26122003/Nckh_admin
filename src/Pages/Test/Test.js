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
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  FormControlLabel,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import Pagination from "@mui/material/Pagination";
import axios from "axios";
import url from "../../ipconfixad";
import "./Test.css";

const TestManagement = () => {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficulty, setDifficulty] = useState("");

  // State phân trang
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 10,
  });
  const filteredtests = tests.filter((test) => {
    const matchDifficulty =
      difficulty !== "" ? test.difficulty_level === difficulty : true;
    return matchDifficulty;
  });

  // const fetch = async (page = 1, limit = 10) => {
  //   let endpoint = `${url}myapi/T/getAll?page=${page}&limit=${limit}`;
  //
  //   try {
  //     const response = await axios.get(endpoint);
  //     // Ví dụ: response.data có cấu trúc { t, totalT, totalPages, currentPage }
  //     setT(response.data.t);
  //     // Bạn có thể lưu thêm state cho phân trang (totalPages, currentPage) để hiển thị nút chuyển trang
  //     setPagination({
  //       totalPages: response.data.totalPages,
  //       currentPage: response.data.currentPage,
  //     });
  //   } catch (error) {
  //     console.error("Error fetching t", error);
  //   }
  // };

  // Hàm lấy dữ liệu bài kiểm tra
  const fetchTest = async () => {
    try {
      const response = await axios.get(`${url}myapi/Test/getall`);
      setTests(response.data);
    } catch (error) {
      console.error("Error fetching Test:", error);
    }
  };

  //Tìm kiếm
  const searchTest = async (searchTerm) => {
    try {
      const response = await axios.get(
        `${url}myapi/Test/tkTest?title=${searchTerm}`
      );
      const tests = response.data.tests;
      console.log("API Response:", tests);
      setTests(tests);
    } catch (error) {
      console.error("Error searching tests:", error);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      // console.log("Searching with:", searchTerm);
      searchTest(searchTerm);
    } else {
      fetchTest();
    }
  }, [searchTerm]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Xử lý thay đổi trang khi người dùng nhấn nút phân trang
  // const handlePageChange = (event, value) => {
  //     fetchTests(value);
  // };

  // Kiểm tra dữ liệu nhập
  const checkData = (test) => {
    if (!test || !test.title || !test.duration || !test.difficulty_level) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    return true;
  };
  // Thêm bài kiểm tra
  const handleAddSubmit = async (newtest) => {
    if (!checkData(selectedTest)) return;
    try {
      const response = await axios.post(`${url}myapi/Test/themTest`, newtest);
      if (response.data.success) {
        console.log("Thêm bài kiểm tra thành công");
      } else {
        console.error("Lỗi:", response.data.message);
      }
      setOpenAdd(false);
      fetchTest();
      //   fetchTests(pagination.currentPage);
    } catch (error) {
      console.error("Error adding test:", error);
    }
  };

  // Mở dialog thêm
  const handleAddClick = () => {
    setSelectedTest({ title: "", duration: "", difficulty_level: "" });
    setOpenAdd(true);
  };

  const handleAddClose = () => {
    setOpenAdd(false);
  };

  // Sửa bài kiểm tra
  const handleEditSubmit = async () => {
    if (!checkData(selectedTest)) return;
    try {
      await axios.put(`${url}myapi/Test/suaTest`, selectedTest);
      setOpenEdit(false);
      fetchTest();
      //   fetchTests(pagination.currentPage);
    } catch (error) {
      console.error("Error updating test:", error);
    }
  };
  // Mở dialog sửa
  const handleEdit = (test) => {
    setSelectedTest(test);
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
    setSelectedTest(null);
  };

  // Xóa bài kiểm tra
  const handleDelete = async (test_id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa bài kiểm tra này không?"
    );
    if (!confirmDelete) return;
    try {
      await axios.delete(`${url}myapi/Test/xoaTest`, {
        data: { test_id },
      });
      //   fetchTests(pagination.currentPage);
      setTests(tests.filter((test) => test.test_id !== test_id));
    } catch (error) {
      console.error("Error deleting test:", error);
    }
  };

  return (
    <div>
      {/* Thanh tìm kiếm và bộ lọc */}
      <Box className="test-topbar">
        <TextField
          label="Tìm kiếm tiêu đề"
          className="test-search-bar"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          fullWidth
          placeholder="Nhập tiêu đề bài kiểm tra"
          style={{ marginRight: "16px" }}
        />

        {/* Lọc theo độ khó */}
        <FormControl style={{ minWidth: 200 }}>
          <InputLabel>Độ khó</InputLabel>
          <Select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            label="Độ khó"
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="Easy">Dễ</MenuItem>
            <MenuItem value="Medium">Trung bình</MenuItem>
            <MenuItem value="Hard">Khó</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Bảng hiển thị Test */}
      <TableContainer component={Paper} className="test-table-container">
        <Table aria-label="test table" className="test-table">
          <TableHead className="head-test">
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tiêu đề</TableCell>
              <TableCell>Thời gian tạo</TableCell>
              <TableCell>Thời gian làm bài (phút)</TableCell>
              <TableCell>Độ khó</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredtests.length > 0 ? (
              filteredtests.map((test) => (
                <TableRow key={test.test_id}>
                  <TableCell>{test.test_id}</TableCell>
                  <TableCell>{test.title}</TableCell>
                  <TableCell>
                    {new Date(test.generated_at).toLocaleString()}
                  </TableCell>
                  <TableCell>{test.duration}</TableCell>
                  <TableCell>{test.difficulty_level}</TableCell>
                  <TableCell className="test-table-actions">
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(test)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(test.test_id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Không có bài kiểm tra nào được tìm thấy
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Nút phân trang hiển thị trang hiện tại */}
      <Box
        display="flex"
        justifyContent="end"
        alignItems="center"
        marginTop={2}
      >
        <Pagination
          count={pagination.totalPages}
          page={pagination.currentPage}
          //   onChange={handlePageChange}
          color="primary"
        />
      </Box>
      {/* Dialog Sửa  */}
      <Dialog open={openEdit} onClose={handleEditClose} fullWidth maxWidth="md">
        <DialogTitle>Sửa bài kiểm tra</DialogTitle>
        <DialogContent>
          {selectedTest && (
            <>
              <TextField
                label="Tiêu đề"
                fullWidth
                margin="normal"
                value={selectedTest.title}
                onChange={(e) =>
                  setSelectedTest({
                    ...selectedTest,
                    title: e.target.value,
                  })
                }
              />
              <TextField
                label="Thời gian làm bài (phút)"
                fullWidth
                margin="normal"
                type="number"
                value={selectedTest.duration}
                onChange={(e) =>
                  setSelectedTest({
                    ...selectedTest,
                    duration: e.target.value,
                  })
                }
              />
              <InputLabel>Độ khó</InputLabel>
              <Select
                className="select-difficult"
                label="Độ khó"
                fullWidth
                margin="normal"
                value={selectedTest?.difficulty_level || ""}
                onChange={(e) =>
                  setSelectedTest({
                    ...selectedTest,
                    difficulty_level: e.target.value,
                  })
                }
              >
                {["Easy", "Medium", "Hard"].map((tdiff) => (
                  <MenuItem key={tdiff} value={tdiff}>
                    {tdiff}
                  </MenuItem>
                ))}
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

      {/* Dialog Thêm */}
      <Dialog open={openAdd} onClose={handleAddClose} fullWidth maxWidth="md">
        <DialogTitle>Thêm bìa kiểm tra</DialogTitle>
        <DialogContent>
          <TextField
            label="Tiêu đề"
            fullWidth
            margin="normal"
            onChange={(e) =>
              setSelectedTest({
                ...selectedTest,
                title: e.target.value,
              })
            }
          />
          <TextField
            label="Thời gian làm bài (phút)"
            fullWidth
            margin="normal"
            type="number"
            onChange={(e) =>
              setSelectedTest({
                ...selectedTest,
                duration: e.target.value,
              })
            }
          />
          <InputLabel>Độ khó</InputLabel>
          <Select
            label="Độ khó"
            fullWidth
            margin="normal"
            value={selectedTest?.difficulty_level || ""}
            onChange={(e) =>
              setSelectedTest({
                ...selectedTest,
                difficulty_level: e.target.value,
              })
            }
          >
            <MenuItem value="Easy">Easy</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Hard">Hard</MenuItem>
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
            onClick={handleAddSubmit}
            style={{ backgroundColor: "#228b22", color: "#ffffff" }}
          >
            Thêm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Nút thêm  */}
      <Box sx={{ position: "fixed", bottom: 30, right: 50 }}>
        <Fab color="primary" aria-label="add" onClick={handleAddClick}>
          <AddIcon />
        </Fab>
      </Box>
    </div>
  );
};

export default TestManagement;
