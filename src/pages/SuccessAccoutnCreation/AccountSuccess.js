import React from "react";
import { Form, Button, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { userlogout } from "../../action/useraction";
import loginbgimg from "../../assets/img/loginLogo.svg";
import { useDispatch } from "react-redux";

function AccountSuccess() {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const navigateToLogin = () => {
    dispatch(userlogout());
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
        <div className="createimgcontainer">
          <img src={loginbgimg} alt="loginbgimg" />
        </div>

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

        <h2 className="checkEmail">
          Congratulations your account has been created successfully <br />
        </h2>
        <div style={{ textAlign: "center" }}></div>

        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Form.Item
            labelCol={{
              span: 24,
            }}
          >
            <Button
              type="primary"
              htmlType="submit"
              // disabled={policy ? true : false}
              onClick={navigateToLogin}
            >
              Continue
            </Button>
          </Form.Item>
        </Col>
        <p className="loginFooter">
          © {new Date().getFullYear()} Topaz. All rights reserved. Terms of Service
        </p>
      </div>
    </div>
  );
}

export default AccountSuccess;
