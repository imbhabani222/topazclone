import * as React from "react"
import { useEffect, useState } from "react"
import axios from "axios"
import { APIs } from "../../worker"
import { checkNumbervalue } from "../onboard_manufactures"
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Select,
  Upload,
  message,
  Image,
  Modal,
} from "antd"
import { CKEditor } from "@ckeditor/ckeditor5-react"
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"
import {
  PlusOutlined,
  DeleteOutlined,
  LoadingOutlined,
} from "@ant-design/icons"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { updateProduct } from "../../action/useraction"
import ViewProduct from "../../pages/ViewProduct/viewproduct"
import "./AddProduct.css"
import ImgCrop from "antd-img-crop"
const { Option } = Select

function UpdateProduct({
  backArrowClick,
  prodInfo,
  viewcategorys,
  updateTableData,
}) {
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  let navigate = useNavigate()

  const [data, setData] = useState("")
  const [productInfo, setProductInfo] = useState(prodInfo?.productImage)
  const [image2, setImage2] = useState(null)
  const [fileList, setFileList] = useState([])
  const [previewOffer, setPreviewOffer] = useState({ image: "" })
  const [deleteImageData, setDeleteImageData] = useState({
    key: "",
    hover: false,
  })
  const userInfo = JSON.parse(localStorage.getItem("userinfo"))
  const [addmrp, setAddMrp] = useState({
    size: prodInfo.size,
    sqFeetPrice: prodInfo.sqFeetPrice,
  })
  const [minCount, setMinCount] = useState(prodInfo.minOrderQty)
  const [delImage, setDelImage] = useState([])
  // {
  //   imageId: "",
  //   productId: "",
  //   del: false,
  // }
  const getAllSubcategory = async () => {
    let data1 = await axios.get(`${APIs.baseURL}/category-service/v1/subcategories`,
    {
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

  useEffect(() => {
    getAllSubcategory()
  }, [])

  const handleChange = (value) => {
    console.log(`selected ${value}`)
  }
  const handelMultiDelete = (delImage, arrItem) => {
    let show = true
    for (let del of delImage) {
      console.log("delImage", del?.imageId, arrItem?.imageId)
      if (del?.imageId === arrItem?.imageId) {
        return (show = false)
      }
    }
    return show
  }
  const handelDelete = (id, prodid) => {
    axios
      .delete(
        `https://topaz.hutechweb.com/topaz-webapp/product-service/v1/product/${id}`,{
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userInfo.token}`,
            "MNF-CODE": `${userInfo.manufacturerCode}`,
          }
        }
        
      )
      .then((res) => {
        console.log(res, "res")
        setFileList([])
        const newProdInfo = productInfo?.filter((ele) => ele?.imageId !== id)
        console.log(newProdInfo)
        setProductInfo(newProdInfo)
        message.success("Image deleted successfully")
        updateTableData()
      })
  }

  const onFinish = async (values) => {
    setLoading(true)
    if (
      prodInfo?.productImage?.length === delImage?.length &&
      fileList.length === 0
    ) {
      //person deletes all the images and uploads no new image
      // the product has no image and person does not upload an image
      message.error("Please upload the new Image")
      setLoading(false)
    } else {
      let tempTag = []
      for (let i in values.tag) {
        tempTag.push(values.tag[i])
      }
      let NumArry = values.size
        .split("*")
        .map((e) => e.charAt(0).replace(/\D/g, ""))
      let arrOfNum = []
      NumArry.forEach((str) => {
        arrOfNum.push(Number(str))
      })
      const id = prodInfo.productid
      const data = {
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
        discription: values?.description || prodInfo.discription,
        tag: tempTag,
        subcategory: {
          subid: values?.subcategory,
        },
      }
      await dispatch(updateProduct(data, id))
      message.success("Data updated successfully")
      navigate("/category")
      backArrowClick()

      if (fileList.length > 0) {
        const imageOffer = new FormData()
        fileList.map((file) => imageOffer.append("files", file.originFileObj))

        try {
          if (fileList?.length === 0 && prodInfo?.productImage?.length !== 0) {
            navigate("/category")
            message.success("Data updated successfully")
            backArrowClick()
            setLoading(false)
          } else if (
            fileList?.length === 0 &&
            prodInfo?.productImage?.length === 0
          ) {
            message.error("Please upload the image")
            setLoading(false)
          } else {
            await axios.put(`${APIs.baseURL}/product-service/v1/productfile/${id}`, imageOffer,{
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userInfo.token}`,
              }
            }
            )
            navigate("/category")
            message.success("Data updated successfully")
            backArrowClick()
            setLoading(false)
          }
        } catch (err) {
          message.error(err.response.data.message)
          setLoading(false)
        }
      }
    }
  }

  const handleTerms = (event, editor) => {
    console.clear()
    let data = editor.getData()
  }

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo)
    setLoading(false)
  }
  const calSize = (size) => {
    let NumArry = size.split("*").map((e) => e.charAt(0).replace(/\D/g, ""))
    let arrOfNum = []
    NumArry.forEach((str) => {
      arrOfNum.push(Number(str))
    })
    return parseInt(arrOfNum.reduce((a, b) => a * b)) * addmrp.sqFeetPrice
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
  const handleChangeimg = async ({ fileList, file }) => {
    setPreviewOffer({ ...previewOffer })
    if (
      productInfo?.length < 5 &&
      fileList?.length <= 5 - productInfo?.length
    ) {
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
      const sumOfSize = fileSizeArr.reduce(
        (acc, cur) => acc + cur,
        initialValue
      )
      if (sumOfSize > 5000000) {
        setFileList([])
        return message.error("Above 5Mb images are not supported")
      }
    } else {
      message.error("Max 5 images can be uploaded")
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
    const image = new Image()
    image.src = src
    const imgWindow = window.open(src)
    imgWindow?.document.write(image.outerHTML)
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
        <h4 className="add-heading-text">Edit Product</h4>
      </div>
      <hr className="divider"></hr>
      <Row>
        <div className="add_product_form">
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
              <Col
                xs={24}
                sm={24}
                md={10}
                lg={7}
                xl={7}
                className="onboardCol pro-id"
              >
                <Form.Item
                  label="SKU ID"
                  name="sku"
                  initialValue={prodInfo.sku}
                  rules={[
                    {
                      required: true,
                      message: "Please input SKU ID",
                    },
                  ]}
                >
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={10} lg={7} xl={7} className="onboardCol">
                <Form.Item
                  label="Product Title"
                  name="productTitle"
                  initialValue={prodInfo.productTitle}
                  rules={[
                    {
                      required: true,
                      message: "Please input Product title",
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
                  initialValue={prodInfo.categoryid}
                  rules={[
                    {
                      required: true,
                      message: "Please select Category type!",
                    },
                  ]}
                >
                  <Select placeholder="Please select a category">
                    {viewcategorys
                      ? viewcategorys.map((e, key) => {
                        return (
                          <Option key={key} value={e.categoryid}>
                            {e.categoryName}
                          </Option>
                        )
                      })
                      : ""}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={10} lg={7} xl={7} className="onboardCol">
                <Form.Item
                  name="subcategory"
                  label="Sub Category Type"
                  initialValue={prodInfo?.subcategory?.subid?.subid}
                  rules={[
                    { required: true, message: "Sub category is required" },
                  ]}
                >
                  <Select placeholder="Please select a category">
                    {data
                      ? data.map((e, key) => {
                        return (
                          <Option key={key} value={e?.subid}>
                            {e?.subcategory}
                          </Option>
                        )
                      })
                      : ""}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={10} lg={7} xl={7} className="onboardCol">
                <Form.Item
                  label="Min Order Qantity"
                  name="minOrderQty"
                  initialValue={prodInfo.minOrderQty}
                  onChange={(e) => setMinCount(e.target.value)}
                  onKeyPress={(event) => {
                    if (checkNumbervalue(event)) {
                      event.preventDefault()
                    }
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Enter Minimum Order Quantity",
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
                  initialValue={prodInfo.maxOrderQty}
                  onKeyPress={(event) => {
                    if (checkNumbervalue(event)) {
                      event.preventDefault()
                    }
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Enter Maximum Order Quantity",
                    },
                    {
                      validator: (_, value) => {
                        if (
                          !value ||
                          value > minCount ||
                          value > prodInfo.minOrderQty
                        ) {
                          console.log(prodInfo.minOrderQty, value)
                          return Promise.resolve()
                        }
                        console.log(value)
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
                      initialValue={prodInfo.color}
                      rules={[
                        {
                          required: true,
                          message: "Please select Color!",
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
                      initialValue={prodInfo.woodType}
                      rules={[
                        {
                          required: true,
                          message: "Please select Woodtype",
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
                      initialValue={prodInfo.size}
                      rules={[
                        {
                          required: true,
                          message: "Please select Size",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Select"
                        onChange={(e) => setAddMrp({ ...addmrp, size: e })}
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
                      initialValue={prodInfo.thickness}
                      rules={[
                        {
                          required: true,
                          message: "Please select Thickness!",
                        },
                      ]}
                    >
                      <Select placeholder="Select">
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
                  initialValue={prodInfo.brand}
                  rules={[
                    {
                      required: true,
                      message: "Please select brand",
                    },
                  ]}
                >
                  <Input placeholder="Enter brand name" />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                sm={24}
                md={10}
                lg={7}
                xl={7}
                // initialValue={prodInfo.sqFeetPrice}

                className="onboardCol"
              >
                <Form.Item
                  label="Price per (SQ/ft)"
                  initialValue={prodInfo.sqFeetPrice}
                  name="sqFeetPrice"
                  rules={[
                    {
                      required: true,
                      message: "Please input SQ/Ft Price",
                    },
                  ]}
                >
                  <Input
                    placeholder="Enter Square foot price"
                    onChange={(e) =>
                      setAddMrp({ ...addmrp, sqFeetPrice: e.target.value })
                    }
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={10} lg={7} xl={7} className="onboardCol">
                <Row gutter={10}>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12} className="">
                    <Form.Item
                      name="stock"
                      label="Stock"
                      initialValue={prodInfo.stock}
                      dependencies={["threshold"]}
                      // onChange={(e) => setThValue(e.target.value)}
                      onKeyPress={(event) => {
                        if (checkNumbervalue(event)) {
                          event.preventDefault()
                        }
                      }}
                      rules={[
                        {
                          required: true,
                          message: "Please enter Stock",
                        },
                        ({ getFieldValue }) => ({
                          validator(rule, value) {
                            console.log("non-list field1 validator")
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
                    >
                      <Input placeholder="Enter stock" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12} className="">
                    <Form.Item
                      name="threshold"
                      label="Threshold"
                      dependencies={["stock"]}
                      initialValue={prodInfo.threshold}
                      onKeyPress={(event) => {
                        if (checkNumbervalue(event)) {
                          event.preventDefault()
                        }
                      }}
                      rules={[
                        {
                          required: true,
                          message: "Please enter Threshold",
                        },
                        ({ getFieldValue }) => ({
                          validator(rule, value) {
                            console.log("non-list field2 validator")
                            if (
                              parseInt(getFieldValue("stock")) <=
                              parseInt(value)
                            ) {
                              return Promise.reject([
                                "Threshold value should be lesser then Stock value",
                              ])
                            }
                            return Promise.resolve()
                          },
                        }),
                        // {
                        //   validator: (_, value) => {
                        //     if (!value || value < thValue) {
                        //       return Promise.resolve();
                        //     }

                        //     return Promise.reject(
                        //       "Threshold value should be lesser then Stock value"
                        //     );
                        //   },
                        // }
                      ]}
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
                  initialValue={prodInfo.collection}
                  rules={[
                    {
                      required: true,
                      message: "Please select Industry type!",
                    },
                  ]}
                >
                  <Select placeholder="Select">
                    <Option value="plywood">New Arrival</Option>
                    <Option value="oldStocks">Old Stocks</Option>
                    <Option value="generalStocks">General Stocks</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={10} lg={7} xl={7} className="onboardCol">
                <Form.Item
                  // name="price"
                  label="MRP"
                  // initialValue={(prodInfo.price)}

                  rules={[
                    {
                      required: true,
                      message: "Please provide MRP",
                    },
                  ]}
                >
                  <Input
                    placeholder="Enter price"
                    value={
                      calSize(addmrp.size) === 0
                        ? prodInfo.price
                        : calSize(addmrp.size)
                    }
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={10} lg={7} xl={7} className="onboardCol">
                <Form.Item
                  name="currency"
                  label="Currency"
                  initialValue={prodInfo.currency}
                  rules={[
                    {
                      required: true,
                      message: "Please select Currency type",
                    },
                  ]}
                >
                  <Select placeholder="Select">
                    <Option value="plywood">Rupees</Option>
                  </Select>
                </Form.Item>
              </Col>
              {/* <Col xs={24} sm={24} md={7} lg={7} xl={7} className="onboardCol"> */}{" "}
              {/* <div className="uploadk">
                  <Form.Item label="Upload Video">
                    <Form.Item
                      name="logo"
                      valuePropName="fileList"
                      getValueFromEvent={normFile}
                      noStyle
                    >
                      <Upload.Dragger
                        listType="picture-card"
                        className="avatar-uploader"
                        name="files"
                        action="/upload.do"
                      >
                        {" "}
                        <Button icon={<PlusOutlined />}> Upload</Button>
                        <h4 className="ant-upload-text">
                          Drop your video here, or select
                        </h4>
                      </Upload.Dragger>
                    </Form.Item>
                  </Form.Item>
                </div> */}
              {/* <Col
                  xs={24}
                  sm={24}
                  md={24}
                  lg={24}
                  xl={24}
                  className="onboardCol"
                > */}
              {/* <Form.Item>
                    <Button
                      type="primary"
                      style={{
                        marginLeft: "75%",
                        height: "30px",
                        width: "103px",
                      }}
                    >
                      PREVIEW
                    </Button>
                  </Form.Item> */}
              {/* </Col>
              </Col> */}
              <Col xs={24} sm={24} md={10} lg={7} xl={7} className="onboardCol">
                <Form.Item
                  name="tag"
                  label="Tag"
                  initialValue={prodInfo?.tag?.map((x) => x)}
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

                {/* <div style={{ textAlign: "left", marginBottom: "15px" }}>
                  <Checkbox>Apply Watermark</Checkbox>
                </div> */}
              </Col>
              <Col
                xs={24}
                sm={24}
                md={10}
                lg={7}
                xl={7}
                className="onboardCol addproductselect editproduct"
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
                        className="avatar-uploader"
                        accept=".jpg, .jpeg, .png"
                        beforeUpload={beforeUpload}
                        maxCount={5}
                      >
                        {" "}
                        <Button icon={<PlusOutlined />}> Upload</Button>
                        <div className="ant-upload-text">
                          <span>
                            {" "}
                            Click or Drag & drop an image file to upload.
                          </span>
                          <span style={{ fontSize: "10px", opacity: " 0.8" }}>
                            {" "}
                            Only PNG or JPEG files with size up to 800KB.
                          </span>
                        </div>
                      </Upload>
                    </ImgCrop>
                  </Form.Item>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      flexWrap: "wrap",
                    }}
                  >
                    {productInfo?.map((item) => (
                      <div
                        key={item?.imageId}
                        style={{ position: "relative" }}
                        onMouseEnter={() =>
                          setDeleteImageData({
                            key: item?.imageId,
                            hover: true,
                          })
                        }
                        onMouseLeave={() =>
                          setDeleteImageData({
                            key: item?.imageId,
                            hover: true,
                          })
                        }
                        className="editimagediv"
                      >
                        {deleteImageData?.key === item?.imageId &&
                          deleteImageData?.hover && (
                            <span
                              onClick={() => {
                                const { confirm } = Modal
                                return new Promise((resolve, reject) => {
                                  confirm({
                                    title: "Are you sure you want to Delete ?",
                                    onOk: () => {
                                      handelDelete(
                                        item?.imageId,
                                        item?.productid
                                      )
                                    },
                                    onCancel: () => {
                                      reject(true)
                                    },
                                  })
                                })
                              }}
                              className="delete_product_image"
                            >
                              <DeleteOutlined twoToneColor="#fff" />
                            </span>
                          )}

                        {handelMultiDelete(delImage, item) && (
                          <Image
                            className="imag-tag"
                            width={70}
                            height={70}
                            // Important
                            /* if you change height and width values change top 37.5px and right 22px in css */
                            src={item?.url}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={24} md={10} lg={7} xl={7} className="onboardCol">
                <Form.Item
                  label="Unit Of Measurement"
                  name="unitMeasure"
                  initialValue={prodInfo.unitMeasure}
                  rules={[
                    {
                      required: true,
                      message: "Please input your Unit",
                    },
                  ]}
                >
                  <Select placeholder="Select">
                    <Option value="ft">ft</Option>
                    <Option value="mm">mm</Option>
                    <Option value="cm">cm</Option>
                  </Select>
                </Form.Item>
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
                  initialValue={prodInfo.discription}
                  getValueFromEvent={(event, editor) => {
                    const data = editor.getData()
                    return data
                  }}
                  rules={[{ message: "Please enter the description" }]}
                >
                  <CKEditor
                    editor={ClassicEditor}
                    label="Description"
                    name="description"
                    onChange={(event, editor) => {
                      console.log("shgtysgt", { event, editor })
                      handleTerms(event, editor)
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <hr className="divider-product"></hr>

            <div className="cancle-button-data">
              <Button
                type="primary"
                id="discount-cancelBtns"
                onClick={backArrowClick}
              >
                BACK
              </Button>

              <Button type="primary" htmlType="submit" id="discount-saveBtns">
                SUBMIT
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
export default UpdateProduct
