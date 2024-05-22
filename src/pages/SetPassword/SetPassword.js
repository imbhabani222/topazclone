import * as React from "react";
import { Form, Input, Button, Checkbox, Row, Col, message } from "antd";
import { checkNumbervalue } from "../onboard_manufactures/index";
import "./SetPasswrod.css";
import axios from "axios";
import { APIs } from "../../worker";
import loginbgimg from "../../assets/img/loginLogo.svg";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createPassword } from "../../action/useraction";
import { useParams } from "react-router-dom";
function ResetPassword() {
  const [policy, setpolicy] = useState(false);

  let dispatch = useDispatch();
  let navigate = useNavigate();
  const [verificationToken, setVerificationToken] = useState("");

  // const userloginn = useSelector((state) => state.emailid);
  // console.log(userloginn.data.emailinfo.resetToken);
  // console.log(userloginn.emailinfo.resetToken);

  useEffect(() => {
    // axios.get(`http://localhost:3000/set-passwrod?resetToken=${params}`)
    // .then(res => {
    //     console.log(res)
    //     // setPosts(res.data)
    // })
    // .catch(err =>{
    //     console.log(err)
    // })
    let url = new URL(window.location.href);
    let filtervalue = url.searchParams.get("resetToken");
    console.log(filtervalue);
    setVerificationToken(filtervalue);
  }, []);

  const onFinish = async (values) => {
    console.log("Success:", values);
    // let verificationToken = userloginn.data.emailinfo.resetToken;
    let { password, conf_password } = values;
    console.log(password, conf_password);

    if (password.length < 8) {
      message.error("Password must be of 8 characters.");
    } else if (password !== conf_password) {
      message.error("Passwords didn't matched.");
    } else {
      let formData = new FormData();
      formData.append("password", password);
      formData.append("resetToken", verificationToken);
      // dispatch(createPassword(formData))

      await axios
        .put(`${APIs.baseURL}/user-service/v1/user/reset-password`, formData)
        .then((response) => {
          if (response.status == 200) navigate("/password-rest");
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });

       let res =  await axios.put(`${APIs.baseURL}/user-service/v1/user/reset-password`,formData);
        console.log(res)
        if(res.status == 200){
          navigate('/password-rest')
        }
      message.success("Password has Successfully set.");
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
          <svg
            width="82"
            height="82"
            viewBox="0 0 82 82"
            style={{ paddingBottom: "10px" }}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="41" cy="41" r="41" fill="#EEEEEE" />
            <circle cx="41" cy="42" r="31" fill="#EAEAEA" />
            <path d="M52 30L41.5 40.5" stroke="#A0A0A0" />
            <path d="M45 37L49 40.5L53 36L50 32.5" stroke="#A0A0A0" />
            <circle cx="36" cy="46" r="7.5" stroke="#A0A0A0" />
            <circle cx="41" cy="41" r="41" fill="#91DEFC" />
            <circle cx="41" cy="42" r="31" fill="white" />
            <path d="M52 30L41.5 40.5" stroke="#00ADEF" stroke-width="2" />
            <path
              d="M45 37L49 40.5L53 36L50 32.5"
              stroke="#00ADEF"
              stroke-width="2"
            />
            <circle cx="36" cy="46" r="7" stroke="#00ADEF" stroke-width="2" />
          </svg>

          <h2>Set New Password</h2>
          <div style={{ textAlign: "left" }}>
            <h4 style={{ color: "gray", paddingBottom: "20px" }}>
              Your new password must be different to
              <br /> previously use passwords.
            </h4>
          </div>

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
            <Link to="/login">{"<-  Back to Login"}</Link>
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
