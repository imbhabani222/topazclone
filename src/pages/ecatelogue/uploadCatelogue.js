import { Row, Col, Button, Form, Upload, Input, message, Modal, Spin, Radio, Select, Tooltip } from "antd"
import { Document, Page } from "react-pdf"
import { CKEditor } from "@ckeditor/ckeditor5-react"
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"
import {
  LeftOutlined,
  PlusOutlined,
  RightOutlined,
  LoadingOutlined,
  ExpandAltOutlined,
  ZoomOutOutlined,
  ZoomInOutlined,
} from "@ant-design/icons"
import { useState } from "react"
import { pdfjs } from "react-pdf"
import axios from "axios"
import { APIs } from "../../worker"
import { useDispatch } from "react-redux"
import { useEffect } from "react"

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString()

const UploadCatelogue = ({ eCatalogue, setECatalogue, onKeyChange, fileListtemp = [], createPage = false, pdfBlobData }) => {
  const [numPages, setNumPages] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [filelist, setFileList] = useState(fileListtemp)
  const [customerList, setCustomerList] = useState([])
  const [file, setFile] = useState("")
  const [terms, setTerms] = useState(1000)
  const [descriptions, setDescription] = useState()
  const [title, setTitle] = useState("")
  const [form] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [scale, setScale] = useState(1)
  const [data, setData] = useState("")
  const [value, setValue] = useState(1)
  const { Option } = Select
  const dispatch = useDispatch()


  const beforeUpload = (file) => {
    const isLt2M = file.size / 1048576 < 50
    const isPdf = file.type === "application/pdf"
    if (!isPdf) {
      message.error("You can only upload PDF file!")
      return Upload.LIST_IGNORE
    }
    if (!isLt2M) {
      message.error("PDF must be smaller than 50MB!")
      return Upload.LIST_IGNORE
    }
    return isPdf && isLt2M
  }

  useEffect(async () => {
    const userInfo = JSON.parse(localStorage.getItem("userinfo"))
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
  }, [])



  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  }

  const userInfo = JSON.parse(localStorage.getItem("userinfo"))
  const apiCall = () => {
    axios
      .get(`${APIs.baseURL}/ecatalouge-service/v1/ecatalouges/${userInfo.manufacturerCode}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userInfo.token}`,
        }
      }
      )
      .then((res) => {
        const list = res.data
        setECatalogue(list)
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
    console.log(esdata)
    if (esdata.length >= 1001) {
      message.error("message cannot be more than 1000 characters")
      event.preventDefault()
    } else {
      setDescription(editor.getData())
      setTerms(1000 - esdata.length)
    }
  }
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages)
    setCurrentPage(1)
  }
  function changePage(offset) {
    setCurrentPage((prevPageNumber) => prevPageNumber + offset)
  }

  function previousPage() {
    changePage(-1)
  }

  function nextPage() {
    changePage(1)
  }

  const props = {
    listType: "picture-card",
    name: "file",
    action: "",
    headers: {
      authorization: "authorization-text",
    },
    async onChange(info) {
      // console.log("info.file.status", info.file.status !== "removed")
      if (info.file.status)
        if (
          info.file.status !== "uploading" &&
          info.file.status !== "removed"
        ) {
          if (Array.isArray(info.fileList)) {
            console.log(Array.isArray(info.fileList))
            const file = await getBase64(info.fileList[0].originFileObj)
            setFile(file)
            setFileList(info.fileList)
          }
        }
    },
    onRemove: onGalleryFileRemove,
    beforeUpload: beforeUpload,
  }

  function onhandleTitle(e) {
    setTitle(e?.target?.value)
  }

  function onGalleryFileRemove() {
    const { confirm } = Modal
    return new Promise((resolve, reject) => {
      confirm({
        title: "Are you sure you want to Delete ?",
        onOk: () => {
          resolve(true)
          // setPreviewOffer({ ...previewOffer, image: "" })
          setFileList([])
          setFile("")
          setNumPages(null)
          setCurrentPage(1)
        },
        onCancel: () => {
          reject(true)
        },
      })
    })
  }
  const isFileUpload = (event) => {
    console.log("event", event)
    if (Array.isArray(event)) {
      return event
    }

    return event && event.fileList
  }

  const onFinish = async (values) => {
    console.log("val------", values,)
    console.log(pdfBlobData)
    setLoading(true)
    if (filelist.length === 1) {
      const formData = new FormData()
      // if (createPage) {
      //   const blob = new Blob([pdfBlobData], { type: 'application/pdf' });
      //   // formData.append('file', blob, 'filename.pdf');
      //   // const layoutDataString = JSON.stringify(pdfBlobData);
      //   // formData.append('layoutData', layoutDataString);

      //   formData.append('file', blob, 'filename.pdf');
      //   const layoutDataString = JSON.stringify(blob._INTERNAL__LAYOUT__DATA_);
      //   formData.append('_INTERNAL__LAYOUT__DATA_', layoutDataString);

      //   console.log("pdf----blob=-============", formData)
      // } else {
      //   console.log("pdf--ofrm=-============", formData)

      // }
      formData.append("file", filelist[0].originFileObj)
      let templist = []
      if (values.listcustomer) {
        values.listcustomer.map((cl) => {
          templist.push({
            customercode: cl,
          })
        })
      } else {
        data.map((cl) => {
          templist.push({
            customercode: cl.customercode,
          })
        })
      }
      console.log("customer_List--------", templist)
      let fileData = {
        title: values.title,
        discription: descriptions ?? "",
        selectedCustomer: templist,
      }
      try {
        await axios
          .post(`${APIs.baseURL}/ecatalouge-service/v1/ecatalouge`, fileData, {
            headers: {
              "Content-Type": "application/json",
              "MNF-CODE": `${userInfo.manufacturerCode}`,
              "Authorization": `Bearer ${userInfo.token}`,
            },
          })
          .then((response) => {
            if (response.status == 200) {
              console.log(response.data)
              axios
                .put(
                  `${APIs.baseURL}/ecatalouge-service/v1/ecatalouge-file/${response.data.ecatalogueId}`,
                  formData, {
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${userInfo.token}`,
                  }
                }
                )

                .then((res) => {
                  if (res.status == 200) {
                  }
                  form.resetFields()
                  message.success("Data saved successfully")
                  setFileList([])
                  setFile("")
                  setNumPages(null)
                  setCurrentPage(1)
                  setTitle("")
                  setTerms(1000)
                  setDescription("")
                  setLoading(false)
                  apiCall()
                  onKeyChange("2")
                })
            } else {
              message.error(`${response.error ? response.error : "some thing went wront"}`)
              setLoading(false)
            }
          })
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    } else {
      message.error("Please Upload Image")
      setLoading(false)
    }
  }



  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo)
    if (filelist.length === 0 && title.length !== 0) {
      message.error("Please Upload An Image")
    } else if (filelist.length === 0 && title.length === 0) {
      message.error("Please Upload Image and Enter Title")
    } else if (title.length === 0) {
      message.error("Please Enter Title")
    }
  }

  function openPdfModal() {
    console.log("Open Modal")
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const onClose = () => {
    setIsModalVisible(false)
  }

  function onZoomHandle(event) {
    console.log(event)
    if (event === "+") {
      setScale((prev) => prev + 0.1)
    } else {
      setScale((prev) => prev - 0.1)
    }
  }



  return (
    <div className={loading && createPage ? "create_container onsubmit_loader_container" : createPage ? "create_container" : "catalogue-container"}>
      <div className={createPage ? "catalogue-formy create_form" : "catalogue-formy"}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <div className={createPage ? "categorCol label-and-heading create_cat_upload" : "categorCol label-and-heading"}>
            {" "}
            <div className={createPage ? "uploadk uploadk_cat" : "uploadk"}>
              <Form.Item
                name="pdf"
                valuePropName="fileList"
                getValueFromEvent={() => isFileUpload()}
              >
                <Upload {...props} maxCount={1}>
                  {" "}
                  <Button icon={<PlusOutlined />}> Upload</Button>
                  <div>
                    <h3 className="image-upload-side-text">
                      Upload a catalogue
                    </h3>
                    <p className="ant-upload-text">
                      Click or Drag & drop an pdf file to upload. Only pdf files
                      with size up to 50MB is accepted
                    </p>
                  </div>
                </Upload>
              </Form.Item>
            </div>
          </div>
          <div className="discountCol">
            <Form.Item
              label="Title"
              name="title"
              onChange={onhandleTitle}
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
          </div>
          <div className="discountCol" style={{ borderRadius: "50px" }}>
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
                  message: "Descriptions cannot be longer than 1000 characters",
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
          </div>
          <Form.Item name="Radio-button" valuePropName="checked">
            <div className="radioGroup">
              <Radio.Group onChange={(e) => setValue(e.target.value)} value={value}>
                <Radio value={1}> Apply All</Radio>
                <Radio value={2}>
                  Select Customer
                </Radio>
              </Radio.Group>
            </div>
          </Form.Item>
          {value === 2 && (
            <>
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
                  onChange={(val) => setCustomerList(val)}
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
                            <p>{item.customerName}</p>
                          </Tooltip>
                        </Option>
                      )
                    })
                    : ""}
                </Select>
              </Form.Item>
            </>
          )}
          <div
            className="discountCol"
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Button
              type="primary"
              htmlType="submit"
              className={createPage ? "nextbtn create_ecat_btn" : "nextbtn"}
              onClick={onKeyChange.onKeyChange}
            >
              {createPage ? "Create" : "SUBMIT"}
            </Button>
            {loading && (
              <Spin className="onsubmit_loader" />
            )}
          </div>
        </Form>
      </div>
      {!createPage && <div className="catalogue-preview">
        <h4 className="catalogue-previewHeader text-style">
          Catalogue Preview
        </h4>
        {filelist?.length ? (
          <div className="displayPdf">
            <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
              <Page
                scale={1.0}
                height={350}
                // width={300}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                pageNumber={currentPage}
                renderInteractiveForms={false}
              />
            </Document>
            <menu className="menuButtonsPdf">
              <li className="menubtnpdf">
                <Button
                  type="text"
                  disabled={currentPage <= 1}
                  onClick={previousPage}
                >
                  <LeftOutlined />
                </Button>
              </li>
              <li className="pageNumber">
                <span>
                  {currentPage} / {numPages}
                </span>
              </li>
              <li className="menubtnpdf">
                <Button
                  type="text"
                  disabled={currentPage >= numPages}
                  onClick={nextPage}
                >
                  <RightOutlined />
                </Button>
              </li>
              <li onClick={openPdfModal} style={{ cursor: "pointer" }}>
                <span>
                  <ExpandAltOutlined />
                </span>
              </li>
            </menu>
          </div>
        ) : (
          ""
        )}
        {title ? <h4 className="preview-title">{title}</h4> : ""}
        {descriptions ? (
          <div
            className="preview-description"
            dangerouslySetInnerHTML={{ __html: descriptions }}
          ></div>
        ) : (
          ""
        )}
      </div>}
      <Modal
        centered
        className="viewPdfModal"
        title="View Pdf"
        visible={isModalVisible}
        onCancel={handleCancel}
        maskClosable={false}
        onClose={onClose}
        closeIcon={
          <div className="product_details">
            {" "}
            <svg
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.5912 14.4788L22.0783 8.99175C22.2016 8.84776 22.2661 8.66254 22.2588 8.47311C22.2514 8.28367 22.1729 8.10398 22.0389 7.96993C21.9048 7.83588 21.7251 7.75735 21.5357 7.75003C21.3463 7.74271 21.161 7.80715 21.017 7.93046L15.5299 13.4176L10.0429 7.92293C9.89886 7.79962 9.71364 7.73519 9.52421 7.7425C9.33478 7.74982 9.15508 7.82835 9.02103 7.9624C8.88698 8.09645 8.80845 8.27615 8.80113 8.46558C8.79382 8.65501 8.85825 8.84023 8.98156 8.98422L14.4687 14.4788L8.97404 19.9659C8.89524 20.0334 8.83125 20.1165 8.78607 20.2098C8.74089 20.3032 8.7155 20.4049 8.7115 20.5086C8.70749 20.6123 8.72496 20.7156 8.7628 20.8122C8.80064 20.9088 8.85804 20.9965 8.9314 21.0699C9.00475 21.1432 9.09247 21.2006 9.18906 21.2385C9.28565 21.2763 9.38902 21.2938 9.49268 21.2898C9.59634 21.2858 9.69805 21.2604 9.79143 21.2152C9.88481 21.17 9.96785 21.106 10.0353 21.0272L15.5299 15.5401L21.017 21.0272C21.161 21.1505 21.3463 21.215 21.5357 21.2077C21.7251 21.2003 21.9048 21.1218 22.0389 20.9878C22.1729 20.8537 22.2514 20.674 22.2588 20.4846C22.2661 20.2952 22.2016 20.1099 22.0783 19.9659L16.5912 14.4788Z"
                fill="#0A7CA7"
              />
              <rect
                x="0.5"
                y="0.5"
                width="29"
                height="29"
                rx="3.5"
                stroke="#0A7CA7"
              />
            </svg>
          </div>
        }
        footer={null}
        width="100%"
      >
        {filelist?.length ? (
          <div className="displayPdf displayonModal">
            <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
              <Page
                scale={scale}
                height={500}
                // width={300}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                pageNumber={currentPage}
                renderInteractiveForms={false}
              />
            </Document>
            <menu className="menuButtonsPdf">
              <li className="menubtnpdf">
                <Button
                  type="text"
                  disabled={currentPage <= 1}
                  onClick={previousPage}
                >
                  <LeftOutlined />
                </Button>
              </li>
              <li className="pageNumber">
                <span>
                  {currentPage} / {numPages}
                </span>
              </li>
              <li className="menubtnpdf">
                <Button
                  type="text"
                  disabled={currentPage >= numPages}
                  onClick={nextPage}
                >
                  <RightOutlined />
                </Button>
              </li>
              <li>
                <menu className="zoom-in-out">
                  <li className="plus" onClick={() => onZoomHandle("+")}>
                    <ZoomInOutlined />
                  </li>
                  <li className="minus" onClick={() => onZoomHandle("-")}>
                    <ZoomOutOutlined />
                  </li>
                </menu>
              </li>
            </menu>
          </div>
        ) : (
          ""
        )}
      </Modal>
    </div>
  )
}
export default UploadCatelogue