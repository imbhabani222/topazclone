import * as React from "react";
import {
  Steps,
  Row,
  Col,
  Form,
  Input,
  Button,
  Select,
  Upload,
  message,
  Divider,
  Modal
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./onboard_manufactures.css";
import { CaretDownOutlined, PlusOutlined } from "@ant-design/icons";
import downArrow from "../../assets/img/downArrow.svg";
import { checkNumbervalue, checkSpace, checkAlphabets, checkAlphabetsNumbersAmpersand, validateEmail } from "./index";
import { useNavigate } from "react-router-dom";
import OnboardManufacturerTab from "./AdditionalDetailsForm";
import axios from "axios";
import { APIs } from "../../worker";
import { setFormData } from "../../action/useraction";

const { Step } = Steps;
const { Option } = Select;

const prefixSelector = (
  <Form.Item name="prefix" noStyle>
    <Select
      suffixIcon={<CaretDownOutlined />}
      defaultValue="91"
      style={{
        width: 60,
      }}
    >
      <Option value="91">+91</Option>
      <Option value="87">+87</Option>
    </Select>
  </Form.Item>
);

function OnboardManufactures() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const userlogin = useSelector((state) => state.userlogin);
  const prevFormData = useSelector((state) => state.formData.data);
  const userInfo = JSON.parse(localStorage.getItem("userinfo"))

  let { userinfo } = userlogin;
  const [isCountry, setIsCountry] = useState(false);
  const [stepTwo, setStepTwo] = useState(false);
  const [userRoles, setUserRoles] = useState([]);
  const [industryType, setIndustryType] = useState([]);
  const [states, setStates] = useState([]);
  const [country, setCountry] = useState([]);
  const [dataform, setDataform] = useState({});
  const [image, setImage] = useState({
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    fileList: [],
  });
  const [image2, setImage2] = useState(null);
  const [showImage, setShowImage] = useState("")
  const [previewOffer, setPreviewOffer] = useState({ image: "" })

  let { admin } = userinfo;

  useEffect(() => {
    if (userinfo && userinfo.admin) {
      getState();
      getCountry();
      getIndustryType();
      getUserRoles();
    } else {
      navigate("/login");
    }
  }, []);

  const getState = async () => {
    let res = await axios.get(`${APIs.baseURL}/manufacturer-service/v1/manufacturer/states`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userInfo.token}`,
      }
    }
    );
    let temp = [];
    res.data.map((e) =>
      temp.push({
        option: e.stateName,
        value: e.stateId,
      })
    );
    setStates(temp);
  };
  const getIndustryType = async () => {
    let res = await axios.get(`${APIs.baseURL}/manufacturer-service/v1/manufacturer/industryType`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userInfo.token}`,
      }
    }
    );
    let temp = [];
    res.data.map((e) =>
      temp.push({
        option: e.industryType,
        value: e.industryId,
      })
    );
    setIndustryType(temp);
  };
  const getUserRoles = async () => {
    let res = await axios.get(`${APIs.baseURL}/user-service/v1/role`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userInfo.token}`,
      }
    }
    );
    let temp = [];
    res.data.map((e) =>
      temp.push({
        option: e.userType,
        value: e.roleid,
      })
    );
    setUserRoles(temp);
  };
  const getCountry = async () => {
    let res = await axios.get(`${APIs.baseURL}/manufacturer-service/v1/manufacturer/countries`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userInfo.token}`,
      }
    }
    );
    let temp = [];
    res.data.map((e) =>
      temp.push({
        option: e.countryName,
        value: e.countryName,
      })
    );
    setCountry(temp);
  };
  useEffect(() => {
    if (!userinfo) {
      navigate("/login");
    }
  }, [navigate, userinfo]);

  useEffect(() => {
    if (userinfo.admin === false) {
      navigate("/login");
    }
  }, [navigate, userinfo]);

  const { previewVisible, previewImage, fileList, previewTitle } = image;

  const onFinish = async (values) => {
    if (!fileList.length) {
      return message.error("Please Upload Logo")
    }
    const data = {
      ...values,
      image: image,
    };
    // form.resetFields();
    await dispatch(setFormData(data, image2));
    setStepTwo(true);
  };

  const onFinishFailed = (errorInfo) => {
    message.error(errorInfo)
  };

  const backArrowClick = () => {
    setStepTwo(false);
  };

  const handleChangePreview = async (file) => {
    let src = file.url
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(file.originFileObj)
        reader.onload = () => resolve(reader.result)
      })
    }
    setShowImage(src)
  }

  const onGalleryFileRemove = (file, index) => {
    const { confirm } = Modal
    return new Promise((resolve, reject) => {
      confirm({
        title: "Are you sure you want to Delete ?",
        onOk: () => {
          resolve(true)
          setImage2(null)
          setPreviewOffer({ image: "" })
        },

        onCancel: () => {
          reject(true)
        },
      })
    })
  }

  const handleChange = async ({ fileList, file }) => {
    console.log("hello---------", file, fileList)
    setPreviewOffer({ ...previewOffer })
    if (file.size < 800000) {
      if (!file.url && !file.preview) {
        setImage2(file);
        setImage({ fileList });
      }
    }
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";

    if (!isJpgOrPng) {
      setImage2(null);
      setImage({
        previewVisible: false,
        previewImage: "",
        previewTitle: "",
        fileList: [],
      });
      message.error("Not able to upload JPEG & PNG format image whos size is less than 800kb");
    }

    if (file.size > 800000) {
      setImage2(null);
      setImage({
        previewVisible: false,
        previewImage: "",
        previewTitle: "",
        fileList: [],
      });

      return message.error("Image must smaller than 800kb!");
    }
  };
  const setZipData = (zip) => {
    try {
      if (zip.length > 5) {
        axios.get(`https://api.postalpincode.in/pincode/${zip}`).then((res) => {
          if (res?.data[0]?.Status !== "Error") {
            res?.data[0]?.PostOffice?.map((data) =>
              form.setFieldsValue({
                state: data?.State,
                city: data?.District,
                country: data?.Country,
              })
            );
          } else message.error("Please add a valid zipcode");
        });
      }
    } catch (err) {
      message.error(err.response.data.message);
    }
  };

  return (
    <div className="onbord_pannel1">
      {stepTwo ? (
        <OnboardManufacturerTab backArrowClick={() => backArrowClick()} />
      ) : (
        <div className="onbordTitle">
          <h3>Manufactures Details</h3>
          <Divider className="divider-onboard-header" />
          <Row>
            <Col xs={0} sm={0} md={4} lg={4} xl={6}></Col>
            <Col xs={24} sm={24} md={16} lg={16} xl={12}>
              <div className="stepsCustomClass">
                <Steps current={0}>
                  <Step title="Manufacturers Details" size="default" />
                  <Step title="Additional Details" />
                </Steps>
              </div>
            </Col>
            <Col xs={0} sm={0} md={0} lg={0} xl={6}></Col>
          </Row>

          <Row>
            <div className="onboard-con">
              <div className="onboardForm">
                <Form
                  form={form}
                  name="basic"
                  initialValues={prevFormData}
                  data={dataform}
                  layout="vertical"
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                >
                  <Row>
                    <Col
                      xs={24}
                      sm={24}
                      md={7}
                      lg={7}
                      xl={7}
                      className="onboardCol"
                    >
                      <Form.Item
                        label="Manufacturer name"
                        name="manufacturerName"
                        onKeyPress={(event) => {
                          if (checkAlphabetsNumbersAmpersand(event)) {
                            event.preventDefault();
                          }
                        }}
                        rules={[
                          {
                            required: true,
                            message: "Enter Manufacturer name",
                          },
                          { whitespace: true },
                          {
                            min: 2,
                            message:
                              "Manufacturer name must be at least 2 characters",
                          },
                          {
                            max: 30,
                            message:
                              "Manufacturer name must be within 30 characters",
                          },
                        ]}
                      >
                        <Input
                          // schema={{ default: "", presence: true }}
                          placeholder="Enter manufacturer name"
                        />
                      </Form.Item>
                    </Col>
                    <Col
                      xs={24}
                      sm={24}
                      md={7}
                      lg={7}
                      xl={7}
                      className="onboardCol"
                    >
                      <Form.Item
                        name="industryType"
                        label="Industry type"
                        rules={[
                          {
                            required: true,
                            message: "Select industry type",
                          },
                        ]}
                      >
                        <Select
                          suffixIcon={<img src={downArrow} alt="downArrow" />}
                          placeholder="Please select Industry"
                        >
                          {industryType.map((e) => {
                            return <Option value={e.option}>{e.option}</Option>;
                          })}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col
                      xs={24}
                      sm={24}
                      md={7}
                      lg={7}
                      xl={7}
                      className="onboardCol"
                    >
                      <Form.Item
                        label="Address line"
                        name="addressLine"
                        rules={[
                          {
                            required: true,
                            message: "Enter your address",
                          },
                          { whitespace: true },

                          {
                            min: 5,
                            message:
                              "Address line must be at least 5 characters",
                          },
                          {
                            max: 50,
                            message:
                              "Address line must be within 50 characters",
                          },
                        ]}
                      >
                        <Input placeholder="Enter your address" />
                      </Form.Item>
                    </Col>
                    <Col
                      xs={24}
                      sm={24}
                      md={7}
                      lg={7}
                      xl={7}
                      className="onboardCol"
                    >
                      <Form.Item
                        name="zipcode"
                        label="Zip code"
                        onKeyPress={(event) => {
                          if (checkNumbervalue(event)) {
                            event.preventDefault();
                          }
                        }}
                        rules={[
                          {
                            required: true,
                            message: "Enter zip code",
                          },
                          {
                            max: 6,
                            message: "Please enter only 6 digits",
                          },
                          {
                            min: 6,
                            message: "Please enter 6 digits",
                          },
                        ]}
                      >
                        <Input
                          maxLength={6}
                          placeholder="Enter zip code"
                          onChange={(event) => {
                            setZipData(event.target.value);
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col
                      xs={24}
                      sm={24}
                      md={7}
                      lg={7}
                      xl={7}
                      className="onboardCol"
                    >
                      <Form.Item
                        name="state"
                        label="State"
                        rules={[
                          {
                            required: true,
                            message: "Please enter the state",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Enter State"
                          disabled={true}
                        ></Input>
                      </Form.Item>
                    </Col>
                    <Col
                      xs={24}
                      sm={24}
                      md={7}
                      lg={7}
                      xl={7}
                      className="onboardCol"
                    >
                      <Form.Item
                        name="city"
                        label="City"
                        rules={[
                          {
                            required: true,
                            message: "Please enter the city",
                          },
                        ]}
                      >
                        <Input placeholder="Enter City" disabled={true}></Input>
                      </Form.Item>
                    </Col>

                    <Col
                      xs={24}
                      sm={24}
                      md={7}
                      lg={7}
                      xl={7}
                      className="onboardCol"
                    >
                      <Form.Item
                        label="Country"
                        name="country"
                        rules={[
                          {
                            required: true,
                            message: "Please enter the city",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Enter Country"
                          disabled={true}
                        ></Input>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Divider className="dividers" />

                  <Row>
                    <Col
                      xs={24}
                      sm={24}
                      md={7}
                      lg={7}
                      xl={7}
                      className="onboardCol"
                    >
                      <Form.Item
                        label="Contact person"
                        name="userName"
                        onKeyPress={(event) => {
                          if (checkAlphabets(event)) {
                            event.preventDefault();
                          }
                        }}
                        rules={[
                          {
                            required: true,
                            message: "Enter Contact person",
                          },
                          { whitespace: true },

                          {
                            min: 2,
                            message:
                              "Contact person must be at least 2 characters",
                          },
                          {
                            max: 30,
                            message:
                              "Contact person must be within 30 characters",
                          },
                        ]}
                      >
                        <Input placeholder="Enter Contact person name" />
                      </Form.Item>
                    </Col>
                    <Col
                      xs={24}
                      sm={24}
                      md={7}
                      lg={7}
                      xl={7}
                      className="onboardCol"
                    >
                      <Form.Item
                        name="role"
                        label="User role"
                        rules={[
                          {
                            required: true,
                            message: "Select your user role",
                          },
                        ]}
                      >
                        <Select
                          suffixIcon={<img src={downArrow} alt="downArrow" />}
                          placeholder="Please select a User role"
                        >
                          {userRoles.map((e) => {
                            return (
                              <Option value={e.value}>
                                {e.option.charAt(0).toUpperCase() +
                                  e.option.slice(1)}
                              </Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col
                      xs={24}
                      sm={24}
                      md={7}
                      lg={7}
                      xl={7}
                      className={
                        isCountry ? "onboardCol  country-code" : "onboardCol"
                      }
                    >
                      <Form.Item
                        type="tel"
                        name="phoneNumber"
                        label="Phone number"
                        onKeyPress={(event) => {
                          if (checkNumbervalue(event)) {
                            event.preventDefault();
                          }
                        }}
                        rules={[
                          {
                            max: 10,
                            min: 10,
                            message: "Please enter 10 digits",
                          },
                          {
                            required: true,
                            message: "Enter phone number",
                          },
                        ]}
                      >
                        <Input
                          addonBefore={prefixSelector}
                          style={{
                            width: "100%",
                          }}
                          placeholder="Enter Phone number"
                        />
                      </Form.Item>
                    </Col>
                    <Col
                      xs={24}
                      sm={24}
                      md={7}
                      lg={7}
                      xl={7}
                      className="onboardCol"
                    >
                      <Form.Item
                        name="email"
                        label="Email ID"
                        onKeyPress={(event) => {
                          if (validateEmail(event)) {
                            event.preventDefault();
                          }
                        }}
                        rules={[
                          {
                            type: "email",
                            message: "The input is not valid E-mail!",
                          },
                          {
                            required: true,
                            message: "Enter your e-mail",
                          },
                        ]}
                      >
                        <Input placeholder="Enter Email address" />
                      </Form.Item>
                    </Col>
                    <Col
                      xs={24}
                      sm={24}
                      md={7}
                      lg={7}
                      xl={7}
                      className="onboardManufacturer"
                    >
                      {" "}
                      <div className="uploadk">
                        <Form.Item
                          label="Upload logo"
                          rules={[
                            {
                              required: true,
                              message: "Please upload the logo !",
                            },
                          ]}
                          name="upload"
                        >
                          <Upload
                            listType="picture-card"
                            maxCount={1}
                            fileList={fileList}
                            onChange={handleChange}
                            accept=".jpg, .jpeg, .png"
                            onPreview={handleChangePreview}
                            onRemove={onGalleryFileRemove}
                          >
                            {fileList.length < 1 && (
                              <>
                                <Button icon={<PlusOutlined />}> Upload</Button>
                                <div>
                                  <p className="ant-upload-text">
                                    Click or Drag & drop an image file to
                                    upload. Only PNG or JPEG files with size up
                                    to 800KB is accepted
                                  </p>
                                </div>
                              </>
                            )}
                          </Upload>
                        </Form.Item>
                        <Modal visible={showImage.length} footer={false} onCancel={() => setShowImage("")}>
                          <img src={showImage} style={{ width: '100%' }} />
                        </Modal>
                      </div>
                    </Col>
                  </Row>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Divider className="divider" />
                  </Col>
                  <Form.Item className="onboard-save-and-continue">
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        style={{
                          marginTop: "10px",
                          borderRadius: "5px",
                          fontSize: "15px",
                          fontWeight: "700",
                          height: "40px",
                          width: "166px",
                        }}
                        className="save_button"
                      >
                        SAVE & CONTINUE
                      </Button>
                    </Col>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </Row>
        </div>
      )}
    </div>
  );
}
export default OnboardManufactures;
