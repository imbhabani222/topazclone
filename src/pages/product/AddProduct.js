import * as React from "react"
import { useEffect, useState } from "react"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { checkNumbervalue } from "../onboard_manufactures"
import { CKEditor } from "@ckeditor/ckeditor5-react"
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Select,
  Upload,
  message,
  Modal,
} from "antd"
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons"
import { APIs } from "../../worker"
import { useNavigate } from "react-router-dom"
import { addProduct } from "../../action/useraction"
import { viewCategory } from "../../action/useraction"
import { setFormData } from "../../action/useraction"
import "./AddProduct.css"
import ImgCrop from "antd-img-crop"

function AddProduct({ backArrowClick }) {
  const [loading, setLoading] = useState(false)
  const { Option } = Select
  let dispatch = useDispatch()
  let navigate = useNavigate()
  const viewcategorys = useSelector(
    (state) => state.category.viewCategoryResponse
  )
  const addProductResponse = useSelector(
    (state) => state.addProduct.addProductResponse
  )
  const [form] = Form.useForm()
  const [minCount, setMinCount] = useState("")
  const [data, setData] = useState("")
  const [previewOffer, setPreviewOffer] = useState({ image: "" })
  const [addmrp, setAddMrp] = useState({
    price: "",
    size: "",
    sqFeetPrice: "",
  })
  const [image2, setImage2] = useState(null)
  const [fileList, setFileList] = useState([])
  const [showImage, setShowImage] = useState("")
  const userInfo = JSON.parse(localStorage.getItem("userinfo"))

  console.log(fileList,"--------")
  const calSize = (size) => {
    let NumArry = size.split("*").map((e) => e.charAt(0).replace(/\D/g, ""))
    let arrOfNum = []
    NumArry.forEach((str) => {
      arrOfNum.push(Number(str))
    })
    return parseInt(arrOfNum.reduce((a, b) => a * b)) * addmrp.sqFeetPrice
  }

  useEffect(() => {
    getAllSubcategory()
    dispatch(viewCategory())
  }, [dispatch])

  const getAllSubcategory = async () => {
    let data1 = await axios.get(`${APIs.baseURL}/category-service/v1/subcategories`,{
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userInfo.token}`,
      }
    }
    )
    let newData = []

    data1.data.map((datum) => {
      if (!newData.find((item) => item.subcategory === datum.subcategory)) {
        newData.push(datum)
      }
    })

    setData(newData)
  }
  const handleChange = (value) => {
    console.log(`selected ${value}`)
  }
  const handleChangeimg = async ({ fileList, file }) => {
    setPreviewOffer({ ...previewOffer })

    if (file.size < 800000) {
      if (!file.url && !file.preview) {
        setImage2(file)
        setFileList(fileList)
      }
      if (fileList && fileList.length > 0) {
        setImage2(null)
      }
    }
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png"
    if (!isJpgOrPng) {
      setFileList([])
      message.error("file format not supported!")
    }
    if (file.size > 800000) {
      setFileList([])

      return message.error("Image must smaller than  800kb!")
    }
    const initialValue = 0
    const fileSizeArr = fileList?.map((ele) => ele?.size)
    const sumOfSize = fileSizeArr.reduce((acc, cur) => acc + cur, initialValue)
    if (sumOfSize > 5000000) {
      setFileList([])
      return message.error("Above 5Mb images are not supported")
    }
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
  const userlogin = useSelector((state) => state.userlogin)
  let { userinfo } = userlogin
  const OnChangeInput = (e) => {
    e.preventDefault()
    const value = e.target.value
    setAddMrp({ ...addmrp, [e.target.name]: value })
  }

  const onFinish = async (values) => {
    setLoading(true)
    let tempTag = []
    for (let i in values.tag) {
      tempTag.push(values.tag[i])
    }
    // let {logo:{fileList}} = values
    // let fileList = values?.logo?.fileList
    console.log(values)
    const imageOffer = new FormData()
    if (fileList?.length !== 0) {
      fileList?.map((file) => imageOffer?.append("files", file?.originFileObj))
    } else {
      message.error("Please upload a image")
      setLoading(false)
    }

    let NumArry = values?.size
      .split("*")
      .map((e) => e.charAt(0).replace(/\D/g, ""))
    let arrOfNum = []
    NumArry.forEach((str) => {
      arrOfNum.push(Number(str))
    })

    let data1 = {
      // sku: values.sku,
      productTitle: values.productTitle,
      categoryType: {
        categoryid: values.categoryType,
      },
      minOrderQty: values.minOrderQty,
      maxOrderQty: values.maxOrderQty,
      color: values.color,
      woodType: values.woodType,
      unitMeasure: values.unitMeasure,
      size: values.size,
      thickness: values.thickness,
      brand: values.brand,
      price: parseInt(values.sqFeetPrice * arrOfNum.reduce((a, b) => a * b)),
      stock: values.stock,
      threshold: values.threshold,
      collection: values.collection,
      currency: values.currency,
      sqFeetPrice: values.sqFeetPrice,
      discription: values.description,
      tag: tempTag,
      subcategory: {
        subid: values.subcategory,
      }
    }

    try {
      if (fileList && fileList.length > 0) {
        let response = await axios.post(`${APIs.baseURL}/product-service/v1/product`, data1,{
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userInfo.token}`,
          }
        }
        )
        if (response.status === 200) {
          let res2 = await axios.put(
            `${APIs.baseURL}/product-service/v1/productfile/${response?.data?.productid}`,
            imageOffer,{
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userInfo.token}`,
              }
            }            
          )
          if (res2.status === 200) {
            message.success("Product Added Successfully")
            setLoading(false)
            navigate("/category")
            backArrowClick()
          }
        }
      } else {
        message.error("Please upload a image")
        setLoading(false)
      }
    } catch (err) {
      message.error(err.responce && err.responce.data.message ? err.responce.data.message : err.message)
      setLoading(false)
    }
    // backArrowClick();
  }

  const onFinishFailed = (errorInfo) => {
    console.log("failed", errorInfo)
    setLoading(false)
  }

  return (
    <div className="onbord_pannel2">
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
        <h4 className="add-heading-text">Add Product</h4>
      </div>
      <hr className="divider"></hr>
      <Row>
        <div className="add_product_form" style={{ marginTop: "-3%" }}>
          <Form
            name="basic"
            form={form}
            initialValues={{
              remember: true,
            }}
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Row>
              <Col xs={24} sm={24} md={10} lg={7} xl={7} className="onboardCol">
                <Form.Item
                  label="Product Title"
                  name="productTitle"
                  rules={[
                    {
                      required: true,
                      message: "Enter product title",
                    },
                    {
                      pattern: /^[a-zA-Z0-9\s]+$/g,
                      message: "Invalid product title",
                    },
                    { whitespace: true },
                    {
                      min: 5,
                      message: "Product title must be atleast 5 characters",
                    },
                    {
                      max: 30,
                      message:
                        "Product title cannot be longer than 30 characters",
                    },
                  ]}
                >
                  <Input placeholder="Enter product title" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={10} lg={7} xl={7} className="onboardCol">
                <Form.Item
                  name="categoryType"
                  label="Category Type"
                  rules={[
                    {
                      required: true,
                      message: "Select industry type!",
                    },
                  ]}
                >
                  <Select placeholder="Please select a category">
                    {viewcategorys
                      ? viewcategorys.map(
                        (e, key) =>
                          e.active && (
                            <Option key={key} value={e.categoryid}>
                              {e.categoryName}
                            </Option>
                          )
                      )
                      : ""}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={10} lg={7} xl={7} className="onboardCol">
                <Form.Item
                  name="subcategory"
                  label="Sub Category Type"
                  rules={[{ required: true, message: "Select sub category" }]}
                >
                  <Select placeholder="Please select a sub category">
                    {data
                      ? data.map((e, key) => {
                        return (
                          <Option key={key} value={e.subid}>
                            {e.subcategory}
                          </Option>
                        )
                      })
                      : ""}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={10} lg={7} xl={7} className="onboardCol">
                <Form.Item
                  label="Min Order Quantity"
                  name="minOrderQty"
                  onChange={(e) => setMinCount(e.target.value)}
                  onKeyPress={(event) => {
                    if (checkNumbervalue(event)) {
                      event.preventDefault()
                    }
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Enter minimum order quantity",
                    },
                  ]}
                >
                  <Input placeholder="Enter min order quantity" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={10} lg={7} xl={7} className="onboardCol">
                <Form.Item
                  name="maxOrderQty"
                  label="Max Order Quantity"
                  onKeyPress={(event) => {
                    if (checkNumbervalue(event)) {
                      event.preventDefault()
                    }
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Enter maximum order quantity",
                    },
                    {
                      validator: (_, value) => {
                        if (!value || +value > +minCount) {
                          return Promise.resolve()
                        }

                        return Promise.reject(
                          "Max order quantity should me greater then min order quantity"
                        )
                      },
                    },
                  ]}
                >
                  <Input placeholder="Enter max order quantity" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={10} lg={7} xl={7} className="onboardCol">
                <Row gutter={10}>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12} className="">
                    <Form.Item
                      name="color"
                      label="Color"
                      rules={[
                        {
                          required: true,
                          message: "Select color!",
                        },
                      ]}
                    >
                      <Select placeholder="Select Color">
                        <Option value="red">Red</Option>
                        <Option value="blue">Blue</Option>
                        <Option value="green">Green</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12} className="">
                    <Form.Item
                      name="woodType"
                      label="Wood Type"
                      rules={[
                        {
                          required: true,
                          message: "Select woodtype",
                        },
                      ]}
                    >
                      <Select placeholder="Select Wood type">
                        <Option value="softWood">Soft Wood</Option>
                        <Option value="hardWood">Hard Wood</Option>
                        <Option value="wood">Wood</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col xs={24} sm={24} md={10} lg={7} xl={7} className="onboardCol">
                <Row gutter={10}>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12} className="">
                    <Form.Item
                      name="size"
                      label="Size (SQ/ft)"
                      rules={[
                        {
                          required: true,
                          message: "Select size",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Select size"
                        onChange={(e) => setAddMrp({ ...addmrp, size: e })}
                        name="size"
                        value={addmrp.size}
                      >
                        <Option value="9.0 ft*3.0 ft">9.0 ft*3.0 ft</Option>
                        <Option value="8.0 ft*4.0 ft">8.0 ft*4.0 ft</Option>
                        <Option value="6.0 ft*2.0 ft">6.0 ft*2.0 ft</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12} className="">
                    <Form.Item
                      name="thickness"
                      label="Thickness (mm)"
                      rules={[
                        {
                          required: true,
                          message: "Select thickness!",
                        },
                      ]}
                    >
                      <Select placeholder="Select thickness">
                        <Option value="7mm">7</Option>
                        <Option value="8mm">8</Option>
                        <Option value="9mm">9</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col xs={24} sm={24} md={10} lg={7} xl={7} className="onboardCol">
                <Form.Item
                  name="brand"
                  label="Brand"
                  rules={[
                    {
                      required: true,
                      message: "Select brand",
                    },
                  ]}
                >
                  <Input placeholder="Enter brand name" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={10} lg={7} xl={7} className="onboardCol">
                <Form.Item
                  label="Price per (SQ/ft) "
                  name="sqFeetPrice"
                  onKeyPress={(event) => {
                    if (checkNumbervalue(event)) {
                      event.preventDefault()
                    }
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Enter Price per (SQ/ft)",
                    },
                  ]}
                >
                  <Input
                    placeholder="Enter Square foot price"
                    name="sqFeetPrice"
                    onChange={OnChangeInput}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={10} lg={7} xl={7} className="onboardCol">
                <Row gutter={10}>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12} className="">
                    <Form.Item
                      name="stock"
                      label="Stock"
                      dependencies={["threshold"]}
                      rules={[
                        {
                          required: true,
                          message: "Enter Stock",
                        },
                        ({ getFieldValue }) => ({
                          validator(rule, value) {
                            if (
                              parseInt(getFieldValue("threshold")) >=
                              parseInt(value)
                            ) {
                              return Promise.reject(["Stock should be greater"])
                            }
                            return Promise.resolve()
                          },
                        }),
                      ]}
                      onKeyPress={(event) => {
                        if (checkNumbervalue(event)) {
                          event.preventDefault()
                        }
                      }}
                    >
                      <Input placeholder="Enter stock" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12} className="">
                    <Form.Item
                      name="threshold"
                      label="Threshold"
                      dependencies={["stock"]}
                      rules={[
                        {
                          required: true,
                          message: "Enter threshold",
                        },

                        ({ getFieldValue }) => ({
                          validator(rule, value) {
                            if (
                              parseInt(getFieldValue("stock")) <=
                              parseInt(value)
                            ) {
                              return Promise.reject([
                                "Threshold should be smaller",
                              ])
                            }
                            return Promise.resolve()
                          },
                        }),
                      ]}
                      onKeyPress={(event) => {
                        if (checkNumbervalue(event)) {
                          event.preventDefault()
                        }
                      }}
                    >
                      <Input placeholder="Enter threshold" />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col xs={24} sm={24} md={10} lg={7} xl={7} className="onboardCol">
                <Form.Item
                  name="collection"
                  label="Collection"
                  rules={[
                    {
                      required: true,
                      message: "Select industry type!",
                    },
                  ]}
                >
                  <Select placeholder="Select collection">
                    <Option value="newArrival">New Arrival</Option>
                    <Option value="oldStocks">Old Stocks</Option>
                    <Option value="generalStocks">General Stocks</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={10} lg={7} xl={7} className="onboardCol">
                <Form.Item
                  label="MRP"
                  rules={[
                    {
                      required: true,
                      message: "Enter MRP",
                    },
                  ]}
                >
                  <Input
                    placeholder="Enter price"
                    value={
                      calSize(addmrp.size) === 0 ? "" : calSize(addmrp.size)
                    }
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={10} lg={7} xl={7} className="onboardCol">
                <Form.Item
                  name="currency"
                  label="Currency"
                  rules={[
                    {
                      required: true,
                      message: "Select currency type",
                    },
                  ]}
                >
                  <Select placeholder="Select currency">
                    <Option value="Rupees">Rupees</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={10} lg={7} xl={7} className="onboardCol">
                <Form.Item
                  name="tag"
                  label="Tag"
                  rules={[{ required: true, message: "Please enter tags" }]}
                >
                  <Select
                    mode="tags"
                    placeholder="Tag"
                    onChange={handleChange}
                    optionLabelProp="label"
                  >
                    <Option value="Laminated plywood" label="Laminated Plywood">
                      <div className="demo-option-label-item">
                        Laminated Plywood
                      </div>
                    </Option>
                    <Option value="Hardwood plywood" label="Hardwood Plywood">
                      <div className="demo-option-label-item">
                        Hardwood Plywood
                      </div>
                    </Option>
                    <Option value="Designer plywood" label="Designer Plywood">
                      <div className="demo-option-label-item">
                        Designer Plywood
                      </div>
                    </Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col
                xs={24}
                sm={24}
                md={10}
                lg={7}
                xl={7}
                className="onboardCol "
              >
                <Form.Item
                  label="Unit of Measurement"
                  name="unitMeasure"
                  rules={[
                    {
                      required: true,
                      message: "Enter unit of measurement",
                    },
                  ]}
                >
                  <Select placeholder="Select unit of measurement">
                    <Option value="ft">ft</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col
                xs={24}
                sm={24}
                md={10}
                lg={7}
                xl={7}
                className="onboardCol addproductselect"
              >
                {" "}
                <div className="uploadk">
                  <Form.Item
                    label={
                      <div className="upload_data">Upload Product Image</div>
                    }
                    name="logo"
                  >
                    <ImgCrop showGrid rotationSlider aspectSlider showReset>
                      <Upload
                        multiple={false}
                        fileList={fileList}
                        listType="picture-card"
                        onChange={handleChangeimg}
                        onPreview={handleChangePreview}
                        onRemove={onGalleryFileRemove}
                        accept=".jpg, .jpeg, .png"
                        maxCount={5}
                        beforeUpload={beforeUpload}
                      >
                        <Button icon={<PlusOutlined />}> Upload</Button>
                        <p className="ant-upload-text">
                          Click or Drag & drop an image file to upload. Only PNG
                          or JPEG files with size up to 800KB is accepted.
                        </p>
                      </Upload>
                    </ImgCrop>
                  </Form.Item>
                  <Modal visible={showImage.length} footer={false} onCancel={() => setShowImage("")}>
                    <img src={showImage} style={{ width: '100%' }} />
                  </Modal>
                </div>
              </Col>
              <Col
                xs={24}
                sm={24}
                md={22}
                lg={23}
                xl={23}
                className="onboardCol"
              >
                <Form.Item
                  label="Description"
                  name="description"
                  valuePropName="data"
                  getValueFromEvent={(event, editor) => {
                    const data = editor.getData()
                    return data
                  }}
                  rules={[{ message: "Please enter the description" }]}
                >
                  <CKEditor editor={ClassicEditor} />
                </Form.Item>
              </Col>
            </Row>

            <hr className="divider"></hr>
            <div className="prod-footer-btn">
              <Button type="primary" id="discount-cancelBtns">
                BACK
              </Button>

              <Button type="primary" htmlType="submit" id="discount-saveBtns">
                SUMBIT
              </Button>
              {loading && (
                <LoadingOutlined
                  style={{ fontSize: "25px", marginLeft: "10px" }}
                />
              )}
            </div>
          </Form>
        </div>
      </Row>
    </div>
  )
}
export default AddProduct
