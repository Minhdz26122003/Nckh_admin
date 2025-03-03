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
  Switch,
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
import axios from "axios";
import "./Option.css";
import url from "../../ipconfixad.js";

const Option = () => {
  const [options, setOptions] = useState([]);
  const [questions, setQuestion] = useState([]);
  const [iscorrect, setCorrect] = useState(""); // Lọc theo độ khó
  const [selectedOption, setSelectedOption] = useState({
    question_id: "",
    content: "",
    is_correct: false,
  });
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  // Bộ lọc: "all" = tất cả, "true" = đúng, "false" = sai

  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    fetchOptions();
    fetchQuestion();
  }, []);

  const filteredAnswer = options.filter((option) => {
    // Đối với dữ liệu là number
    // const matchSkill =
    // iscorrect !== "" ? lesson.iscorrect === Number(iscorrect) : true;

    const matchCorrect =
      iscorrect !== "" ? option.is_correct === iscorrect : true;
    return matchCorrect;
  });

  // Hàm lấy dữ liệu Option
  const fetchOptions = async () => {
    try {
      const response = await axios.get(`${url}myapi/Option/getOption`);
      setOptions(response.data);
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };
  // Hàm lấy dữ liệu question
  const fetchQuestion = async () => {
    try {
      const response = await axios.get(`${url}myapi/questions/gettquestions`);
      setQuestion(response.data);
    } catch (error) {
      console.error("Error fetching questions", error);
    }
  };

  //Tìm kiếm option
  const searchOptions = async (searchTerm) => {
    try {
      const response = await axios.get(
        `${url}myapi/Option/tkoptions?content=${searchTerm}`
      );
      const options = response.data.options;
      console.log("API Response:", options);
      setOptions(options);
    } catch (error) {
      console.error("Error searching options:", error);
    }
  };

  useEffect(() => {
    fetchQuestion();
    if (searchTerm) {
      // console.log("Searching with:", searchTerm);
      searchOptions(searchTerm);
    } else {
      fetchOptions();
    }
  }, [searchTerm]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Kiểm tra dữ liệu nhập
  const checkData = (option) => {
    if (!option.question_id || !option.content) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return false;
    }
    return true;
  };

  // Thêm Option
  const handleAddSubmit = async () => {
    if (!checkData(selectedOption)) return;
    try {
      const response = await axios.post(
        `${url}myapi/Option/themOption`,
        newAccount
      );

      if (response.data.success) {
        console.log("Thêm Option thành công");
      } else {
        console.error("Lỗi:", response.data.message);
      }
      setOpenAdd(false);
      fetchOptions();
    } catch (error) {
      console.error("Error adding option:", error);
    }
  };
  const handleAddClick = () => {
    setSelectedOption({ question_id: "", content: "", is_correct: false });
    setOpenAdd(true);
  };

  const handleAddClose = () => {
    setOpenAdd(false);
  };

  // Sửa Option
  const handleEditSubmit = async () => {
    if (!checkData(selectedOption)) return;

    try {
      await axios.put(`${url}myapi/Option/suaOption`, selectedOption);
      setOpenEdit(false);
      fetchOptions();
    } catch (error) {
      console.error("Error updating option:", error);
    }
  };

  const handleEdit = (option) => {
    setSelectedOption(option);
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
    setSelectedOption({ question_id: "", content: "", is_correct: false });
  };

  // Xóa Option
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa Option này không?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${url}myapi/Option/xoaOption`, {
        data: { option_id: id },
      });
      setOptions(options.filter((option) => option.option_id !== id));
    } catch (error) {
      console.error("Error deleting option:", error);
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
      {/* Thanh tìm kiếm và bộ lọc */}
      <Box className="option-topbar">
        <TextField
          label="Tìm kiếm câu hỏi"
          className="option-search-bar"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Tìm kiếm theo nội dung"
          style={{ marginRight: "16px" }}
        />
        <FormControl style={{ minWidth: 200 }}>
          <InputLabel>Đáp án</InputLabel>
          <Select
            label="Đáp án"
            value={iscorrect}
            onChange={(e) => setCorrect(e.target.value)}
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="true">Đúng</MenuItem>
            <MenuItem value="false">Sai</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Bảng Option */}
      <TableContainer component={Paper} className="option-table-container">
        <Table aria-label="option table" className="option-table">
          <TableHead className="head-option">
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>ID câu hỏi</TableCell>
              <TableCell>Nội dung</TableCell>
              <TableCell>Đáp án</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAnswer.length > 0 ? (
              filteredAnswer.map((option) => (
                <TableRow key={option.option_id}>
                  <TableCell>{option.option_id}</TableCell>
                  <TableCell>{option.question_id}</TableCell>
                  <TableCell>
                    {expandedRows[option.question_id] ? (
                      <>
                        {option.content}{" "}
                        <Button
                          color="error"
                          size="small"
                          onClick={() => toggleExpand(option.question_id)}
                        >
                          Thu gọn
                        </Button>
                      </>
                    ) : (
                      <>
                        {option.content.length > 100
                          ? `${option.content.slice(0, 100)}...`
                          : option.content}
                        {option.content.length > 100 && (
                          <Button
                            color="error"
                            size="small"
                            onClick={() => toggleExpand(option.question_id)}
                          >
                            Xem thêm
                          </Button>
                        )}
                      </>
                    )}
                  </TableCell>
                  <TableCell>{option.is_correct ? "Đúng" : "Sai"}</TableCell>
                  <TableCell className="option-table-actions">
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(option)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(option.option_id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Không có Option nào được tìm thấy
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog Sửa Option */}
      <Dialog open={openEdit} onClose={handleEditClose} maxWidth="md" fullWidth>
        <DialogTitle>Sửa Option</DialogTitle>
        <DialogContent>
          <Select
            label="Câu hỏi"
            fullWidth
            margin="normal"
            value={selectedOption.question_id}
            disabled
            onChange={(e) =>
              setSelectedOption({
                ...selectedOption,
                question_id: e.target.value,
              })
            }
          >
            {/* Hiển thị câu hỏi hiện tại */}
            {/* {selectedOption.question_id && (
                  <MenuItem value={selectedOption.question_id}>
                    {topics.find((t) => t.id === selectedOption.question_id)
                      ?.content || "Câu hỏi hiện tại"}
                  </MenuItem>
                )} */}

            {questions.map((question) => (
              <MenuItem key={question.question_id} value={question.question_id}>
                {question.content}
              </MenuItem>
            ))}
          </Select>

          <TextField
            label="Nội dung"
            fullWidth
            margin="normal"
            value={selectedOption.content}
            onChange={(e) =>
              setSelectedOption({
                ...selectedOption,
                content: e.target.value,
              })
            }
          />
          <FormControlLabel
            control={
              <Switch
                checked={selectedOption.is_correct}
                onChange={(e) =>
                  setSelectedOption({
                    ...selectedOption,
                    is_correct: e.target.checked,
                  })
                }
                color="primary"
              />
            }
            label="Đúng?"
          />
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

      {/* Dialog Thêm Option */}
      <Dialog
        open={openAdd}
        onClose={handleAddClose}
        maxWidth="md"
        fullWidth
        className="dialogadd"
      >
        <DialogTitle>Thêm Option</DialogTitle>
        <DialogContent>
          <InputLabel className="label">Câu hỏi</InputLabel>
          <Select
            label="Câu hỏi"
            fullWidth
            margin="normal"
            value={searchOptions?.question_id || ""}
            onChange={(e) => {
              const newOption = e.target.value;
              setSelectedOption({
                ...searchOptions,
                question_id: newOption,
              });
            }}
          >
            {questions.map((question) => (
              <MenuItem key={question.question_id} value={question.question_id}>
                {question.content}
              </MenuItem>
            ))}
          </Select>

          <FormControlLabel
            control={
              <Switch
                checked={selectedOption.is_correct}
                onChange={(e) =>
                  setSelectedOption({
                    ...selectedOption,
                    is_correct: e.target.checked,
                  })
                }
                color="primary"
              />
            }
            label="Sai/Đúng"
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
            onClick={handleAddSubmit}
            style={{ backgroundColor: "#228b22", color: "#ffffff" }}
          >
            Thêm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Nút Thêm Option */}
      <Box sx={{ position: "fixed", bottom: 30, right: 50 }}>
        <Fab color="primary" aria-label="add" onClick={handleAddClick}>
          <AddIcon />
        </Fab>
      </Box>
    </div>
  );
};

export default Option;
