import React, { useState, useEffect } from "react"
import {
  Divider,
  Row,
  Col,
  Input,
  Upload,
  DatePicker,
  Button,
  Modal,
  Checkbox,
  Card,
  message,
  Form,
  Image,
  Spin,
  Alert,
} from "antd"

import { PlusOutlined, LoadingOutlined } from "@ant-design/icons"
import axios from "axios"
import { CKEditor } from "@ckeditor/ckeditor5-react"
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"
import { APIs } from "../../worker"
import "./Offers.css"

function Offers() {
  const [loading, setLoading] = useState(false)
  const [terms, setTerms] = useState(1000)
  const [form] = Form.useForm()
  const [previewOffer, setPreviewOffer] = useState({
    image: "",
    title: "",
    description: "",
  })

  const [dateChange, setDateChange] = useState({
    startValue: "",
    endValue: "",
    endOpen: false,
  })

  const userInfo = JSON.parse(localStorage.getItem("userinfo"))
  let config = {
    headers: {
      "Content-Type": "application/json",
    },
  }

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

  const onhandleOfferPreview = (e) => {
    const { name, value } = e.target
    setPreviewOffer({ ...previewOffer, [name]: value })
  }
  const OnCancel = () => {
    setPreviewOffer({ image: "", title: "", description: "" })
  }
  useEffect(() => { }, [previewOffer])
  
  //fix Below Code
  // const handleCancel = () => setImage({ previewVisible: false })
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
  function convertBase64(file) {
    return new Promise((resolve, reject) => {
      const data = new FileReader()
      data.readAsDataURL(file)
      data.onload = () => resolve(data.result)
      data.onerror = (error) => reject(error)
    })
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
    if (esdata.length >= 1001) {
      message.error("message cannot be more than 1000 characters")
      event.preventDefault()
    } else {
      // console.log(editor.getData(),"edi-----------------------",previewOffer)
      setPreviewOffer({ image: previewOffer.image, title: previewOffer.title, description: editor.getData() })
      setTerms(1000 - esdata.length)
    }
  }
  
  
  const handleChange = async ({ fileList }) => {
    const file = fileList[0]
    const isJpgOrPng = file?.type === "image/jpeg" || file?.type === "image/png"
    const imageData = await convertBase64(file.originFileObj)
    
    // setPreviewOffer({ ...previewOffer, image: file })
    
    if (!isJpgOrPng) {
      setPreviewOffer({ ...previewOffer, image: "" })
      message.error("file format not supported!")
      return
    }

    if (file?.size < 800000) {
      if (!file?.url && !file?.preview) {
        setPreviewOffer({ ...previewOffer, image: imageData })
        return
      }
    }
    
    if (file?.size > 800000) {
      setPreviewOffer({ ...previewOffer, image: "" })
      message.error("Image must smaller than 800kb!")
    }
  }

  const onGalleryFileRemove = (file, index) => {
    const { confirm } = Modal
    return new Promise((resolve, reject) => {
      confirm({
        title: "Are you sure you want to Delete ?",
        onOk: () => {
          resolve(true)
          setPreviewOffer({ ...previewOffer, image: "" })
        },
        onCancel: () => {
          reject(true)
        },
      })
    })
  }
  const onFinish = async (values) => {
    if (!previewOffer.image) {
      return message.error("Please Upload An Image")
    }

    const {
      // description:priview,
      endDate,
      logo: { fileList },
      startDate,
      title,
    } = values
    setLoading(true)
    // let formattedStartDate = startDate?._d.toLocaleDateString()
    // let formattedEndDate = endDate?._d.toLocaleDateString()
    let data = {
      title: title,
      description: previewOffer.description,
      startDate: startDate,
      endDate: endDate,
    }
    console.log(fileList)
    
    const imageOffer = new FormData()
    imageOffer.append("file", fileList[0]?.originFileObj)
    
    let response = await axios.post(`${APIs.baseURL}/offer-service/v1/offer`, data, {
      headers: {
        "Content-Type": "application/json",
        "MNF-CODE": `${userInfo.manufacturerCode}`,
        "Authorization": `Bearer ${userInfo.token}`,
      }
    }
    )

    let responseImage = await axios
      .put(`${APIs.baseURL}/offer-service/v1/offerfile/${response?.data?.offerId}`, imageOffer,{
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userInfo.token}`,
        }
      }
      )
      .then(() => {
        form.resetFields()
        setPreviewOffer({})
        setLoading(false)
      })

    message.success("Uploaded the offers data Successfully.")
  }

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo)
    setLoading(false)
  }

  const disabledStartDate = (startValue) => {
    const endValue = dateChange.endValue
    if (!startValue || !endValue) {
      return startValue.valueOf() < Date.now() - 86400000
    }

    return (
      startValue.valueOf() < Date.now() - 86400000 ||
      startValue.valueOf() > endValue.valueOf()
    )
  }

  const disabledEndDate = (endValue) => {
    const startValue = dateChange?.startValue
    if (!endValue || !startValue) {
      return false
    }
    return endValue.valueOf() <= startValue.valueOf()
  }

  const onChange = (field, value) => {
    setDateChange((prevDateChange) => ({
      ...prevDateChange,
      [field]: value,
    }))
  }

  const onStartChange = (value) => {
    onChange("startValue", value)
  }

  const onEndChange = (value) => {
    onChange("endValue", value)
  }

  const handleStartOpenChange = (open) => {
    if (!open) {
      setDateChange((prevDateChange) => ({
        ...prevDateChange,
        endOpen: true,
      }))
    }
  }

  const handleEndOpenChange = (open) => {
    setDateChange((prevDateChange) => ({ ...prevDateChange, endOpen: open }))
  }

  return (
    <div className={loading?"onsubmit_loader_container":""}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        className="offerForm"
      >
        <div className="offers-cnainer">
          <Row>
            <Col xs={24} sm={20} md={14} lg={14} xl={14}>
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
                    <div className="offers-image offer-image-new">
                      <Form.Item
                        name="logo"
                        className="offers-image1"
                        label={
                          <div className="upload_data">Background Image</div>
                        }
                      >
                        <Upload
                          listType="picture-card"
                          maxCount={1}
                          accept=".jpg, .jpeg, .png"
                          onChange={handleChange}
                          onRemove={onGalleryFileRemove}
                          onPreview={handleChangePreview}
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
                              accepted.
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
                      rules={[
                        { required: true, message: "Please input title!" },
                        { whitespace: true },
                        { min: 2 },
                        { max: 45 },
                      ]}
                    >
                      <Input
                        name="title"
                        value={previewOffer.title}
                        maxLength={45}
                        maxCount={45}
                        onChange={onhandleOfferPreview}
                      />
                    </Form.Item>
                  </Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={20}
                    lg={22}
                    xl={22}
                    className="discountCol description-col"
                  >
                    <Form.Item
                      label="Description"
                      name="description"
                      className="add-category-id-and-name"
                      rules={[
                        { message: "Please enter the description" },
                        { whitespace: true },
                        { min: 2 },
                        { max: 500 },
                      ]}
                    >
                      <CKEditor
                        editor={ClassicEditor}
                        onChange={(event, editor) => {
                          handleTerms(event, editor)
                        }}
                      />
                      <p style={{ textAlign: "right" }}>{terms}/1000</p>
                      {/* <Input.TextArea
                        showCount
                        maxLength={500}
                        maxCount={500}
                        name="description"
                        value={previewOffer.description}
                        onChange={onhandleOfferPreview}
                      /> */}
                    </Form.Item>
                  </Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={20}
                    lg={22}
                    xl={22}
                    className="discountCol offers-date"
                  >
                    <h3 className="text-style dates-margin">
                      Set a Start and End date for your Offer
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
                        >
                          <DatePicker
                            disabledDate={disabledStartDate}
                            format="YYYY-MM-DD "
                            value={dateChange.startValue}
                            onChange={onStartChange}
                            onOpenChange={handleStartOpenChange}
                            placeholder="Start Date"
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                        <Form.Item
                          name="endDate"
                          label="End Date"
                          rules={[
                            {
                              required: true,
                              message: "Please input end date!",
                            },
                          ]}
                        >
                          <DatePicker
                            disabledDate={disabledEndDate}
                            disabled={
                              dateChange.startValue !== "" ? false : true
                            }
                            format="YYYY-MM-DD "
                            value={dateChange?.endValue}
                            onChange={onEndChange}
                            open={dateChange?.endOpen}
                            onOpenChange={handleEndOpenChange}
                            placeholder="End Date"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>

                  <Col
                    xs={24}
                    sm={24}
                    md={20}
                    lg={20}
                    xl={22}
                    className="discountCol alleft"
                  >
                    <Form.Item
                      name="social media"
                      valuePropName="checked"
                      className="offer-display"
                    >
                      <Checkbox>
                        I would like this offer to be shared on social media
                      </Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col xs={24} sm={20} md={10} lg={10} xl={10}>
              <div className="offer-product-details">
                <h4 className="image-header text-style">Preview offer</h4>

                <Card>
                  {previewOffer?.image && (
                    <Image alt="example" style={{}} src={previewOffer?.image} />
                  )}
                  {previewOffer?.title && (
                    <h4 className="preview-title">{previewOffer?.title}</h4>
                  )}
                  {previewOffer?.description && (
                    <div
                      className="preview-description"
                      dangerouslySetInnerHTML={{
                        __html: previewOffer?.description,
                      }}
                    ></div>
                  )}
                </Card>
              </div>
            </Col>
          </Row>
        </div>
        <Divider className="offer-divide-button" />

        <Row justify="end" style={{ gap: "20px" }}>
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
            <Button type="primary" htmlType="submit" className="offer-saveBtn">
              SUBMIT
            </Button>

          </Col>
        </Row>
        
      </Form>
      {loading && (
          <Spin className="onsubmit_loader" />
      )}
    </div>
  )
}

export default Offers
