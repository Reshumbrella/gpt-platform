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

import { useEffect, useState } from "react";

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";

function Basic() {
  const [rememberMe, setRememberMe] = useState(true);
  const [user, setUser] = useState({ email: "", password: "" });
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("success");
  const [text, setText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.clear();
  }, []);

  const handlesbClose = () => {
    setOpen(false);
  };

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const handleChange = (e, target) => {
    if (target === "email") user.email = e.target.value;
    if (target === "pwd") user.password = e.target.value;
  };

  const handleClick = async () => {
    let res = await axios.post(
      "api/auth/login",
      { username: user.email, password: user.password, remember: rememberMe },
      {
        headers: { "content-type": "application/x-www-form-urlencoded" },
      }
    );
    // console.log(res.data.text);
    setSeverity(res.data.state);
    setText(res.data.message);
    setOpen(true);
    if (res.data.state === "success") {
      setTimeout(function () {
        sessionStorage.setItem("username", res.data.info.username);
        sessionStorage.setItem("email", user.email);
        sessionStorage.setItem("apikey", res.data.info.apikey);
        sessionStorage.setItem("temperature", res.data.info.temperature);
        sessionStorage.setItem("presence", res.data.info["presence"]);
        sessionStorage.setItem("frequency", res.data.info.frequency);
        navigate("/simplechat");
      }, 3000);
    }
  };
  const onKeydown = (e) => {
    if (e.keyCode === 13) {
      handleClick();
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign In
          </MDTypography>
          <Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <FacebookIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GitHubIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GoogleIcon color="inherit" />
              </MDTypography>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="email"
                onChange={(e) => handleChange(e, "email")}
                onKeyDown={(e) => onKeydown(e)}
                fullWidth
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="password"
                onChange={(e) => handleChange(e, "pwd")}
                onKeyDown={(e) => onKeydown(e)}
                fullWidth
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" onClick={handleClick} fullWidth>
                Sign in
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Don&lsquo;t have an account yet?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign up
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
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
          {text}
        </Alert>
      </Snackbar>
    </BasicLayout>
  );
}

export default Basic;
