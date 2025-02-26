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
  Box,
  Typography,
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

  // Lọc bài học theo tab
  const filteredSkills = lessons((lesson) => {
    if (value === 0 && lesson.skill === 0) return true; // Listening
    if (value === 1 && lesson.skill === 1) return true; // Speaking
    if (value === 2 && lesson.skill === 2) return true; // Reading
    if (value === 3 && lesson.skill === 3) return true; // Writing
    return false;
  });
  const btnStatus = (skill) => {
    switch (skill) {
      case 0:
        return { confirm: true, cancel: true, action: "confirm" }; // Action cho từng trạng thái
      case 1:
        return { confirm: true, cancel: false, action: "complete" };
      case 2:
        return { confirm: true, cancel: false, action: "payment" };
      case 3:
        return { confirm: false, cancel: false, action: null };
      default:
        return { confirm: false, cancel: false, action: null };
    }
  };

  const { confirm, cancel } = btnStatus(value);
  const convertTrangThai = (skill) => {
    const trangThaiMap = {
      0: "Listening",
      1: "Speaking",
      2: "Reading",
      3: "Writing",
    };
    return trangThaiMap[skill] || "Không xác định";
  };
  const fetchLessons = async () => {
    try {
      const response = await axios.get(`${url}myapi/Lichhen/getallLh.php`);
      setLesson(response.data.lichhen);
      console.log(response);
    } catch (error) {
      console.error("Error fetching lessons:", error);
    }
  };

  // TÌM KIẾM bài học
  const searchLessons = async (startDate, endDate) => {
    try {
      if (!startDate || !endDate) {
        console.error("Ngày bắt đầu và kết thúc không hợp lệ.");
        return;
      }
      const response = await axios.get(
        `${url}myapi/Lichhen/tkLichhen.php?start_date=${startDate}&end_date=${endDate}`
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
    if (startDate && endDate) {
      searchLessons(startDate, endDate);
    } else {
      fetchLessons();
    }
  }, [startDate, endDate]);

  // Sửa bài học
  const handleEditSubmit = async () => {
    try {
      await axios.put(`${url}myapi/Trungtam/suatrungtam.php`, selectedLesson);

      setOpenEdit(false);
      fetchCenters();
    } catch (error) {
      console.error("Error updating center:", error);
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

  //HỦY bài học
  const Huylich = async (lesson_id, lyDo) => {
    try {
      const response = await axios.post(`${url}myapi/Lichhen/huylichhen.php`, {
        lesson_id,
        lydohuy: lyDo,
      });

      if (response.data.success) {
        console.log("Thành công", "bài học đã được hủy thành công.");
        fetchLessons();
      } else {
        console.log(
          "Lỗi",
          response.data.message || "Hủy lịch không thành công."
        );
      }
    } catch (error) {
      console.error(error);
      console.log("Lỗi", "Không thể kết nối với máy chủ.");
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
        aria-label="Appointment Status Tabs"
      >
        <Tab className="tabitem" label="Listening" />
        <Tab className="tabitem" label="Speaking" />
        <Tab className="tabitem" label="Reading" />
        <Tab className="tabitem" label="Writing" />
      </Tabs>

      {/* Tìm kiếm theo ngày */}

      <Box className="book-search-bar">
        <TextField
          className="book-search-start"
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
          className="book-search-end"
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
      <TableContainer component={Paper} className="book-table-container">
        <Table aria-label="appointment table" className="book-table">
          <TableHead className="head-book">
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
            {filteredLessons.length > 0 ? (
              filteredLessons.map((lesson) => (
                <TableRow key={lesson.lesson_id}>
                  <TableCell>{lesson.lesson_id}</TableCell>
                  <TableCell>{lesson.title}</TableCell>
                  <TableCell>{lesson.content}</TableCell>
                  <TableCell>{convertTrangThai(lesson.skill)}</TableCell>
                  <TableCell>{lesson.name}</TableCell>
                  <TableCell>{lesson.difficulty_level}</TableCell>

                  <TableCell>{lesson.created_at}</TableCell>

                  <TableCell className="book-table-actions">
                    {confirm && (
                      <IconButton
                        color="success"
                        onClick={() =>
                          handleConfirm(
                            btnStatus(lesson.trangthai).action,
                            lesson.lesson_id
                          )
                        }
                        disabled={!btnStatus(value).confirm}
                      >
                        <CheckIcon />
                      </IconButton>
                    )}
                    {cancel && (
                      <IconButton
                        color="warning"
                        onClick={() => openCancelModal(lesson.lesson_id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
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
                value={selectedLesson.tentrungtam}
                onChange={(e) =>
                  setSelectedLesson({
                    ...selectedLesson,
                    tentrungtam: e.target.value,
                  })
                }
              />
              <TextField
                label="Nội dung"
                fullWidth
                margin="normal"
                value={selectedLesson.diachi}
                onChange={(e) =>
                  setSelectedLesson({
                    ...selectedLesson,
                    diachi: e.target.value,
                  })
                }
              />
              <TextField
                label="Kỹ năng"
                fullWidth
                margin="normal"
                value={selectedLesson.sodienthoai}
                onChange={(e) =>
                  setSelectedLesson({
                    ...selectedLesson,
                    sodienthoai: e.target.value,
                  })
                }
              />
              <TextField
                label="Chủ đề"
                fullWidth
                margin="normal"
                value={selectedLesson.email}
                onChange={(e) =>
                  setSelectedLesson({
                    ...selectedLesson,
                    email: e.target.value,
                  })
                }
              />
              <TextField
                label="Độ khó"
                fullWidth
                margin="normal"
                value={selectedLesson.hinhanh}
                onChange={(e) =>
                  setSelectedLesson({
                    ...selectedLesson,
                    hinhanh: e.target.value,
                  })
                }
              />

              {/* <TextField
                label="Thời gian tạo"
                fullWidth
                margin="normal"
                value={selectedLesson.toadoy}
                onChange={(e) =>
                  setSelectedLesson({
                    ...selectedLesson,
                    toadoy: e.target.value,
                  })
                }
              /> */}
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleEditClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="primary">
            Save
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
                tentrungtam: e.target.value,
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
                diachi: e.target.value,
              })
            }
          />
          <TextField
            label="Kỹ năng"
            fullWidth
            margin="normal"
            onChange={(e) =>
              setSelectedLesson({
                ...selectedLesson,
                sodienthoai: e.target.value,
              })
            }
          />
          <TextField
            label="Chủ đề"
            fullWidth
            margin="normal"
            onChange={(e) =>
              setSelectedLesson({
                ...selectedLesson,
                email: e.target.value,
              })
            }
          />

          <TextField
            label="Độ khó"
            fullWidth
            margin="normal"
            onChange={(e) =>
              setSelectedLesson({
                ...selectedLesson,
                hinhanh: e.target.value, // Nhập URL hình ảnh
              })
            }
          />

          <TextField
            label="Thời gian tạo"
            fullWidth
            margin="normal"
            onChange={(e) =>
              setSelectedLesson({
                ...selectedLesson,
                toadoy: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={() => handleAddSubmit(selectedLesson)}
            color="primary"
          >
            Add
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

export default Lesson;
