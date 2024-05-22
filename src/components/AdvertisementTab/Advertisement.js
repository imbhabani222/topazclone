import React, { useState } from "react"
import { useDispatch } from "react-redux"
import axios from "axios"
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"
import { CKEditor } from "@ckeditor/ckeditor5-react"
import {
  Divider,
  Row,
  Col,
  Form,
  Input,
  Upload,
  Radio,
  Button,
  message,
  Card,
  Select,
  Image,
  DatePicker,
  Modal,
  Tooltip,
  Spin,
} from "antd"
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons"
import { APIs } from "../../worker"
import "./Advertisement.css"

function Offers({ onKeyChange = () => { }, setAdvertisement, advertisement }) {
  let dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const { Option } = Select
  const [value, setValue] = useState(1)
  const [vals, setVals] = useState(3)
  const [data, setData] = useState("")
  const [fileLists, setFileList] = useState([])
  const [dateChagne, setDateChagne] = useState({
    startValue: "",
    endValue: "",
    endOpen: false,
  })
  const [terms, setTerms] = useState(1000)
  const [descriptions, setDescription] = useState("")
  const [previewOffer, setPreviewOffer] = useState({
    image: "",
    title: "",
  })
  const userInfo = JSON.parse(localStorage.getItem("userinfo"))

  const beforeUpload = (file) => {
    const isLt2M = file.size / 1024 < 800
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png"
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!")
      return Upload.LIST_IGNORE
    }
    if (!isLt2M) {
      message.error("Image must be smaller than 800kb!")
      return Upload.LIST_IGNORE
    }
    return isJpgOrPng && isLt2M
  }

  const onChange = (e) => {
    setValue(e.target.value)
  }
  const onChangebtn = (e) => {
    setVals(e.target.value)
  }
  const apiCall = () => {
    axios
      .get(`${APIs.baseURL}/advertisement-service/v1/advertisements/${userInfo.manufacturerCode}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userInfo.token}`,
        }
      }
      )
      .then((res) => {
        const list = res.data
        setAdvertisement(list)
        // setLoading(false)
      })
  }
  const viewList = async () => {
    dispatch({ type: "VIWE_CUSTOMER" })
    let config = {
      headers: {
        "Content-Type": "application/json",
        "MNF-CODE": `${userInfo.manufacturerCode}`,
        "Authorization": `Bearer ${userInfo.token}`,
      },
    }
    
    let data1 = await axios.get(`${APIs.baseURL}/customer-service/v1/customers`, config)
    dispatch({ type: "VIWE_CUSTOMER_SUCCESS", payload: data })

    // form.resetFields();
    // message.success(" Data uploaded successfully");
    setData(data1.data)
  }

  const onFinish = async (values) => {
    setLoading(true)
    console.log(values, "image added", fileLists.length)
    if (fileLists.length === 1) {
      if (value === 2) {
        const imageOffer = new FormData()
        imageOffer.append("file", fileLists[0].originFileObj)
        // imageOffer.append("type", "logo");

        let temp = []
        values.listcustomer.map((e) => {
          temp.push({
            customercode: e,
          })
        })

        let fileData = {
          title: values.title,
          discription: values.description,
          startDate: values.startDate,
          endDate: values.endDate,
          selectcustomers: temp,
        }

        await axios
          .post(`${APIs.baseURL}/advertisement-service/v1/advertisement`, fileData, {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${userInfo.token}`,
              "MNF-CODE": `${userInfo.manufacturerCode}`,
            }
          })

          .then((response) => {
            if (response.status == 200) {
              axios
                .put(
                  `${APIs.baseURL}/advertisement-service/v1/advertisment-file/${response.data.advertisementid}`,
                  imageOffer, {
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${userInfo.token}`,
                  }
                })

                .then((res) => {
                  if (res.status == 200) {
                    onKeyChange()
                  }
                  form.resetFields()
                  message.success("Data saved successfully")
                  apiCall()
                  form.resetFields()
                  setPreviewOffer({
                    image: "",
                    title: "",
                  })
                  setFileList([])
                  setDescription("")
                  setLoading(false)
                })
            }
          })
          .catch((err) => {
            message.error(err || "Some Error")
            setLoading(false)
          })
      } else if (value === 1) {
        dispatch({ type: "VIWE_CUSTOMER" })
        let config = {
          headers: {
            "Content-Type": "application/json",
            "MNF-CODE": `${userInfo.manufacturerCode}`,
            "Authorization": `Bearer ${userInfo.token}`,
          },
        }
        let data1 = await axios.get(`${APIs.baseURL}/customer-service/v1/customers`, config)
        dispatch({ type: "VIWE_CUSTOMER_SUCCESS", payload: data })

        let temp = []
        data1.data.map((e) => {
          temp.push({
            customercode: e.customercode,
          })
        })

        const imageOffer = new FormData()
        imageOffer.append("file", fileLists[0].originFileObj)

        let fileData = {
          title: values.title,
          discription: descriptions,
          startDate: values.startDate,
          endDate: values.endDate,
          selectcustomers: temp,
        }

        await axios
          .post(`${APIs.baseURL}/advertisement-service/v1/advertisement`, fileData, {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${userInfo.token}`,
              "MNF-CODE": `${userInfo.manufacturerCode}`,
            }
          })

          .then((response) => {
            if (response.status == 200) {
              onKeyChange()
              axios
                .put(
                  `${APIs.baseURL}/advertisement-service/v1/advertisment-file/${response.data.advertisementid}`,
                  imageOffer, {
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${userInfo.token}`,
                  }
                }

                )
                .then((res) => {
                  message.success("Data saved successfully")
                  form.resetFields()
                  setPreviewOffer({
                    image: "",
                    title: "",
                  })
                  setFileList([])
                  setDescription("")
                  apiCall()
                  setLoading(false)
                })
            }
          })
          .catch((err) => {
            message.error("Advertisement has already created for this Customer")
            setLoading(false)
          })
      }
    } else {
      message.error("Please Upload An Image")
    }
  }

  const onGalleryFileRemove = () => {
    const { confirm } = Modal
    return new Promise((resolve, reject) => {
      confirm({
        title: "Are you sure you want to Delete ?",
        onOk: () => {
          resolve(true)
          setPreviewOffer({ ...previewOffer, image: "" })
          setFileList([])
        },
        onCancel: () => {
          reject(true)
        },
      })
    })
  }
  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  }

  const OnCancel = () => {
    setFileList([])
    setPreviewOffer({ image: "", title: "" })
  }

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo)
    if (fileLists.length === 0 && previewOffer.title.length !== 0) {
      message.error("Please Upload An Image")
    } else if (fileLists.length === 0 && previewOffer.title.length === 0) {
      message.error("Please Upload Image and Enter Title")
    } else if (previewOffer.title.length === 0) {
      message.error("Please Enter Title")
    }
  }

  const onhandleOfferPreview = (e) => {
    const { name, value } = e.target
    setPreviewOffer({ ...previewOffer, [name]: value })
  }

  const handleChangeimg = async ({ fileList }) => {
    console.log("handlechangeimg", previewOffer, fileList)
    const file = fileList[0]
    if (fileList.length > 0) {
      console.log("handlechangeimg INNER", previewOffer)
      if (file.size < 800000) {
        if (!file.url && !file.preview) {
          const imageData = await getBase64(file.originFileObj)
          console.log("handlechangeimg SMALLER1", previewOffer)
          setFileList(fileList)
          setPreviewOffer({ ...previewOffer, image: imageData })
          console.log("handlechangeimg SMALLER2", previewOffer)
        }
      }

      if (file.size > 800000) {
        setFileList([])
        console.log("handlechangeimg GREATER", previewOffer)
        setPreviewOffer({ ...previewOffer, image: "" })
        return message.error("Image must smaller than  800kb!")
      }

      const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png"
      if (!isJpgOrPng) {
        setFileList([])
        setPreviewOffer({ ...previewOffer, image: "" })
        message.error("file format not supported!")
        console.log("handlechangeimg JPG OR PNG", previewOffer)
      }
    }
  }

  console.log("handlechangeimg OUTER", previewOffer)
  const handleChangePreview = async (file) => {
    let src = file.url
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(file.originFileObj)
        reader.onload = () => resolve(reader.result)
      })
    }
    const image = new Image()
    image.src = src
    const imgWindow = window.open(src)
    imgWindow?.document.write(image.outerHTML)
  }

  const normFile = ({ fileList, file }) => {
    setFileList(fileList)
  }

  const handleTerms = (event, editor) => {
    var spdata = editor.getData().replace("<p>", "")
    var epdata = spdata.replace("</p>", "")
    var ssdata = epdata.replace("<strong>", "")
    var esdata = ssdata.replace("</strong>", "")
    esdata = esdata.replace("</h2>", "")
    esdata = esdata.replace("<h2>", "")
    esdata = esdata.replace("<h3>", "")
    esdata = esdata.replace("<h4>", "")
    esdata = esdata.replace("</h4>", "")
    esdata = esdata.replace("</h3>", "")
    esdata = esdata.replace("<i>", "")
    esdata = esdata.replace("</i>", "")
    console.log(esdata)
    if (esdata.length >= 1001) {
      message.error("message cannot be more than 1000 characters")
      event.preventDefault()
    } else {
      setDescription(editor.getData())
      setTerms(1000 - esdata.length)
    }
  }
  const disabledStartDate = (startValue) => {
    const endValue = dateChagne.endValue
    if (!startValue || !endValue) {
      return startValue.valueOf() < Date.now() - 86400000
    }

    return (
      startValue.valueOf() < Date.now() - 86400000 ||
      startValue.valueOf() > endValue.valueOf()
    )
  }

  const disabledEndDate = (endValue) => {
    const startValue = dateChagne.startValue
    if (!endValue || !startValue) {
      return false
    }
    return endValue.valueOf() <= startValue.valueOf()
  }

  const onChangee = (field, value) => {
    setDateChagne((prevDateChagne) => ({
      ...prevDateChagne,
      [field]: value,
    }))
  }

  const onStartChange = (value) => {
    onChangee("startValue", value)
  }

  const onEndChange = (value) => {
    onChangee("endValue", value)
  }

  const handleStartOpenChange = (open) => {
    if (!open) {
      setDateChagne((prevDateChagne) => ({
        ...prevDateChagne,
        endOpen: true,
      }))
    }
  }

  const handleEndOpenChange = (open) => {
    setDateChagne((prevDateChagne) => ({ ...prevDateChagne, endOpen: open }))
  }

  return (
    <div className={loading ? "onsubmit_loader_container Advertisementcontainer" : "Advertisementcontainer"}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <div className="offers-cnainer">
          <Row>
            <Col xs={24} sm={20} md={14} lg={12} xl={12} className="adform">
              <div className="offers-form">
                <Row>
                  <Col
                    xs={24}
                    sm={24}
                    md={22}
                    lg={22}
                    xl={22}
                    className="categorCol label-and-heading"
                  >
                    {" "}
                    <div className="uploadk">
                      <Form.Item
                        label="Background Image"
                        name="logo"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                      >
                        <Upload
                          listType="picture-card"
                          fileList={fileLists}
                          maxCount={1}
                          onChange={handleChangeimg}
                          onRemove={onGalleryFileRemove}
                          onPreview={handleChangePreview}
                          accept=".jpg, .jpeg, .png"
                          beforeUpload={beforeUpload}
                        >
                          {" "}
                          <Button icon={<PlusOutlined />}> Upload</Button>
                          <div>
                            <h3 className="image-upload-side-text">
                              Upload an Image
                            </h3>
                            <p className="ant-upload-text">
                              Click or Drag & drop an image file to upload. Only
                              PNG or JPEG files with size up to 800KB is
                              accepted
                            </p>
                          </div>
                        </Upload>
                      </Form.Item>
                    </div>
                  </Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={20}
                    lg={22}
                    xl={22}
                    className="discountCol"
                  >
                    <Form.Item
                      label="Title"
                      name="title"
                      onChange={onhandleOfferPreview}
                      rules={[
                        { required: true, message: "Please input title!" },
                        { whitespace: true },
                        {
                          min: 2,
                          message: "Title should be atleast 2 characters ",
                        },
                        {
                          max: 25,
                          message: "Title cannot be longer than 25 characters ",
                        },
                      ]}
                    >
                      <Input name="title" maxLength={50} />
                    </Form.Item>
                  </Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={20}
                    lg={22}
                    xl={22}
                    className="discountCol"
                    style={{ borderRadius: "50px" }}
                  >
                    <Form.Item
                      name="description"
                      label="Descriptions"
                      getValueFromEvent={(event, editor) => {
                        const data = editor.getData()
                        return data
                      }}
                      rules={[
                        { message: "Please enter the description" },
                        { whitespace: true },
                        { min: 2 },
                        {
                          max: 1000,
                          message:
                            "Descriptions cannot be longer than 1000 characters",
                        },
                      ]}
                    >
                      <CKEditor
                        editor={ClassicEditor}
                        onChange={(event, editor) => {
                          handleTerms(event, editor)
                        }}
                      />
                      <p style={{ textAlign: "right" }}>{terms}/1000</p>
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={24} md={20} lg={22} xl={22}>
                    <Form.Item name="Radio-button" valuePropName="checked">
                      <div className="radioGroup">
                        <Radio.Group onChange={onChange} value={value}>
                          <Radio value={1}> Apply All</Radio>
                          <Radio value={2} onClick={viewList}>
                            Select Customer
                          </Radio>
                        </Radio.Group>
                      </div>
                    </Form.Item>
                    {value === 2 ? (
                      <>
                        <Col xs={24} sm={24} md={20} lg={24} xl={24}>
                          <Form.Item
                            name="listcustomer"
                            label="List of Customers"
                            // initialValue={data1.tags.map((x) => x.tags)}
                            requiredMark={"optional"}
                            rules={[
                              {
                                required: true,
                                message: "Select Customer",
                              },
                            ]}
                          >
                            <Select
                              mode="multiple"
                              // optionLabelProp="label"
                              onChange={handleChangeimg}
                            >
                              {data
                                ? data.map((item, key) => {
                                  return (
                                    <Option
                                      key={key}
                                      value={item.customercode}
                                    // title={item.customerName}
                                    // {item.customercode}
                                    >
                                      <Tooltip
                                        placement="topLeft"
                                        title={item.customercode}
                                        arrowPointAtCenter
                                      >
                                        <p>{item.customerName.charAt(0).toUpperCase() + item.customerName.slice(1)}</p>
                                      </Tooltip>
                                    </Option>
                                  )
                                })
                                : ""}
                            </Select>
                          </Form.Item>
                        </Col>
                      </>
                    ) : (
                      <Col>{""}</Col>
                    )}
                  </Col>
                  <Col xs={24} sm={24} md={20} lg={22} xl={22}>
                    <Form.Item name="Radio-button" valuePropName="checked">
                      <div className="radioGroup">
                        <Radio.Group onChange={onChangebtn} value={vals}>
                          <Radio value={3} className="Radio-btn">
                            {" "}
                            Always{" "}
                          </Radio>

                          <Radio value={4}>Specific Range</Radio>
                        </Radio.Group>
                      </div>
                    </Form.Item>
                  </Col>
                  {vals === 4 ? (
                    <>
                      <Col
                        xs={24}
                        sm={24}
                        md={20}
                        lg={22}
                        xl={22}
                        className="discountCol offers-date"
                      >
                        <h3 className="text-styles dates-margin">
                          Set a Start and End date for the Advertisement
                        </h3>
                        <Row gutter={[40]}>
                          <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                            <Form.Item
                              name="startDate"
                              label="Start Date"
                              rules={[
                                {
                                  required: true,
                                  message: "Please input start date!",
                                },
                              ]}
                              className="datelabel"
                            >
                              <DatePicker
                                // onChange={startDate}
                                disabledDate={disabledStartDate}
                                format="YYYY-MM-DD"
                                value={dateChagne.startValue}
                                onChange={onStartChange}
                                onOpenChange={handleStartOpenChange}
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                            <Form.Item
                              name="endDate"
                              className="datelabel"
                              label="End Date"
                              rules={[
                                {
                                  required: true,
                                  message: "Please input end date!",
                                },
                              ]}
                            >
                              <DatePicker
                                // onChange={startDate}
                                disabledDate={disabledEndDate}
                                format="YYYY-MM-DD "
                                disabled={
                                  dateChagne.startValue !== "" ? false : true
                                }
                                value={dateChagne.endValue}
                                onChange={onEndChange}
                                open={dateChagne.endOpen}
                                onOpenChange={handleEndOpenChange}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Col>
                    </>
                  ) : (
                    <Col>{""}</Col>
                  )}
                </Row>
              </div>
            </Col>

            <Col xs={24} sm={20} md={10} lg={12} xl={12}>
              <div className="bannerPreview">
                <h4 className="image-header text-style">Banner Preview</h4>
                {previewOffer.title || descriptions || previewOffer.image ? (
                  <Card>
                    <Image src={previewOffer.image ? previewOffer.image : ""} />

                    <h4 className="preview-title">{previewOffer.title}</h4>
                    <div
                      className="preview-description"
                      dangerouslySetInnerHTML={{ __html: descriptions }}
                    ></div>
                    {/* <p className="preview-description">{descriptions}</p> */}
                  </Card>
                ) : (
                  ""
                )}
              </div>
            </Col>
          </Row>
        </div>
        <Divider className="offer-divide-button" />
        {value === 1 ? (
          <Row justify="end" style={{ gap: "30px" }}>
            <Col className="offer-BtnCol advertisement-cancel-button adv-btn">
              <Button
                id="offer-cancelBtn"
                className="advert-cancel"
                type="primary"
                htmlType="reset"
                onClick={OnCancel}
              >
                CANCEL
              </Button>
            </Col>
            <Col>
              <Button
                type="primary"
                htmlType="submit"
                className="advert-saveBtn"
                onClick={onKeyChange.onKeyChange}
              >
                SUBMIT
              </Button>
              {loading && (
                <LoadingOutlined
                  style={{ fontSize: "25px", marginLeft: "10px" }}
                />
              )}
            </Col>
          </Row>
        ) : (
          <Row>
            <Col className="offer-BtnCol advertisement-cancel-button adv-btn">
              <Button
                onClick={onKeyChange.onKeyChange}
                type="primary"
                htmlType="submit"
                className="nextbtn"
              >
                SUBMIT
              </Button>
              {loading && (
                <Spin className="onsubmit_loader" />
              )}
            </Col>
            <Col>{""}</Col>
          </Row>
        )}
      </Form>
    </div>
  )
}

export default Offers
