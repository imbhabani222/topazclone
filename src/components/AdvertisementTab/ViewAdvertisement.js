import React, { useEffect, useState } from "react"
import moment from "moment"
import {
  Space,
  Table,
  Tag,
  Button,
  Image,
  Modal,
  Col,
  Row,
  Divider,
  Form,
  Card,
  Upload,
  DatePicker,
  Input,
  message,
  Tooltip,
} from "antd"
import axios from "axios"
import {
  PlusOutlined,
  SearchOutlined,
  ExclamationCircleFilled,
  LoadingOutlined,
} from "@ant-design/icons"
import TextArea from "antd/lib/input/TextArea"
import plywd from "../../assets/img/plywd.jpg"
import "./ViewAdvertisement.css"
import { useNavigate, Link } from "react-router-dom"
import { current } from "@reduxjs/toolkit"
import { CKEditor } from "@ckeditor/ckeditor5-react"
import { APIs } from "../../worker"
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"

function ViewAdvertisement({ key, advertisement, setAdvertisement }) {
  const [loading, setLoading] = useState(false)
  const [endDatefun, setEndDatefun] = useState("")
  const [isAdvertisementDetails, setIsAdvertisementDetails] = useState(false)
  const [datas, setDatas] = useState("")
  const [advInfo, setAdvInfo] = useState("")
  const [advId, setAdvId] = useState()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [page, setPage] = React.useState(1)
  const [searchInputValue, setSearchInputValue] = useState("")
  const [filterTable, setFilterTable] = useState("")
  const [tableTotal, setTableTotal] = useState(0)
  const userInfo = JSON.parse(localStorage.getItem("userinfo"))

  const [dateChagne, setDateChagne] = useState({
    startValue: "",
    endValue: "",
    endOpen: false,
  })

  let navigate = useNavigate()

  const apiCall = () => {
    axios
      .get(`${APIs.baseURL}/advertisement-service/v1/advertisements/${userInfo.manufacturerCode}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userInfo.token}`,
          "MNF-CODE": `${userInfo.manufacturerCode}`,
        }
      }
      )
      .then((res) => {
        const list = res.data
        setAdvertisement(list)
      })
  }

  useEffect(() => {
    console.log("ad")
  }, [advertisement])

  const startDate = (e) => {
    setSDate(e._d)
  }

  const [previewOffer, setPreviewOffer] = useState(
    { image: "" },
    { title: "" },
    { description: "" }
  )
  const [image, setImage] = useState({
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    fileList: [],
  })
  const [image2, setImage2] = useState(null)
  const [sDate, setSDate] = useState()
  const [form] = Form.useForm()
  const [dataUpdate, setDataUpdate] = useState(true)
  const [singeAdvertisement, setSingeAdvertisement] = useState([])
  const onhandleOfferPreview = (e) => {
    const { name, value } = e.target
    setPreviewOffer({ ...previewOffer, [name]: value })
  }

  const { previewVisible, previewImage, fileList, previewTitle } = image

  const handleChange = async ({ fileList, file }) => {
    console.log(file)
    if (file.size < 800000) {
      if (!file.url && !file.preview) {
        const imageData = await getBase64(file.originFileObj)
        setImage2(imageData)
        setImage({ fileList })
      }
      console.log("image2", image2)
    }

    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png"
    console.log(file)
    if (!isJpgOrPng) {
      setImage2(null)
      setImage({
        previewVisible: false,
        previewImage: "",
        previewTitle: "",
        fileList: [],
      })
      setPreviewOffer({ image: "" }, { title: "" }, { description: "" })
      message.error("file format not supported!")
    }

    if (file.size > 800000) {
      setImage2(null)
      setImage({
        previewVisible: false,
        previewImage: "",
        previewTitle: "",
        fileList: [],
      })
      setPreviewOffer({ image: "" }, { title: "" }, { description: "" })

      return message.error("Image must smaller than 800kb!")
    }
  }

  const handleChangePreview = async (file) => {
    let src = file?.url
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
          // if (file.status === "removed" || resolve(true))
          console.log(resolve)
          fileList.splice(index, 1)
          setImage2(null)
          setImage({
            previewVisible: false,
            previewImage: "",
            previewTitle: "",
            fileList: [],
          })
          setPreviewOffer({ image: "" }, { title: "" }, { description: "" })
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
  console.log("datas", datas)
  const handleCancel = () => {
    console.log("hello")
    setIsAdvertisementDetails(false)
    setIsModalVisible(false)
  }

  const getAdvertiseDetails = async (record) => {
    if (record.enabled) {
      let res = await axios.get(
        `${APIs.baseURL}/advertisement-service/v1/advertisements/${record.advertisementid}`
      )
      setDatas(res)
      setIsAdvertisementDetails(true)
    }
  }

  const editAdvertiseDetails = async (record) => {
    let todayDate = new Date()
    let endDate = new Date(record.endDate)
    let endtime = endDate.getTime() + 86400000
    let todaytime = todayDate.getTime()
    console.log(record, "record")
    if (record.enabled) {
      setAdvId(record.advertisementid)

      let findData = advertisement.find(
        (e) => e.advertisementid == record.advertisementid
      )

      setSingeAdvertisement(findData)

      setIsModalVisible(true)
      let res = await axios.get(
        `${APIs.baseURL}/advertisement-service/v1/advertisements/${record.advertisementid}`
      )
      console.log(res)
      setAdvInfo(res)
      setImage2(res?.data?.advertismentImage?.url)
    } else if (!record.enabled && todaytime > endtime) {
      setAdvId(record.advertisementid)

      let findData = advertisement.find(
        (e) => e.advertisementid == record.advertisementid
      )

      setSingeAdvertisement(findData)

      setIsModalVisible(true)
      let res = await axios.get(
        `${APIs.baseURL}/advertisement-service/v1/advertisements/${record.advertisementid}`
      )
      console.log(res)
      setAdvInfo(res)
      setImage2(res?.data?.advertismentImage?.url)
    }
  }
  const onFinish = async (values) => {
    setLoading(true)
    console.log(values)
    let startDate = values.startDate._d.toLocaleDateString("en-ZA")
    startDate = startDate.replaceAll("/", "-")

    let endDate = values.endDate._d.toLocaleDateString("en-ZA")
    endDate = endDate.replaceAll("/", "-")

    const imageOffer = new FormData()
    if (image.fileList.length !== 0) {
      console.log("log enterd")
      imageOffer.append("file", image.fileList[0].originFileObj)
      imageOffer.append("type", "logo")
    }

    let data = {
      title: values.title,
      discription: values.discription,
      startDate: startDate,
      endDate: endDate,
    }
    let res = await axios.put(
      `${APIs.baseURL}/advertisement-service/v1/advertisement/${advId}`,
      data, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userInfo.token}`,
      }
    }
    )

    if (image.fileList.length !== 0) {
      let responseImage = await axios.put(
        `${APIs.baseURL}/advertisement-service/v1/advertisment-file/${advId}`,
        imageOffer, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userInfo.token}`,
        }
      }
      )
      setLoading(false)
    }

    apiCall()
    setIsModalVisible(false)
  }
  console.log("id", advId)

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo)
  }

  const disableRow = async (id) => {
    let todayDate = new Date()
    let endDate = new Date(id.endDate)
    let endtime = endDate.getTime() + 86400000
    console.log(id)
    if (todayDate.getTime() > endtime) {
      const { confirm } = Modal
      if (id.enabled) {
        let res = await axios.put(
          `${APIs.baseURL}/advertisement-service/v1/status/${id.advertisementid}`, {},{
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userInfo.token}`,
          }
        }
        )
        setDataUpdate(!dataUpdate)
        console.log(res)
        if (res.status == 200) {
          message.success(res.data)
        }
      } else {
        return new Promise((resolve, reject) => {
          confirm({
            title:
              "This is an expired advertisement. Are you sure you want to enable it ? ",
            icon: <ExclamationCircleFilled />,
            content:
              "Please change the date to a future date also , if you want this advertisement to be visible on the mobile app",
            onOk: async () => {
              console.log(dataUpdate)
              resolve(true)
              let res = await axios.put(
                `${APIs.baseURL}/advertisement-service/v1/status/${id.advertisementid}`,{}, {
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${userInfo.token}`,
                }
              }
              )
              setDataUpdate(!dataUpdate)
              console.log(res)
              if (res.status == 200) {
                message.success(res.data)
              }
            },
            onCancel: () => {
              reject(true)
            },
          })
        })
      }
    } else {
      let res = await axios.put(
        `${APIs.baseURL}/advertisement-service/v1/status/${id.advertisementid}`,{},
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userInfo.token}`,
          }
        }
      )
      setDataUpdate(!dataUpdate)
      console.log(res)
      if (res.status == 200) {
        message.success(res.data)
      }
    }
  }

  const onClose = (e) => { }

  useEffect(() => {
    apiCall()
  }, [dataUpdate, key])

  useEffect(() => {
    setFilterTable(filterTable)
  }, [filterTable])
  useEffect(() => {
    form.resetFields()
  }, [form, singeAdvertisement])

  const columns = [
    {
      title: "SI No.",
      dataIndex: "name",
      key: "name",
      // render: (text, record, index) => (page - 1) * 10 + index + 1,
      render: (text, record, index) => {
        setTableTotal((page - 1) * 10 + index + 1)
        return (page - 1) * 10 + index + 1
      },
      width: "0.5%",
      fixed: "left",
      editable: true,
    },
    {
      title: "Image",
      dataIndex: "advertismentImage",
      key: "advertismentImage",
      width: "0.7%",
      editable: true,
      render: (record) => <Image width={20} src={record?.url} />,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: "1.5%",
      render: (data) => <>{data.charAt(0).toUpperCase() + data.slice(1)}</>,
      sorter: {
        compare: (a, b) => a.title.localeCompare(b.title),
        multiple: 2,
      },
      editable: true,
    },
    {
      title: "Start Date",
      key: "startDate",
      dataIndex: "startDate",
      sorter: {
        compare: (a, b) => a.startDate.localeCompare(b.startDate),
        multiple: 1,
      },
      width: "1%",
      editable: true,
    },
    {
      title: "End Date",
      key: "endDate",
      dataIndex: "endDate",
      sorter: {
        compare: (a, b) => a.endDate.localeCompare(b.endDate),
        multiple: 1,
      },
      width: "1%",
      editable: true,
    },
    {
      title: "Action",
      width: "1%",
      align: "center",
      fixed: "right",
      render: (record) => (
        <Space size="middle">
          <a
          // onClick={() => viewAdvDetails(record)}
          >
            <Tooltip placement="topLeft" title="Edit" arrowPointAtCenter>
              <svg
                width="14"
                height="14"
                viewBox="0 0 18 18"
                fill="none"
                onClick={() => editAdvertiseDetails(record)}
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.5903 6.05716C15.7856 6.25242 16.1022 6.25242 16.2974 6.05716L17.0997 5.25486C18.3001 4.05448 18.3001 2.1009 17.0997 0.900048C16.5185 0.31928 15.7459 0 14.9221 0C14.0983 0 13.3252 0.319754 12.7444 0.900522L11.9426 1.70235C11.7473 1.89761 11.7473 2.21419 11.9426 2.40945L15.5903 6.05716ZM10.9379 3.41415C10.7426 3.21891 10.426 3.21892 10.2308 3.41417L2.02485 11.6201C1.84248 11.8025 1.70368 12.0275 1.62315 12.2714L0.0362214 17.0659C-0.0485726 17.3207 0.0182204 17.6016 0.208178 17.7916C0.344133 17.9271 0.52509 17.9995 0.710784 17.9995C0.78563 17.9995 0.86095 17.9877 0.934375 17.9635L5.72737 16.3761C5.97228 16.2956 6.19776 16.1568 6.38014 15.974L14.5856 7.76855C14.7808 7.57328 14.7808 7.25668 14.5855 7.06142L10.9379 3.41415Z"
                  fill="#0A7CA7"
                />
              </svg>
            </Tooltip>
            {/* <EditFilled onClick={showModaltwo} /> */}
          </a>
          <a>
            {/* <StopFilled /> */}
            <Tooltip placement="topLeft" title="View" arrowPointAtCenter>
              <svg
                width="14"
                height="14"
                viewBox="0 0 18 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => getAdvertiseDetails(record)}
              >
                <path
                  d="M16.2535 5.22746C16.026 5.63243 15.7692 6.02071 15.4853 6.38812C15.5333 6.32549 15.5834 6.26078 15.6314 6.19815C15.1388 6.83276 14.5689 7.40267 13.9322 7.89531C13.9948 7.8473 14.0595 7.7972 14.1221 7.74919C13.4917 8.23351 12.8007 8.63638 12.068 8.94744C12.1432 8.91613 12.2183 8.88482 12.2914 8.85351C11.5524 9.16246 10.7759 9.37539 9.98051 9.48395C10.064 9.47352 10.1475 9.46099 10.231 9.45055C9.41268 9.55911 8.58187 9.55911 7.76148 9.45055C7.84498 9.46099 7.92848 9.47352 8.01198 9.48395C7.21663 9.3754 6.44006 9.16247 5.70109 8.85351C5.77624 8.88482 5.85139 8.91613 5.92445 8.94744C5.19174 8.63849 4.50076 8.23561 3.87035 7.74919C3.93297 7.7972 3.99768 7.8473 4.06031 7.89531C3.4236 7.40473 2.85373 6.83276 2.36105 6.19815C2.40906 6.26078 2.45916 6.32549 2.50717 6.38812C2.22327 6.02071 1.96651 5.63243 1.73896 5.22746V6.17519C1.9665 5.77023 2.22329 5.38194 2.50717 5.01454C2.45916 5.07716 2.40906 5.14187 2.36105 5.2045C2.8537 4.56989 3.4236 3.99999 4.06031 3.50734C3.99769 3.55535 3.93297 3.60545 3.87035 3.65347C4.50079 3.16914 5.19174 2.76627 5.92445 2.45521C5.8493 2.48652 5.77415 2.51783 5.70109 2.54915C6.44006 2.24019 7.21663 2.02726 8.01198 1.9187C7.92848 1.92914 7.84498 1.94166 7.76148 1.9521C8.57981 1.84355 9.41062 1.84355 10.231 1.9521C10.1475 1.94166 10.064 1.92914 9.98051 1.9187C10.7759 2.02725 11.5524 2.24018 12.2914 2.54915C12.2162 2.51783 12.1411 2.48652 12.068 2.45521C12.8007 2.76417 13.4917 3.16704 14.1221 3.65347C14.0595 3.60545 13.9948 3.55535 13.9322 3.50734C14.5668 3.99793 15.1388 4.56989 15.6314 5.2045C15.5834 5.14188 15.5333 5.07717 15.4853 5.01454C15.7692 5.38194 16.026 5.77023 16.2535 6.17519C16.3683 6.37977 16.5917 6.54469 16.8151 6.6073C17.0405 6.66993 17.3391 6.6407 17.5395 6.51336C17.9737 6.23363 18.1344 5.68671 17.8756 5.22743C17.5248 4.60534 17.1032 4.02085 16.6356 3.48018C16.168 2.93951 15.6377 2.46775 15.072 2.03354C13.9969 1.20895 12.7319 0.60774 11.4147 0.286294C9.96384 -0.0664993 8.45666 -0.0894633 6.99132 0.196529C6.27529 0.336395 5.59266 0.572286 4.92259 0.858278C4.32974 1.11296 3.76609 1.42819 3.23794 1.79975C2.07103 2.62224 1.07943 3.65766 0.327941 4.87259C0.288276 4.93731 0.248615 5.00202 0.211039 5.06673C0.190164 5.10222 0.169287 5.13771 0.150502 5.17111C0.0336005 5.37569 -0.0227641 5.58654 0.00854838 5.8224C0.0440365 6.0896 0.202687 6.32551 0.344641 6.55095C0.534608 6.85573 0.743347 7.1438 0.962569 7.42772C1.3738 7.96003 1.82682 8.45688 2.33825 8.89524C3.42794 9.83462 4.6867 10.5465 6.06448 10.9682C7.45058 11.394 8.9244 11.4963 10.3584 11.3022C11.755 11.1143 13.1077 10.6404 14.3058 9.8952C15.5228 9.14367 16.5541 8.14375 17.3745 6.97057C17.554 6.71381 17.721 6.44869 17.8734 6.17522C17.9945 5.96021 18.0341 5.6909 17.9673 5.45083C17.9068 5.23373 17.7398 4.99575 17.5352 4.88929C17.0948 4.65548 16.5102 4.7703 16.2535 5.22747L16.2535 5.22746Z"
                  fill="#0A7CA7"
                />
                <path
                  d="M10.2919 5.70107C10.2919 5.79709 10.2857 5.89312 10.2731 5.98915C10.2836 5.90565 10.2961 5.82214 10.3065 5.73864C10.2794 5.93487 10.2293 6.12483 10.1542 6.30645C10.1855 6.2313 10.2168 6.15615 10.2481 6.08308C10.1729 6.26052 10.0769 6.42752 9.9621 6.57993C10.0101 6.5173 10.0602 6.45259 10.1082 6.38996C9.98506 6.54861 9.8452 6.69057 9.68654 6.81165C9.74917 6.76364 9.81388 6.71354 9.87651 6.66552C9.72203 6.78242 9.55712 6.87845 9.37966 6.95151C9.45482 6.9202 9.52996 6.88889 9.60303 6.85758C9.41933 6.93273 9.23145 6.98283 9.03522 7.00997C9.11872 6.99953 9.20222 6.98701 9.28573 6.97657C9.09367 6.99953 8.89954 6.99953 8.7075 6.97657C8.791 6.98701 8.8745 6.99953 8.958 7.00997C8.76177 6.98283 8.57181 6.93273 8.39019 6.85758C8.46534 6.88889 8.54049 6.9202 8.61356 6.95151C8.43612 6.87636 8.26912 6.78034 8.11671 6.66552C8.17934 6.71354 8.24405 6.76364 8.30668 6.81165C8.14803 6.68848 8.00607 6.54862 7.88499 6.38996C7.93301 6.45259 7.98311 6.5173 8.03112 6.57993C7.91422 6.42545 7.81819 6.26054 7.74513 6.08308C7.77644 6.15824 7.80775 6.23339 7.83907 6.30645C7.76391 6.12275 7.71382 5.93487 7.68668 5.73864C7.69711 5.82214 7.70964 5.90565 7.72008 5.98915C7.69711 5.7971 7.69711 5.60296 7.72008 5.41092C7.70964 5.49442 7.69711 5.57792 7.68668 5.66142C7.71381 5.46519 7.76391 5.27523 7.83907 5.09361C7.80775 5.16877 7.77644 5.24391 7.74513 5.31698C7.82028 5.13954 7.91631 4.97254 8.03112 4.82013C7.98311 4.88276 7.93301 4.94747 7.88499 5.0101C8.00816 4.85145 8.14802 4.7095 8.30668 4.58841C8.24406 4.63643 8.17934 4.68653 8.11671 4.73454C8.27119 4.61764 8.43611 4.52161 8.61356 4.44855C8.53841 4.47986 8.46326 4.51117 8.39019 4.54249C8.57389 4.46733 8.76177 4.41724 8.958 4.3901C8.8745 4.40053 8.791 4.41306 8.7075 4.4235C8.89955 4.40053 9.09368 4.40053 9.28573 4.4235C9.20222 4.41306 9.11872 4.40053 9.03522 4.3901C9.23145 4.41723 9.42141 4.46733 9.60303 4.54249C9.52788 4.51117 9.45273 4.47986 9.37966 4.44855C9.5571 4.5237 9.7241 4.61973 9.87651 4.73454C9.81388 4.68653 9.74917 4.63643 9.68654 4.58841C9.84519 4.71158 9.98715 4.85144 10.1082 5.0101C10.0602 4.94747 10.0101 4.88276 9.9621 4.82013C10.079 4.97461 10.175 5.13953 10.2481 5.31698C10.2168 5.24183 10.1855 5.16668 10.1542 5.09361C10.2293 5.27732 10.2794 5.46519 10.3065 5.66142C10.2961 5.57792 10.2836 5.49442 10.2731 5.41092C10.2857 5.50903 10.2919 5.60506 10.2919 5.70108C10.294 5.94324 10.3963 6.19373 10.5675 6.36493C10.7303 6.52776 10.9975 6.65093 11.2313 6.64049C11.4735 6.63005 11.7261 6.55072 11.8952 6.36493C12.0643 6.18123 12.1728 5.95371 12.1707 5.70108C12.1666 5.08316 11.9891 4.43397 11.6259 3.9267C11.4192 3.63653 11.2001 3.40271 10.9203 3.18563C10.6427 2.97061 10.3567 2.8224 10.0269 2.69924C9.73046 2.5886 9.40064 2.54059 9.08542 2.52806C8.77019 2.51554 8.44245 2.55729 8.13978 2.64288C7.84544 2.72638 7.54694 2.85372 7.29015 3.0249C7.03965 3.18982 6.7975 3.38396 6.60542 3.61775C6.48643 3.76388 6.36744 3.91418 6.26933 4.07494C6.17122 4.23985 6.09815 4.41729 6.02509 4.59262C5.9061 4.88488 5.856 5.19593 5.82886 5.51112C5.80173 5.83051 5.84139 6.16451 5.91654 6.47557C5.98752 6.772 6.11068 7.06426 6.26725 7.3252C6.42381 7.58406 6.62213 7.83663 6.84758 8.03703C7.07302 8.23744 7.32354 8.42322 7.5991 8.5464C7.77446 8.62572 7.9519 8.70297 8.13561 8.75516C8.32558 8.80943 8.5218 8.83239 8.71804 8.85536C9.03534 8.89293 9.35891 8.85744 9.67203 8.79691C9.97681 8.73846 10.2774 8.61529 10.5467 8.46499C10.8097 8.31886 11.0561 8.1289 11.2648 7.9118C11.4756 7.69261 11.6677 7.43794 11.8034 7.16657C11.9411 6.89102 12.058 6.59876 12.104 6.2919C12.1353 6.09358 12.1624 5.89735 12.1645 5.69695C12.1666 5.45688 12.058 5.2022 11.889 5.0331C11.7261 4.87028 11.4589 4.74711 11.2251 4.75755C10.7199 4.78468 10.2961 5.17507 10.292 5.70112L10.2919 5.70107Z"
                  fill="#0A7CA7"
                />
              </svg>
            </Tooltip>
          </a>
          <a onClick={() => disableRow(record)}>
            {console.log(record)}
            {record.enabled === true ? (
              <Tooltip placement="topLeft" title="Disable" arrowPointAtCenter>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.24605 15.0439C0.205656 12.7133 -0.504458 9.50286 0.363145 6.5291C1.23069 3.55569 3.55584 1.23055 6.52914 0.363115C9.50278 -0.504431 12.713 0.205659 15.0439 2.24602L2.24605 15.0439ZM2.96158 15.7594C5.29346 17.798 8.50487 18.5055 11.4775 17.6356C14.4503 16.7658 16.7736 14.4388 17.6389 11.4644C18.504 8.49038 17.7916 5.28001 15.7493 2.95136L2.96158 15.7594Z"
                    fill="#0A7CA7"
                  />
                </svg>
              </Tooltip>
            ) : (
              <Tooltip placement="topLeft" title="Enable" arrowPointAtCenter>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.24605 15.0439C0.205656 12.7133 -0.504458 9.50286 0.363145 6.5291C1.23069 3.55569 3.55584 1.23055 6.52914 0.363115C9.50278 -0.504431 12.713 0.205659 15.0439 2.24602L2.24605 15.0439ZM2.96158 15.7594C5.29346 17.798 8.50487 18.5055 11.4775 17.6356C14.4503 16.7658 16.7736 14.4388 17.6389 11.4644C18.504 8.49038 17.7916 5.28001 15.7493 2.95136L2.96158 15.7594Z"
                    fill="#0A7CA7"
                  />
                </svg>
              </Tooltip>
            )}
          </a>
        </Space>
      ),
    },
  ]

  //********************************* **/
  const disabledStartDate = (startValue) => {
    // const current = current
    console.log(Date.now())
    const endValue = dateChagne.endValue
    if (!startValue || !endValue) {
      return startValue.valueOf() < Date.now() - 86400000
    }

    return (
      startValue.valueOf() < Date.now() ||
      startValue.valueOf() > endValue.valueOf()
    )
  }

  const disabledEndDate = (endValue) => {
    const startValue = dateChagne.startValue
    if (!endValue || !startValue) {
      return false
    }
    return endValue.valueOf() <= startValue.valueOf() - 86400000
  }

  const onChange = (field, value) => {
    setDateChagne((prevDateChagne) => ({
      ...prevDateChagne,
      [field]: value,
    }))
    console.log(dateChagne)
  }

  const onStartChange = (value) => {
    onChange("startValue", value)
  }

  const onEndChange = (value) => {
    onChange("endValue", value)
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

  //********************************* **/

  return (
    <>
      {/* <Row> */}
      {/* <Col xs={18} sm={14} md={14} lg={14} xl={14} className="search_bar"> */}
      <Input
        placeholder="Search"
        bordered
        className="search_bar"
        // value={value}
        onChange={(e) => {
          const currVal = e.target.value
          setSearchInputValue(currVal)

          const filteredData = advertisement.filter((o) =>
            Object.keys(o).some((k) =>
              String(o[k])
                .toLowerCase()
                .includes(currVal.toLocaleLowerCase())
            )
          )
          setFilterTable(filteredData)
        }}
        style={{ borderRadius: "5px" }}
        prefix={
          <SearchOutlined
            style={{
              color: "#CCCCCC",
              height: "13.12",
              width: "20px",
            }}
          />
        }
      />
      {/* </Col> */}
      {/* </Row> */}
      <Table
        className="adv_table"
        columns={columns}
        dataSource={searchInputValue.length == 0 ? advertisement : filterTable}
        rowClassName={(record) =>
          record.enabled == false ? "disabled-row" : ""
        }
        pagination={{
          onChange(current) {
            setPage(current)
          },
        }}
        scroll={{
          x: 800,
          xs: 500,
          // y: 300,
        }}
      />
      <div className="below-table-paginatio">
        Showing{" "}
        {+tableTotal % 10 == 0
          ? tableTotal - 9
          : tableTotal.toString().length == 1
            ? tableTotal - (tableTotal - 1)
            : tableTotal - (+tableTotal.toString().split("")[1] - 1)}{" "}
        to {tableTotal} of {advertisement.length} entries
      </div>
      <Modal
        className="viewModalAdvertisment"
        title="Advertisement Details"
        centered
        visible={isAdvertisementDetails}
        onCancel={handleCancel}
        maskClosable={false}
        footer={null}
        width={730}
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
      >
        <Row>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            {console.log(datas.data)}
            {datas?.data?.advertismentImage?.url ? (
              <Image
                width="90%"
                src={datas?.data?.advertismentImage?.url}
                alt="plywood"
              />
            ) : (
              <p>Image Unavailable</p>
            )}
          </Col>

          <Col xs={24} sm={24} md={16} lg={16} xl={16}>
            <h3
              style={{
                color: "#095198",
                fontSize: "16px",
                lineHeight: "19.2px",
              }}
            >
              General
            </h3>
            <Divider
              className="divider"
              style={{ marginTop: "0px", marginBottom: "0px" }}
            />
            <Row>
              <Col className="tr-data" xs={12} sm={12} md={8} lg={8} xl={8}>
                Title
              </Col>
              <Col className="td-data" xs={12} sm={12} md={8} lg={8} xl={16}>
                {/* {datas.data.title} */}
                {datas.data != undefined ? datas.data.title : ""}
              </Col>
              <Col className="tr-data" xs={12} sm={12} md={8} lg={8} xl={8}>
                Start Date
              </Col>
              <Col className="td-data" xs={12} sm={12} md={8} lg={8} xl={16}>
                {/* {datas.data.startDate} */}
                {datas.data != undefined ? datas.data.startDate : ""}
              </Col>
              <Col className="tr-data" xs={12} sm={12} md={8} lg={8} xl={8}>
                End Date
              </Col>
              <Col className="td-data" xs={12} sm={12} md={8} lg={8} xl={16}>
                {/* {datas.data.endDate} */}
                {datas.data != undefined ? datas.data.endDate : ""}
              </Col>
            </Row>

            <br />
            <br />
            <h3
              style={{
                color: "#095198",
                fontSize: "16px",
                lineHeight: "19.2px",
              }}
            >
              Description
            </h3>
            <Divider
              className="divider"
              style={{ marginTop: "0px", marginBottom: "0px" }}
            />
            {/* <p className="para"> */}
            {/* {datas.data.discription} */}
            <p
              dangerouslySetInnerHTML={{
                __html: datas.data != undefined ? datas.data.discription : "",
              }}
            ></p>
            {/* {datas.data != undefined ? datas.data.discription : ""} */}
            {/* </p> */}
          </Col>
        </Row>
      </Modal>

      {/* Edit Advertisement Model */}

      <Modal
        centered
        className="editAdvertisementModal"
        title="Edit Advertisement"
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
        width="80%"
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <div className="offers-cnainer">
            <Row>
              <Col xs={24} sm={20} md={14} lg={14} xl={14}>
                <div className="offers-form">
                  <Row>
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
                        initialValue={singeAdvertisement.title}
                        rules={[
                          { required: true, message: "Please input title!" },
                          { whitespace: true },
                          {
                            min: 5,
                            message: "Title must be atleast 5 characters",
                          },
                          {
                            max: 50,
                            message:
                              "Title cannot be longer than 50 characters",
                          },
                        ]}
                        onChange={onhandleOfferPreview}
                      >
                        <Input
                          name="title"
                          placeholder={
                            advInfo.data != undefined ? advInfo.data.title : ""
                          }
                        />
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
                      <Row gutter={[40]}>
                        <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                          <Form.Item
                            name="startDate"
                            label="Start Date"
                            // initialValue={singeAdvertisement.startDate}
                            initialValue={moment(singeAdvertisement.startDate)}
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
                              value={dateChagne.startValue}
                              onChange={onStartChange}
                              onOpenChange={handleStartOpenChange}
                              // onChange={startDate}
                              // disabledDate={(current) => {
                              //   return (
                              //     current &&
                              //     current.valueOf() < Date.now() - 86400000 && endDatefun !== "" ? endDatefun : ""
                              //   );
                              // }}
                              placeholder={
                                advInfo.data != undefined
                                  ? advInfo.data.startDate
                                  : ""
                              }
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                          <Form.Item
                            name="endDate"
                            label="End Date"
                            initialValue={moment(singeAdvertisement.endDate)}
                          >
                            <DatePicker
                              disabledDate={disabledEndDate}
                              format="YYYY-MM-DD "
                              value={dateChagne.endValue}
                              onChange={onEndChange}
                              open={dateChagne.endOpen}
                              onOpenChange={handleEndOpenChange}
                              placeholder={
                                advInfo.data !== undefined
                                  ? advInfo.data.endDate
                                  : ""
                              }
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                    <Col
                      xs={24}
                      sm={24}
                      md={20}
                      lg={22}
                      xl={22}
                      className="edit-advertisement-description"
                    >
                      <Form.Item
                        label="Description"
                        name="discription"
                        valuePropName="data"
                        initialValue={
                          singeAdvertisement.discription !== undefined
                            ? singeAdvertisement?.discription?.replace(
                              /(<([^>]+)>)/gi,
                              ""
                            )
                            : ""
                        }
                        placeholder={
                          advInfo.data !== undefined
                            ? advInfo.data?.discription
                            : ""
                        }
                        onChange={onhandleOfferPreview}
                        getValueFromEvent={(event, editor) => {
                          const data = editor.getData()
                          return data
                        }}
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: "Please input description!",
                      //   },
                      // ]}
                      >
                        <CKEditor
                          label="Description"
                          name="description"
                          editor={ClassicEditor}
                        />
                        {/* <TextArea
                          name="discription"
                          showCount
                          maxLength={500}
                          maxCount={500}
                          placeholder={
                            advInfo.data !== undefined
                              ? advInfo.data.discription
                              : ""
                          }
                        /> */}
                      </Form.Item>
                    </Col>
                    <Col
                      xs={24}
                      sm={24}
                      md={22}
                      lg={22}
                      xl={22}
                      className="categorCol label-and-heading"
                    >
                      {" "}
                      <div className="offers-image">
                        <Form.Item label="Upload image">
                          <Form.Item
                            required={"optional"}
                            name="logo"
                            className="uploadItemModal"
                          >
                            <Upload
                              listType="picture-card"
                              fileList={fileList}
                              maxCount={1}
                              onChange={handleChange}
                              onRemove={onGalleryFileRemove}
                              onPreview={handleChangePreview}
                              accept=".jpg, .jpeg, .png"
                            // beforeUpload={() => false}
                            >
                              {" "}
                              <Button icon={<PlusOutlined />}>Upload</Button>
                              <div>
                                {/* <h3 className="image-upload-side-text">Upload an Image</h3> */}
                                <p className="ant-upload-text">
                                  Click or Drag & drop an image file to upload.
                                  Only PNG or JPEG files with size up to 800KB
                                  is accepted
                                </p>
                              </div>
                            </Upload>
                          </Form.Item>
                        </Form.Item>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col xs={24} sm={20} md={10} lg={10} xl={10}>
                <div className="offer-product-details">
                  <h4 className="image-header text-style">Banner Preview</h4>

                  {(previewOffer.title ||
                    previewOffer.description ||
                    image2) && (
                      <Card>
                        {image2 == undefined ? (
                          <img
                            alt="example"
                            src={advInfo?.data?.advertismentImage?.url}
                          />
                        ) : (
                          <img alt="example" src={image2} />
                        )}

                        {/* {image2 || advInfo.data.advertismentImage != undefined  && <img alt="example" src={image2} />} */}
                      </Card>
                    )}
                </div>
              </Col>
            </Row>
          </div>
          <Divider className="offer-divide-button" />
          <div className="save-cancle-button">
            <Row>
              <Col
                xs={24}
                sm={9}
                md={17}
                lg={19}
                xl={12}
                className="offer-BtnCol advertisement-cancel-button adv-btn"
              >
                <Button
                  type="primary"
                  className="cancelbtn"
                  key="back"
                  onClick={handleCancel}
                >
                  CANCEL
                </Button>
              </Col>
              <Col
                xs={24}
                sm={11}
                md={7}
                lg={5}
                xl={12}
                style={{ display: "flex", alignItems: "center" }}
              >
                <Button
                  // type="primary"
                  htmlType="submit"
                  // className="advert-saveBtn"
                  className="save-btn"
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
          </div>
        </Form>
      </Modal>
    </>
  )
}

export default ViewAdvertisement
