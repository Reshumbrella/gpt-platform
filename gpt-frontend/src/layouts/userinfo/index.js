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
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import { useEffect, useMemo, useRef, useState } from "react";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import { Alert, Slider, Zoom } from "@mui/material";
import { makeStyles } from "@material-ui/styles";
import MDInput from "../../components/MDInput";
import axios from "axios";
import ComplexStatisticsCard from "../../examples/Cards/StatisticsCards/ComplexStatisticsCard";
import VerticalBarChart from "../../examples/Charts/BarCharts/VerticalBarChart";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Snackbar from "@mui/material/Snackbar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

const useStyles = makeStyles({
  root: {
    color: "#2982eb",
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: "#ffffff",
    border: "2px solid currentColor",
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit",
    },
  },
  active: {},
  valueLabel: {
    opacity: 0.75,
    color: "#ffffff",
    backgroundColor: "#267ce1",
    borderRadius: 10,
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#e0e0e0",
  },
});

function UserInfo() {
  const classes = useStyles();
  const [name, setName] = useState(sessionStorage.getItem("username"));
  const [email, setEmail] = useState(sessionStorage.getItem("email"));
  const [apiKey, setApiKey] = useState(sessionStorage.getItem("apikey"));
  const [isEdit, setIsEdit] = useState(false);
  const [oldPWD, setOldPWD] = useState("");
  const [newPWD, setNewPWD] = useState("");
  const [chatCount, setChatCount] = useState(0);
  const [msgCount, setMsgCount] = useState(0);
  const [temperature, setTemperature] = useState(Number(sessionStorage.getItem("temperature")));
  const [presence, setPresence] = useState(Number(sessionStorage.getItem("presence")));
  const [frequency, setFrequency] = useState(Number(sessionStorage.getItem("frequency")));
  const [chartData, setChartData] = useState({ labels: [], data: [] });

  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("error");
  const [warnMsg, setWarnMsg] = useState("");

  const fetchData = async (url) => {
    let res = await axios.post(url, { email: email });
    // console.log(res.data);
    chartData.labels = res.data.labels;
    chartData.data = res.data.stats;
    // console.log(chartData);
    let temp = eval(chartData.data.join("+"));
    setChatCount(chartData.labels.length);
    setMsgCount(temp);
  };
  useEffect(() => {
    fetchData("/get-stat-data").then((r) => {});
  }, []);

  const barChart = useMemo(() => {
    return (
      <VerticalBarChart
        icon={{ color: "info", component: "leaderboard" }}
        height={360}
        title="Message Distribution"
        description="Message distribution per session"
        chart={{
          labels: chartData.labels,
          datasets: [
            {
              label: "Message Count",
              color: "info",
              data: chartData.data,
            },
          ],
        }}
      />
    );
  }, [msgCount]);
  const handlesbClose = () => {
    setOpen(false);
  };
  const handleEdit = () => {
    setName(sessionStorage.getItem("username"));
    setApiKey(sessionStorage.getItem("apikey"));
    setOldPWD("");
    setNewPWD("");
    setIsEdit(!isEdit);
  };
  const handleConfirm = () => {
    let postjson = { email: sessionStorage.getItem("email") };
    if (name !== sessionStorage.getItem("username")) {
      postjson.username = name;
    }
    if (apiKey !== sessionStorage.getItem("apikey")) {
      postjson.apikey = apiKey;
    }
    if (oldPWD !== "" && newPWD !== "") {
      postjson.oldpwd = oldPWD;
      postjson.newpwd = newPWD;
    }
    // console.log(postjson);
    axios.post("/update-info", postjson).then((res) => {
      // console.log(res.data);
      if (res.data.state === "success") {
        sessionStorage.setItem("username", name);
        sessionStorage.setItem("apikey", apiKey);
        setWarnMsg(res.data.message);
        setOpen(true);
        setSeverity(res.data.state);
      } else {
        setWarnMsg(res.data.message);
        setOpen(true);
        setSeverity(res.data.state);
      }
    });
    setOldPWD("");
    setNewPWD("");
    setIsEdit(!isEdit);
  };

  const handleParams = async () => {
    sessionStorage.setItem("temperature", String(temperature));
    sessionStorage.setItem("presence", String(presence));
    sessionStorage.setItem("frequency", String(frequency));
    let res = await axios.post("/update-info", {
      email: email,
      temperature: temperature,
      presence: presence,
      frequency: frequency,
    });
    // console.log(res.data);
    if (res.data.state === "success") {
      setWarnMsg("对话参数修改成功!");
      setOpen(true);
      setSeverity(res.data.state);
    }
  };

  const handleReset = async () => {
    setTemperature(0);
    setPresence(0);
    setFrequency(0);
    sessionStorage.setItem("temperature", "0");
    sessionStorage.setItem("presence", "0");
    sessionStorage.setItem("frequency", "0");
    let res = await axios.post("/update-info", {
      email: email,
      temperature: 0,
      presence: 0,
      frequency: 0,
    });
    // console.log(res.data);
    if (res.data.state === "success") {
      setWarnMsg("对话参数已重置!");
      setOpen(true);
      setSeverity(res.data.state);
    }
  };

  const handleChange = (e, target) => {
    if (target === "username") setName(e.target.value);
    if (target === "apikey") setApiKey(e.target.value);
    if (target === "oldpwd") setOldPWD(e.target.value);
    if (target === "newpwd") setNewPWD(e.target.value);
    if (target === "temperature") setTemperature(e.target.value);
    if (target === "presence") setPresence(e.target.value);
    if (target === "frequency") setFrequency(e.target.value);
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox height={780} py={3}>
        <Grid container height={750}>
          <Grid item height={720} xs={12} lg={3} md={3}>
            <Grid
              item
              height={720}
              lg={10}
              md={10}
              alignItems="center"
              borderRadius={8}
              mt={0}
              ml={4}
            >
              <Grid container height={40} alignItems="center"></Grid>
              <Grid container alignItems="center" justifyContent="center">
                <Avatar
                  style={{
                    color: "#ffffff",
                    backgroundColor: "dodgerblue",
                    height: 90,
                    width: 90,
                  }}
                  onClick={() => alert("hello!")}
                >
                  {name}
                </Avatar>
              </Grid>
              <Grid container alignItems="center" justifyContent="center">
                <TextField
                  id="username"
                  label="Username"
                  disabled={!isEdit}
                  value={name}
                  onChange={(e) => handleChange(e, "username")}
                  style={{ width: "80%", marginTop: 35 }}
                />
                <TextField
                  id="email"
                  label="Email"
                  disabled={true}
                  value={email}
                  style={{ width: "80%", marginTop: 35 }}
                />
                <TextField
                  id="api-key"
                  label="API Key"
                  disabled={!isEdit}
                  value={apiKey}
                  onChange={(e) => handleChange(e, "apikey")}
                  helperText="Enter the ChatGPT API key"
                  style={{ width: "80%", marginTop: 35 }}
                />
                <Zoom in={isEdit}>
                  <TextField
                    id="old-pwd"
                    type="password"
                    label="Old Password"
                    value={oldPWD}
                    onChange={(e) => handleChange(e, "oldpwd")}
                    style={{ width: "80%", marginTop: 35 }}
                  />
                </Zoom>
                <Zoom in={isEdit}>
                  <TextField
                    id="new-pwd"
                    type="password"
                    label="New Password"
                    value={newPWD}
                    onChange={(e) => handleChange(e, "newpwd")}
                    style={{ width: "80%", marginTop: 35 }}
                  />
                </Zoom>
              </Grid>
              {!isEdit ? (
                <Grid container mt={3} alignItems="center" justifyContent="center">
                  <Button
                    variant="contained"
                    color="primary"
                    style={{
                      color: "#ffffff",
                      backgroundColor: "#2780ea",
                      width: "60%",
                      height: 50,
                      fontSize: 18,
                    }}
                    onClick={handleEdit}
                  >
                    <Icon fontSize="large">edit</Icon>&nbsp;&nbsp;EDIT
                  </Button>
                </Grid>
              ) : (
                <Grid container mt={3} alignItems="center" justifyContent="center">
                  <Grid
                    item
                    xs={12}
                    lg={6}
                    md={6}
                    height={50}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      style={{
                        color: "#ffffff",
                        backgroundColor: "#2780ea",
                        width: "80%",
                        height: "100%",
                        fontSize: 18,
                      }}
                      onClick={handleConfirm}
                    >
                      <Icon fontSize="large">check</Icon>&nbsp;&nbsp;OK
                    </Button>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    lg={6}
                    md={6}
                    height={50}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      style={{
                        color: "#ffffff",
                        backgroundColor: "#2780ea",
                        width: "80%",
                        height: "100%",
                        fontSize: 18,
                      }}
                      onClick={handleEdit}
                    >
                      <Icon fontSize="large">clear</Icon>&nbsp;&nbsp;CANCEL
                    </Button>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
          <Grid item height={720} xs={12} lg={9} md={9}>
            <Grid container height={240} alignItems="center" justifyContent="center">
              <Grid item mx={3} xs={5} md={5} lg={5}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    icon="forum"
                    color="info"
                    title="Total Sessions"
                    count={chatCount}
                    percentage={{
                      color: "info",
                      amount: `${chatCount}`,
                      label: "sessions are established",
                    }}
                  />
                </MDBox>
              </Grid>
              <Grid item mx={3} xs={5} md={5} lg={5}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    icon="chat"
                    color="info"
                    title="Total Messages"
                    count={msgCount}
                    percentage={{
                      color: "success",
                      amount: `${msgCount}`,
                      label: "messages have you sent",
                    }}
                  />
                </MDBox>
              </Grid>
              {/*<Grid item xs={1} md={1} lg={1}>*/}
              {/*  <Tabs*/}
              {/*    orientation="vertical"*/}
              {/*    variant="scrollable"*/}
              {/*    value="test"*/}
              {/*    aria-label="Vertical tabs example"*/}
              {/*    style={{ height: 150, backgroundColor: "#ffffff" }}*/}
              {/*  >*/}
              {/*    <Tab label="Item One" />*/}
              {/*    <Tab label="Item Two" />*/}
              {/*  </Tabs>*/}
              {/*</Grid>*/}
            </Grid>
            <Grid container alignItems="center" justifyContent="center" height={480}>
              <Grid item xs={12} mr={2} lg={5.5} md={5.5}>
                <Typography gutterBottom>Temperature</Typography>
                <Tooltip
                  disableFocusListener
                  disableTouchListener
                  title="Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic."
                >
                  <Slider
                    classes={{
                      root: classes.root,
                      thumb: classes.thumb,
                      rail: classes.rail,
                      valueLabel: classes.valueLabel,
                      track: classes.track,
                    }}
                    track="inverted"
                    onChange={(e) => handleChange(e, "temperature")}
                    value={temperature}
                    aria-labelledby="discrete-slider-small-steps"
                    step={0.01}
                    min={0.0}
                    max={1.0}
                    marks={[
                      { value: 0.0, label: 0.0 },
                      { value: 0.25, label: 0.25 },
                      { value: 0.5, label: 0.5 },
                      { value: 0.75, label: 0.75 },
                      { value: 1.0, label: 1.0 },
                    ]}
                    valueLabelDisplay="auto"
                  />
                </Tooltip>
                <div style={{ height: 20 }}></div>
                <Typography gutterBottom>Presence_penalty</Typography>
                <Tooltip
                  disableFocusListener
                  disableTouchListener
                  title="Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics."
                >
                  <Slider
                    classes={{
                      root: classes.root,
                      thumb: classes.thumb,
                      rail: classes.rail,
                      valueLabel: classes.valueLabel,
                      track: classes.track,
                    }}
                    track="inverted"
                    onChange={(e) => handleChange(e, "presence")}
                    value={presence}
                    aria-labelledby="discrete-slider-small-steps"
                    step={0.1}
                    min={-2.0}
                    max={2.0}
                    marks={[
                      { value: -2.0, label: -2.0 },
                      { value: -1.0, label: -1.0 },
                      { value: 0.0, label: 0.0 },
                      { value: 1.0, label: 1.0 },
                      { value: 2.0, label: 2.0 },
                    ]}
                    valueLabelDisplay="auto"
                  />
                </Tooltip>
                <div style={{ height: 20 }}></div>
                <Typography gutterBottom>Frequency_penalty</Typography>
                <Tooltip
                  disableFocusListener
                  disableTouchListener
                  title="Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim."
                >
                  <Slider
                    classes={{
                      root: classes.root,
                      thumb: classes.thumb,
                      rail: classes.rail,
                      valueLabel: classes.valueLabel,
                      track: classes.track,
                    }}
                    track="inverted"
                    onChange={(e) => handleChange(e, "frequency")}
                    value={frequency}
                    aria-labelledby="discrete-slider-small-steps"
                    step={0.1}
                    min={-2.0}
                    max={2.0}
                    marks={[
                      { value: -2.0, label: -2.0 },
                      { value: -1.0, label: -1.0 },
                      { value: 0.0, label: 0.0 },
                      { value: 1.0, label: 1.0 },
                      { value: 2.0, label: 2.0 },
                    ]}
                    valueLabelDisplay="auto"
                  />
                </Tooltip>
                <div style={{ height: 20 }}></div>
                <Button
                  variant="contained"
                  color="primary"
                  lg={3}
                  style={{
                    color: "#ffffff",
                    backgroundColor: "#2780ea",
                    width: "35%",
                    height: 50,
                    fontSize: 18,
                    marginLeft: "10%",
                    marginRight: "5%",
                  }}
                  onClick={handleParams}
                >
                  <Icon fontSize="large">done</Icon>&nbsp;&nbsp;OK
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  style={{
                    color: "#ffffff",
                    backgroundColor: "#2780ea",
                    width: "35%",
                    height: 50,
                    fontSize: 18,
                    marginLeft: "5%",
                    marginRight: "10%",
                  }}
                  onClick={handleReset}
                >
                  <Icon fontSize="large">autorenew</Icon>&nbsp;&nbsp;RESET
                </Button>
              </Grid>
              <Grid item xs={12} ml={2} lg={5.5} md={5.5}>
                {/*<VerticalBarChart*/}
                {/*  icon={{ color: "info", component: "leaderboard" }}*/}
                {/*  height={360}*/}
                {/*  title="Message Distribution"*/}
                {/*  description="Message distribution per session"*/}
                {/*  chart={{*/}
                {/*    labels: chartData.labels,*/}
                {/*    datasets: [*/}
                {/*      {*/}
                {/*        label: "Message Count",*/}
                {/*        color: "info",*/}
                {/*        data: chartData.data,*/}
                {/*      },*/}
                {/*    ],*/}
                {/*  }}*/}
                {/*/>*/}
                {barChart}
              </Grid>
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

export default UserInfo;
