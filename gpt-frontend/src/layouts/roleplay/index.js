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
import Icon from "@mui/material/Icon";
import Button from "@mui/material/Button";
import {
  Alert,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { ChatList, MessageList } from "react-chat-elements";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import GPTIcon from "assets/images/chatgpt-icon.png";
import Box from "@mui/material/Box";
import MDInput from "../../components/MDInput";
import PropTypes from "prop-types";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import { AzureKeyCredential, OpenAIClient } from "@azure/openai";

function Roleplay() {
  const endpoint = "https://gptplatform.openai.azure.com/";
  const roleSet = useRef();
  const myref = useRef(null);
  //snackbar状态
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("error");
  const [warnMsg, setWarnMsg] = useState("");

  const [msg, setMsg] = useState("");
  const [roleList, setRoleList] = useState([]);
  const [msgList, setMsgList] = useState([]);
  const [currMsg, setCurrMsg] = useState([]);
  const [currId, setCurrId] = useState(-1);
  const [delId, setDelId] = useState(-1);
  const [roleName, setRoleName] = useState([]);
  const [roleInfo, setRoleInfo] = useState([]);
  const [currName, setCurrName] = useState("Unknown");
  const [currInfo, setCurrInfo] = useState("No information here...");
  const [subtitle, setSubtitle] = useState([]);

  //GPT聊天参数
  const temperature = Number(sessionStorage.getItem("temperature"));
  const presence = Number(sessionStorage.getItem("presence"));
  const frequency = Number(sessionStorage.getItem("frequency"));

  useEffect(() => {
    scrolltoBottom();
  }, [currMsg]);

  useEffect(() => {
    const getChats = () => {
      let result = axios.get("/get-role-chat", {
        params: { email: sessionStorage.getItem("email") },
      });
      result.then((res) => {
        // console.log(res);
        if (res.data !== "noFile") {
          if (res.data.name.length !== 0) {
            setRoleName(res.data.name);
          }
          if (res.data.info.length !== 0) {
            setRoleInfo(res.data.info);
          }
          if (res.data.roles.length !== 0) {
            setRoleList(res.data.roles);
          }
          if (res.data.msgs.length !== 0) {
            setMsgList(res.data.msgs);
          }
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
        name: roleName,
        info: roleInfo,
        roles: roleList,
        msgs: msgList,
      };
      axios.post("/save-role-chat", jsonData).then((res) => {
        // console.log(res.data);
      });
    }
  }, [currMsg]);

  //role上限：5
  const addRole = () => {
    if (roleList.length < 5) {
      subtitle.push("");
      setSubtitle([...subtitle]);
      roleSet.current.handleOption("add");
      roleSet.current.handleOpen();
    } else {
      setWarnMsg("最多只能创建5个角色对话！");
      setOpen(true);
      setSeverity("error");
      return;
    }
  };
  const editRole = () => {
    console.log(currId);
    if (currId === -1) {
      setWarnMsg("请创建一个对话或选择一个对话...");
      setOpen(true);
      setSeverity("error");
    } else {
      console.log(roleInfo);
      roleSet.current.handleOption("edit");
      roleSet.current.handleOpen();
    }
  };

  const handleRoleClick = (e) => {
    msgList.map((msg) => {
      if (msg.id === currId) {
        msg.msgs = currMsg;
      }
    });
    setDelId(e.id);
    setCurrId(e.id);
    roleName.map((role) => {
      if (e.id === role.id) {
        setCurrName(role.name);
      }
    });
    roleInfo.map((role) => {
      if (e.id === role.id) {
        setCurrInfo(role.info);
      }
    });
    msgList.map((msg) => {
      if (e.id === msg.id) {
        setCurrMsg(msg.msgs);
      }
    });
  };

  const handleChange = (e) => {
    setMsg(e.target.value);
  };

  const sendMsg = async () => {
    if (sessionStorage.getItem("apikey") === "") {
      setWarnMsg("API Key为空，请前往用户界面输入...");
      setOpen(true);
      setSeverity("error");
      return;
    }
    if (roleList.length === 0 || currId === -1) {
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
      text: msg,
    });
    setCurrMsg([...currMsg]);
    setMsg("");
    subtitle[currId] = msg;
    setSubtitle([...subtitle]);
    roleList[currId].subtitle = subtitle[currId];
    let messages = [];
    messages.push({
      role: "system",
      content: currInfo,
    });
    currMsg.map((msg) => {
      if (msg["position"] === "right") {
        messages.push({
          role: "user",
          content: msg.text,
        });
      } else if (msg["position"] === "left") {
        messages.push({
          role: "assistant",
          content: msg.text,
        });
      }
    });
    const azureApiKey = sessionStorage.getItem("apikey");
    const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
    const deploymentId = "gpt_api";
    const result = client.getChatCompletions(deploymentId, messages, {
      temperature: temperature,
      presencePenalty: presence,
      frequencyPenalty: frequency,
    });
    result.then((res) => {
      currMsg.push({
        position: "left",
        type: "text",
        title: "ChatGPT",
        text: res.choices[0].message.content,
      });
      setCurrMsg([...currMsg]);
      subtitle[currId] = res.choices[0].message.content;
      setSubtitle([...subtitle]);
      roleList[currId].subtitle = subtitle[currId];
      setRoleList([...roleList]);
    });
  };

  const roleDelete = () => {
    if (currId === -1) {
      setWarnMsg("请选择一个角色对话进行删除...");
      setOpen(true);
      setSeverity("error");
      return;
    }
    msgList.map((msg) => {
      if (msg.id === currId) {
        msg.msgs = currMsg;
      }
    });
    let tempMsg = [];
    let tempRole = [];
    let tempName = [];
    let tempInfo = [];
    msgList.map((msg) => {
      if (msg.id < delId) {
        tempMsg.push(msg);
      } else if (msg.id > delId) {
        msg.id -= 1;
        tempMsg.push(msg);
      }
    });
    roleList.map((role) => {
      if (role.id < delId) {
        tempRole.push(role);
      } else if (role.id > delId) {
        role.id -= 1;
        tempRole.push(role);
      }
    });
    roleName.map((role) => {
      if (role.id < delId) {
        tempName.push(role);
      } else if (role.id > delId) {
        role.id -= 1;
        tempName.push(role);
      }
    });
    roleInfo.map((role) => {
      if (role.id < delId) {
        tempInfo.push(role);
      } else if (role.id > delId) {
        role.id -= 1;
        tempInfo.push(role);
      }
    });
    let tempSub = subtitle.filter((item, index) => {
      return index !== delId;
    });
    setRoleList([...tempRole]);
    setMsgList([...tempMsg]);
    setRoleName([...tempName]);
    setRoleInfo([...tempInfo]);
    setSubtitle([...tempSub]);
    setCurrId(-1);
    setCurrMsg([]);
    setCurrName("Unknown");
    setCurrInfo("No information here...");
    setWarnMsg("删除角色对话成功!");
    setOpen(true);
    setSeverity("success");
  };

  const handleKeydown = (e) => {
    if (e.keyCode === 13) {
      sendMsg();
    }
  };

  const scrolltoBottom = () => {
    myref.current.scrollTop = myref.current.scrollHeight;
  };

  const handlesbClose = () => {
    setOpen(false);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox height={780} py={3}>
        <Grid container height={750}>
          <Grid item height={720} xs={3} md={3} lg={3}>
            <Grid container height={50}>
              <Button
                variant="contained"
                onClick={addRole}
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
                <Icon fontSize="large">add</Icon>&nbsp;&nbsp;NEW ROLE
              </Button>
              <RoleSet
                rid={currId}
                cname={currName}
                cinfo={currInfo}
                rname={roleName}
                rinfo={roleInfo}
                rlist={roleList}
                mlist={msgList}
                setMsg={setMsgList}
                setList={setRoleList}
                setName={setRoleName}
                setInfo={setRoleInfo}
                setCname={setCurrName}
                setCinfo={setCurrInfo}
                ref={roleSet}
              ></RoleSet>
            </Grid>
            <Grid container mt={1} mb={-1} height={370}>
              <Grid xs={12} lg={12} md={12}>
                <ChatList
                  onClick={handleRoleClick}
                  id="rolechat"
                  className="chat-list"
                  dataSource={roleList}
                  fullwidth
                />
              </Grid>
            </Grid>
            <Grid container height={300} alignItems="center" justifyContent="center">
              <Grid item mt={0} xs={12} md={12} lg={12}>
                <Card
                  style={{
                    height: 290,
                    width: "99%",
                    borderColor: "red",
                    borderTop: 2,
                    backgroundColor: "#ffffff",
                  }}
                >
                  <CardHeader
                    avatar={<Avatar src={GPTIcon} />}
                    title={currName}
                    subheader={currId === -1 ? "GPT Session -- ?" : "GPT Session -- " + currId}
                  />
                  <CardContent>
                    <Box height={130} component="div" overflow="scroll">
                      <Typography align="justify" color="textSecondary" gutterBottom>
                        {currInfo}
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={editRole}>
                      EDIT
                    </Button>
                    <Button onClick={roleDelete} size="small">
                      DELETE
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </Grid>
          <Grid item height={720} xs={9} md={9} lg={9}>
            <Grid container height={670} overflow="scroll" ref={myref}>
              <Grid item xs={12} md={12} lg={12}>
                <MessageList className="message-list" lockable={true} dataSource={currMsg} />
              </Grid>
            </Grid>
            <Grid container alignItems="center" justifyContent="center" height={50}>
              <Grid item xs={10} md={10} lg={10}>
                <MDInput
                  style={{ height: "100%", width: "100%" }}
                  value={msg}
                  onChange={handleChange}
                  onKeyDown={handleKeydown}
                  label="Send a message..."
                />
              </Grid>
              <Grid item xs={2} md={2} lg={2}>
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

export default Roleplay;

//角色设置组件
const RoleSet = forwardRef(
  (
    {
      rid,
      cname,
      cinfo,
      rname,
      rinfo,
      rlist,
      mlist,
      setMsg,
      setList,
      setName,
      setInfo,
      setCname,
      setCinfo,
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [option, setOption] = useState("add");
    const [localName, setLocalName] = useState("");
    const [localInfo, setLocalInfo] = useState("");

    useImperativeHandle(ref, () => {
      return {
        handleOpen: handleOpen,
        handleOption: handleOption,
      };
    });
    const handleOption = (target) => {
      setOption(target);
    };
    const handleOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };

    const inputChange = (e, target) => {
      if (target === "name") setLocalName(e.target.value);
      if (target === "info") setLocalInfo(e.target.value);
    };

    const handleConfirm = () => {
      if (option === "add") {
        rname.push({ id: rname.length, name: localName === "" ? "Unknown" : localName });
        setName([...rname]);
        rinfo.push({
          id: rinfo.length,
          info: localInfo === "" ? "No information here..." : localInfo,
        });
        setInfo([...rinfo]);
        rlist.push({
          id: rlist.length,
          avatar: require("assets/images/chatgpt-icon.png"),
          title: `${localName}`,
          subtitle: "This is a new roleplay session,just have a chat now!",
        });
        setList([...rlist]);
        mlist.push({
          id: mlist.length,
          msgs: [],
        });
        setMsg([...mlist]);
        setLocalName("");
        setLocalInfo("");
        handleClose();
      }
      if (option === "edit") {
        rname.map((role) => {
          if (role.id === rid) {
            role.name = localName;
          }
        });
        rlist.map((role) => {
          if (role.id === rid) {
            role.title = localName;
          }
        });
        setName([...rname]);
        setCname(localName);
        rinfo.map((role) => {
          if (role.id === rid) {
            role.info = localInfo;
          }
        });
        setInfo([...rinfo]);
        setCinfo(localInfo);
        setLocalName("");
        setLocalInfo("");
        handleClose();
      }
    };
    const handleCancel = () => {
      setLocalName("");
      setLocalInfo("");
      handleClose();
    };

    return (
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide a detailed description of the role you would like ChatGPT to play.
          </DialogContentText>
          <TextField
            margin="dense"
            id="name"
            label="Role Name"
            value={localName}
            onChange={(e) => inputChange(e, "name")}
            fullWidth
          />
          <TextField
            multiline
            rows={8}
            margin="dense"
            id="info"
            label="Role Information"
            value={localInfo}
            onChange={(e) => inputChange(e, "info")}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirm} color="primary">
            OK
          </Button>
          <Button onClick={handleCancel} color="primary">
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);
RoleSet.propTypes = {
  rid: PropTypes.number,
  cname: PropTypes.string,
  cinfo: PropTypes.string,
  rname: PropTypes.array,
  rinfo: PropTypes.array,
  rlist: PropTypes.array,
  mlist: PropTypes.array,
  setMsg: PropTypes.func,
  setList: PropTypes.func,
  setName: PropTypes.func,
  setInfo: PropTypes.func,
  setCinfo: PropTypes.func,
  setCname: PropTypes.func,
};
