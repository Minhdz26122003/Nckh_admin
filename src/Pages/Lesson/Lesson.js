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

import axios from "axios";
import ".././Lesson/Lesson.css"; // Import style riêng
import url from "../../ipconfixad";

const Lesson = () => {
  const [lessons, setLesson] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [value, setValue] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [topics, setTopic] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  // Lọc bài học theo tab
  const filteredSkills = lessons.filter((lesson) => {
    if (value === 0 && lesson.skill === 0) return true; // Listening
    if (value === 1 && lesson.skill === 1) return true; // Speaking
    if (value === 2 && lesson.skill === 2) return true; // Reading
    if (value === 3 && lesson.skill === 3) return true; // Writing
    return false;
  });

  const convertTrangThai = (skill) => {
    const trangThaiMap = {
      0: "Listening",
      1: "Speaking",
      2: "Reading",
      3: "Writing",
    };
    return trangThaiMap[skill] || "Không xác định";
  };

  const fetchTopics = async () => {
    try {
      const response = await axios.get(`${url}myapi/Topics/getTp`);
      setTopic(response.data);
    } catch (error) {
      console.error("Error fetching topic", error);
    }
  };

  const fetchLessons = async () => {
    try {
      const response = await axios.get(`${url}myapi/baihoc/getall`);
      setLesson(response.data.baihoc);
      console.log(response);
    } catch (error) {
      console.error("Error fetching lessons:", error);
    }
  };

  // thêm bài học
  const handleAddSubmit = async (newLesson) => {
    try {
      const formData = new FormData();
      formData.append("title", newLesson.title);
      formData.append("content", newLesson.content);
      formData.append("skill", newLesson.skill);
      formData.append("topic_id", newLesson.topic_id);
      formData.append("difficulty_level", newLesson.difficulty_level);

      // Gửi yêu cầu thêm dịch vụ mới
      const response = await axios.post(
        `${url}/myapi/Baihoc/themBaihoc`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        console.log("Thêm bài học thành công");
      } else {
        console.error("Lỗi:", response.data.message);
      }
      // Sau khi thêm thành công, đóng form và tải lại danh sách
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

  // tìm kiếm bài học
  const searchLessons = async (startDate, endDate) => {
    try {
      if (!startDate || !endDate) {
        console.error("Ngày bắt đầu và kết thúc không hợp lệ.");
        return;
      }
      const response = await axios.get(
        `${url}myapi/baihoc/tkbaihoc?start_date=${startDate}&end_date=${endDate}`
      );
      console.log(response.data);

      if (response.data.success) {
        setLesson(response.data.lessons);
      } else {
        setLesson([]);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm bài học:", error);
    }
  };

  useEffect(() => {
    fetchTopics();
    if (startDate && endDate) {
      searchLessons(startDate, endDate);
    } else {
      fetchLessons();
    }
  }, [startDate, endDate]);

  // Sửa bài học
  const handleEditSubmit = async () => {
    try {
      await axios.put(`${url}myapi/Baihoc/suaBaihoc`, selectedLesson);

      setOpenEdit(false);
      fetchLessons();
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
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      {/* Tab chọn trạng thái */}
      <Tabs
        className="tabstatus"
        value={value}
        onChange={handleChange}
        aria-label="Lesson Status Tabs"
      >
        <Tab className="tabitem" label="Listening" />
        <Tab className="tabitem" label="Speaking" />
        <Tab className="tabitem" label="Reading" />
        <Tab className="tabitem" label="Writing" />
      </Tabs>

      {/* Tìm kiếm theo ngày */}

      <Box className="lesson-search-bar">
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
            {filteredSkills.length > 0 ? (
              filteredSkills.map((lesson) => (
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
                      onClick={() => handleEdit(center)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(center.idBaihoc)}
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

      {/* Dialog sửa*/}
      <Dialog open={openEdit} onClose={handleEditClose}>
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
          <Button onClick={handleEditClose} color="secondary">
            Trở lại
          </Button>
          <Button onClick={handleEditSubmit} color="primary">
            Lưu lại
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog thêm */}
      <Dialog open={openAdd} onClose={handleAddClose}>
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
          <Button onClick={handleAddClose} color="secondary">
            Trở lại
          </Button>
          <Button
            onClick={() => handleAddSubmit(selectedLesson)}
            color="primary"
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
