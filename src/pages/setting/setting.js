import React, { useState, useEffect } from "react";
import { Divider, Tabs } from "antd";
import "./setting.css";
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
  InboxOutlined,
  Card,
  Switch,
  Modal,
} from "antd";
import { CloseSquareOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setting } from "../../action/useraction";
import themeimage from "../../assets/img/settingstheme.png";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
//import { checkNumbervalue } from "../../index";
import { format } from "date-and-time";
const { Option } = Select;
const { Meta } = Card;

function Setting() {
  let dispatch = useDispatch();
  const { TabPane } = Tabs;
  const profileDatas = useSelector((state) => state.profileInfo);
  console.log(profileDatas);

  function callback(key) {
    console.log(key);
  }

  const [termsConditions, setTermsConditions] = React.useState();
  const [privacyPolicy, setPrivacyPolicy] = React.useState();

  const checkNumbervalue = (event) => {
    if (!/^[0-9]*\.?[0-9]*$/.test(event.key) && event.key !== "Backspace") {
      return true;
    }
  };

  const onFinish = async (values) => {
    console.log("Success:", values);
    let data = {
      termsAndConditions: termsConditions,
      privacyPolicy: privacyPolicy,
      support: {
        problemdiscription: values.description,
        discription: values.details,
        contactdetails: values.supportCntact,
        emailaddress: values.emailSupport,
      },
      manufacturer: {
        manufacturerCode: profileDatas.profileReducerResponse.manufacturerCode,
      },
    };

    console.log(data);
    const imageWaterMark = new FormData();
    imageWaterMark.append("file", image.fileList[0].originFileObj);
    dispatch(setting(data, imageWaterMark));
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  // const normFile = ({ fileList }) => {
  //   setImage({ fileList });
  //   console.log("fileList", fileList);
  //   console.log("Upload event:", image);
  // };

  const [terms, setTerms] = React.useState(3000);
  const [policyCount, setPolicyCount] = React.useState(3000);
  const handleTerms = (event, editor) => {
    let data = editor.getData();
    setTermsConditions(data);
    var spdata = editor.getData().replace("<p>", "");
    var epdata = spdata.replace("</p>", "");
    var ssdata = epdata.replace("<strong>", "");
    var esdata = ssdata.replace("</strong>", "");
    esdata = esdata.replace("</h2>", "");
    esdata = esdata.replace("<h2>", "");
    esdata = esdata.replace("<h3>", "");
    esdata = esdata.replace("<h4>", "");
    esdata = esdata.replace("</h4>", "");
    esdata = esdata.replace("</h3>", "");
    esdata = esdata.replace("<i>", "");
    esdata = esdata.replace("</i>", "");
    setTerms(3000 - esdata.length);
  };

  const handlePrivacyPolicy = (event, editor) => {
    let data = editor.getData();
    setPrivacyPolicy(data);
    var spdata = editor.getData().replace("<p>", "");
    var epdata = spdata.replace("</p>", "");
    var ssdata = epdata.replace("<strong>", "");
    var esdata = ssdata.replace("</strong>", "");
    esdata = esdata.replace("</h2>", "");
    esdata = esdata.replace("<h2>", "");
    esdata = esdata.replace("<h3>", "");
    esdata = esdata.replace("<h4>", "");
    esdata = esdata.replace("</h4>", "");
    esdata = esdata.replace("</h3>", "");
    esdata = esdata.replace("<i>", "");
    esdata = esdata.replace("</i>", "");
    setPolicyCount(3000 - esdata.length);
  };

  // function getBase64(file) {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => resolve(reader.result);
  //     reader.onerror = (error) => reject(error);
  //   });
  // }

  const [image, setImage] = useState({
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    fileList: [],
  });
  // const [image2, setImage2] = useState(null);
  // console.log(image2);
  // const { previewVisible, previewImage, fileList, previewTitle } = image;
  // const handleCancel = () => setImage({ previewVisible: false });
  // // const handleChange = async ({ fileList, file }) => {
  // //   setImage({ fileList });
  // //   if (!file.url && !file.preview) {
  // //     const imageData = await getBase64(file.originFileObj);
  // //     setImage2(imageData);
  // //   }
  // //   console.log("image2", image2);
  // // };

  // const handlePreview = async (file) => {
  //   console.log("preview------", file)
  //   if (!file.url && !file.preview) {
  //     file.preview = await getBase64(file.originFileObj);
  //   }
  //   const setCurrentImage = {
  //     previewVisible: true,
  //     previewImage: file.url || file.preview,
  //     previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
  //     fileList: image.fileList
  //   }
  //   setImage(setCurrentImage)
  //   // setPreviewImage(file.url || file.preview);
  //   // setImage({ previewImage: file.url || file.preview })
  //   // setPreviewOpen(true);
  //   // setImage({ previewVisible: true })
  //   // setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  //   // setImage({ previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1) })
  // };
  // const handleChange = ({ fileList: newFileList }) => setImage({ fileList: newFileList });

  // const beforeUpload = (file) => {
  //   const isLt2M = file.size / 1024 < 800;
  //   const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  //   if (!isJpgOrPng) {
  //     message.error("You can only upload JPG/PNG file!");
  //     return Upload.LIST_IGNORE;
  //   }
  //   if (!isLt2M) {
  //     message.error("Image must be smaller than 800kb!");
  //     return Upload.LIST_IGNORE;
  //   }
  //   return isJpgOrPng && isLt2M;
  // };

  // // const handleChange = async ({ fileList, file }) => {
  // //   console.log(file);
  // //   if (file.size < 800000) {
  // //     if (!file.url && !file.preview) {
  // //       const imageData = await getBase64(file.originFileObj);
  // //       setImage2(imageData);
  // //       setImage({ fileList });
  // //     }
  // //     console.log("image2", image2);
  // //   }

  // //   const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  // //   console.log(file);
  // //   if (!isJpgOrPng) {
  // //     setImage2(null);
  // //     setImage({
  // //       previewVisible: false,
  // //       previewImage: "",
  // //       previewTitle: "",
  // //       fileList: [],
  // //     });

  // //     message.error("file format not supported!");
  // //   }

  // //   if (file.size > 800000) {
  // //     setImage2(null);
  // //     setImage({
  // //       previewVisible: false,
  // //       previewImage: "",
  // //       previewTitle: "",
  // //       fileList: [],
  // //     });

  // //     message.error("Image must smaller than 800kb!");
  // //   }
  // // };

  // const onGalleryFileRemove = (file, index) => {
  //   const { confirm } = Modal;
  //   return new Promise((resolve, reject) => {
  //     confirm({
  //       title: "Are you sure you want to Delete ?",
  //       onOk: () => {
  //         resolve(true);
  //         // if (file.status === "removed" || resolve(true))
  //         console.log(resolve);
  //         fileList.splice(index, 1);
  //         setImage2(null);
  //         setImage({
  //           previewVisible: false,
  //           previewImage: "",
  //           previewTitle: "",
  //           fileList: [],
  //         });
  //       },
  //       onCancel: () => {
  //         reject(true);
  //       },
  //     });
  //   });
  // };


  // const [fileList, setFileList] = useState([]);
  // const [image2, setImage2] = useState(null);
  // const [previewOffer, setPreviewOffer] = useState({ image: "" });
  // const [showPreview, setShowPreview] = useState(false)

  const [fileList, setFileList] = useState([]);
  const [image2, setImage2] = useState(null);
  const [previewOffer, setPreviewOffer] = useState({ image: "" });
  const [showPreview, setShowPreview] = useState(false)

  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      setImage2(null);
      message.error("Image must smaller than 2MB!");
    }

    return isJpgOrPng && isLt2M;
  };
  const handleChangeimg = async ({ fileList, file }) => {
    setPreviewOffer({ ...previewOffer });
    if (file.size < 800000) {
      if (!file.url && !file.preview) {
        const imageData = await getBase64(file.originFileObj);
        setImage2(imageData);
        setFileList(fileList);
      }
    }
  };
  // const handlePreviewimg = async (file) => {
  //   console.log("preview......")
  //   if (!file.url && !file.preview) {
  //     file.preview = await getBase64(file.originFileObj);
  //   }
  //   const obj = {
  //     previewOpen: true,
  //     previewImage: file.url || file.preview,
  //     previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
  //     fileList:fileList
  //   }
  //   setImage(obj)
  // };
  const onGalleryFileRemove = (file, index) => {
    const { confirm } = Modal;
    return new Promise((resolve, reject) => {
      confirm({
        title: "Are you sure you want to Delete ?",
        onOk: () => {
          resolve(true);
          setImage2(null);
          setPreviewOffer({ image: "" });
        },
        onCancel: () => {
          reject(true);
        },
      });
    });
  };

  const normFile = ({ fileList }) => {
    setFileList(fileList);
  };


  return (
    <div className="setting-tabs-container">
      <div className="settingsForm">
        <Form
          layout="vertical"
          name="basic"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Tabs defaultActiveKey="1" onChange={callback}>
            <TabPane tab="Add Watermark" key="1">
              <Col
                xs={26}
                sm={22}
                md={12}
                lg={8}
                xl={7}
                className="onboardCol settings-water-mark-image display-vertical"
              >
                {" "}
                <div className="uploadk uploadlogo">
                  <Form.Item label="Upload Watermark">
                    <Form.Item
                      name="logo"
                      getValueFromEvent={normFile}
                      className="upld_watermark"
                    // noStyle
                    //   rules={[
                    //     {message: "Please upload image!" },
                    //   ]}
                    >
                      <Upload
                        listType="picture-card"
                        maxCount={1}
                        fileList={fileList}
                        onPreview={() => setShowPreview(true)}
                        onChange={handleChangeimg}
                        beforeUpload={beforeUpload}
                        onRemove={onGalleryFileRemove}
                        accept=".jpg, .jpeg, .png"
                      >
                        {" "}
                        <Button icon={<PlusOutlined />} className="Uploadbtn"> Upload</Button>
                        <div>
                          <p className="ant-upload-text">
                            Click or Drag & drop an image file to upload. Only
                            PNG or JPEG files with size up to 800KB is accepted.
                          </p>
                        </div>
                      </Upload>
                      {/* {showPreview && <div className="show_profile_image">
                        <div>
                          <span class="close_profile_image" onClick={() => setShowPreview(false)}><CloseSquareOutlined /></span>
                          <img src={image2 !== undefined ? image2 : ""} />
                        </div>
                      </div>} */}
                      <Modal visible={showPreview} footer={null} onCancel={() => setShowPreview(false)}>
                        <img alt="Water Mark" style={{ width: '100%' }} src={image2} />
                      </Modal>
                    </Form.Item>
                  </Form.Item>
                </div>
              </Col>
              <Col xs={26} sm={22} md={12} lg={8} xl={7}>
                <Form.Item label="Alignment">
                  <Form.Item
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Please select alignment",
                      },
                    ]}
                    className="onboardCols"
                  >
                    <Select placeholder="Please select alignment">
                      <Option value="left">Left</Option>
                      <Option value="right">Right</Option>
                    </Select>
                  </Form.Item>
                </Form.Item>
              </Col>
              <hr className="settins-divider"></hr>
              { }
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xl={24}
                className="set-save-button"
              >
                <Button type="primary" className="set-save" htmlType="submit">
                  SAVE
                </Button>
              </Col>
            </TabPane>
            <TabPane tab="Theme" key="2">
              {/* <Card style={{backgroundColor:"blue"}}> */}
              <div className="theme-image_container">
                <div>
                  <img
                    alt="example"
                    src={themeimage}
                  />
                </div>
                <div className="theme-image_footer">
                  <p>White Theme</p>
                  <Button type="primary" className="set-save">
                    Apply
                  </Button>
                </div>
              </div>
              {/* </Card> */}
              <Divider />
              {/* <hr className="settins-divider"></hr> */}
              { }
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xl={24}
                className="set-save-button"
              >
                <Button type="primary" className="set-save" htmlType="submit">
                  SAVE
                </Button>
              </Col>
            </TabPane>
            <TabPane tab="Terms & Conditions" key="3">
              <div className="settings-input-text display-vertical">
                <Form.Item name="Terms" label="Terms & Conditions">
                  <CKEditor
                    editor={ClassicEditor}
                    onChange={(event, editor) => {
                      handleTerms(event, editor);
                      const data = editor.getData();
                      if (data.length > 3000) {
                        message.error(
                          "message cannot be more than 3000 characters"
                        );
                        event.preventDefault();
                      }
                    }}
                    config={{
                      toolbar: [
                        "Heading",
                        "|",
                        "Bold",
                        "Italic",
                        "Alignment",
                        "List",
                        "Undo",
                        "Redo",
                      ],
                    }}
                  />
                </Form.Item>
              </div>
              <p className="text-count">{terms}/3000</p>
              <hr className="settins-divider"></hr>
              { }
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xl={24}
                className="set-save-button"
              >
                <Button type="primary" className="set-save" htmlType="submit">
                  SAVE
                </Button>
              </Col>
            </TabPane>
            <TabPane tab="Privacy Policy" key="4">
              <div className="settings-input-text display-vertical">
                <Form.Item
                  name="privacyPolicy"
                  label="Privacy Policy"
                // rules={[{ message: "Please enter the description" }]}
                >
                  <CKEditor
                    editor={ClassicEditor}
                    // maxlength={5}
                    onChange={(event, editor) => {
                      handlePrivacyPolicy(event, editor);
                      const data = editor.getData();
                      if (data.length > 3000) {
                        message.error(
                          "message cannot be more than 3000 characters"
                        );
                        event.preventDefault();
                      }
                    }}
                    config={{
                      toolbar: [
                        "Heading",
                        "|",
                        "Bold",
                        "Italic",
                        "Alignment",
                        "List",
                        "Undo",
                        "Redo",
                      ],
                    }}
                  />
                </Form.Item>
                <p className="text-count">{policyCount}/3000</p>
              </div>
              <hr className="settins-divider"></hr>
              { }
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xl={24}
                className="set-save-button"
              >
                <Button type="primary" className="set-save" htmlType="submit">
                  SAVE
                </Button>
              </Col>
            </TabPane>
            <TabPane tab="Notification" key="5">
              <div className="setting_notification_tabs">
                <Row  >
                  <Col xs={20} sm={20} md={15} lg={15} xl={15} >
                    <div className="settings_notification_headers">
                      <h3>
                        Order Confirmations
                      </h3>
                      <h5>
                        You will be notified when customer order any product.
                      </h5>
                    </div>
                  </Col>
                  <Col xs={20} sm={20} md={9} lg={9} xl={9} >
                    <div className="settings_notification_footer">
                      <Switch defaultChecked />
                    </div>
                  </Col>
                </Row>
                <Row  >
                  <Col xs={20} sm={20} md={15} lg={15} xl={15} >
                    <div className="settings_notification_headers">
                      <h3>
                        Order Status Changed
                      </h3>
                      <h5>
                        You will be notified when customer make changes to the
                      </h5>
                    </div>
                  </Col>
                  <Col xs={20} sm={20} md={9} lg={9} xl={9} >
                    <div className="settings_notification_footer">
                      <Switch defaultChecked />
                    </div>
                  </Col>
                </Row>
                <Row  >
                  <Col xs={20} sm={20} md={15} lg={15} xl={15} >
                    <div className="settings_notification_headers">
                      <h3>
                        Order Delivered
                      </h3>
                      <h5>
                        You will be notified once order delivered.
                      </h5>
                    </div>
                  </Col>
                  <Col xs={20} sm={20} md={9} lg={9} xl={9} >
                    <div className="settings_notification_footer">
                      <Switch defaultChecked />
                    </div>
                  </Col>
                </Row>
                <Row  >
                  <Col xs={20} sm={20} md={15} lg={15} xl={15} >
                    <div className="settings_notification_headers">
                      <h3>
                        Email Notifications
                      </h3>
                      <h5>
                        Turn on email notifications to get updates through email.
                      </h5>
                    </div>
                  </Col>
                  <Col xs={20} sm={20} md={9} lg={9} xl={9} >
                    <div className="settings_notification_footer">
                      <Switch defaultChecked />
                    </div>
                  </Col>
                </Row>
              </div>
            </TabPane>







            <TabPane tab="Support" key="6">
              <div className="settings-input-text display-vertical">
                <Form.Item name="Support">
                  <Row>
                    <Col xs={24} sm={24} md={24} lg={12} xl={24}>
                      <p className="contactinfo">
                        {" "}
                        <strong>Describe the problems you are having</strong>
                      </p>
                      <Form.Item name="description">
                        <Input style={{ height: 50 }} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={12} xl={24}>
                      <p className="contactinfo">
                        <strong>Give us the details</strong>
                      </p>
                      <Form.Item name="details">
                        <Input.TextArea maxLength={3000} name="details" autoSize={{
                          minRows: 8,
                          maxRows: 15,
                        }} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={24} sm={24} md={12} lg={6} xl={6}>
                      <Form.Item
                        label="Contact Details"
                        name="supportCntact"
                        onKeyPress={(event) => {
                          if (checkNumbervalue(event)) {
                            event.preventDefault();
                          }
                        }}
                        rules={[
                          {
                            max: 10,
                            message: "Please enter only 10 digits",
                          },
                          {
                            required: true,
                            message: "Enter phone number",
                          },
                        ]}
                      >
                        <Input placeholder="Enter Contact Number" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={12} lg={6} xl={6}>
                      <Form.Item
                        label="Email Address"
                        name="emailSupport"
                        rules={[
                          {
                            type: "email",
                            message: "The input is not valid E-mail!",
                          },
                          {
                            required: true,
                            message: "Enter your e-mail!",
                          },
                        ]}
                      >
                        <Input
                          type="email"
                          name="email"
                          required="required"
                          placeholder="Enter Email Address"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form.Item>
              </div>
              <hr className="settins-divider"></hr>
              { }
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xl={24}
                className="set-save-button"
              >
                <Button type="primary" className="set-save" htmlType="submit">
                  SUBMIT
                </Button>
              </Col>
            </TabPane>
          </Tabs>
        </Form>
      </div >
    </div >
  );
}
export default Setting;


// <div className="settings-input-text">
//                 <div
//                   style={{
//                     height: "83px",
//                     width: "616px",
//                     background: "#F7F7F7",
//                     margin: "auto",
//                     marginBottom: "15px",
//                     padding: "15px",
//                   }}
//                 >
//                   <Row>
//                     <Col xs={24} sm={24} md={8} lg={18} xl={18}>
//                       <h3
//                         style={{
//                           textAlign: "left",
//                           color: "#272C39",
//                           fontWeight: "700",
//                         }}
//                       >
//                         Order Confirmations
//                       </h3>
//                       <h5 style={{ textAlign: "left" }}>
//                         You will be notified when customer order any product.
//                       </h5>
//                     </Col>
//                     <Col span={6} className="toggle">
//                       <Switch defaultChecked />
//                     </Col>
//                   </Row>
//                 </div>
//                 <div
//                   style={{
//                     height: "83px",
//                     width: "616px",
//                     background: "#F7F7F7",
//                     margin: "auto",
//                     marginBottom: "15px",
//                     padding: "15px",
//                   }}
//                 >
//                   <Row>
//                     <Col span={18}>
//                       <h3
//                         style={{
//                           textAlign: "left",
//                           color: "#272C39",
//                           fontWeight: "700",
//                         }}
//                       >
//                         Order Status Changed
//                       </h3>
//                       <h5 style={{ textAlign: "left" }}>
//                         You will be notified when customer make changes to the
//                         order.
//                       </h5>
//                     </Col>
//                     <Col span={6} className="toggle">
//                       <Switch />
//                     </Col>
//                   </Row>
//                 </div>
//                 <div
//                   style={{
//                     height: "83px",
//                     width: "616px",
//                     background: "#F7F7F7",
//                     margin: "auto",
//                     marginBottom: "15px",
//                     padding: "15px",
//                   }}
//                 >
//                   <Row>
//                     <Col span={18}>
//                       <h3
//                         style={{
//                           textAlign: "left",
//                           color: "#272C39",
//                           fontWeight: "700",
//                         }}
//                       >
//                         Order Delivered
//                       </h3>
//                       <h5 style={{ textAlign: "left" }}>
//                         You will be notified once order delivered.
//                       </h5>
//                     </Col>
//                     <Col span={6} className="toggle">
//                       <Switch defaultChecked />
//                     </Col>
//                   </Row>
//                 </div>
//                 <div
//                   style={{
//                     height: "83px",
//                     width: "616px",
//                     background: "#F7F7F7",
//                     margin: "auto",
//                     marginBottom: "15px",
//                     padding: "15px",
//                   }}
//                 >
//                   <Row>
//                     <Col span={18}>
//                       <h3
//                         style={{
//                           textAlign: "left",
//                           color: "#272C39",
//                           fontWeight: "700",
//                         }}
//                       >
//                         Email Notifications
//                       </h3>
//                       <h5 style={{ textAlign: "left" }}>
//                         Turn on email notifications to get updates through
//                         email.
//                       </h5>
//                     </Col>
//                     <Col span={6} className="toggle">
//                       <Switch defaultChecked />
//                     </Col>
//                   </Row>
//                 </div>
// 