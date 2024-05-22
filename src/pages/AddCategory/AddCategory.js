import React, { useState } from "react"
import { CKEditor } from "@ckeditor/ckeditor5-react"
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"
import {
  Divider,
  Row,
  Col,
  Form,
  Input,
  Upload,
  Select,
  Button,
  message,
  Modal,
} from "antd"
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons"
import { useDispatch, useSelector } from "react-redux"
import { addCategory } from "../../action/useraction"
import "./AddCategory.css"

function AddCategory({ backArrowClick }) {
  const [loading, setLoading] = useState(false)
  let dispatch = useDispatch()
  const messageData = useSelector((state) => state?.addCategory)
  const [fileList, setFileList] = useState([])
  const [image2, setImage2] = useState(null)
  const [previewOffer, setPreviewOffer] = useState({ image: "" })
  const [showImage, setShowImage] = useState("")
  const handleChangeimg = async ({ fileList, file }) => {
    setPreviewOffer({ ...previewOffer })
    if (file.size < 800000) {
      if (!file.url && !file.preview) {
        setImage2(file)
        setFileList({ fileList })
      }
      if (fileList && fileList.length > 0) {
        setImage2(null)
      }
    }
  }
  const onGalleryFileRemove = (file, index) => {
    const { confirm } = Modal
    return new Promise((resolve, reject) => {
      confirm({
        title: "Are you sure you want to Delete ?",
        onOk: () => {
          resolve(true)
          setImage2(null)
          setFileList(null)
          setPreviewOffer({ image: "" })
        },
        onCancel: () => {
          reject(true)
        },
      })
    })
  }

  const handleChange = (value) => {
    console.log(`selected ${value}`)
  }
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
    // const image = new Image()
    // image.src = src
    // const imgWindow = window.open(src)
    // imgWindow?.document.write(image.outerHTML)
  }

  const beforeUpload = (file, onSuccess) => {
    const isLt2M = file.size / 1024 < 800

    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png"
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!")
      setLoading(false)
      return Upload.LIST_IGNORE
    }
    if (!isLt2M) {
      message.error("Image must be smaller than 800kb!")
      setLoading(false)
      return Upload.LIST_IGNORE
    }
    return isJpgOrPng && isLt2M
  }
  const normFile = ({ fileList, file }) => {
    setFileList({ fileList })
  }
  const onFinish = async (values) => {
    setLoading(true)
    let tempTag = []
    for (let i in values.tags) {
      tempTag.push(values.tags[i])
    }
    let tempSub = []
    for (let i in values.subcategory) {
      tempSub.push({
        subcategory: values.subcategory[i],
      })
    }
    const imageOffer = new FormData()
    imageOffer.append(
      "file",
      fileList?.fileList?.length > 0 ? fileList?.fileList[0]?.originFileObj : ""
    )
    let data = {
      categoryName: values.categoryName,
      discription: values.description,
      subcategory: tempSub,
      tags: tempTag,
    }
    if (fileList?.fileList?.length > 0) {
      await dispatch(addCategory(data, imageOffer))
      if (messageData?.error === undefined) {
        message.success("Category added Successfully")
        setLoading(false)
      } else {
        message.error("Category name already exist")
        setLoading(false)
      }

      backArrowClick()
    } else {
      message.error("Please upload image")
      setLoading(false)
    }
  }

  const onFinishFailed = (errorInfo) => {
    message.error("Failed to create Category")
    setLoading(false)
  }

  return (
    <div className="add-category-container">
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

        <h4 className="add-heading-text">Add Category</h4>
      </div>

      <Divider className="add-cat-divider" />
      <Form
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        scrollToFirstError
      >
        <div className="add-category-id-and-name">
          <Row>
            <Col xs={24} sm={20} md={11} lg={7} xl={7} className="categorCol">
              <Form.Item
                label="Category Name"
                name="categoryName"
                rules={[
                  { required: true, message: "Enter category name" },
                  {
                    min: 5,
                    message: "Category name must be atleast 5 characters",
                  },
                  {
                    max: 30,
                    message:
                      "Category name cannot be longer than 30 characters",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col
              xs={24}
              sm={20}
              md={10}
              lg={7}
              xl={7}
              className="category-m-col categorCol"
            >
              <Form.Item
                name="tags"
                label="Tag"
                rules={[{ required: true, message: "Please input tags" }]}
              >
                <Select
                  mode="tags"
                  onChange={handleChange}
                  optionLabelProp="label"
                ></Select>
              </Form.Item>
            </Col>
            <Col
              xs={24}
              sm={20}
              md={10}
              lg={7}
              xl={7}
              className="text-positions"
            >
              <Form.Item
                name="subcategory"
                label="Sub Category Type"
                rules={[
                  { required: true, message: "Please input subcategory" },
                ]}
              >
                <Select
                  mode="tags"
                  onChange={handleChange}
                  optionLabelProp="label"
                ></Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={20} md={11} lg={7} xl={7} className="categorCol">
              {" "}
              <div className="uploadk">
                <Form.Item
                  label={
                    <div className="upload_data">Upload Category Image</div>
                  }
                  name="logo"
                  // rules={[{ required: true, message: "Please upload Image" }]}
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                >
                  <Upload
                    listType="picture-card"
                    onChange={handleChangeimg}
                    fileList={fileList}
                    maxCount={1}
                    onRemove={onGalleryFileRemove}
                    onPreview={handleChangePreview}
                    beforeUpload={beforeUpload}
                    accept=".jpg, .jpeg, .png"
                  >
                    <>
                      <Button icon={<PlusOutlined />}> Upload</Button>

                      <p className="ant-upload-text">
                        Click or Drag & drop an image file to upload. Only PNG
                        or JPEG files with size up to 800KB is accepted.
                      </p>
                    </>
                  </Upload>
                </Form.Item>
              </div>
              <Modal visible={showImage.length} footer={false} onCancel={() => setShowImage("")}>
                <img src={showImage} style={{ width: '100%' }} />
              </Modal>
            </Col>
          </Row>
        </div>

        <Form.Item
          label="Description"
          name="description"
          valuePropName="data"
          className="add-category-id-and-name"
          getValueFromEvent={(event, editor) => {
            const data = editor.getData()
            return data
          }}
          rules={[{ message: "Please enter the description" }]}
        >
          <CKEditor editor={ClassicEditor} />
        </Form.Item>

        <Divider className="add-cat-bottom-divider" />

        <div className="divButton">
          <Button type="primary" id="category-backbtn" onClick={backArrowClick}>
            BACK
          </Button>
          <Button type="primary" htmlType="submit" id="create-btn">
            CREATE
          </Button>
          {loading && (
            <LoadingOutlined style={{ fontSize: "25px", marginLeft: "10px" }} />
          )}
        </div>
      </Form>
    </div>
  )
}

export default AddCategory
