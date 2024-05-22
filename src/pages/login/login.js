import * as React from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import "./login.css";
import loginbgimg from "../../assets/img/loginLogo.svg";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userlogin, bredCurm } from "../../action/useraction";
import { useNavigate, Link } from "react-router-dom";
function Login() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  let navigate = useNavigate();
  let dispatch = useDispatch();
  const userloginn = useSelector((state) => state.userlogin);
  let { loading, userinfo, error } = userloginn;

  const onFinish = (values) => {
    let { username, password } = values;
    setemail(username);
    setpassword(password);
    dispatch(userlogin(username, password));
  };
  const onFinishFailed = (errorInfo) => {
    console.log(errorInfo);
  };

  useEffect(() => {
    if (userinfo) {
      if (userinfo.admin) {
        navigate("/view-manufacturers");
        dispatch(bredCurm("1"));
      }

      if (userinfo.productowner) return navigate("/dashboard");
    }
    if (error) return message.error(userloginn?.error);
  }, [navigate, userinfo, error]);

  useEffect(() => {
    if (!userinfo) {
      navigate("/login");
    }
  }, [navigate]);

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
          <h2 className="login_header">Login to your account.</h2>
          <Form.Item
            label="Username"
            name="username"
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
            wrapperCol={{
              span: 18,
            }}
          >
            <Input placeholder="Enter your Username" className="username_col" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
            wrapperCol={{
              span: 18,
            }}
            className="pwd_item"
          >
            <Input.Password placeholder="Password" className="pwd_col" />
          </Form.Item>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              width: "75%",
              marginBottom: "20px",
              justifyContent: "space-between",
            }}
            className="colRemember"
          >
            <Checkbox style={{ paddingTop: "3px", width: "50%" }}>
              Remember me
            </Checkbox>

            <Form.Item
              name="remember"
              valuePropName="checked"
              style={{
                marginBottom: "0px",
                width: "50%",
                display: "flex",
              }}
            >
              <Link
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
                to="/forgot-pwd"
              >
                Forgot password?
              </Link>
            </Form.Item>
          </div>

          <Form.Item
            wrapperCol={{
              span: 18,
            }}
          >
            <Button type="primary" htmlType="submit">
              Sign in
            </Button>
          </Form.Item>
        </Form>

        <p className="loginFooter">
          © {new Date().getFullYear()} Topaz. All rights reserved. Terms of Service
        </p>
      </div>
    </div>
  );
}

export default Login;
