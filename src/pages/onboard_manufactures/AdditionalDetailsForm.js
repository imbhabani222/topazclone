import React, { useEffect, useState } from "react";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { APIs } from "../../worker";
import {
  Row,
  Col,
  Divider,
  Form,
  Input,
  Button,
  Space,
  Steps,
  message,
  Spin,
} from "antd";
import { bredCurm } from "../../action/useraction";
import { useSelector, useDispatch } from "react-redux";
import { userOnbordManufectures, setFormData } from "../../action/useraction";
import { checkNumbervalue, checkSpecialCharacter } from "./index";
import { useNavigate, Link } from "react-router-dom";
import "./AddtionalDetailsForm.css";
import "./onboard_manufactures.css";

const { Step } = Steps;

function OnboardManufacturerTab({ backArrowClick }) {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const [form] = Form.useForm();
  const prevFormData = useSelector((state) => state.formData);
  const onbord = useSelector((state) => state.onBordman);
  const [loading, setLoading] = useState(false);
  const { error, passwordToken, } = onbord;

  const userInfo = JSON.parse(localStorage.getItem("userinfo"))

  // useEffect(() => {
  //   setLoading(onbord.loading)
  // }, [onbord])

  const onFinish = async (values) => {
    setLoading(true);

    let temp = [
      {
        accountNumber: values.accountNumber,
        ifscCode: values.ifscCode,
        branchName: values.branchName,
        bankName: values.bankName,
      },
    ];
    if (values.bank_ac !== undefined) return temp.push(...values.bank_ac);
    const imageOnboard = new FormData();
    if (prevFormData.data.image.fileList[0].originFileObj)
      imageOnboard.append(
        "file",
        prevFormData.data.image.fileList[0].originFileObj
      );

    const payload = {
      manufacturerName: prevFormData.data.manufacturerName,
      industry: {
        industryType: prevFormData.data.industryType,
      },
      city: prevFormData.data.city,
      state: {
        stateName: prevFormData.data.state,
      },
      addressLine: prevFormData.data.addressLine,
      country: {
        countryName: prevFormData.data.country,
      },
      zipcode: prevFormData.data.zipcode,
      contactPerson: {
        userName: prevFormData.data.userName,
        role: {
          roleid: prevFormData.data.role,
        },
        email: prevFormData.data.email,
        phoneNumber: prevFormData.data.phoneNumber,
      },
      adddetails: {
        bankdetails: temp,
        cinNumber: values.cinNumber,
        gstNumber: values.gstNumber,
      },
    };
    console.log("payload",payload,prevFormData.data.image.fileList[0].originFileObj)
    dispatch(userOnbordManufectures(payload, imageOnboard))
    setLoading(false)

    // await axios
    //   .post(
    //     `${APIs.baseURL}/manufacturer-service/v1/manufacturer`,
    //     payload,
    //     {
    //       headers: {
    //         "Content-Type": "application/json",
    //         "Authorization": `Bearer ${userInfo.token}`,
    //       }
    //     }

    //     //config
    //   )
    //   .then((resAdd) => {
    //     if (resAdd.status === 200) {
    //       axios
    //         .put(
    //           `${APIs.baseURL}/manufacturer-service/v1/manufacturer-file/${resAdd.data.manufacturerCode}`,
    //           imageOnboard,{
    //             headers: {
    //               "Content-Type": "application/json",
    //               "Authorization": `Bearer ${userInfo.token}`,
    //             }
    //           }              
    //         )
    //         .then((res) => {
    //           message.success("Manufacturer Onboarded Successfully");
    //           dispatch(setFormData({}, {}));
    //           navigate("/view-manufacturers");
    //           backArrowClick();
    //           setLoading(false);
    //           dispatch(bredCurm("2"));
    //         });
    //     } else {
    //       setLoading(false);
    //       message.error(resAdd.error);
    //     }
    //   })
    //   .catch((err) => {
    //     setLoading(false);
    //     message.error(err.response.data.message);
    //   });
  };

  const setIfscData = (ifsc) => {
    console.log({ ifsc });
    if (ifsc.length > 10) {
      axios.get(`https://ifsc.razorpay.com/${ifsc}`).then((res) => {
        console.log("hiiiiii", res?.data);
        const { BRANCH: branchName, BANK: bankName } = res?.data;
        {
          form.setFieldsValue({
            branchName,
            bankName,
          });
        }
      });
    }
  };

  const onhandleAccountDetails = () => { };
  return (
    <div className="additional-details-container">
      <Spin spinning={onbord.loading}>
        <div className="additional-details-text">
          <div className="add-heading">
            <svg
              width="40"
              height="14"
              viewBox="0 0 40 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={backArrowClick}
              id="header-back-icon"
              cursor="pointer"
            >
              <path
                d="M7 14L8.41 12.59L3.83 8H20V6L3.83 6L8.42 1.41L7 0L0 7L7 14Z"
                fill="#848989"
              />
            </svg>

            <h4 className="add-heading-text" style={{ marginTop: "4px" }}>
              Additional Details
            </h4>
          </div>
          <Divider />
        </div>
        <Row>
          <Col xs={0} sm={0} md={4} lg={4} xl={6}></Col>
          <Col xs={24} sm={24} md={16} lg={16} xl={12}>
            <div className="stepsCustomClass">
              <Steps current={1}>
                <Step title="Manufacturers Details" className="rightmark" />
                <Step title="Additional Details" />
              </Steps>
            </div>
          </Col>
          <Col xs={0} sm={0} md={0} lg={0} xl={6}></Col>
        </Row>
        <div className=" additional-bank onboardForm">
          <Form
            layout="vertical"
            form={form}
            name="dynamic_form_nest_item"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.List name="bank_ac">
              {(fields, { add, remove }) => (
                <>
                  <Row>
                    <Col xs={24} sm={24} md={1} lg={1} xl={1}></Col>
                    <Col xs={24} sm={24} md={22} lg={22} xl={22}>
                      <div className="additional-details-info">
                        <Row>
                          <Col xs={24} sm={12} md={7} lg={5} xl={5}>
                            <h4 className="details-heading">Account Details</h4>
                          </Col>
                          <Col
                            xs={24}
                            sm={12}
                            md={17}
                            lg={19}
                            xl={19}
                            className="additional-add-delete-buttons man-additional-add"
                          >
                            <Form.Item>
                              <Button
                                type="primary"
                                className="add-btn height-addional"
                                onClick={() => {
                                  if(fields.length > 1){
                                    message.error("Limit Exceeded")
                                  }else{
                                    add()
                                  }
                                }}
                                icon={
                                  <PlusCircleOutlined className="add-plusicon" />
                                }
                              >
                                Add
                              </Button>
                            </Form.Item>
                          </Col>
                        </Row>
                        <Divider />
                      </div>
                    </Col>
                    <Col xs={24} sm={24} md={1} lg={1} xl={1}></Col>
                  </Row>
                  {fields.map((field) => (
                    <Space key={field.key} align="baseline">
                      <Row>
                        <Col xs={24} sm={24} md={1} lg={1} xl={1}></Col>
                        <Col
                          xs={24}
                          sm={24}
                          md={10}
                          lg={10}
                          xl={10}
                          className="onboardCol"
                        >
                          <Form.Item
                            label="Bank account number"
                            onKeyPress={(event) => {
                              if (checkNumbervalue(event)) {
                                event.preventDefault();
                              }
                            }}
                            name={[field.name, "accountNumber"]}
                            rules={[
                              {
                                // required: true,
                                message: "Enter Bank account number!",
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={1} lg={1} xl={1}></Col>
                        <Col
                          xs={24}
                          sm={24}
                          md={10}
                          lg={10}
                          xl={10}
                          className="onboardCol"
                        >
                          <Form.Item
                            {...field}
                            label="IFSC code"
                            onKeyPress={(event) => {
                              if (checkSpecialCharacter(event)) {
                                event.preventDefault();
                              }
                            }}
                            name={[field.name, "ifscCode"]}
                            requiredMark="optional"
                            rules={[
                              {
                                required: true,
                                message: "Enter Ifsc code!",
                              },
                            ]}
                          >
                            <Input
                              maxLength={12}
                              onChange={(event) => {
                                setIfscData(event.target.value);
                              }}
                              onInput={e => e.target.value = e.target.value.toUpperCase()}
                            />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row>
                        <Col xs={24} sm={24} md={1} lg={1} xl={1}></Col>
                        <Col
                          xs={24}
                          sm={24}
                          md={10}
                          lg={10}
                          xl={10}
                          className="onboardCol"
                        >
                          <Form.Item
                            {...field}
                            label="Branch name"
                            name={[field.name, "branchName"]}
                            requiredMark="optional"
                            rules={[
                              {
                                required: true,
                                message: "Enter branch name!",
                              },
                            ]}
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={1} lg={1} xl={1}></Col>
                        <Col
                          xs={24}
                          sm={24}
                          md={10}
                          lg={10}
                          xl={10}
                          className="onboardCol"
                        >
                          <Form.Item
                            requiredMark={"optional"}
                            label="Bank name"
                            name="bankName"
                            rules={[
                              {
                                required: true,
                                message: "Enter bank name!",
                              },
                              { whitespace: true },
                              {
                                min: 2,
                                message:
                                  "Bank name must be atleast 2 characters",
                              },
                              {
                                max: 35,
                                message:
                                  "Bank name cannot be longer than 35 characters",
                              },
                            ]}
                          >
                            <Input type="text" />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs={24} sm={24} md={1} lg={1} xl={1}></Col>
                        <Col xs={24} sm={24} md={22} lg={22} xl={22}>
                          <Form.Item>
                            <Button
                              type="primary"
                              onClick={() => remove(field.name)}
                              icon={<MinusCircleOutlined />}
                              className="height-addional"
                            >
                              Delete
                            </Button>
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={1} lg={1} xl={1}></Col>
                      </Row>

                      <Row>
                        <Col xs={24} sm={24} md={1} lg={1} xl={1}></Col>
                        <Col
                          xs={24}
                          sm={24}
                          md={22}
                          lg={22}
                          xl={22}
                          className="additional-delete-divider"
                        >
                          {" "}
                          <Divider />
                        </Col>
                        <Col xs={24} sm={24} md={1} lg={1} xl={1}></Col>
                      </Row>
                    </Space>
                  ))}
                </>
              )}
            </Form.List>

            <Row>
              <Col xs={24} sm={24} md={1} lg={1} xl={1}></Col>
              <Col
                xs={24}
                sm={24}
                md={10}
                lg={10}
                xl={10}
                className="onboardCol"
              >
                <Form.Item
                  // {...field}
                  label="Bank account number"
                  onKeyPress={(event) => {
                    if (checkNumbervalue(event)) {
                      event.preventDefault();
                    }
                  }}
                  name="accountNumber"
                  rules={[
                    {
                      required: true,
                      message: "Enter bank account number!",
                    },
                    {
                      max: 20,
                      message: "Cannot enter more than 20 digits",
                    },
                    {
                      min: 11,
                      message: "Enter minimum 11 digits",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={1} lg={1} xl={1}></Col>
              <Col
                xs={24}
                sm={24}
                md={10}
                lg={10}
                xl={10}
                className="onboardCol"
              >
                <Form.Item
                  label="IFSC code"
                  onKeyPress={(event) => {
                    if (checkSpecialCharacter(event)) {
                      event.preventDefault();
                    }
                  }}
                  name="ifscCode"
                  rules={[
                    {
                      required: true,
                      message: "Enter Ifsc code!",
                    },
                    {
                      pattern: "^[A-Za-z]{4}0[A-Z0-9a-z]{6}$",
                      message: "Invalid IFCS code",
                    },
                    {
                      max: 12,
                      message: "Value should be less than 12 character",
                    },
                  ]}
                >
                  <Input
                    maxLength={12}
                    onChange={(event) => {
                      setIfscData(event.target.value);
                    }}
                    onInput={e => e.target.value = e.target.value.toUpperCase()}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col xs={24} sm={24} md={1} lg={1} xl={1}></Col>
              <Col
                xs={24}
                sm={24}
                md={10}
                lg={10}
                xl={10}
                className="onboardCol"
              >
                <Form.Item
                  label="Branch name"
                  name="branchName"
                  rules={[
                    {
                      required: true,
                      message: "Enter branch name!",
                    },
                    { whitespace: true },
                    { min: 2 },
                    { max: 30 },
                  ]}
                >
                  <Input disabled={true} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={1} lg={1} xl={1}></Col>
              <Col
                xs={24}
                sm={24}
                md={10}
                lg={10}
                xl={10}
                className="onboardCol"
              >
                <Form.Item
                  label="Bank name"
                  name="bankName"
                  rules={[
                    {
                      required: true,
                      message: "Enter bank name!",
                    },
                    { whitespace: true },
                    {
                      min: 2,
                      message: "Bank name must be atleast 2 characters",
                    },
                    {
                      max: 35,
                      message: "Bank name cannot be longer than 35 characters",
                    },
                  ]}
                >
                  <Input disabled={true} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={1} lg={1} xl={1}></Col>
              <Col xs={24} sm={24} md={22} lg={22} xl={22}>
                {" "}
                <Divider />
              </Col>
              <Col xs={24} sm={24} md={1} lg={1} xl={1}></Col>
            </Row>

            <div className="cin-divider">
              <Row>
                <Col xs={24} sm={24} md={1} lg={1} xl={1}></Col>
                <Col
                  xs={24}
                  sm={24}
                  md={10}
                  lg={10}
                  xl={10}
                  className="onboardCol"
                >
                  <Form.Item
                    name="gstNumber"
                    label="GST number"
                    onKeyPress={(event) => {
                      if (checkSpecialCharacter(event)) {
                        event.preventDefault();
                      }
                    }}
                    onChange={onhandleAccountDetails}
                    rules={[
                      { required: true, message: "Enter gst number" },
                      {
                        max: 15,
                        min: 15,
                        pattern:
                          /\d{2}[A-Za-z]{5}\d{4}[A-Za-z]{1}[A-Za-z\d]{1}[Zz]{1}[A-Za-z\d]{1}/,
                        message: "Enter a valid GST Number",
                      },
                    ]}
                  >
                    <Input onInput={e => e.target.value = e.target.value.toUpperCase()} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={1} lg={1} xl={1}></Col>
                <Col
                  xs={24}
                  sm={24}
                  md={10}
                  lg={10}
                  xl={10}
                  className="onboardCol"
                >
                  <Form.Item
                    label="CIN number"
                    name="cinNumber"
                    onKeyPress={(event) => {
                      if (checkSpecialCharacter(event)) {
                        event.preventDefault();
                      }
                    }}
                    onChange={onhandleAccountDetails}
                    rules={[
                      { required: true, message: "Enter CIN number!" },
                      {
                        max: 21,
                        min: 21,
                        // pattern: /\([L|U]{1})([0-9]{5})([A-Za-z]{2})([0-9]{4})([A-Za-z]{3})([0-9]{6})$,
                        message: "Please enter a valid CIN Number",
                      },
                    ]}
                  >
                    <Input onInput={e => e.target.value = e.target.value.toUpperCase()} />
                  </Form.Item>
                </Col>
                <Col
                  xs={24}
                  sm={24}
                  md={5}
                  lg={5}
                  xl={5}
                  className="onboardCol"
                ></Col>
              </Row>
              <Row>
                <Col xs={24} sm={24} md={1} lg={1} xl={1}></Col>
                <Col xs={24} sm={24} md={22} lg={22} xl={22}>
                  {" "}
                  <Divider />
                </Col>
                <Col xs={24} sm={24} md={1} lg={1} xl={1}></Col>
              </Row>
            </div>
            <Row>
              <Col xs={24} sm={24} md={1} lg={1} xl={1}></Col>
              <Col
                xs={24}
                sm={24}
                md={22}
                lg={22}
                xl={22}
                className="additional-sumbmit"
              >
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    SUBMIT
                  </Button>
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={1} lg={1} xl={1}></Col>
            </Row>
          </Form>
        </div>
      </Spin>
    </div>
  );
}

export default OnboardManufacturerTab;
