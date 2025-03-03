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
  Slider,
  Button,
  Fab,
  Typography,
  Box,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import axios from "axios";
import "./topic.css";
import url from "../../ipconfixad.js";

const Topic = () => {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState({
    tenchude: "",
    description: "",
    // created_at: "",
  });
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    fetchTopic();
  }, []);

  const fetchTopic = async () => {
    try {
      const response = await axios.get(`${url}myapi/Chude/Chude`);
      setTopics(response.data);
    } catch (error) {
      console.error("Error fetching topic:", error);
    }
  };

  const checkData = async (newTopic) => {
    if (!newTopic.name || !newTopic.description) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
  };
  //TÌM KIẾM CHỦ ĐỀ
  const searchTopics = async (giatri) => {
    try {
      const response = await axios.get(
        `${url}myapi/Chude/tkiem?giatri=${giatri}`
      );
      const sales = response.data.sales;
      console.log("API Response:", sales);
      setSales(sales);
    } catch (error) {
      console.error("Error searching sales:", error);
    }
  };

  // Gọi API để lấy tất cả khi component được load lần đầu
  useEffect(() => {
    if (searchTerm) {
      console.log("Searching for:", searchTerm);
      searchTopics(searchTerm);
    } else {
      console.log("Fetching all topic");
      fetchTopic();
    }
  }, [searchTerm]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    // console.log("Search Term:", event.target.value);
  };

  // THÊM CHỦ ĐỀ
  const handleAddSubmit = async (newTopic) => {
    try {
      checkData();

      const formData = new FormData();
      formData.append("name", newTopic.name);
      formData.append("description", newTopic.description);

      const response = await axios.post(
        `${url}myapi/Chude/themChude`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        console.log("Thêm chủ đề thành công");
      } else {
        console.error("Lỗi:", response.data.message);
      }

      // Đóng form và tải lại danh sách CHỦ ĐỀ
      setOpenAdd(false);
      fetchTopic();
    } catch (error) {
      console.error("Error adding fetchTopic:", error);
    }
  };

  const handleAddClick = () => {
    setOpenAdd(true);
  };
  const handleAddClose = () => {
    setOpenAdd(false);
  };

  // SỬA CHỦ ĐỀ
  const handleEditSubmit = async () => {
    try {
      // Gửi dữ liệu đã sửa về server
      await axios.put(`${url}myapi/Chude/suaChude`, selectedTopic);
      setOpenEdit(false);
      fetchTopic();
    } catch (error) {
      console.error("Error updating fetchTopic:", error);
    }
  };
  const handleEdit = (topic) => {
    setSelectedTopic(topic);
    setOpenEdit(true);
  };
  const handleEditClose = () => {
    setOpenEdit(false);
    setSelectedTopic(null);
  };

  // XÓA CHỦ ĐỀ
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa tài khoản này không?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`${url}myapi/Chude/xoaChude`, {
        data: { topic_id: id },
      });

      setTopics(topics.filter((topic) => topic.topic_id !== id));
    } catch (error) {
      console.error("Error deleting topic:", error);
    }
  };

  const toggleExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div>
      {/* Thanh tìm kiếm */}

      <Box className="topic-search-bar">
        <TextField
          className="topic-search-text"
          label="Tìm kiếm chủ đề"
          variant="outlined"
          value={searchTerm}
          fullWidth
          onChange={handleSearch}
          placeholder="Tìm kiếm theo tên dịch vụ"
        />
      </Box>

      <TableContainer component={Paper} className="topic-table-container">
        <Table aria-label="topic table" className="topic-table">
          {/* Tiêu đề bảng*/}
          <TableHead className="head-topic">
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên Chủ Đề</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Thời Gian Tạo</TableCell>

              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {topics && topics.length > 0 ? (
              topics.map((topic) => (
                <TableRow key={topic.topic_id}>
                  <TableCell>{topic.topic_id}</TableCell>
                  <TableCell>{topic.name}</TableCell>
                  <TableCell>
                    {expandedRows[topic.topic_id] ? (
                      <>
                        {topic.description}{" "}
                        <Button
                          color="error"
                          size="small"
                          onClick={() => toggleExpand(topic.topic_id)}
                        >
                          Thu gọn
                        </Button>
                      </>
                    ) : (
                      <>
                        {topic.description.length > 100
                          ? `${topic.description.slice(0, 100)}...`
                          : topic.description}
                        {topic.description.length > 100 && (
                          <Button
                            color="error"
                            size="small"
                            onClick={() => toggleExpand(topic.topic_id)}
                          >
                            Xem thêm
                          </Button>
                        )}
                      </>
                    )}
                  </TableCell>
                  <TableCell>{topic.created_at}</TableCell>

                  <TableCell className="topic-table-actions">
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(topic)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(topic.topic_id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Không có chủ đề nào được tìm thấy
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog sửa*/}
      <Dialog open={openEdit} onClose={handleEditClose}>
        <DialogTitle>Sửa chủ đề</DialogTitle>
        <DialogContent>
          {selectedTopic && (
            <>
              <TextField
                label="Tên chủ đề"
                fullWidth
                margin="normal"
                value={selectedTopic.name}
                onChange={(e) =>
                  setSelectedTopic({
                    ...selectedTopic,
                    name: e.target.value,
                  })
                }
              />
              <TextField
                label="Mô tả"
                fullWidth
                margin="normal"
                value={selectedTopic.description}
                onChange={(e) =>
                  setSelectedTopic({
                    ...selectedTopic,
                    description: e.target.value,
                  })
                }
              />
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
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog thêm */}
      <Dialog open={openAdd} onClose={handleAddClose}>
        <DialogTitle>Thêm chủ đề</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên chủ đề"
            fullWidth
            margin="normal"
            onChange={(e) =>
              setSelectedTopic({
                ...selectedTopic,
                name: e.target.value,
              })
            }
          />
          <TextField
            label="Mô tả"
            fullWidth
            margin="normal"
            onChange={(e) =>
              setSelectedTopic({
                ...selectedTopic,
                description: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleAddClose}
            style={{ backgroundColor: "#ff0000", color: "#ffffff" }}
          >
            Trở lại
          </Button>
          <Button
            onClick={() => handleAddSubmit(selectedTopic)}
            style={{ backgroundColor: "#228b22", color: "#ffffff" }}
          >
            Thêm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Nút thêm CHỦ ĐỀ */}
      <Box sx={{ position: "fixed", bottom: 30, right: 50 }}>
        <Fab color="primary" aria-label="add" onClick={handleAddClick}>
          <AddIcon />
        </Fab>
      </Box>
    </div>
  );
};

export default Topic;
