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
import { useState } from "react";
import { Alert, Select } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import TranslateIcon from "@material-ui/icons/Translate";
import HistoryIcon from "@material-ui/icons/History";
import CachedIcon from "@material-ui/icons/Cached";
import SyncAltIcon from "@material-ui/icons/SyncAlt";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import TextField from "@mui/material/TextField";
import { makeStyles } from "@material-ui/styles";
import Tooltip from "@mui/material/Tooltip";
import Snackbar from "@mui/material/Snackbar";
import { AzureKeyCredential, OpenAIClient } from "@azure/openai";
import Menu from "@mui/material/Menu";

const iconStyles = makeStyles({
  root: {
    color: "#ffffff",
    backgroundColor: "#ffffff",
    boxShadow: "1px 1px 2px 1px #88B4FF",
    "&:hover": {
      boxShadow: "3px 3px 6px 3px #88B4FF",
    },
  },
});
const menuStyles = makeStyles({
  paper: {
    color: "black",
    width: 200,
    backgroundColor: "#ffffff",
    boxShadow: "1px 1px 2px 1px #76A9FF",
    "&:hover": {
      boxShadow: "2px 2px 4px 2px #76A9FF",
    },
  },
});
const itemStyles = makeStyles({
  root: {
    height: "40px",
    justifyContent: "center",
    "&:hover": {
      background: "linear-gradient(-225deg, #5D9FFF 0%, #B8DCFF 48%, #6BBBFF 100%)",
      boxShadow: "1px 6px 6px 1px #8EBEFF",
    },
  },
  selected: {
    background: "linear-gradient(-225deg, #5D9FFF 0%, #B8DCFF 48%, #6BBBFF 100%)",
    boxShadow: "0px 0px 0px 0px #8EBEFF",
  },
});
const delItemStyles = makeStyles({
  root: {
    height: "40px",
    justifyContent: "center",
    "&:hover": {
      color: "white",
      background: "#FF0A22",
    },
  },
});
const initialState = {
  mouseX: null,
  mouseY: null,
};
function AITranslate() {
  const endpoint = "https://gptplatform.openai.azure.com/";
  const iconClasses = iconStyles();
  const menuClasses = menuStyles();
  const itemClasses = itemStyles();
  const delItemClasses = delItemStyles();
  const language = ["中文（简体）", "英语", "日语", "法语", "俄语"];
  const [origin, setOrigin] = useState("中文（简体）");
  const [translation, setTranslation] = useState("英语");
  const [oriContent, setOriContent] = useState("");
  const [transContent, setTransContent] = useState("");
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("error");
  const [warnMsg, setWarnMsg] = useState("");
  //历史菜单相关
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [state, setState] = useState(initialState);
  const mapping = {
    "中文（简体）": "Chinese",
    英语: "English",
    日语: "Japanese",
    法语: "French",
    俄语: "Russian",
  };
  //交互参数
  const temperature = Number(sessionStorage.getItem("temperature"));
  const presence = Number(sessionStorage.getItem("presence"));
  const frequency = Number(sessionStorage.getItem("frequency"));
  const history = [
    "History-0",
    "History-1",
    "History-2",
    "History-3",
    "History-4",
    "History-5",
    "History-6",
    "History-7",
  ];

  const handlesbClose = () => {
    setOpen(false);
  };
  const handleOriChange = (e) => {
    setOrigin(e.target.value);
  };
  const handleTranChange = (e) => {
    setTranslation(e.target.value);
  };

  const handleChange = (e, target) => {
    if (target === "ori") setOriContent(e.target.value);
    if (target === "trans") setTransContent(e.target.value);
  };

  const handleTranslate = async () => {
    if (sessionStorage.getItem("apikey") === "") {
      setWarnMsg("API Key为空，请前往用户界面输入...");
      setOpen(true);
      setSeverity("error");
      return;
    }
    if (oriContent === "") {
      setWarnMsg("请输入待翻译内容...");
      setOpen(true);
      setSeverity("error");
      return;
    }
    let messages = [];
    messages.push({
      role: "system",
      content: "You are a translation expert, highly skilled in language translation work.",
    });
    messages.push({
      role: "user",
      content: `Translate the following ${mapping[origin]} text to ${mapping[translation]}:${oriContent}`,
    });
    console.log(messages);
    const azureApiKey = sessionStorage.getItem("apikey");
    const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
    const deploymentId = "gpt_api";
    const result = client.getChatCompletions(deploymentId, messages, {
      temperature: temperature,
      presencePenalty: presence,
      frequencyPenalty: frequency,
    });
    result.then((res) => {
      setTransContent(res.choices[0].message.content);
    });
  };
  const handleExchange = (e) => {
    let tempOption = origin;
    setOrigin(translation);
    setTranslation(tempOption);
    let tempContent = oriContent;
    setOriContent(transContent);
    setTransContent(tempContent);
  };

  const handleReset = () => {
    setOriContent("");
    setTransContent("");
  };
  const handleHistory = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleItem = (item, index) => {
    setSelectedIndex(index);
    setAnchorEl(null);
  };
  const handleContext = (e, item) => {
    e.preventDefault();
    setState({
      mouseX: e.clientX - 2,
      mouseY: e.clientY - 4,
    });
  };
  const handleDelClose = () => {
    setState(initialState);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox height={780} py={3}>
        <Grid container alignItems="center" justifyContent="center" height={750}>
          <Grid item xs={12} md={5.5} lg={5.5}>
            <Grid item height={100} xs={12} md={12} lg={12}>
              <Grid container height={20} alignItems="center" justifyContent="center">
                <Typography color="#3b95ef" mt={-2} fontSize={24}>
                  Original Language
                </Typography>
              </Grid>
              <Grid container height={80} alignItems="center" justifyContent="center">
                <Select
                  value={origin}
                  onChange={handleOriChange}
                  style={{
                    width: "60%",
                    height: "60%",
                  }}
                >
                  {language.map((lang, index) => {
                    return (
                      <MenuItem key={index} value={lang}>
                        {lang}
                      </MenuItem>
                    );
                  })}
                </Select>
              </Grid>
            </Grid>
            <Grid
              container
              height={650}
              alignItems="center"
              justifyContent="center"
              style={{ backgroundColor: "#fff" }}
            >
              <TextField
                id="origin"
                label={mapping[origin]}
                multiline
                rows={30}
                value={oriContent}
                onChange={(e) => handleChange(e, "ori")}
                placeholder="Please enter the text you want to translate..."
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                style={{ width: "90%" }}
              />
            </Grid>
          </Grid>
          <Grid item height={750} xs={12} md={1} lg={1}>
            <Grid container height={100} alignItems="center" justifyContent="center">
              <ArrowForwardIosIcon style={{ color: "#3b95ef", fontSize: 40 }} />
              <ArrowForwardIosIcon
                style={{ color: "#3b95ef", fontSize: 40, marginLeft: -20, marginRight: -20 }}
              />
              <ArrowForwardIosIcon style={{ color: "#3b95ef", fontSize: 40 }} />
            </Grid>
            <Grid container height={650} alignItems="center" justifyContent="center">
              <Grid container height={150} alignItems="center" justifyContent="center">
                <Tooltip title="Translate text">
                  <IconButton
                    onClick={handleTranslate}
                    classes={{
                      root: iconClasses.root,
                    }}
                    color="info"
                    aria-label="translate text"
                  >
                    <TranslateIcon style={{ color: "#3b95ef", fontSize: 45 }} />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid container height={150} alignItems="center" justifyContent="center">
                <Tooltip title="Exchange text field">
                  <IconButton
                    onClick={handleExchange}
                    classes={{
                      root: iconClasses.root,
                    }}
                    color="info"
                    aria-label="exchange text field"
                  >
                    <SyncAltIcon style={{ color: "#3b95ef", fontSize: 45 }} />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid container height={150} alignItems="center" justifyContent="center">
                <Tooltip title="Reset text field">
                  <IconButton
                    onClick={handleReset}
                    classes={{
                      root: iconClasses.root,
                    }}
                    color="info"
                    aria-label="reset text field"
                  >
                    <CachedIcon style={{ color: "#3b95ef", fontSize: 45 }} />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid container height={150} alignItems="center" justifyContent="center">
                <Tooltip title="Translation history">
                  <IconButton
                    onClick={handleHistory}
                    classes={{
                      root: iconClasses.root,
                    }}
                    color="info"
                    aria-label="display translation history"
                  >
                    <HistoryIcon style={{ color: "#3b95ef", fontSize: 45 }} />
                  </IconButton>
                </Tooltip>
                <Menu
                  id="history-menu"
                  varient="menu"
                  anchorEl={anchorEl}
                  keepMounted
                  classes={{
                    paper: menuClasses.paper,
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                >
                  {history.map((item, index) => {
                    return (
                      <MenuItem
                        key={index}
                        classes={{
                          root: itemClasses.root,
                          selected: itemClasses.selected,
                        }}
                        selected={index === selectedIndex}
                        onClick={() => handleItem(item, index)}
                        onContextMenu={(e) => handleContext(e, item)}
                      >
                        {item}
                      </MenuItem>
                    );
                  })}
                </Menu>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={5.5} lg={5.5}>
            <Grid item height={100} xs={12} md={12} lg={12}>
              <Grid container height={20} alignItems="center" justifyContent="center">
                <Typography color="#3b95ef" mt={-2} fontSize={24}>
                  Translation Language
                </Typography>
              </Grid>
              <Grid container height={80} alignItems="center" justifyContent="center">
                <Select
                  value={translation}
                  onChange={handleTranChange}
                  style={{
                    width: "60%",
                    height: "60%",
                  }}
                >
                  {language.map((lang, index) => {
                    return (
                      <MenuItem key={index} value={lang}>
                        {lang}
                      </MenuItem>
                    );
                  })}
                </Select>
              </Grid>
            </Grid>
            <Grid
              container
              height={650}
              alignItems="center"
              justifyContent="center"
              style={{ backgroundColor: "#fff" }}
            >
              <TextField
                id="translation"
                label={mapping[translation]}
                multiline
                rows={30}
                value={transContent}
                onChange={(e) => handleChange(e, "trans")}
                placeholder="Translated text will be displayed here..."
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                style={{ width: "90%" }}
              />
            </Grid>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={open}
        autoHideDuration={1500}
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
      <Menu
        keepMounted
        open={state.mouseY !== null}
        onClose={handleDelClose}
        anchorReference="anchorPosition"
        anchorPosition={
          state.mouseY !== null && state.mouseX !== null
            ? { top: state.mouseY, left: state.mouseX }
            : undefined
        }
      >
        <MenuItem classes={{ root: delItemClasses.root }} onClick={handleDelClose}>
          Delete
        </MenuItem>
      </Menu>
    </DashboardLayout>
  );
}

export default AITranslate;
