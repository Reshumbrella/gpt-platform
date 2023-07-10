/**
 =========================================================
 * Material Dashboard 2 React - v2.2.0
 =========================================================

 * Product Page: https://www.creative-tim.com/product/material-dashboard-react
 * Copyright 2023 Creative Tim (https://www.creative-tim.com)

 Coded by www.creative-tim.com

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Data
// Dashboard components
import "react-chat-elements/dist/main.css";
import { ChatList, MessageList } from "react-chat-elements";
import Icon from "@mui/material/Icon";
import Button from "@mui/material/Button";
import { useEffect, useRef, useState } from "react";
import MDInput from "../../components/MDInput";
import axios from "axios";
import { Alert } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";

const initialState = {
  mouseX: null,
  mouseY: null,
};

function SimpleChat() {
  //snackbar状态
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("error");
  const [warnMsg, setWarnMsg] = useState("");

  //删除菜单位置状态
  const [state, setState] = useState(initialState);

  //聊天内容
  const [chats, setChats] = useState([]);
  const [currId, setCurrId] = useState(-1);
  const [delId, setDelId] = useState(-1);
  const [msgList, setMsgList] = useState([]);
  const [currMsg, setCurrMsg] = useState([]);
  const [text, setText] = useState("");
  const [subtitle, setSubtitle] = useState([]);

  //聊天滚动条
  const myref = useRef(null);
  //GPT聊天参数
  const temperature = Number(sessionStorage.getItem("temperature"));
  const presence = Number(sessionStorage.getItem("presence"));
  const frequency = Number(sessionStorage.getItem("frequency"));

  useEffect(() => {
    scrolltoBottom();
  }, [currMsg]);

  useEffect(() => {
    const getChats = () => {
      let result = axios.get("/simplechat/", {
        params: { email: sessionStorage.getItem("email") },
      });
      result.then((res) => {
        //console.log(res);
        if (res.data.simplechat.length !== "") {
          setMsgList(res.data.simplechat);
        }
        if (res.data.sessions.length !== "") {
          setChats(res.data.sessions);
        }
      });
    };
    getChats();
  }, []);

  useEffect(() => {
    if (currId !== -1) {
      msgList.map((msg) => {
        if (msg.id === currId) {
          msg.msgs = currMsg;
        }
      });
      setMsgList([...msgList]);
      let jsonData = {
        username: sessionStorage.getItem("username"),
        email: sessionStorage.getItem("email"),
        sessions: chats,
        chats: msgList,
      };
      axios.post("/savesimplechat/", jsonData).then((res) => {
        //console.log(res.data);
      });
    }
  }, [currMsg]);

  const scrolltoBottom = () => {
    myref.current.scrollTop = myref.current.scrollHeight;
  };
  const handlesbClose = () => {
    setOpen(false);
  };
  const handleChange = (e) => {
    setText(e.target.value);
  };
  const handleKeydown = (e) => {
    if (e.keyCode === 13) {
      sendMsg();
    }
  };
  const addNewChat = () => {
    if (chats.length < 9) {
      subtitle.push("");
      setSubtitle([...subtitle]);
      chats.push({
        id: chats.length,
        avatar: require("assets/images/chatgpt-icon.png"),
        alt: "ChatGPT",
        title: `GPT-Session`,
        subtitle: "This is a new session",
      });
      msgList.push({
        id: msgList.length,
        msgs: [],
      });
      setMsgList([...msgList]);
      setChats([...chats]);
      if (currId === -1) {
        setCurrId(0);
      }
      //console.log(subtitle);
      // console.log(msglist);
    }
  };
  const handleChatClick = (e) => {
    msgList.map((msg) => {
      if (msg.id === currId) {
        msg.msgs = currMsg;
      }
    });
    setCurrId(e.id);
    msgList.map((msg) => {
      if (e.id === msg.id) {
        setCurrMsg([...msg.msgs]);
      }
    });
  };

  const handleContextmenu = (e) => {
    e.preventDefault;
    setDelId(e.id);
    setState({
      mouseX: 400,
      mouseY: 210 + e.id * 70,
    });
  };
  const chatDelete = () => {
    msgList.map((msg) => {
      if (msg.id === currId) {
        msg.msgs = currMsg;
      }
    });
    let tempMsg = [];
    let tempChats = [];
    msgList.map((msg) => {
      if (msg.id < delId) {
        tempMsg.push(msg);
      } else if (msg.id > delId) {
        msg.id -= 1;
        tempMsg.push(msg);
      }
    });
    chats.map((chat) => {
      if (chat.id < delId) {
        tempChats.push(chat);
      } else if (chat.id > delId) {
        chat.id -= 1;
        tempChats.push(chat);
      }
    });
    let tempSub = subtitle.filter((item, index) => {
      return index !== delId;
    });
    setChats([...tempChats]);
    setMsgList([...tempMsg]);
    setSubtitle([...tempSub]);
    setCurrId(-1);
    setCurrMsg([]);
    setState(initialState);
  };

  const sendMsg = async () => {
    if (sessionStorage.getItem("apikey") === "") {
      setWarnMsg("API Key为空，请前往用户界面输入...");
      setOpen(true);
      setSeverity("error");
      return;
    }
    if (chats.length === 0 || currId === -1) {
      setWarnMsg("请创建一个对话或选择一个对话...");
      setOpen(true);
      setSeverity("error");
      return;
    }
    currMsg.push({
      position: "right",
      type: "text",
      title:
        sessionStorage.getItem("username") === null ? "Guest" : sessionStorage.getItem("username"),
      text: text,
    });
    setCurrMsg([...currMsg]);
    subtitle[currId] = text;
    setSubtitle([...subtitle]);
    chats[currId].subtitle = subtitle[currId];
    setChats([...chats]);
    setText("");
    let res = await axios.post("/havesimplechat/", {
      apikey: sessionStorage.getItem("apikey"),
      userMsg: text,
      temperature: temperature,
      presence: presence,
      frequency: frequency,
    });
    currMsg.push({
      position: "left",
      type: "text",
      title: "ChatGPT",
      text: res.data.msg,
    });
    setCurrMsg([...currMsg]);
    subtitle[currId] = res.data.msg;
    setSubtitle([...subtitle]);
    chats[currId].subtitle = subtitle[currId];
    setChats([...chats]);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox height={780} py={3}>
        <Grid container height={750}>
          <Grid item height={720} xs={3} lg={3} md={3}>
            <Grid container height={50}>
              <Button
                variant="contained"
                onClick={addNewChat}
                style={{
                  height: 50,
                  width: "100%",
                  postition: "absoulte",
                  color: "#ffffff",
                  backgroundColor: "#3b95ef",
                  bottom: 0,
                  fontSize: 18,
                }}
              >
                <Icon fontSize="large">add</Icon>&nbsp;&nbsp;NEW CHAT
              </Button>
            </Grid>
            <Grid container mt={1} overflow="scroll">
              <ChatList
                className="chat-list"
                onContextMenu={(e) => handleContextmenu(e)}
                onClick={(e) => handleChatClick(e)}
                dataSource={chats}
              />
              <Menu
                keepMounted
                open={state.mouseY !== null}
                onClose={() => setState(initialState)}
                anchorReference="anchorPosition"
                anchorPosition={
                  state.mouseY !== null && state.mouseX !== null
                    ? { top: state.mouseY, left: state.mouseX }
                    : undefined
                }
              >
                <MenuItem onClick={(e) => chatDelete(e)}>Delete</MenuItem>
              </Menu>
            </Grid>
          </Grid>

          <Grid item height={720} xs={9} lg={9} md={9}>
            <Grid container height={670} overflow="scroll" ref={myref}>
              <Grid item xs={12} lg={12} md={12}>
                <MessageList className="message-list" lockable={true} dataSource={currMsg} />
              </Grid>
            </Grid>
            <Grid container height={50}>
              <Grid item mt={1} xs={10} md={10} lg={10}>
                <MDInput
                  onChange={(e) => handleChange(e)}
                  onKeyDown={(e) => handleKeydown(e)}
                  style={{ height: "100%", width: "100%" }}
                  label="Send a message..."
                  value={text}
                />
              </Grid>
              <Grid item mt={1} xs={2} md={2} lg={2}>
                <Button
                  variant="contained"
                  onClick={sendMsg}
                  style={{
                    height: "95%",
                    width: "95%",
                    marginLeft: 10,
                    postition: "absoulte",
                    color: "#ffffff",
                    backgroundColor: "#3b95ef",
                    fontSize: 18,
                  }}
                >
                  <Icon fontSize="large">send</Icon>&nbsp;&nbsp;SEND&nbsp;IT!
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={open}
        autoHideDuration={2500}
        onClose={handlesbClose}
      >
        <Alert
          style={{ width: 400, color: "white", fontSize: 16 }}
          variant="filled"
          onClose={handlesbClose}
          severity={severity}
        >
          {warnMsg}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}

export default SimpleChat;
