import * as React from "react";
import { Form, Input, Button, Checkbox, Row, Col, message } from "antd";
import { checkNumbervalue } from "../onboard_manufactures/index";
import "./createpassword.css";
import axios from "axios";
import { APIs } from "../../worker";
import loginbgimg from "../../assets/img/loginLogo.svg";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createPassword } from "../../action/useraction";
function ResetPassword() {
  const [policy, setpolicy] = useState(false);

  let dispatch = useDispatch();
  let navigate = useNavigate();
  const [verificationToken, setVerificationToken] = useState("");
  const userloginn = useSelector((state) => state.userregister);
  let { loading, userinfo, error } = userloginn;
  useEffect(() => {
    if (userinfo) {
      navigate("/onboard-manufactures");
    }
  }, [userinfo]);

  useEffect(() => {
    let url = new URL(window.location.href);
    let filtervalue = url.searchParams.get("verificationToken");
    console.log(filtervalue);
    setVerificationToken(filtervalue);
  }, []);
  console.log(verificationToken);

  const onFinish = async (values) => {
    console.log("Success:", values);
    // let verificationToken = "36aa68fe-dfc4-4227-9d0e-057146d2ec58a2bee28f-4704-4a4e-a2a7-bc3503a9508b";
    let { password, conf_password } = values;

    if (password.length < 8) {
      message.error("Password must be of 8 characters.");
    } else if (password !== conf_password) {
      message.error("Passwords didn't matched.");
    } else {
      let formData = new FormData();
      formData.append("verificationToken", verificationToken);
      formData.append("password", password);

      await axios
        .put(`${APIs.baseURL}/manufacturer-service/v1/manufacturer/password`, formData)
        .then((response) => console.log(response))
        .catch((error) => {
          console.error("There was an error!", error);
        });
      // dispatch(createPassword(verificationToken, password))
      message.success("Password Has Been Successfully Changed");
      navigate("/account-success");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="loginpage">
      <div className="loginleftContainer">
        {" "}
        <img src={loginbgimg} />
        <div className="project_title">
          {" "}
          <h2>
            “Amazing things will <br></br>happen when you listen <br></br>to the
            consumer”
          </h2>
        </div>
      </div>

      <div className="createrightContainer">
        <div className="createimgcontainer">
          <img src={loginbgimg} />
        </div>

        <Form
          name="basic"
          className="formenterPassword"
          // labelCol={{
          //   span: 24,
          // }}
          // wrapperCol={{
          //   span: 24,
          // }}
          initialValues={{
            remember: true,
          }}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <h2>Create New Password</h2>

          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <Form.Item
              label="Enter Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
              // labelCol={{
              //   span: 24,
              // }}
              // wrapperCol={{
              //   span: 24,
              // }}
            >
              <Input.Password placeholder="••••••••••••" />
            </Form.Item>
            <Form.Item
              label="Confirm Password"
              name="conf_password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password placeholder="••••••••••••" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <Form.Item
              labelCol={{
                span: 24,
              }}
              // wrapperCol={{
              //   span: 24,
              // }}
            >
              <Button
                type="primary"
                style={{ marginTop: "20px" }}
                htmlType="submit"
                disabled={policy ? true : false}
              >
                Submit
              </Button>
            </Form.Item>
          </Col>
        </Form>
        <p className="loginFooter">
          © {new Date().getFullYear()} Topaz. All rights reserved. Terms of Service
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;
