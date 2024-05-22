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
  Image as ImageTag,
  Modal,
} from "antd"
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons"
import axios from "axios"
import { APIs } from "../../worker"
import "./EditCategory.css"

function EditCategory({ catInfo, editedCatInfo, backArrowClick }) {
  const [loading, setLoading] = useState(false)
  const [fileList, setFileList] = useState([])
  const [image2, setImage2] = useState(null)
  const [previewOffer, setPreviewOffer] = useState({ image: "" })
  const userInfo = JSON.parse(localStorage.getItem("userinfo"))

  const handleChangeimg = async ({ fileList, file }) => {
    setPreviewOffer({ ...previewOffer })
    console.log(fileList, file, "fileList, file ")
    if (file.size < 800000) {
      if (!file.url && !file.preview) {
        setImage2(file)
        setFileList(fileList)
      }
      if (fileList && fileList?.length > 0) {
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
    console.log("Preview")
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

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo)
  }
  const onFinish = async (values) => {
    setLoading(true)
    let tempTag = []
    for (let i in values.tag) {
      tempTag.push(values.tag[i])
    }
    let tempSub = []
    for (let i in values.subCategory) {
      tempSub.push({
        subcategory: values.subCategory[i],
      })
    }
    const imageOffer = new FormData()
    imageOffer.append(
      "file",
      fileList?.length > 0 ? fileList[0]?.originFileObj : ""
    )
    let data = {
      categoryName: values.username,
      tags: tempTag,
      subcategory: tempSub,
      discription: values.description,
    }
    // if (fileList?.length > 0) {
    await axios.put(
      `${APIs.baseURL}/category-service/v1/category/${catInfo.categoryid}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userInfo.token}`,
          "MNF-CODE": `${userInfo.manufacturerCode}`,
        }
      }

    ).then(async() => {
      if (image2 !== null) {
        try {
          await axios.put(
            `${APIs.baseURL}/category-service/v1/category-file/${catInfo.categoryid}`,
            imageOffer,
            {
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userInfo.token}`,
                "MNF-CODE": `${userInfo.manufacturerCode}`,
              }
            }
          )
          editedCatInfo()
          setLoading(false)
        } catch (err) {
          editedCatInfo()
          console.log(err)
          setLoading(false)
        }
      } else {
        editedCatInfo()
      }
      console.log(image2, "image2")
      message.success("Category updated Successfully")
    })
    backArrowClick()
    // }
    // else {
    //   console.log("err");
    //   message.error("Please upload image");
    // }
  }

  const normFile = ({ fileList }) => {
    console.log("Upload event:", fileList)
    setFileList({ fileList })
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

  return (
    <div className="add-category-container">
      <div className="add-heading">
        <svg
          width="40"
          height="14"
          viewBox="0 0 40 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          onClick={editedCatInfo}
          id="edit-header-back-icon"
          cursor="pointer"
        >
          <path
            d="M7 14L8.41 12.59L3.83 8H20V6L3.83 6L8.42 1.41L7 0L0 7L7 14Z"
            fill="#848989"
          />
        </svg>

        <h4 className="add-heading-text">Edit Category</h4>
      </div>
      <Divider className="edit-cat-divider" />
      <Form
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <div className="add-category-id-and-name">
          <Row>
            <Col
              xs={24}
              sm={20}
              md={11}
              lg={7}
              xl={7}
              className="categorCol category-m-col cat-id"
            >
              <Form.Item
                label="Category ID"
                name="category id"
                initialValue={catInfo.categoryid}
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col xs={24} sm={20} md={11} lg={7} xl={7} className="categorCol">
              <Form.Item
                label="Category Name"
                name="username"
                initialValue={catInfo.categoryName}
                rules={[
                  { required: true, message: "Enter category name" },
                  { whitespace: true },
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
              className="category-m-col"
            >
              <Form.Item
                name="tag"
                label="Tag"
                initialValue={catInfo?.tags?.map((x) => x)}
                rules={[{ required: true, message: "Please input tags" }]}
              >
                <Select
                  mode="tags"
                  optionLabelProp="label"
                  onChange={handleChange}
                ></Select>
              </Form.Item>
            </Col>
            <Col
              xs={24}
              sm={20}
              md={12}
              lg={7}
              xl={7}
              className="categorCol uploadcat"
            >
              {" "}
              <div className="uploadk">
                <Form.Item
                  label={
                    <div className="upload_data">Upload Category Image</div>
                  }
                  name="logo"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                //rules={[{ required: true, message: "Upload image" }]}
                >
                  <Upload
                    listType="picture-card"
                    onChange={handleChangeimg}
                    fileList={fileList}
                    maxCount={1}
                    onPreview={handleChangePreview}
                    onRemove={onGalleryFileRemove}
                    beforeUpload={beforeUpload}
                    accept=".jpg, .jpeg, .png"
                    className="avatar-uploader"
                  >
                    <Button icon={<PlusOutlined />}> Upload</Button>
                    <p className="ant-upload-text">
                      Click or Drag & drop an image file to upload. Only PNG or
                      JPEG files with size up to 800KB is accepted.
                    </p>
                  </Upload>
                  {console.log(
                    fileList[0]?.originFileObj,
                    "fileList[0]?.originFileObj"
                  )}
                  {fileList[0]?.originFileObj === undefined ? (
                    <ImageTag
                      className="imagTag"
                      width={80}
                      height={80}
                      src={catInfo?.categoryimage}
                    />
                  ) : (
                    ""
                  )}
                </Form.Item>
              </div>
            </Col>
            <Col
              xs={24}
              sm={20}
              md={10}
              lg={7}
              xl={7}
              className="text-position"
            >
              <Form.Item
                name="subCategory"
                label="Sub Category Type"
                initialValue={catInfo.subcategory.map((x) => x.subcategory)}
                rules={[
                  { required: true, message: "Please input subcategory" },
                ]}
              >
                <Select
                  mode="tags"
                  optionLabelProp="label"
                  onChange={handleChange}
                ></Select>
              </Form.Item>
            </Col>
          </Row>
        </div>
        <div className="editor">
          <Form.Item
            label="Description"
            name="description"
            valuePropName="data"
            className="add-category-id-and-name"
            initialValue={catInfo.discription}
            getValueFromEvent={(event, editor) => {
              const data = editor.getData()
              return data
            }}
            rules={[{ message: "Please enter the description" }]}
          >
            <CKEditor
              label="Description"
              name="description"
              editor={ClassicEditor}
            // onChange={(event, editor) => {
            //   handleTerms(event, editor);
            // }}
            />
          </Form.Item>
        </div>
        <Divider className="edit-cat-bot-divider" />
        <Row>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} className="BtnCol">
            <Button type="primary" htmlType="submit" id="edit-create-btn">
              SUBMIT
            </Button>
            {loading && (
              <LoadingOutlined
                style={{ fontSize: "25px", marginLeft: "10px" }}
              />
            )}
          </Col>
        </Row>
      </Form>
    </div>
  )
}

export default EditCategory
