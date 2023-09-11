import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "./../../logos.png";
import axios from "./../AxiosInstance";
import "./Login.css";
import AnimatedPage from "../Shared_Components/AnimatedPage";
import { Col, Row } from "react-bootstrap";

function Login({ setMenu, setToken }) {
  const navigate = useNavigate();
  const userNameRef = useRef(null);
  const companyEmailRef = useRef(null);
  const PassRef = useRef(null);
  const TmpCodeRef = useRef(null);
  const [loggedIn, setLoggedIn] = useState(0);
  const [err, setErr] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidIP, setIsValidIP] = useState("Checking If IP Exist");
  const [ip, setIp] = useState(null);
  const [showTmpCode, setShowTmpCode] = useState(false);
  const [user, setUser] = useState({
    Username: null,
    parties: null,
    ip: null,
    TmpCode: null,
    Token: null,
    CompanyEmail: "fsp@cloudpkerp.com",
  });
  function LoginAccess() {
    setErr("");
    if (
      user.Username !== null &&
      user.Password !== null &&
      user.TmpCode !== null
    ) {
      setIsLoading(true);
      axios
        .post("api/login/authorize", {
          CompanyEmail: user.CompanyEmail,
          UserName: user.Username,
          Pwd: user.Password,
          TmpCode: user.TmpCode,
          CompanyId: window.localStorage.getItem("CompanyId"),
        })
        .then((response) => {
          // console.log(response.data);
          if (response.data.token.length > 0 && response.status === 200) {
            axios.defaults.headers.common["Authorization"] =
              "Bearer " + response.data.token[0];
            window.localStorage.setItem(
              "user",
              JSON.stringify({
                UserName: user.Username,
                Token: response.data.token[0],
              })
            );
            window.localStorage.setItem(
              "menus",
              JSON.stringify(response.data.menu)
            );
            window.localStorage.setItem(
              "token",
              JSON.stringify(response.data.token[0])
            );
            setMenu(response.data.menu);
            setErr("");
            navigate("/");
          } else {
            setErr("Email or Password is Incorrect");
          }
        })
        .catch((err) => {
          console.log(err);
          alert(err.message);
          PassRef.current.focus();
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setErr("All Fields Are Required!");
    }
  }
  useEffect(() => {
    if (showTmpCode) TmpCodeRef.current.focus();
  }, [showTmpCode]);
  function GetUserTmpCode() {
    setErr("");
    if (user.Username !== null && user.Password !== null && user.CompanyEmail) {
      setIsLoading(true);
      axios
        .post("api/login/GetUserTmpCode", {
          UserName: user.Username,
          Pwd: user.Password,
          CompanyEmail: user.CompanyEmail,
        })
        .then((response) => {
          window.localStorage.setItem(
            "CompanyEmail",
            companyEmailRef.current.value
          );
          window.localStorage.setItem(
            "CompanyId",
            JSON.stringify(response.data[0].CompanyId)
          );
          axios.defaults.headers.common["CompanyId"] =
            response.data[0].CompanyId;

          if (response.data?.token?.length > 0 && response.status === 200) {
            console.log(response.data);
            axios.defaults.headers.common["Authorization"] =
              "Bearer " + response.data.token[0];
            window.localStorage.setItem(
              "user",
              JSON.stringify({
                UserName: user.Username,
                Token: response.data.token[0],
              })
            );
            window.localStorage.setItem(
              "menus",
              JSON.stringify(response.data.menu)
            );
            setMenu(response.data.menu);
            setErr("");
            navigate("/");
          } else if (response.status === 200) {
            console.log(response);
            setShowTmpCode(true);
            setErr("");
          } else {
            setErr("Email or Password is Incorrect");
          }
        })
        .catch((err) => {
          console.log(err);
          alert(err.message);
          PassRef.current.focus();
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setErr("All Fields Are Required!");
    }
  }

  useEffect(() => {
    document.title = "CloudPK Login";
    async function fetchIp() {
      const response = await fetch("https://api.ipify.org");
      const ip = await response.text();
      setIp(ip);

      const response2 = await axios.get("api/perm/ipaddress/" + ip);
      if (response2.data === true) setIsValidIP("IP Found");
      else setIsValidIP("IP Not Found");
    }

    user.CompanyEmail = window.localStorage.getItem("CompanyEmail");
    companyEmailRef.current.value = "fsp@cloudpkerp.com";
    user.CompanyEmail = companyEmailRef.current.value;

    fetchIp();
  }, []);

  function OnEnterFun(e) {
    if (e.key !== "Enter") return;

    if (PassRef.current === document.activeElement) {
      GetUserTmpCode();
    }
    if (TmpCodeRef.current === document.activeElement) {
      LoginAccess();
    }
  }
  useEffect(() => {
    setLoggedIn(1);
    if (loggedIn === 1) {
      if (localStorage.getItem("user")) {
        navigate("/");
      }
    }
  }, [loggedIn]);

  useEffect(() => {
    userNameRef.current.focus();
  }, []);

  return (
    <AnimatedPage>
      <div className="form_main_wrapper">
        <div className="ripple-background">
          <div className="circle xxlarge shade1"></div>
          <div className="circle xlarge shade2"></div>
          <div className="circle large shade3"></div>
          <div className="circle mediun shade4"></div>
          <div className="circle small shade5"></div>
        </div>
        <Row>
          <Col xs={4}></Col>

          <Col xs={4}>
            <div className="form_area">
              <div className="form_content">
                <div className="logo_img">
                  <img src={logo} alt="Logo" />
                </div>
                <div className="form_inputs_area">
                  <div className="error form_error text-warning">{err}</div>
                  <input
                    ref={companyEmailRef}
                    type="text"
                    placeholder="Company Email"
                    className="form-control"
                    onChange={(e) =>
                      setUser({ ...user, CompanyEmail: e.target.value })
                    }
                    value={user.CompanyEmail !== null ? user.CompanyEmail : ""}
                  />
                  <br />
                  <input
                    ref={userNameRef}
                    type="text"
                    placeholder="User Name"
                    className="form-control"
                    onChange={(e) =>
                      setUser({ ...user, Username: e.target.value })
                    }
                    value={user.Username !== null ? user.Username : ""}
                  />
                  <br />
                  <input
                    type="password"
                    placeholder="Password"
                    className="form-control"
                    ref={PassRef}
                    onKeyDown={(e) => OnEnterFun(e)}
                    onChange={(e) =>
                      setUser({ ...user, Password: e.target.value })
                    }
                    value={user.Password !== null ? user.Password : ""}
                  />
                  <br />
                  <input
                    type="text"
                    disabled
                    placeholder="fetching IP"
                    className="form-control"
                    value={(ip !== null ? ip : "") + " (" + isValidIP + ")"}
                  />
                  <br />
                  {showTmpCode && (
                    <>
                      <input
                        type="number"
                        placeholder="code"
                        className="form-control"
                        ref={TmpCodeRef}
                        onKeyDown={(e) => OnEnterFun(e)}
                        onChange={(e) =>
                          setUser({ ...user, TmpCode: e.target.value })
                        }
                        value={user.TmpCode !== null ? user.TmpCode : ""}
                      />
                      <br />
                    </>
                  )}
                  <div className="SignIn_SignUp_Form_Bottom_Area">
                    <div className="SignIn_SignUp_Form_Left">
                      <button
                        disabled={isLoading}
                        onClick={showTmpCode ? LoginAccess : GetUserTmpCode}
                        className="btn btn-info SignUp_SignIn_Btn"
                      >
                        {isLoading ? "Logging In..." : "Login"}
                      </button>
                    </div>
                    <div className="SignIn_SignUp_Form_Right">
                      <Link to="/forgot" className="forget_password">
                        Forgot Password?
                      </Link>{" "}
                      &nbsp;
                      <Link
                        to="/signup"
                        className="btn btn-info SignUp_SignIn_Btn"
                      >
                        SignUp
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={2}></Col>
        </Row>
      </div>
    </AnimatedPage>
  );
}

export default Login;
