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

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";
import { useEffect, useState } from "react";
import axios from "axios";
import { Alert } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";

function Cover() {
  const [user, setUser] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("email");
  const [info, setInfo] = useState({
    username: "uesrname",
    uerror: false,
    password: "password",
    perror: false,
  });
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("success");
  const [text, setText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log(sessionStorage.getItem("email"));
  }, []);

  const handlesbClose = () => {
    setOpen(false);
  };
  const handleChange = (e, target) => {
    switch (target) {
      case "username":
        user.username = e.target.value;
        return;
      case "email":
        user.email = e.target.value;
        return;
      case "pwd":
        user.password = e.target.value;
        return;
    }
  };

  //邮箱检查
  const emailCheck = () => {
    const reg = /^([a-zA-Z\d][\w-]{2,})@(\w{2,})\.([a-z]{2,})(\.[a-z]{2,})?$/;
    if (!reg.test(user.email)) {
      setError(true);
      setEmail("邮箱不合法或已注册，请重新输入!");
      setTimeout(function () {
        setError(false);
        setEmail("email");
      }, 2500);
      return false;
    }
    return true;
  };

  //密码及用户名检查
  const infoCheck = () => {
    if (user.username === "" || user.password === "") {
      if (user.username === "") {
        info.uerror = true;
        info.username = "用户名不能为空!";
        setTimeout(function () {
          info.uerror = false;
          info.username = "username";
        }, 2500);
      }
      if (user.password === "") {
        info.perror = true;
        info.password = "密码不能为空!";
        setTimeout(function () {
          info.perror = false;
          info.password = "password";
        }, 2500);
      }
      return false;
    }
    return true;
  };
  const handleClick = () => {
    let ec = emailCheck();
    let ic = infoCheck();
    if (ec && ic) {
      axios.post("/api/auth/sign-up", user).then((res) => {
        setSeverity(res.data.state);
        setText(res.data.message);
        setOpen(true);
        console.log(res.data);
        if (res.data.state === "success") {
          setTimeout(function () {
            navigate("/authentication/sign-in");
          }, 3000);
        }
      });
    }
  };

  return (
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Join Us
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Enter your email and password to register
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput
                error={info.uerror}
                type="text"
                label={info.username}
                variant="standard"
                onChange={(e) => handleChange(e, "username")}
                fullWidth
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                error={error}
                type="email"
                label={email}
                variant="standard"
                onChange={(e) => handleChange(e, "email")}
                fullWidth
                style={{ textColor: "red" }}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                error={info.perror}
                type="password"
                label={info.password}
                variant="standard"
                onChange={(e) => handleChange(e, "pwd")}
                fullWidth
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Checkbox />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;I agree the&nbsp;
              </MDTypography>
              <MDTypography
                component="a"
                href="#"
                variant="button"
                fontWeight="bold"
                color="info"
                textGradient
              >
                Terms and Conditions
              </MDTypography>
            </MDBox>
            <MDBox mt={2} mb={1}>
              <MDButton variant="gradient" color="info" onClick={handleClick} fullWidth>
                SIGN UP
              </MDButton>
            </MDBox>
            <MDBox mt={1} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Already have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign In
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
    </CoverLayout>
  );
}

export default Cover;
