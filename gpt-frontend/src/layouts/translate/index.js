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
import { Alert, Select, SvgIcon } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import TranslateIcon from "@material-ui/icons/Translate";
import CachedIcon from "@material-ui/icons/Cached";
import SyncAltIcon from "@material-ui/icons/SyncAlt";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import TextField from "@mui/material/TextField";
import { makeStyles } from "@material-ui/styles";
import Tooltip from "@mui/material/Tooltip";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";

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

function AITranslate() {
  const iconClasses = iconStyles();
  const language = ["中文（简体）", "英语", "日语", "法语", "俄语"];
  const [origin, setOrigin] = useState("中文（简体）");
  const [translation, setTranslation] = useState("英语");
  const [oriContent, setOriContent] = useState("");
  const [transContent, setTransContent] = useState("");
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("error");
  const [warnMsg, setWarnMsg] = useState("");
  const mapping = {
    "中文（简体）": "Chinese",
    英语: "English",
    日语: "Japanese",
    法语: "French",
    俄语: "Russian",
  };

  const temperature = Number(sessionStorage.getItem("temperature"));
  const presence = Number(sessionStorage.getItem("presence"));
  const frequency = Number(sessionStorage.getItem("frequency"));

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
    let res = await axios.post("/translate/", {
      apikey: sessionStorage.getItem("apikey"),
      from: mapping[origin],
      to: mapping[translation],
      temperature: temperature,
      presence: presence,
      frequency: frequency,
      content: oriContent,
    });
    if (res.data.state === true) {
      setTransContent(res.data.translation);
    }
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
              <Grid container height={200} alignItems="center" justifyContent="center">
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
              <Grid container height={200} alignItems="center" justifyContent="center">
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
              <Grid container height={200} alignItems="center" justifyContent="center">
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
    </DashboardLayout>
  );
}

export default AITranslate;
