import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Button, message } from "antd";
import { emailVerify, emailid } from "../../action/useraction";
import loginbgimg from "../../assets/img/loginLogo.svg";
import keyImg from "../../assets/img/keyLogo.svg";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { APIs } from "../../worker";

function ForgotPwd() {
  let dispatch = useDispatch();
  let navigate = useNavigate();

  const userloginn = useSelector((state) => state.emaildata);
  const [policy, setpolicy] = useState(false);

  if (userloginn) {
    dispatch(emailid(userloginn));
  }

  useEffect(() => {
    if (userloginn.emailinfo) {
      navigate("/check-email");
    }
  }, [userloginn.emailinfo]);

  const onFinish = async (values) => {
    let formData = new FormData(); //formdata object
    formData.append("email", values.email); //append the values with key, value pair
    // dispatch(emailVerify(formData));
    try {
      let response = await axios.post(
        `${APIs.baseURL}/user-service/v1/user/forgot-password`,
        formData
      );
      message.success("Please check your registered email id ");
    } catch (err) {
      message.error(err.response.data.message);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="loginpage">
      <div className="loginleftContainer">
        <img src={loginbgimg} alt="loginbgimg" />
        <div className="project_title">
          <h2>
            “Amazing things will <br></br>happen when you listen <br></br>to the
            consumer”
          </h2>
        </div>
      </div>
      <div className="loginrightContainer">
        <div className="rightimgcontainer">
          <img src={keyImg} alt="keyImg" />
        </div>
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 24,
          }}
          initialValues={{
            remember: true,
          }}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <h2>Forgot Password ?</h2>
          <div style={{ textAlign: "left" }}>
            <h4 style={{ color: "gray", marginBottom: "20px" }}>
              No worries, we’ll send you reset instructions.
            </h4>
          </div>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: "Please input your E-mail!",
              },
            ]}
          >
            <Input name="email" placeholder="Enter your Email." />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              span: 24,
            }}
          >
            <Button
              type="primary"
              style={{ marginTop: "20px" }}
              htmlType="submit"
              disabled={policy ? true : false}
            >
              Reset Password
            </Button>
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
        </Form>
        <p className="loginFooter">
          © {new Date().getFullYear()} Topaz. All rights reserved. Terms of Service
        </p>
      </div>
    </div>
  );
}

export default ForgotPwd;
