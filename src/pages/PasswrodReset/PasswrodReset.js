import * as React from "react";
import { Form, Input, Button, Checkbox, Row, Col, message } from "antd";
import { checkNumbervalue } from "../onboard_manufactures/index";
import "./PasswrodReset.css";
import loginbgimg from "../../assets/img/loginLogo.svg";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createPassword } from "../../action/useraction";
function ResetPassword() {
  const [policy, setpolicy] = useState(false);

  let dispatch = useDispatch();
  let navigate = useNavigate();
  const userloginn = useSelector((state) => state.emailid);
  console.log(userloginn);
  //   useEffect(() => {
  //   if (userinfo) {
  //     navigate('/onboard-manufactures')
  //   }
  // }, [userinfo])

  const navigateToLogin = () => {
    console.log("login");
    navigate("/login");
  };

  return (
    <div className="loginpage">
      <div className="loginleftContainer">
        {" "}
        <img src={loginbgimg} alt="loginbgimg" />
        <div className="project_title">
          {" "}
          <h2>
            “Amazing things will <br></br>happen when you listen <br></br>to the
            consumer”
          </h2>
        </div>
      </div>

      <div className="createrightContainer">
        <svg
          width="82"
          height="82"
          viewBox="0 0 82 82"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="41" cy="41" r="41" fill="#7FE26E" />
          <circle cx="41" cy="42" r="31" fill="#60CA4E" />
          <circle cx="41" cy="42" r="15" stroke="white" stroke-width="2" />
          <path
            d="M32.9177 43.1513L37.7538 47.8873L50.3189 36.724"
            stroke="white"
            stroke-width="2"
          />
        </svg>

        <h2 className="checkEmail">Password reset</h2>
        <div style={{ textAlign: "center" }}>
          <h4 style={{ color: "gray", paddingBottom: "20px" }}>
            Your password hasbeen sucessfully reset.
            <br />
            <span>click bleow to login magically.</span>
          </h4>
        </div>

        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Form.Item
            labelCol={{
              span: 24,
            }}
          >
            <Button
              type="primary"
              htmlType="submit"
              disabled={policy ? true : false}
              onClick={navigateToLogin}
            >
              Continue
            </Button>
          </Form.Item>
          <Link to="/login">
            {" "}
            <svg
              width="10"
              height="12"
              viewBox="0 0 10 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6 1L1 6.5L6 11.5" stroke="#0185FE" />
              <line x1="1" y1="6.5" x2="10" y2="6.5" stroke="#0185FE" />
            </svg>
            <span> </span> Back to log in
          </Link>
        </Col>
        <p className="loginFooter">
          © {new Date().getFullYear()} Topaz. All rights reserved. Terms of Service
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;
