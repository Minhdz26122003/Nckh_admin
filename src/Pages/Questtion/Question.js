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
  FormControl,
  InputLabel,
  MenuItem,
  Fab,
  Select,
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
import "../Questtion/Question.css"; // Import style riêng
import url from "../../ipconfixad";

const Question = () => {
  const [questions, setQuestion] = useState([]);
  const [selectedQuesttion, setselectedQuesttion] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [topics, setTopic] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);

  const [skill, setSkill] = useState(""); // Lọc theo độ khó
  const [difficulty, setDifficulty] = useState(""); // Lọc theo độ khó
  const [questionType, setQuestionType] = useState(""); // Lọc theo loại câu hỏi

  const filteredQuestion = questions.filter((question) => {
    // Đối với dữ liệu là number
    // const matchSkill =
    // skill !== "" ? question.skill === Number(skill) : true;

    const matchSkill = skill !== "" ? question.skill === skill : true;
    const matchDifficulty =
      difficulty !== "" ? question.difficulty_level === difficulty : true;
    const matchQuestionType =
      questionType !== "" ? question.question_type === questionType : true;

    return matchSkill && matchDifficulty && matchQuestionType;
  });

  const fetchQuestion = async () => {
    try {
      const response = await axios.get(`${url}myapi/Question/getQ`);
      setQuestion(response.data);
    } catch (error) {
      console.error("Error fetching Question", error);
    }
  };
  const fetchTopics = async () => {
    try {
      const response = await axios.get(`${url}myapi/Topics/getTT`);
      setTopic(response.data);
    } catch (error) {
      console.error("Error fetching topic", error);
    }
  };
  // thêm câu hỏi
  const handleAddSubmit = async (newQuest) => {
    try {
      const formData = new FormData();
      formData.append("content", newQuest.content);
      formData.append("question_type", newQuest.question_type);
      formData.append("skill", newQuest.skill);
      formData.append("topic_id", newQuest.topic_id);
      formData.append("difficulty_level", newQuest.difficulty_level);
      formData.append("audio_url", newQuest.audio_url);
      formData.append("correct_answer", newQuest.correct_answer);

      // Gửi yêu cầu thêm dịch vụ mới
      const response = await axios.post(
        `${url}/myapi/Baihoc/themcauhoi`,
        formData
      );
      if (response.data.success) {
        console.log("Thêm câu hỏi thành công");
      } else {
        console.error("Lỗi:", response.data.message);
      }
      // Sau khi thêm thành công, đóng form và tải lại danh sách
      setOpenAdd(false);
      fetchQuestion();
    } catch (error) {
      console.error("Error adding quest:", error);
    }
  };

  const handleAddClick = () => {
    setOpenAdd(true);
  };
  const handleAddClose = () => {
    setOpenAdd(false);
  };

  // tìm kiếm câu hỏi
  const searchQuestions = async (startDate, endDate) => {
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
        setQuestion(response.data.questions);
      } else {
        setQuestion([]);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm câu hỏi:", error);
    }
  };

  useEffect(() => {
    fetchTopics();
    if (startDate && endDate) {
      searchQuestions(startDate, endDate);
    } else {
      fetchQuestion();
    }
  }, [startDate, endDate]);

  // Sửa câu hỏi
  const handleEditSubmit = async () => {
    try {
      await axios.put(`${url}myapi/Quest/sua`, selectedQuesttion);

      setOpenEdit(false);
      fetchQuestion();
    } catch (error) {
      console.error("Error updating Question:", error);
    }
  };
  const handleEdit = (question) => {
    setselectedQuesttion(question);
    setOpenEdit(true);
  };
  const handleEditClose = () => {
    setOpenEdit(false);
    setselectedQuesttion(null);
  };

  //Xóa câu hỏi
  const handleDelete = async (question_id) => {
    try {
      const response = await axios.post(`${url}myapi/Quest/xoa`, {
        data: { question_id: id },
      });
      if (response.data.success) {
        window.alert("Xóa câu hỏi thành công");
      } else {
        console.error("Lỗi:", response.data.message);
      }
      fetchQuestion();
      setQuestion(questions.filter((question) => question.question_id !== id));
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  return (
    <div>
      <div className="quest-topbar">
        <Box className="quest-dropdown">
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

          {/* Lọc theo loại câu hỏi */}
          <FormControl style={{ minWidth: 200 }}>
            <InputLabel>Loại câu hỏi</InputLabel>
            <Select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
              label="Loại câu hỏi"
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="Multiple Choice">Trắc nghiệm</MenuItem>
              <MenuItem value="True/False">Đúng/Sai</MenuItem>
              <MenuItem value="Short Answer">Trả lời ngắn</MenuItem>
              <MenuItem value="Essay">Tự luận</MenuItem>
              <MenuItem value="Listening">Nghe</MenuItem>
            </Select>
          </FormControl>
        </Box>
        {/* Tìm kiếm theo ngày */}
        <Box className="quest-search-bar">
          <TextField
            className="quest-search-start"
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
            className="quest-search-end"
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
      </div>
      {/* Bảng câu hỏi */}
      <TableContainer component={Paper} className="quest-table-container">
        <Table aria-label="quest table" className="quest-table">
          <TableHead className="head-quest">
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nội dung</TableCell>
              <TableCell>Loại câu hỏi</TableCell>
              <TableCell>Kỹ năng</TableCell>
              <TableCell>Chủ đề</TableCell>
              <TableCell>Độ khó</TableCell>
              <TableCell>Link Audio</TableCell>
              <TableCell>Đáp án đúng</TableCell>
              <TableCell>Thời gian tạo</TableCell>

              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredQuestion.length > 0 ? (
              filteredQuestion.map((question) => (
                <TableRow key={question.question_id}>
                  <TableCell>{question.question_id}</TableCell>
                  <TableCell>{question.content}</TableCell>
                  <TableCell>{question.question_type}</TableCell>
                  <TableCell>{question.skill}</TableCell>

                  {/*  tên chủ dề */}
                  <TableCell>{question.name}</TableCell>
                  <TableCell>{question.difficulty_level}</TableCell>
                  <TableCell>{question.audio_url}</TableCell>
                  <TableCell>{question.correct_answer}</TableCell>
                  <TableCell>{question.created_at}</TableCell>
                  <TableCell className="quest-table-actions">
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(question)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(question.question_id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Không có câu hỏi nào được tìm thấy
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog sửa*/}
      <Dialog open={openEdit} onClose={handleEditClose}>
        <DialogTitle>Sửa câu hỏi</DialogTitle>
        <DialogContent>
          {selectedQuesttion && (
            <>
              <TextField
                label="Nội dung"
                fullWidth
                margin="normal"
                value={selectedQuesttion.content}
                onChange={(e) =>
                  setselectedQuesttion({
                    ...selectedQuesttion,
                    content: e.target.value,
                  })
                }
              />

              {/* Danh sách các loại câu hỏi */}
              <InputLabel className="label">Loại câu hỏi</InputLabel>
              <Select
                className="select-questtype"
                label="Loại câu hỏi"
                fullWidth
                margin="normal"
                value={selectedQuesttion?.question_type || ""}
                onChange={(e) =>
                  setselectedQuesttion({
                    ...selectedQuesttion,
                    question_type: e.target.value,
                  })
                }
              >
                {[
                  "Multiple Choice",
                  "True/False",
                  "Short Answer",
                  "Essay",
                  "Listening",
                ].map((qtype) => (
                  <MenuItem key={qtype} value={qtype}>
                    {qtype}
                  </MenuItem>
                ))}
              </Select>

              {/* Danh sách các kỹ năng*/}
              <InputLabel className="label">Kỹ năng</InputLabel>
              <Select
                className="select-skill"
                label="Kỹ năng"
                fullWidth
                margin="normal"
                value={selectedQuesttion?.skill || ""}
                onChange={(e) =>
                  setselectedQuesttion({
                    ...selectedQuesttion,
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
                value={selectedQuesttion.topic_id}
                onChange={(e) =>
                  setselectedQuesttion({
                    ...selectedQuesttion,
                    topic_id: e.target.value,
                  })
                }
              >
                {/*                 
                {selectedQuesttion.topic_id && (
                  <MenuItem value={selectedQuesttion.topic_id}>
                    {topics.find((t) => t.id === selectedQuesttion.topic_id)
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
                value={selectedQuesttion?.difficulty_level || ""}
                onChange={(e) =>
                  setselectedQuesttion({
                    ...selectedQuesttion,
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

              <TextField
                label="Đường dẫn audio"
                fullWidth
                margin="normal"
                value={selectedQuesttion.audio_url}
                onChange={(e) =>
                  setselectedQuesttion({
                    ...selectedQuesttion,
                    audio_url: e.target.value,
                  })
                }
              />
              <TextField
                label="Đáp án đúng"
                fullWidth
                margin="normal"
                value={selectedQuesttion.correct_answer || ""}
                onChange={(e) =>
                  setselectedQuesttion({
                    ...selectedQuesttion,
                    correct_answer: e.target.value,
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
            Lưu lại
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog thêm */}
      <Dialog open={openAdd} onClose={handleAddClose}>
        <DialogTitle>Thêm câu hỏi</DialogTitle>
        <DialogContent>
          <TextField
            label="Nội dung"
            fullWidth
            margin="normal"
            onChange={(e) =>
              setselectedQuesttion({
                ...selectedQuesttion,
                content: e.target.value,
              })
            }
          />
          <InputLabel className="label">Loại câu hỏi</InputLabel>
          <Select
            label="Loại câu hỏi"
            fullWidth
            margin="normal"
            value={selectedQuesttion?.question_type || ""}
            onChange={(e) =>
              setselectedQuesttion({
                ...selectedQuesttion,
                question_type: e.target.value,
              })
            }
          >
            <MenuItem value="Multiple Choice">Multiple Choice</MenuItem>
            <MenuItem value="True/False">True/False</MenuItem>
            <MenuItem value="Short Answer">Short Answer</MenuItem>
            <MenuItem value="Essay">Essay</MenuItem>
            <MenuItem value="Listening">Listening</MenuItem>
          </Select>

          <InputLabel className="label">Kỹ năng</InputLabel>
          <Select
            label="Kỹ năng"
            fullWidth
            margin="normal"
            value={selectedQuesttion?.skill || ""}
            onChange={(e) =>
              setselectedQuesttion({
                ...selectedQuesttion,
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
            value={selectedQuesttion?.topic_id || ""}
            onChange={(e) =>
              setselectedQuesttion({
                ...selectedQuesttion,
                topic_id: e.target.value,
              })
            }
          >
            {topics?.length > 0 &&
              topics.map((topic) => (
                <MenuItem key={topic.topic_id} value={topic.topic_id}>
                  {topic.name}
                </MenuItem>
              ))}
          </Select>

          <InputLabel className="label">Độ khó </InputLabel>
          <Select
            label="Độ khó"
            fullWidth
            margin="normal"
            value={selectedQuesttion?.difficulty_level || ""}
            onChange={(e) =>
              setselectedQuesttion({
                ...selectedQuesttion,
                difficulty_level: e.target.value,
              })
            }
          >
            <MenuItem value="Easy">Easy</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Hard">Hard</MenuItem>
          </Select>

          <TextField
            label="Đường dẫn audio"
            fullWidth
            margin="normal"
            onChange={(e) =>
              setselectedQuesttion({
                ...selectedQuesttion,
                audio_url: e.target.value,
              })
            }
          />

          <TextField
            label="Đáp án đúng"
            fullWidth
            margin="normal"
            onChange={(e) =>
              setselectedQuesttion({
                ...selectedQuesttion,
                correct_answer: e.target.value,
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
            onClick={() => handleAddSubmit(selectedQuesttion)}
            style={{ backgroundColor: "#228b22", color: "#ffffff" }}
          >
            Thêm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Nút thêm câu hỏi */}
      <Box sx={{ position: "fixed", bottom: 30, right: 50 }}>
        <Fab color="primary" aria-label="add" onClick={handleAddClick}>
          <AddIcon />
        </Fab>
      </Box>
    </div>
  );
};

export default Question;
