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
  Tabs,
  Tab,
  Select,
  Fab,
  FormControl,
  InputLabel,
  MenuItem,
  Box,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Check as CheckIcon,
  BorderAll,
} from "@mui/icons-material";
import Pagination from "@mui/material/Pagination";
import axios from "axios";
import ".././Lesson/Lesson.css";
import url from "../../ipconfixad";

const Lesson = () => {
  const [lessons, setLesson] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [topics, setTopic] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);

  const [skill, setSkill] = useState("");
  const [difficulty, setDifficulty] = useState("");
  // State phân trang
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 5,
  });

  const filteredLesson = lessons.filter((lesson) => {
    // Đối với dữ liệu là number
    // const matchSkill =
    // skill !== "" ? lesson.skill === Number(skill) : true;

    const matchSkill = skill !== "" ? lesson.skill === skill : true;
    const matchDifficulty =
      difficulty !== "" ? lesson.difficulty_level === difficulty : true;

    return matchSkill && matchDifficulty;
  });

  const fetchTopics = async () => {
    try {
      const response = await axios.get(`${url}myapi/Topics/getTp`);
      setTopic(response.data);
    } catch (error) {
      console.error("Error fetching topic", error);
    }
  };

  const fetchLessons = async (
    page = pagination.currentPage,
    limit = pagination.limit
  ) => {
    try {
      const response = await axios.get(`${url}myapi/baihoc/getall`, {
        params: { page, limit },
      });
      setLesson(response.data.baihoc);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        limit,
      });
    } catch (error) {
      console.error("Error fetching lessons:", error);
    }
  };

  //tìm kiếm theo tiêu đề
  const searchLesson = async (searchTerm) => {
    try {
      const response = await axios.get(
        `${url}myapi/lessons/tklessons?title=${searchTerm}`
      );
      const lessons = response.data.lessons;
      setLesson(lessons);
    } catch (error) {
      console.error("Error searching lessons:", error);
    }
  };

  // tìm kiếm bài học theo ngày
  const searchLessonsDate = async (startDate, endDate) => {
    try {
      if (!startDate || !endDate) {
        console.error("Ngày bắt đầu và kết thúc không hợp lệ.");
        return;
      }
      const response = await axios.get(
        `${url}myapi/baihoc/tkbaihoc?start_date=${startDate}&end_date=${endDate}`
      );
      if (response.data.success) {
        setLesson(response.data.lessons);
      } else {
        setLesson([]);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm bài học:", error);
    }
  };

  // Khi thay đổi từ khóa tìm kiếm, reset về trang 1
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    fetchLessons(1, pagination.limit);
  };

  const handlePageChange = (event, value) => {
    fetchLessons(value, pagination.limit);
  };

  useEffect(() => {
    fetchTopics();
    if ((startDate && endDate) || searchTerm) {
      searchLessonsDate(startDate, endDate);
      searchLesson(searchTerm);
    } else {
      fetchLessons();
    }
  }, [searchTerm, startDate, endDate]);

  // Kiểm tra dữ liệu nhập
  const checkData = (lesson) => {
    if (
      !lesson.title ||
      !lesson.content ||
      !lesson.skill ||
      !lesson.topic_id ||
      !lesson.difficulty_level
    ) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return false;
    }
    return true;
  };

  // thêm bài học
  const handleAddSubmit = async (newLesson) => {
    if (!checkData(selectedLesson)) return;
    try {
      const formData = new FormData();
      formData.append("title", newLesson.title);
      formData.append("content", newLesson.content);
      formData.append("question_type", newLesson.question_type);
      formData.append("skill", newLesson.skill);
      formData.append("topic_id", newLesson.topic_id);
      formData.append("difficulty_level", newLesson.difficulty_level);

      // Gửi yêu cầu thêm dịch vụ mới
      const response = await axios.post(
        `${url}/myapi/Baihoc/themBaihoc`,
        formData
      );
      if (response.data.success) {
        window.alert("Thêm bài học thành công");
      } else {
        console.error("Lỗi:", response.data.message);
      }

      setOpenAdd(false);
      fetchLessons();
    } catch (error) {
      console.error("Error adding center:", error);
    }
  };

  const handleAddClick = () => {
    setOpenAdd(true);
  };
  const handleAddClose = () => {
    setOpenAdd(false);
  };

  // Sửa bài học
  const handleEditSubmit = async () => {
    if (!checkData(selectedLesson)) return;
    try {
      await axios.put(`${url}myapi/Baihoc/suaBaihoc`, selectedLesson);
      setOpenEdit(false);
      fetchLessons();
      window.alert("Sửa bài học thành côngcông");
    } catch (error) {
      console.error("Error updating lesson:", error);
    }
  };
  const handleEdit = (center) => {
    setSelectedLesson(center);
    setOpenEdit(true);
  };
  const handleEditClose = () => {
    setOpenEdit(false);
    setSelectedLesson(null);
  };

  //Xóa bài học
  const handleDelete = async (lesson_id) => {
    try {
      const response = await axios.post(`${url}myapi/baihoc/huybaihoc`, {
        data: { lesson_id: id },
      });
      if (response.data.success) {
        window.alert("Xóa bài học thành công");
      } else {
        console.error("Lỗi:", response.data.message);
      }
      fetchLessons();
      fetchLessons(lessons.filter((less) => less.lesson_id !== id));
    } catch (error) {
      console.error("Error deleting lesson:", error);
    }
  };

  return (
    <div>
      {/* Tab chọn trạng thái */}
      <Box className="lesson-topbar">
        <Box className="lesson-search-container">
          <TextField
            className="lesson-search-bar"
            label="Tìm bài học"
            variant="outlined"
            fullWidth
            margin="normal"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Tìm kiếm bài học"
          />
        </Box>
        <Box className="lesson-dropdown">
          {/* Dropdown Lọc theo kỹ năng */}
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
        {/* Tìm kiếm theo ngày */}

        <Box className="lesson-searchdate-bar">
          <TextField
            className="lesson-search-start"
            label="Ngày bắt đầu"
            variant="outlined"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <TextField
            className="lesson-search-end"
            label="Ngày kết thúc"
            variant="outlined"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Box>
      </Box>
      {/* Bảng bài học */}
      <TableContainer component={Paper} className="lesson-table-container">
        <Table aria-label="lesson table" className="lesson-table">
          <TableHead className="head-lesson">
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tiêu đề</TableCell>
              <TableCell>Nội dung</TableCell>
              <TableCell>Kỹ năng</TableCell>
              <TableCell>Chủ đề</TableCell>
              <TableCell>Độ khó</TableCell>
              <TableCell>Thời gian tạo</TableCell>

              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredLesson.length > 0 ? (
              filteredLesson.map((lesson) => (
                <TableRow key={lesson.lesson_id}>
                  <TableCell>{lesson.lesson_id}</TableCell>
                  <TableCell>{lesson.title}</TableCell>
                  <TableCell>{lesson.content}</TableCell>
                  <TableCell>{convertTrangThai(lesson.skill)}</TableCell>
                  <TableCell>{lesson.name}</TableCell>
                  <TableCell>{lesson.difficulty_level}</TableCell>

                  <TableCell>{lesson.created_at}</TableCell>

                  <TableCell className="lesson-table-actions">
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(lesson)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(lesson.lesson_id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Không có bài học nào được tìm thấy
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
      {/* Dialog sửa*/}
      <Dialog open={openEdit} onClose={handleEditClose} fullWidth maxWidth="md">
        <DialogTitle>Sửa bài học</DialogTitle>
        <DialogContent>
          {selectedLesson && (
            <>
              <TextField
                label="Tiêu đề"
                fullWidth
                margin="normal"
                value={selectedLesson.title}
                onChange={(e) =>
                  setSelectedLesson({
                    ...selectedLesson,
                    title: e.target.value,
                  })
                }
              />
              <TextField
                label="Nội dung"
                fullWidth
                margin="normal"
                value={selectedLesson.content}
                onChange={(e) =>
                  setSelectedLesson({
                    ...selectedLesson,
                    content: e.target.value,
                  })
                }
              />

              {/* Danh sách các kỹ năng*/}
              <InputLabel>Kỹ năng</InputLabel>
              <Select
                className="select-skill"
                label="Kỹ năng"
                fullWidth
                margin="normal"
                value={selectedLesson?.skill || ""}
                onChange={(e) =>
                  setSelectedLesson({
                    ...selectedLesson,
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

              <InputLabel className="label">Chủ đề</InputLabel>
              <Select
                label="Chủ đề"
                fullWidth
                margin="normal"
                value={selectedLesson.topic_id}
                onChange={(e) =>
                  setSelectedLesson({
                    ...selectedLesson,
                    topic_id: e.target.value,
                  })
                }
              >
                {/* Hiển thị chủ đề hiện tại */}
                {/* {selectedLesson.topic_id && (
                  <MenuItem value={selectedLesson.topic_id}>
                    {topics.find((t) => t.id === selectedLesson.topic_id)
                      ?.name || "Chủ đề hiện tại"}
                  </MenuItem>
                )} */}

                {topics.map((topic) => (
                  <MenuItem key={topic.topic_id} value={topic.topic_id}>
                    {topic.name}
                  </MenuItem>
                ))}
              </Select>

              {/* Danh sách độ khó*/}
              <InputLabel>Độ khó</InputLabel>
              <Select
                className="select-difficult"
                label="Độ khó"
                fullWidth
                margin="normal"
                value={selectedLesson?.difficulty_level || ""}
                onChange={(e) =>
                  setSelectedLesson({
                    ...selectedLesson,
                    difficulty_level: e.target.value,
                  })
                }
              >
                {["Easy", "Medium", "Hard"].map((qdiff) => (
                  <MenuItem key={qdiff} value={qdiff}>
                    {qdiff}
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

      {/* Dialog thêm */}
      <Dialog open={openAdd} onClose={handleAddClose} fullWidth maxWidth="md">
        <DialogTitle>Thêm bài học</DialogTitle>
        <DialogContent>
          <TextField
            label="Tiêu đề"
            fullWidth
            margin="normal"
            onChange={(e) =>
              setSelectedLesson({
                ...selectedLesson,
                title: e.target.value,
              })
            }
          />
          <TextField
            label="Nội dung"
            fullWidth
            margin="normal"
            onChange={(e) =>
              setSelectedLesson({
                ...selectedLesson,
                content: e.target.value,
              })
            }
          />

          <InputLabel className="label">Kỹ năng</InputLabel>
          <Select
            label="Kỹ năng"
            fullWidth
            margin="normal"
            value={selectedLesson?.skill || ""}
            onChange={(e) =>
              setSelectedLesson({
                ...selectedLesson,
                skill: e.target.value,
              })
            }
          >
            <MenuItem value="Listening">Listening</MenuItem>
            <MenuItem value="Speaking">Speaking</MenuItem>
            <MenuItem value="Reading">Reading</MenuItem>
            <MenuItem value="Writing">Writing</MenuItem>
          </Select>

          <InputLabel className="label">Chủ đề</InputLabel>
          <Select
            label="Chủ đề"
            fullWidth
            margin="normal"
            value={selectedLesson?.topic_id || ""}
            onChange={(e) => {
              const newTopic_id = e.target.value;
              setSelectedLesson({
                ...selectedLesson,
                topic_id: newTopic_id,
              });
            }}
          >
            {topics.map((topic) => (
              <MenuItem key={topic.topic_id} value={topic.topic_id}>
                {topic.name}
              </MenuItem>
            ))}
          </Select>

          <InputLabel className="label">Độ khó</InputLabel>
          <Select
            label="Độ khó"
            fullWidth
            margin="normal"
            value={selectedLesson?.difficulty_level || ""}
            onChange={(e) =>
              setSelectedLesson({
                ...selectedLesson,
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
            onClick={() => handleAddSubmit(selectedLesson)}
            style={{ backgroundColor: "#228b22", color: "#ffffff" }}
          >
            Thêm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Nút thêm bài học */}
      <Box sx={{ position: "fixed", bottom: 30, right: 50 }}>
        <Fab color="primary" aria-label="add" onClick={handleAddClick}>
          <AddIcon />
        </Fab>
      </Box>
    </div>
  );
};

export default Lesson;
