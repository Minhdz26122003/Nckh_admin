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
import Pagination from "@mui/material/Pagination";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import axios from "axios";
import url from "../../ipconfixad";
import "./Test_Question.css";

const TestQuestionManagement = () => {
  const [testQuestions, setTestQuestions] = useState([]);
  const [tests, setTests] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedTestQuestion, setSelectedTestQuestion] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [skill, setSkill] = useState(""); // Lọc theo độ khó
  const [searchTerm, setSearchTerm] = useState("");

  // State phân trang
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 10,
  });

  const filteredSkill = testQuestions.filter((testQuestion) => {
    // Đối với dữ liệu là number
    // const matchSkill =
    // skill !== "" ? testQuestion.skill === Number(skill) : true;

    const matchSkill = skill !== "" ? testQuestion.skill === skill : true;
    return matchSkill;
  });
  // Hàm lấy dữ liệu bài kiểm tra
  const fetchTestQuestions = async (
    page = pagination.currentPage,
    limit = pagination.limit
  ) => {
    try {
      const response = await axios.get(`${url}myapi/TestQuest/getall`, {
        params: { page, limit },
      });
      setTestQuestions(response.data);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        limit,
      });
    } catch (error) {
      console.error("Error fetching TestQuestions:", error);
    }
  };
  // Hàm lấy dữ liệu
  const fetchTest = async () => {
    try {
      const response = await axios.get(`${url}myapi/Test/getall`);
      setTests(response.data);
    } catch (error) {
      console.error("Error fetching Test:", error);
    }
  };
  // Hàm lấy dữ liệu bài kiểm tra
  const fetchQuestion = async () => {
    try {
      const response = await axios.get(`${url}myapi/Question/getall`);
      setQuestions(response.data);
    } catch (error) {
      console.error("Error fetching Test:", error);
    }
  };

  //Tìm kiếm
  const searchTesttitle = async (searchTerm) => {
    try {
      const response = await axios.get(
        `${url}myapi/Test/tkTest?title=${searchTerm}`
      );
      const testQuestions = response.data.testQuestions;
      console.log("API Response:", testQuestions);
      setSelectedTestQuestion(testQuestions);
    } catch (error) {
      console.error("Error searching testQuestions:", error);
    }
  };

  useEffect(() => {
    fetchQuestion();
    fetchTest();
    if (searchTerm) {
      // console.log("Searching with:", searchTerm);
      searchTesttitle(searchTerm);
    } else {
      fetchTestQuestions();
    }
  }, [searchTerm]);
  // Khi thay đổi từ khóa tìm kiếm, reset về trang 1
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    fetchTestQuestions(1, pagination.limit);
  };

  const handlePageChange = (event, value) => {
    fetchTestQuestions(value, pagination.limit);
  };

  // Kiểm tra dữ liệu nhập
  const checkData = (value) => {
    if (!value.test_id || !value.question_id || !value.skill) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    return true;
  };
  // Thêm Test_Question
  const handleAddSubmit = async (newtest) => {
    if (!checkData(selectedTestQuestion)) return;

    try {
      const formData = new FormData();
      formData.append("test_id", newtest.test_id);
      formData.append("question_id", newtest.question_id);
      formData.append("skill", newtest.skill);

      const response = await axios.post(
        `${url}myapi/TestQuestion/themTestQuestion`,
        formData
      );
      if (response.data.success) {
        console.log("Thêm Test Question thành công");
      } else {
        console.error("Lỗi:", response.data.message);
      }
      setOpenAdd(false);
      //   fetchTestQuestions(pagination.currentPage);
      fetchTestQuestions();
    } catch (error) {
      console.error("Error adding test question:", error);
    }
  };
  // Mở dialog thêm mới
  const handleAddClick = () => {
    setSelectedTestQuestion({ test_id: "", question_id: "", skill: "" });
    setOpenAdd(true);
  };

  const handleAddClose = () => {
    setOpenAdd(false);
  };

  // Sửa Test_Question
  const handleEditSubmit = async () => {
    if (!checkData(selectedTestQuestion)) return;
    try {
      await axios.put(
        `${url}myapi/TestQuestion/suaTestQuestion`,
        selectedTestQuestion
      );
      setOpenEdit(false);
      fetchTestQuestions(pagination.currentPage);
    } catch (error) {
      console.error("Error updating test question:", error);
    }
  };

  // Mở dialog sửa
  const handleEdit = (testQuestion) => {
    setSelectedTestQuestion(testQuestion);
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
    setSelectedTestQuestion(null);
  };
  // Xóa Test_Question
  const handleDelete = async (test_question_id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa Test Question này không?"
    );
    if (!confirmDelete) return;
    try {
      await axios.delete(`${url}myapi/TestQuestion/xoaTestQuestion`, {
        data: { test_question_id },
      });
      fetchTestQuestions(pagination.currentPage);
    } catch (error) {
      console.error("Error deleting test question:", error);
    }
  };

  return (
    <div>
      {/* Thanh tìm kiếm và bộ lọc */}
      <Box className="tq-topbar">
        <TextField
          label="Tìm kiếm tiêu đề test"
          className="tq-search-bar"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Nhập tiêu đề bài kiểm tra"
          fullWidth
          style={{ marginRight: 16 }}
        />
        <FormControl style={{ minWidth: 200 }}>
          <InputLabel>Kỹ năng</InputLabel>
          <Select
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            label="Kỹ năng"
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="Listening">Nghe</MenuItem>
            <MenuItem value="Speaking">Nói</MenuItem>
            <MenuItem value="Reading">Đọc</MenuItem>
            <MenuItem value="Writing">Viết</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Bảng hiển thị Test_Question */}
      <TableContainer component={Paper} className="tq-table-container">
        <Table aria-label="tq table" className="tq-table">
          <TableHead className="head-tq">
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Test ID</TableCell>
              <TableCell>Question ID</TableCell>
              <TableCell>Kỹ năng</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSkill.length > 0 ? (
              filteredSkill.map((item) => (
                <TableRow key={item.test_question_id}>
                  <TableCell>{item.test_question_id}</TableCell>

                  <TableCell>
                    {expandedRows[item.test_id] ? (
                      <>
                        {item.title}{" "}
                        <Button
                          color="error"
                          size="small"
                          onClick={() => toggleExpand(item.test_id)}
                        >
                          Thu gọn
                        </Button>
                      </>
                    ) : (
                      <>
                        {item.title.length > 50
                          ? `${item.title.slice(0, 50)}...`
                          : item.title}
                        {item.title.length > 50 && (
                          <Button
                            color="error"
                            size="small"
                            onClick={() => toggleExpand(item.test_id)}
                          >
                            Xem thêm
                          </Button>
                        )}
                      </>
                    )}
                  </TableCell>
                  <TableCell>
                    {expandedRows[item.question_id] ? (
                      <>
                        {item.content}{" "}
                        <Button
                          color="error"
                          size="small"
                          onClick={() => toggleExpand(item.question_id)}
                        >
                          Thu gọn
                        </Button>
                      </>
                    ) : (
                      <>
                        {item.content.length > 100
                          ? `${item.content.slice(0, 100)}...`
                          : item.content}
                        {item.content.length > 100 && (
                          <Button
                            color="error"
                            size="small"
                            onClick={() => toggleExpand(item.question_id)}
                          >
                            Xem thêm
                          </Button>
                        )}
                      </>
                    )}
                  </TableCell>
                  <TableCell>{item.skill}</TableCell>
                  <TableCell className="tq-actions">
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(item)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(item.test_question_id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Không có Test Question nào được tìm thấy
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Phân trang */}
      <Box
        display="flex"
        justifyContent="end"
        alignItems="center"
        marginTop={2}
      >
        <Pagination
          count={pagination.totalPages}
          page={pagination.currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      {/* Dialog Sửa Test_Question */}
      <Dialog open={openEdit} onClose={handleEditClose} fullWidth maxWidth="md">
        <DialogTitle>Sửa Test Question</DialogTitle>
        <DialogContent>
          {selectedTestQuestion && (
            <>
              <InputLabel className="label">Bài kiểm tra</InputLabel>
              <Select
                label="Chủ đề"
                fullWidth
                margin="normal"
                value={selectedTestQuestion.test_id}
                onChange={(e) =>
                  setSelectedTestQuestion({
                    ...selectedTestQuestion,
                    test_id: e.target.value,
                  })
                }
              >
                {tests.map((test) => (
                  <MenuItem key={test.test_id} value={test.test_id}>
                    {test.title}
                  </MenuItem>
                ))}
              </Select>

              <InputLabel className="label">Câu hỏi</InputLabel>
              <Select
                label="Câu hỏi"
                fullWidth
                margin="normal"
                value={selectedTestQuestion.question_id}
                onChange={(e) =>
                  setSelectedTestQuestion({
                    ...selectedTestQuestion,
                    question_id: e.target.value,
                  })
                }
              >
                {questions.map((question) => (
                  <MenuItem
                    key={question.question_id}
                    value={question.question_id}
                  >
                    {question.content}
                  </MenuItem>
                ))}
              </Select>

              <InputLabel className="label">Kỹ năng</InputLabel>
              <Select
                fullWidth
                margin="normal"
                value={selectedTestQuestion.skill || ""}
                onChange={(e) =>
                  setSelectedTestQuestion({
                    ...selectedTestQuestion,
                    skill: e.target.value,
                  })
                }
              >
                {["Listening", "Speaking", "Reading", "Writing"].map(
                  (qskill) => (
                    <MenuItem key={qskill} value={qskill}>
                      {qskill}
                    </MenuItem>
                  )
                )}
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

      {/* Dialog Thêm Test_Question */}
      <Dialog open={openAdd} onClose={handleAddClose} fullWidth maxWidth="md">
        <DialogTitle>Thêm Test Question</DialogTitle>
        <DialogContent>
          <InputLabel className="label">Bài kiểm tra</InputLabel>
          <Select
            label="Bài kiểm tra"
            fullWidth
            margin="normal"
            value={selectedTestQuestion?.test_id || ""}
            onChange={(e) =>
              setSelectedTestQuestion({
                ...selectedTestQuestion,
                test_id: e.target.value,
              })
            }
          >
            {tests?.length > 0 &&
              tests.map((test) => (
                <MenuItem key={test.test_id} value={test.test_id}>
                  {test.title}
                </MenuItem>
              ))}
          </Select>
          <InputLabel className="label">Câu hỏi </InputLabel>
          <Select
            label="Câu hỏi"
            fullWidth
            margin="normal"
            value={selectedTestQuestion?.question_id || ""}
            onChange={(e) =>
              setSelectedTestQuestion({
                ...selectedTestQuestion,
                question_id: e.target.value,
              })
            }
          >
            {questions?.length > 0 &&
              questions.map((question) => (
                <MenuItem
                  key={question.question_id}
                  value={question.question_id}
                >
                  {question.content}
                </MenuItem>
              ))}
          </Select>

          <InputLabel className="label">Kỹ năng</InputLabel>
          <Select
            fullWidth
            margin="normal"
            value={selectedTestQuestion?.skill || ""}
            onChange={(e) =>
              setSelectedTestQuestion({
                ...selectedTestQuestion,
                skill: e.target.value,
              })
            }
          >
            <MenuItem value="Listening">Listening</MenuItem>
            <MenuItem value="Speaking">Speaking</MenuItem>
            <MenuItem value="Reading">Reading</MenuItem>
            <MenuItem value="Writing">Writing</MenuItem>
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
            onClick={() => handleAddSubmit(selectedTestQuestion)}
            style={{ backgroundColor: "#228b22", color: "#ffffff" }}
          >
            Thêm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Nút thêm (Floating Button) */}
      <Box sx={{ position: "fixed", bottom: 30, right: 50 }}>
        <Fab color="primary" aria-label="add" onClick={handleAddClick}>
          <AddIcon />
        </Fab>
      </Box>
    </div>
  );
};

export default TestQuestionManagement;
