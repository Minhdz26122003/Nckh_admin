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
  MenuItem,
  Select,
  InputLabel,
  Button,
  Fab,
  Box,
  Alert,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import "./Less_Ques.css"; // Import style riêng
import url from "../../ipconfixad.js";

const Less_Ques = () => {
  const [lessonQuestion, setLessonQuestion] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedLesson, setselectedLesson] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);
  // State phân trang
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 5,
  });
  useEffect(() => {
    fetchLessonQuestion();
    fetchLessons();
    fetchQuestions();
    if (selectedLesson?.question_id) {
      fetchQuestions(selectedLesson.question_id); // Lấy danh sách câu hỏi chưa có
    }
  }, [selectedLesson?.question_id]);

  const fetchLessonQuestion = async (
    page = pagination.currentPage,
    limit = pagination.limit
  ) => {
    try {
      const response = await axios.get(`${url}myapi/Lesson_Question/getall`, {
        params: { page, limit },
      });
      setLessonQuestion(response.data);
      setPagination({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        limit,
      });
    } catch (error) {
      console.error("Error fetching lesson-question:", error);
    }
  };

  const fetchLessons = async () => {
    try {
      const response = await axios.get(`${url}myapi/Lesson/getall`);
      setLessons(response.data);
    } catch (error) {
      console.error("Error fetching lessons:", error);
    }
  };

  const fetchQuestions = async (lessId) => {
    if (!lessId) return;
    try {
      const response = await axios.get(
        `${url}myapi/Lesson_Question/getquestinless`,
        {
          params: { question_id: lessId },
        }
      );
      setQuestions(response.data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handlePageChange = (event, value) => {
    fetchLessonQuestion(value, pagination.limit);
  };

  // thêm câu hỏi vào bài học
  const handleAddSubmit = async (newData) => {
    try {
      const formData = new FormData();
      formData.append("lesson_id", newData.lesson_id);
      formData.append("question_id", newData.question_id);

      const response = await axios.post(
        `${url}myapi/Lesson_Question/add`,
        formData
      );

      if (response.data.success) {
        window.alert("Thêm liên kết thành công");
        fetchLessonQuestion();
        setOpenAdd(false);
      } else {
        console.error("Lỗi:", response.data.message);
      }
    } catch (error) {
      console.error("Error adding:", error);
    }
  };

  const handleAddClick = () => {
    setOpenAdd(true);
  };
  const handleAddClose = () => {
    setOpenAdd(false);
  };

  // Xóa câu hỏi
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa liên kết này không?"
    );
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `${url}myapi/Lesson_Question/delete`,
        { data: { lesson_question_id: id } }
      );

      if (response.data.success) {
        window.alert("Xóa liên kết thành công");
        fetchLessonQuestion();
      } else {
        console.error("Lỗi:", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  return (
    <div>
      <TableContainer component={Paper} className="lessques-table-container">
        <Table aria-label="lessques table" className="lessques-table">
          {/* Tiêu đề bảng*/}
          <TableHead className="head-lessques">
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Bài học</TableCell>
              <TableCell>Câu hỏi</TableCell>

              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {Array.isArray(lessonQuestion) && lessonQuestion.length > 0 ? (
              lessonQuestion.map((item) => (
                <TableRow key={item.iddvtt}>
                  <TableCell>{item.lesson_question_id}</TableCell>
                  {/* tiêu đề bài học */}
                  <TableCell>{item.name}</TableCell>
                  {/* nội dung câu hỏi */}
                  <TableCell>{item.content}</TableCell>

                  <TableCell className="lessques-table-actions">
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(item.lesson_question_id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Không có dữ liệu nào đươc tìm thấy
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
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
      {/* Dialog thêm */}
      <Dialog fullWidth maxWidth="md" open={openAdd} onClose={handleAddClose}>
        <DialogTitle>Thêm câu hỏi</DialogTitle>
        <DialogContent>
          <InputLabel className="label">Bài học</InputLabel>
          <Select
            labelId="select-less-label"
            label="Bài học"
            fullWidth
            margin="normal"
            value={selectedLesson?.lesson_id || ""}
            onChange={(e) => {
              const newlessid = e.target.value;
              setselectedLesson({
                ...selectedLesson,
                lesson_id: newlessid,
              });
            }}
          >
            {lessons.map((lesson) => (
              <MenuItem key={lesson.lesson_id} value={lesson.lesson_id}>
                {lesson.title}
              </MenuItem>
            ))}
          </Select>

          <InputLabel className="label">Câu hỏi</InputLabel>
          <Select
            labelId="select-quest-label"
            label="Câu hỏi"
            fullWidth
            margin="normal"
            value={selectedLesson?.question_id || ""}
            onChange={(e) =>
              setselectedLesson({
                ...selectedLesson,
                question_id: e.target.value,
              })
            }
          >
            {questions.map((question) => (
              <MenuItem key={question.question_id} value={question.question_id}>
                {question.content}
              </MenuItem>
            ))}
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
            onClick={() => handleAddSubmit(selectedLesson)}
            style={{ backgroundColor: "#228b22", color: "#ffffff" }}
          >
            Thêm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Nút thêm dịch vụ */}
      <Box sx={{ position: "fixed", bottom: 30, right: 50 }}>
        <Fab color="primary" aria-label="add" onClick={handleAddClick}>
          <AddIcon />
        </Fab>
      </Box>
    </div>
  );
};

export default Less_Ques;
