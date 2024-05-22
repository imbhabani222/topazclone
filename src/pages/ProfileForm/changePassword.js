import React from 'react'
import {
    Row,
    Col,
    Form,
    Input,
    Button,
    Select,
    Divider,
    message,
    Modal,
  } from "antd";

function changePassword() {
  return (
    <>
       <Form
            //   form={form}
              name="basic"
              layout="vertical"
            //   onFinish={onFinish}
            //   onFinishFailed={onFinishFailed}
              autoComplete="off"
              wrapperCol={{
                span: 17,
              }}
            >
                  <Row>
                  <Col xs={0} sm={0} md={0} lg={6} xl={6}></Col>
       <Col
                  xs={24}
                  sm={24}
                  md={8}
                  lg={6}
                  xl={6}
                  className="profile-bottom-Col"
                >
                  <Form.Item
                    requiredMark={"optional"}
                    label="New Password"
                    name="newPassword"
                    // onChange={newPasswordhandler}
                    rules={[
                      {
                        min: 6,
                        message: "Password must be atleast 6 characters",
                      },
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                </Col>
                <Col
                  xs={24}
                  sm={24}
                  md={8}
                  lg={6}
                  xl={6}
                  className="profile-bottom-Col"
                >
                  <Form.Item
                    label="Confirm Password"
                    name="confirmPassword"
                    // onChange={onhandlePasswordChange}
                    rules={[
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (getFieldValue("newPassword") == value) {
                            return Promise.resolve();
                          } else {
                            return Promise.reject("Password does not match!");
                          }
                        },
                      }),
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                </Col>
                <Col
                  xs={24}
                  sm={24}
                  md={7}
                  lg={6}
                  xl={2}
                  className="profile-adress-btn profile-password-button"
                >
                  <Form.Item
                    rules={[
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (
                            getFieldValue("confirmPassword") ==
                            getFieldValue("newPassword")
                          ) {
                            return Promise.resolve();
                          } else {
                            return Promise.reject("Password does not match!");
                          }
                        },
                      }),
                    ]}
                  >
                    <Button
                      type="primary"
                    //   disabled={saveChange == newChanges ? false : true}
                    //   onClick={onChangePassword}
                    >
                      Change Password
                    </Button>
                  </Form.Item>
                </Col>
                </Row>
                </Form>
    </>
  )
}

export default changePassword