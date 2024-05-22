import * as React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Form, Button, Col } from "antd";
import loginbgimg from "../../assets/img/loginLogo.svg";
import { Link } from "react-router-dom";
import emailImg from "../../assets/img/emailImg.svg";
import "./CheckEmail.css";

function ResetPassword() {
  const [policy, setpolicy] = useState(false);
  const userloginn = useSelector((state) => state.emailid);
  const navTogmail = () => {
    window.location.assign("https://mail.google.com/mail/u/0/#inbox");
  };

  return (
    <div className="loginpage">
      <div className="createleftContainer">
        <img src={loginbgimg} alt="loginbgimg" />
        <div className="project_title">
          <h2>“Amazing things will happen when you listen to the consumer”</h2>
        </div>
      </div>

      <div className="createrightContainer">
        <div className="rightimgcontainer">
          <img src={emailImg} alt="emailImg" />
        </div>

        <h2 className="checkEmail">Check your email</h2>
        <div style={{ textAlign: "center" }}>
          <h4 style={{ color: "gray", paddingBottom: "20px" }}>
            We sent a password reset link to <br />
            <span className="textColor">
              {userloginn?.data?.emailinfo?.email}
            </span>
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
              to="https://mail.google.com/mail/u/0/#inbox"
              htmlType="submit"
              onClick={navTogmail}
            >
              Open email
            </Button>
            <div style={{ textAlign: "center" }}>
              <h4 style={{ color: "gray", paddingTop: "10px" }}>
                {" "}
                Didn’t recive email?
                <span className="textColor">Click to resend</span>
              </h4>
            </div>
          </Form.Item>
          <Link to="/login" className="backTologin">
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
