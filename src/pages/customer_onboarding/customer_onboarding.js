import React, { useState, useEffect } from "react"
import { Row, Col, Form, Input, Button, Divider, message, Spin } from "antd"
import "./customer_onboarding.css"
import axios from "axios"
import { APIs } from "../../worker"
import { useNavigate } from "react-router-dom"
import {
  checkAlphabets,
  checkForSetOfStrings,
  checkNumbervalue,
  checkSpecialCharacter,
  checknumcharCharacter,
} from "../onboard_manufactures/index"
import {
  MinusCircleOutlined,
  PlusCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons"

const CustomerOnboarding = () => {
  const [form] = Form.useForm()
  let navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [states, setStates] = useState([])
  const [country, setCountry] = useState([])
  const [priPhoneNum, setPriPhoneNum] = useState("")
  const [bankDetails, setBankDetails] = useState(false)
  const userInfo = JSON.parse(localStorage.getItem("userinfo"))

  useEffect(() => {
    if (!bankDetails) {
      form.setFieldsValue({
        accountNumber: "",
        ifscCode: "",
        branchName: "",
        upiNumber: "",
        bankName: "",
      })
    }
  }, [bankDetails])

  useEffect(() => {
    getState()
    getCountry()
  }, [])

  const getState = async () => {
    let res = await axios.get(`${APIs.baseURL}/manufacturer-service/v1/manufacturer/states`,{
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userInfo.token}`,
      }
    }
    )
    let temp = []
    res.data.map((e) =>
      temp.push({
        option: e.stateName,
        value: e.stateId,
      })
    )
    setStates(temp)
  }

  const getCountry = async () => {
    let res = await axios.get(`${APIs.baseURL}/manufacturer-service/v1/manufacturer/countries`,{
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userInfo.token}`,
      }
    }
    )
    let temp = []
    res.data.map((e) =>
      temp.push({
        option: e.countryName,
        value: e.countryName,
      })
    )
    setCountry(temp)
  }

  const onFinish = async (value) => {
    setLoading(true)
    let data = {
      customerName: value.customerName,
      primaryPhonenumber: value.primaryPhonenumber,
      secondaryPhonenumber: value.secondaryPhonenumber,
      email: value.email,
      addressLine: value.addressLine,
      city: value.city,
      state: {
        stateName: value.state,
      },
      country: {
        countryName: value.country,
      },
      zipcode: value.zipcode,
      accountdetails: {
        accountNumber: value.accountNumber,
        ifscCode: value.ifscCode,
        branchName: value.branchName,
        upiNumber: value.upiNumber,
        bankName: value.bankName,
      },
    }
// {"customerName":"Ramkumar","primaryPhonenumber":"9861234567","email":"kumar@gmail.com","addressLine":"123,gandhinagar","city":"Allahabad","state":{"stateName":"Uttar Pradesh"},"country":{"countryName":"India"},"zipcode":"211001","accountdetails":{}}
    try {
      const userInfo = JSON.parse(localStorage.getItem("userinfo"))
      let config = {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userInfo.token}`,
          "MNF-CODE": `${userInfo.manufacturerCode}`,
        }
      }
      await axios.post(`${APIs.baseURL}/customer-service/v1/customer`, data, config)
      message.success("Customer Onboarding Initiated")
      navigate("/viewcustomers")
      setLoading(false)
    } catch (err) {
      message.error(err.response.data.message)
      setLoading(false)
    }
    // dispatch(customerOnboarding(data))
  }

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo)
  }

  const setZipData = (zip) => {
    if (zip.length > 5) {
      axios.get(`https://api.postalpincode.in/pincode/${zip}`).then((res) => {
        res?.data[0]?.PostOffice?.map((data) =>
          form.setFieldsValue({
            city: data?.District,
            state: data?.State,
            country: data?.Country,
          })
        )
        if(res.data[0].Status === "Error" ){
          message.error("Please Enter Valid Zip Code")
        }
        console.log(res)
      })
    }
  }
  const setIfscData = (ifsc) => {
    if (ifsc.length > 10) {
      axios.get(`https://ifsc.razorpay.com/${ifsc}`).then((res) => {
        console.log("hiiiiii", res?.data)
        const { BRANCH: branchName, BANK: bankName } = res?.data
        form.setFieldsValue({
          branchName,
          bankName,
        })
      })
    }
  }
  return (
    <>
      <div className={loading?"onbord_pannel onsubmit_loader_container":"onbord_pannel"}>
        <div className="onbordTitle">
          <div className="onboardForm"> 
            <Form
              form={form}
              name="basic"
              initialValues={{
                remember: true,
              }}
              layout="vertical"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Row>
                <h3 className="account-info">Customer Onboarding</h3>
                <Divider
                  className="acc-divider"
                  style={{ marginTop: "29px" }}
                />
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <Row>
                    <Col xs={24} sm={4} md={4} lg={4} xl={4}></Col>
                    {/*<Col xs={24} sm={18} md={18} lg={12} xl={12}> */}
                    <Row>
                      <Col xs={24} sm={4} md={4} lg={4} xl={4}></Col>
                      <Col
                        xs={24}
                        sm={24}
                        md={8}
                        lg={8}
                        xl={8}
                        className="onboardCol"
                      >
                        <Form.Item
                          label="Customer Name"
                          name="customerName"
                          onKeyPress={(event) => {
                            if (checkAlphabets(event)) {
                              event.preventDefault()
                            }
                          }}
                          rules={[
                            {
                              required: true,
                              message: "Enter Customer name!",
                            },
                            { whitespace: true },
                            { min: 2 },
                            { max: 30 },
                          ]}
                        >
                          <Input placeholder="Enter Customer name" />
                        </Form.Item>
                      </Col>
                      <Col
                        xs={24}
                        sm={24}
                        md={8}
                        lg={8}
                        xl={8}
                        className="onboardCol"
                      >
                        <Form.Item
                          label="Primary Phone Number"
                          name="primaryPhonenumber"
                          onChange={(e) => setPriPhoneNum(e.target.value)}
                          onKeyPress={(event) => {
                            if (checkNumbervalue(event)) {
                              event.preventDefault()
                            }
                          }}
                          rules={[
                            {
                              required: true,
                              message: "Enter phone number!",
                            },
                            {
                              max: 10,
                              min: 10,
                              message: "Please enter only 10 digits",
                            },
                          ]}
                        >
                          <Input placeholder="Enter phone number" />
                        </Form.Item>
                      </Col>

                      <Col xs={24} sm={4} md={4} lg={4} xl={4}></Col>
                      <Col
                        xs={24}
                        sm={24}
                        md={8}
                        lg={8}
                        xl={8}
                        className="onboardCol"
                      >
                        <Form.Item
                          label="Secondary Phone Number"
                          name="secondaryPhonenumber"
                          onKeyPress={(event) => {
                            if (checkNumbervalue(event)) {
                              event.preventDefault()
                            }
                          }}
                          rules={[
                            {
                              max: 10,
                              min: 10,
                              message: "Please enter only 10 digits",
                            },
                            {
                              validator: (_, value) => {
                                if (!value || value !== priPhoneNum) {
                                  return Promise.resolve()
                                }
                                console.log(value)
                                return Promise.reject(
                                  "Primary Phone number and Secondary phone number should not be same"
                                )
                              },
                            },
                          ]}
                        >
                          <Input placeholder="Enter phone number " />
                        </Form.Item>
                      </Col>

                      <Col
                        xs={24}
                        sm={24}
                        md={8}
                        lg={8}
                        xl={8}
                        className="onboardCol"
                      >
                        <Form.Item
                          label="Email Address"
                          name="email"
                          rules={[
                            {
                              type: "email",
                              required: true,
                              message: "Enter your e-mail!",
                            },
                          ]}
                        >
                          <Input placeholder="Enter Email address" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={4} md={4} lg={4} xl={4}></Col>
                      <Col
                        xs={24}
                        sm={24}
                        md={8}
                        lg={8}
                        xl={8}
                        className="onboardCol"
                      >
                        <Form.Item
                          label="ZIP Code"
                          name="zipcode"
                          onKeyPress={(event) => {
                            if (checkNumbervalue(event)) {
                              event.preventDefault()
                            }
                          }}
                          rules={[
                            {
                              required: true,
                              message: "Enter zip code!",
                            },
                            {
                              max: 6,
                              message: "Please enter only 6 digits",
                            },
                            {
                              min: 6,
                              message: "please enter 6 digits",
                            },
                          ]}
                        >
                          <Input
                            placeholder="Enter Zip Code"
                            maxLength={6}
                            onChange={(event) => {
                              setZipData(event.target.value)
                            }}
                          />
                        </Form.Item>
                      </Col>

                      <Col
                        xs={24}
                        sm={24}
                        md={8}
                        lg={8}
                        xl={8}
                        className="onboardCol"
                      >
                        <Form.Item
                          label="City"
                          name="city"
                          rules={[
                            {
                              required: true,
                              message: "Enter Valid ZIP Code !",
                            },
                          ]}
                        >
                          <Input placeholder="Enter City" disabled></Input>
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={4} md={4} lg={4} xl={4}></Col>
                      <Col
                        xs={24}
                        sm={24}
                        md={8}
                        lg={8}
                        xl={8}
                        className="onboardCol"
                      >
                        <Form.Item
                          label="State"
                          name="state"
                          rules={[
                            {
                              required: true,
                              message: "Enter Valid ZIP Code !",
                            },
                          ]}
                        >
                          <Input placeholder="Enter State" disabled></Input>
                        </Form.Item>
                      </Col>

                      <Col
                        xs={24}
                        sm={24}
                        md={8}
                        lg={8}
                        xl={8}
                        className="onboardCol"
                      >
                        <Form.Item
                          label="Country"
                          name="country"
                          rules={[
                            {
                              required: true,
                              message: "Enter Valid ZIP Code !",
                            },
                            { whitespace: true },
                            { min: 2 },
                            { max: 35 },
                          ]}
                        >
                          <Input placeholder="Enter Country" disabled></Input>
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={4} md={4} lg={4} xl={4}></Col>
                      <Col
                        xs={24}
                        sm={24}
                        md={8}
                        lg={8}
                        xl={8}
                        className="onboardCol"
                      >
                        <Form.Item
                          label="Address Line"
                          name="addressLine"
                          rules={[
                            {
                              required: true,
                              message: "Enter your address!",
                            },
                            { whitespace: true },
                            {
                              min: 2,
                              message:
                                "Address Line must be atleast 2 characters",
                            },
                            {
                              max: 50,
                              message:
                                "Address Line cannot be longer than 50 characters",
                            },
                          ]}
                        >
                          <Input placeholder="Enter address" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Row>
                </Col>
                <p className="account-info">
                  Account Informations{" "}
                  {!bankDetails ? (
                    <PlusCircleOutlined
                      onClick={() => {
                        setBankDetails(true)
                      }}
                    />
                  ) : (
                    <MinusCircleOutlined
                      onClick={() => {
                        setBankDetails(false)
                        // form.resetFields();
                      }}
                    />
                  )}
                </p>
                {bankDetails ? (
                  <>
                    <Divider className="acc-divider" />

                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <Row>
                        <Col xs={24} sm={4} md={4} lg={4} xl={4}></Col>
                        <Col
                          xs={24}
                          sm={24}
                          md={8}
                          lg={8}
                          xl={8}
                          className="onboardCol"
                        >
                          <Form.Item
                            label="Bank Account Number"
                            name="accountNumber"
                            onKeyPress={(event) => {
                              if (checkNumbervalue(event)) {
                                event.preventDefault()
                              }
                            }}
                            rules={[
                              {
                                max: 20,
                                message: "Cannot enter more than 20 digits",
                              },
                            ]}
                          >
                            <Input placeholder="Enter Account Number" />
                          </Form.Item>
                        </Col>

                        <Col
                          xs={24}
                          sm={24}
                          md={8}
                          lg={8}
                          xl={8}
                          className="onboardCol"
                        >
                          <Form.Item
                            label="IFSC Code"
                            name="ifscCode"
                            onKeyPress={(event) => {
                              if (checknumcharCharacter(event)) {
                                event.preventDefault()
                              }
                            }}
                            rules={[
                              {
                                pattern: "^[A-Za-z]{4}0[A-Z0-9a-z]{6}$",
                                message: "Invalid IFSC code",
                              },
                            ]}
                          >
                            <Input
                              placeholder="Enter IFSC Code"
                              maxLength={12}
                              onChange={(event) => {
                                setIfscData(event.target.value)
                              }}
                              onInput={e => e.target.value = e.target.value.toUpperCase()}
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={4} md={4} lg={4} xl={4}></Col>
                        <Col
                          xs={24}
                          sm={24}
                          md={8}
                          lg={8}
                          xl={8}
                          className="onboardCol"
                        >
                          <Form.Item
                            label="Branch Name"
                            name="branchName"
                            rules={[
                              { whitespace: true },
                              { min: 2 },
                              { max: 30 },
                            ]}
                          >
                            <Input placeholder="Enter Branch Name" />
                          </Form.Item>
                        </Col>

                        <Col
                          xs={24}
                          sm={24}
                          md={8}
                          lg={8}
                          xl={8}
                          className="onboardCol"
                        >
                          <Form.Item
                            label="UPI Number"
                            name="upiNumber"
                            rules={[
                              {
                                required: false,
                                message: "Enter your upi number!",
                              },
                            ]}
                          >
                            <Input placeholder="Enter UPI Number" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={4} md={4} lg={4} xl={4}></Col>
                        <Col
                          xs={24}
                          sm={24}
                          md={8}
                          lg={8}
                          xl={8}
                          className="onboardCol"
                        >
                          <Form.Item
                            label="Bank Name"
                            name="bankName"
                            rules={[
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
                            <Input placeholder="Enter Bank Name" />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                  </>
                ) : null}

                <Divider className="divider-customer" />
              </Row>

              <Row>
                <Col
                  xs={24}
                  sm={9}
                  md={17}
                  lg={19}
                  xl={24}
                  className="offer-BtnCol advertisement-cancel-button adv-btn"
                >
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="save_continue"
                  >
                    SUBMIT
                  </Button>
                  {loading && (
                    <Spin className="onsubmit_loader" />
                  )}
                </Col>
                <Col xs={24} sm={11} md={7} lg={5} xl={0}>
                  {""}
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </div>
    </>
  )
}

export default CustomerOnboarding
