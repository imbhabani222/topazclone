import * as React from "react"
import { useState, useEffect } from "react"
import "./EditRequest.css"
import axios from "axios"
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  message,
  Divider,
  Modal,
  Table,
  Card,
  Spin,
} from "antd"
import "antd/dist/antd.css"
import { APIs } from "../../../worker"
import { LoadingOutlined } from "@ant-design/icons"
import { useDispatch, shallowEqual, useSelector } from "react-redux"
import {
  deleteOrderItems,
  orderStatusUpdate,
  manufacturerConversation,
} from "../../../action/useraction"
import Columns from "./columns"
import { checkNumbervalue } from "../../onboard_manufactures"
import ChatConversation from "./chatConversation"
import { useLocation } from "react-router"

const { TextArea } = Input

const formater = (num, decimals) =>
  num?.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

function EditRequest({ iseditOrder, orderDetails, newArrs, setViewOrder, setProductEditState , backArrowClick }) {
  const [isloading, setIsLoading] = useState(false)
  const [disableItem, setDisableItem] = useState(true)
  const [edit, setEdit] = useState("")
  const [Total, setTotal] = useState("")
  const [orderList, setOrderList] = useState("")
  const [tableData, setTableData] = useState([])
  const [finalOrder, setFinalOrder] = useState({})
  const orderSumData = useSelector((state) => state.summary)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [active, setActive] = useState("")
  const [data, setData] = useState("")
  const [modalname, setModalname] = useState("")
  const [editvalue, setEditvalue] = useState("")
  const [card, setCard] = useState([])
  const [dataSource, setDataSource] = useState({})
  const [propData, setPropData] = useState("")
  const [orderid, setOrderid] = useState("")
  const [conversationId, setConversationId] = useState(null)
  const location = useLocation()
  const [user, setUser] = useState({
    shippinghandling: "",
    taxamount: "",
    promotionsdiscounts: "",
  })
  const [shipping, setShipping] = useState("")
  const [promotition, setPromotition] = useState("")
  const [taxamount, setTaxamount] = useState("")
  const [custInfo, setCustInfo] = useState("")
  const userInfo = JSON.parse(localStorage.getItem("userinfo"))

  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const reducerData = useSelector((state) => state || null, shallowEqual)
  const {
    OrderStatusUpdate: { resultData, loading },
    deleteOrderItems: { resultData: deleteOrderData },
  } = reducerData

  useEffect(() => {
    if (resultData
      // || deleteOrderData
    ) {
      // if (deleteOrderData) {
      //   // message.success(`Product is deleted successfully`)
      // }

      EditFunction()
    }
  }, [resultData, deleteOrderData,location.state])

  // console.log("new---",newArrs,)

  const EditFunction = async () => {
    dispatch({ type: "DELETE_ORDER_ITEM_CLEAR" })
    dispatch({ type: "MANUFACTURER_CONVERSATION_CLEAR" })
    console.log("arr---------------",newArrs)
    await axios
      .get(`${APIs.baseURL}/order-service/v1/order/${newArrs[0].orderID}`,{
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userInfo.token}`,
        }
      }
      )
      .then((res) => {
        const orderList = res.data.orderItems
        orderList.forEach((element) => {
          element.originalAmount = element.price
          element.orderSqFeetPrice = element.sqftprice
          element.orderPrice = element.price
        })
        let data1 = {
          amountwithtax: res.data.amountwithtax,
          amountwithouttax: res.data.amountwithouttax,
          shippinghandling: res.data.shippinghandling,
          promotionsdiscounts: res.data.overallDiscount || 0,
          taxpercentage: res?.data?.orderTax?.taxpercentage.replaceAll("%", ""),
          taxamount: res?.data?.orderTax?.taxamount,
        }
        setDataSource(data1)
        setTableData(orderList)
        setOrderList(orderList)
        setFinalOrder(res.data)
      })
  }
  let newArr = []

  if (orderList != "") {
    orderList.map((e) => {
      newArr.push({
        orderID: [],
        quantity: e.quantity,
        thickness: e.product.thickness,
        size: e.size,
        sqftprice: e.sqftprice,
        image:
          e.product.productimage !== null
            ? e.product.productimage.imagebyte
            : "",
        productTitle: e.product.productTitle,
        orderItemsId: e.orderItemId,
        discription: e.product.discription,
        orderItems: e.orderItems,
        totlaValue: e.price,
        orderDiscount: {
          ...e.orderDiscount,
          promotionsdiscounts: e.orderDiscount.promotionsdiscounts,
        },
      })
    })
  }

  useEffect(() => {
    EditFunction()
  }, [])

  console.log(orderid)

  const editRow = (record, flag) => {
    if (flag) {
      if (conversationId === record.orderItemId) {
        setConversationId(null)
      } else {
        setConversationId(record.orderItemId)
      }
    } else {
      setEdit(record.orderItemId)

      setDisableItem(!disableItem)
    }
  }

  const OnSubmitButton = async (response) => {
    setIsLoading(true)
    let temp = finalOrder
    let tempData = temp.orderTax
    let tempOrder = temp.orderItems[0].orderDiscount

    temp = {
      ...temp,
      amountwithouttax: response.amountwithouttax,
      amountwithtax: Number(reduceAmount(dataSource)),
      shippinghandling: response.shippinghandling,
      overallDiscount: response.promotionsdiscounts,
      orderTax: {
        ...tempData,
        taxamount: response.taxamount,
        taxpercentage: response.taxpercentage,
      },
      orderstatus: { status: "Quote Sent", statusid: 8 },
    }

    try {
      await axios
        .put(`${APIs.baseURL}/order-service/v1/order/${newArrs[0].orderID}`, temp,{
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userInfo.token}`,
          }
        }
        )

        .then((response) => setDataSource({ updatedAt: response }))
      // setTableData( updatedAt: response });
      message.success("Data Updated Successfully.")
      setIsLoading(false)
      backArrowClick()
      setViewOrder(null)
    } catch (err) {
      message.error("Data update failed")
      setIsLoading(false)
    }
  }

  const onInputChange = (key, index, key2) => (e) => {
    e.preventDefault()
    const newData = [...tableData]
    if (key === "sqftprice" || key === "quantity") {
      newData[index][key] = +e.target.value
      newData[index]['orderSqFeetPrice'] = newData[index]['sqftprice']
      newData[index]["totalSqft"] = newData[index]["size"]
        .replaceAll("ft", "")
        .split("*")
        .reduce((a, b) => a * b, 1)
      newData[index]["price"] =
        newData[index]["sqftprice"] *
        newData[index]["quantity"] *
        newData[index]["totalSqft"]
      const discountAmount =
        newData[index]["price"] *
        (Number(newData[index]["promotionsdiscounts"] || 0) / 100)
      newData[index]["price"] = Number(
        Number(newData[index]["price"]) - discountAmount
      ).toFixed(2)
    } else if (key === "orderDiscount") {
      if (+e.target.value <= 50) {
        newData[index]["totalSqft"] = newData[index]["size"]
          .replaceAll("ft", "")
          .split("*")
          .reduce((a, b) => a * b, 1)
        newData[index]["price"] =
          newData[index]["sqftprice"] *
          newData[index]["quantity"] *
          newData[index]["totalSqft"]
        newData[index]["promotionsdiscounts"] = +e.target.value
        const discountAmount = newData[index]["price"] * (Number(e.target.value) / 100)
        newData[index]["price"] = Number(
          Number(newData[index]["price"]) - discountAmount
        ).toFixed(2)
        newData[index]["orderPrice"] = Number(newData[index]['price'])
      } else {
        message.error("Discount should not be greatr then 50%")
      }
    }
    setTableData(newData)
    let NumArry = newData.map((e) => e.price)
    const totalPrice = NumArry.reduce((a, b) => Number(a) + Number(b), 0)
    setTotal(totalPrice)
    setDataSource({
      ...dataSource,
      amountwithouttax: totalPrice,
      taxamount: totalPrice * 0.18,
      amountwithtax:
        totalPrice + totalPrice * 0.18 + parseInt(dataSource.shippinghandling),
    })
  }

  const deleteOrder = (record) => {
    // if (tableData?.length === 1) {
    const { confirm } = Modal
    return new Promise((resolve, reject) => {
      confirm({
        title: "Are you sure you want to Delete ?",
        onOk: () => {
          resolve(true)
          dispatch(deleteOrderItems({ params: record?.orderItemId }))
          // backArrowClick()
          if (tableData?.length === 1) {
            setViewOrder(null)
            setProductEditState(true)
          }
        },
        onCancel: () => {
          reject(true)
        },
      })
    })
    // } else {
    //   dispatch(deleteOrderItems({ params: record?.orderItemId }))
    //   setIsModalVisible(false)
    //   // setViewOrder(null)
    // }
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const onClose = (e) => { }

  const showDiscounts = (discount) => {
    setActive("showDiscounts")
    setIsModalVisible(true)
    setModalname("Promotions & Discounts")
    setPropData(discount)
  }
  const showShipping = (shipping) => {
    setActive("showShipping")
    setIsModalVisible(true)
    setModalname("Shipping & Handling")
    // setTableData({ ...tableData, shippinghandling: shipping });
    setPropData(shipping)
  }
  const showGSTModal = (gst) => {
    setActive("showGSTModal")
    setIsModalVisible(true)
    setModalname("GST 18%")
    setPropData(gst)
  }

  const reduceAmount = (response) => {
    const {
      amountwithouttax,
      promotionsdiscounts,
      shippinghandling,
      taxamount,
    } = response

    const gstamount = (
      parseInt(Math.round(taxamount)) +
      parseInt(shippinghandling) -
      parseInt(promotionsdiscounts) +
      parseInt(amountwithouttax)
    ).toFixed(2)
    // setDataSource({...dataSource, amountwithtax : gstamount})
    return gstamount
  }

  const calculateGST = (response) => {
    const { amountwithouttax } = response
    const gstamount = (parseInt(amountwithouttax) * 0.18).toFixed(2)
    return gstamount
  }

  useEffect(() => {
    // apiCall();
  }, [shipping])

  const apiCall = async () => {
    setIsModalVisible(false)

    await axios
      .get(`${APIs.baseURL}/order-service/v1/order/${newArrs[0].orderID}`,{
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userInfo.token}`,
        }
      }
      )
      .then((res) => {
        setOrderid(res.data.orderid)

        setData(res.data)

        let data1 = {
          amountwithtax: res.data.amountwithtax,
          amountwithouttax: res.data.amountwithouttax,
          shippinghandling: res.data.shippinghandling,
          promotionsdiscounts: res.data.orderItems.map(
            (pro) => pro.orderDiscount.promotionsdiscounts
          ),
          taxpercentage: res?.data?.orderTax?.taxpercentage.replaceAll("%", ""),
          taxamount: res?.data?.orderTax?.taxamount,
        }
        setDataSource(data1)

        let temp = []

        res.data.orderItems.map((e) => {
          temp.push({
            id: user.orderid,
            // tags: e.categoryType.tags,
            // product: e.orderItems.product.categoryType.productTitle,
            productid: e.product.productid,
            productTitle: e.product.productTitle,
            // categoryType: e.categoryType,
            subcategory: e.product.categoryType.subcategory[0].subcategory,
            // productImage: e.product.categoryType.productImage,
            imagebyte: e.product.productimage.imagebyte,
            quantity: e.quantity,
            categoryName: e.product.categoryType.categoryName,
            thickness: e.product.thickness,
            brand: e.product.brand,
            size: e.size,
            sqftprice: e.sqftprice,
          })
        })

        setCard(temp)
      })
  }

  const onFinish = (values) => {
    console.log(values)
    const { message } = values
    const payloadObject = {
      orderItemId: conversationId,
      manufacturerconversation: message,
    }

    dispatch(
      manufacturerConversation({
        params: newArrs[0].orderID,
        body: payloadObject,
      })
    )
    form.resetFields()
    setIsModalVisible(false)
  }

  const onFinishFailed = (errorInfo) => { }
  const getTaxAmount = (flag, value) => {
    if (flag === "discount") {
      const taxamount =
        dataSource?.amountwithouttax -
        Number(value) +
        Number(dataSource?.shippinghandling)
      const taxpercentage = dataSource?.taxpercentage?.split("%")?.[0] / 100
      return Number(taxamount) * Number(taxpercentage)
    }
    if (flag === "shipping") {
      const taxamount =
        dataSource?.amountwithouttax +
        Number(value) -
        Number(dataSource.promotionsdiscounts)
      const taxpercentage = dataSource?.taxpercentage?.split("%")?.[0] / 100
      return Number(taxamount) * Number(taxpercentage)
    }
  }

  return (
    <div className={loading?"onboard-tabs-container onsubmit_loader_container":"onboard-tabs-container"}>
      {tableData?.length > 0 && (
        <Table
          size={"middle"}
          columns={Columns(
            deleteOrder,
            onInputChange,
            editRow,
            edit,
            setIsModalVisible,
            setModalname,
            setActive,
          )}
          pagination={false}
          className="table-header"
          rowKey={(rcd) => rcd.orderItemId}
          expandable={{
            // expandIconColumnIndex: 10,
            expandedRowKeys: [conversationId],
            expandIcon: false,
            showExpandColumn: false,
            expandedRowRender: (record) => (
              <div className="order">
                <ChatConversation
                  orderId={newArrs[0].orderID}
                  orderItemId={conversationId}
                />
              </div>
            ),
          }}
          dataSource={tableData}
        />
      )}

      <div className="order-div2">
        <Row>
          <Col xs={24} sm={24} md={18} lg={17} xl={17}>
            {""}
          </Col>
          <Col xs={24} sm={24} md={6} lg={7} xl={7}>
            <Card bordered={false} bodyStyle={{ padding: "0px" }}>
              <div className="Subdiv">
                <table style={{ width: "100%" }}>
                  <tr>
                    <td>
                      <h4>Item Subtotal</h4>
                    </td>
                    <td>
                      {" "}
                      <p>
                        {" "}
                        <strong>
                          ₹{" "}
                          {Total === ""
                            ? formater(dataSource.amountwithouttax)
                            : formater(Total)}
                        </strong>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h4>Promotions & Discounts</h4>
                    </td>
                    <td>
                      {" "}
                      {promotition === "" ? (
                        <p>
                          <strong>
                            {" "}
                            ₹ {formater(dataSource.promotionsdiscounts)}
                          </strong>
                        </p>
                      ) : (
                        <p>{promotition}</p>
                      )}
                    </td>

                    <td>
                      <svg
                        style={{
                          float: "right",
                          marginLeft: "10px",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          showDiscounts(dataSource.promotionsdiscounts)
                        }
                        width="24"
                        height="24"
                        viewBox="0 0 31 31"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 19.8469V22.1269C9 22.3369 9.165 22.5019 9.375 22.5019H11.655C11.7525 22.5019 11.85 22.4644 11.9175 22.3894L20.1075 14.2069L17.295 11.3944L9.1125 19.5769C9.0375 19.6519 9 19.7419 9 19.8469ZM22.2825 12.0319C22.575 11.7394 22.575 11.2669 22.2825 10.9744L20.5275 9.21937C20.235 8.92687 19.7625 8.92687 19.47 9.21937L18.0975 10.5919L20.91 13.4044L22.2825 12.0319Z"
                          fill="#0A7CA7"
                        />
                        <rect
                          x="0.5"
                          y="0.5"
                          width="30"
                          height="30"
                          rx="3.5"
                          stroke="#0A7CA7"
                        />
                      </svg>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {" "}
                      <h4>Shipping & Handling</h4>
                    </td>
                    <td>
                      {shipping === "" ? (
                        <p>
                          <strong>
                            ₹ {formater(dataSource?.shippinghandling)}
                          </strong>
                        </p>
                      ) : (
                        <p>{shipping}</p>
                      )}
                    </td>

                    <td>
                      <svg
                        style={{
                          float: "right",
                          marginLeft: "10px",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          showShipping(dataSource.shippinghandling)
                        }
                        width="24"
                        height="24"
                        viewBox="0 0 31 31"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 19.8469V22.1269C9 22.3369 9.165 22.5019 9.375 22.5019H11.655C11.7525 22.5019 11.85 22.4644 11.9175 22.3894L20.1075 14.2069L17.295 11.3944L9.1125 19.5769C9.0375 19.6519 9 19.7419 9 19.8469ZM22.2825 12.0319C22.575 11.7394 22.575 11.2669 22.2825 10.9744L20.5275 9.21937C20.235 8.92687 19.7625 8.92687 19.47 9.21937L18.0975 10.5919L20.91 13.4044L22.2825 12.0319Z"
                          fill="#0A7CA7"
                        />
                        <rect
                          x="0.5"
                          y="0.5"
                          width="30"
                          height="30"
                          rx="3.5"
                          stroke="#0A7CA7"
                        />
                      </svg>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      {" "}
                      <h4>GST {dataSource?.taxpercentage}%</h4>
                    </td>

                    <td>
                      <p>
                        <strong>₹ {formater(dataSource?.taxamount)}</strong>
                        {/* <strong>₹{parseInt(Total) * 0.18}</strong> */}
                      </p>
                    </td>

                    <td>
                      <svg
                        style={{
                          float: "right",
                          marginLeft: "10px",
                          cursor: "pointer",
                        }}
                        onClick={() => showGSTModal(dataSource.taxamount)}
                        width="24"
                        height="24"
                        viewBox="0 0 31 31"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 19.8469V22.1269C9 22.3369 9.165 22.5019 9.375 22.5019H11.655C11.7525 22.5019 11.85 22.4644 11.9175 22.3894L20.1075 14.2069L17.295 11.3944L9.1125 19.5769C9.0375 19.6519 9 19.7419 9 19.8469ZM22.2825 12.0319C22.575 11.7394 22.575 11.2669 22.2825 10.9744L20.5275 9.21937C20.235 8.92687 19.7625 8.92687 19.47 9.21937L18.0975 10.5919L20.91 13.4044L22.2825 12.0319Z"
                          fill="#0A7CA7"
                        />
                        <rect
                          x="0.5"
                          y="0.5"
                          width="30"
                          height="30"
                          rx="3.5"
                          stroke="#0A7CA7"
                        />
                      </svg>
                    </td>
                  </tr>
                  <tr
                    style={{
                      borderTop: "1px solid #D0CACA",
                    }}
                  >
                    <td
                      style={{
                        padding: "9px 0px",
                      }}
                    >
                      <h4>Order Total</h4>
                    </td>
                    <td>
                      {" "}
                      <p>
                        <strong>₹{reduceAmount(dataSource)}</strong>
                        {/* <strong>₹{dataSource}</strong> */}
                      </p>
                    </td>
                    <td></td>
                  </tr>
                </table>
              </div>
            </Card>
          </Col>
          {/* <Col
              xs={24}
              sm={24}
              md={18}
              lg={17}
              xl={17}
              className="order-total-bg"
            >
              {""}
            </Col>
            <Col
              xs={24}
              sm={24}
              md={6}
              lg={7}
              xl={7}
              className="order-total-bg"
            ></Col> */}
        </Row>
      </div>

      <hr
        style={{
          border: "1px solid #E0E0E0",
          marginTop: "16px",
          marginBottom: "16px",
        }}
      />

      <div style={{ textAlign: "right" }}>
        <Row justify="end" style={{ gap: "10px" }}>
          <Col>
            <Button
              // id="offer-cancelBtn"
              className="edit-cancel"
              type="primary"
              htmlType="reset"
              onClick={() => setViewOrder(null)}
            >
              CANCEL
            </Button>
          </Col>
          <Col>
            <Button
              type="primary"
              htmlType="submit"
              className="advert-saveBtn"
              onClick={() => OnSubmitButton(dataSource)}
            >
              SEND
            </Button>
            {loading && (
              <Spin className="onsubmit_loader" />
            )}
          </Col>
        </Row>
      </div>

      <Modal
        title={
          modalname == "Promotions & Discounts"
            ? " Promotions & Discounts"
            : modalname == "Shipping & Handling"
              ? "Shipping & Handling"
              : modalname == "GST 18%"
                ? "GST"
                : ""
        }
        onCancel={handleCancel}
        onClose={onClose}
        closeIcon={
          <svg
            style={{ marginRight: "15px", marginTop: "15px" }}
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
        }
        footer={null}
        width="427px"
        height="321px"
        visible={isModalVisible}
        onOk={handleOk}
        okText="Save"
      >
        <Form
          className="Modal-form"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
          form={form}
        >
          {active === "showDiscounts" ? (
            <Form.Item
              className="changePrice_modal"
              label={<strong>Amount</strong>}
              name="promotionsdiscounts"
              initialValue={dataSource?.promotionsdiscounts}
            >
              <Input
                placeholder="Enter Amount"
                className="modal-input-box"
                onKeyPress={(event) => {
                  if (checkNumbervalue(event)) {
                    event.preventDefault()
                  }
                  if(event.target.value >= dataSource.amountwithouttax){
                    message.error("Promotions & Discounts must Be lessthan Subtotal")
                    event.preventDefault()
                  }
                }}
                onChange={(e) =>
                  
                  setDataSource({
                    ...dataSource,
                    promotionsdiscounts: parseInt(e.target.value || 0),
                    taxamount: getTaxAmount("discount", e.target.value || 0),
                  })
                }
                value={dataSource.promotionsdiscounts}
              />
            </Form.Item>
          ) : active === "showShipping" ? (
            <Form.Item
              className="shipping_modal"
              name="shippinghandling"
              label={<strong>Charges</strong>}
              initialValue={dataSource?.shippinghandling}
            >
              <Input
                placeholder="Enter Amount"
                className="modal-input-box"
                // value={dataSource.shippinghandling}
                onKeyPress={(event) => {
                  if (checkNumbervalue(event)) {
                    event.preventDefault()
                  }
                  if(event.target.value >= dataSource.amountwithouttax){
                    message.error("Shipping Charges must Be lessthan Subtotal")
                    event.preventDefault()
                  } 
                }}
                onChange={(e) =>
                  setDataSource({
                    ...dataSource,
                    shippinghandling: Number(e.target.value || 0),
                    taxamount: getTaxAmount("shipping", e.target.value || 0),
                  })
                }
              />
            </Form.Item>
          ) : active == "showGSTModal" ? (
            <Form.Item
              className="GST_modal"
              name="taxamount"
              label={<strong>Percentage</strong>}
              initialValue={dataSource?.taxpercentage}
            >
              <Input
                className="modal-input-box"
                placeholder="Enter your GST Amount"
                // value={user.taxamount}
                onKeyPress={(event) => {
                  if (checkNumbervalue(event)) {
                    event.preventDefault()
                  }
                }}
                onChange={(e) =>
                  setDataSource({
                    ...dataSource,
                    taxamount:
                      (e.target.value / 100) * dataSource.amountwithouttax,
                    taxpercentage: e.target.value,
                  })
                }
              />
            </Form.Item>
          ) : (
            <Form.Item
              className="GST_modal"
              name="message"
              label="Message"
              rules={[
                {
                  required: true,
                  message: "Please Enter your message!",
                },
              ]}
            // initialValue={propData}
            >
              <TextArea
                className="modal-input-box"
                rows="5"
                placeholder="Write message"
              />
            </Form.Item>
          )}
          {modalname === "conversation" ? (
            <>
              <div className="Profile-buttons">
                <Button
                  className="Cancel-btn"
                  key="back"
                  onClick={handleCancel}
                >
                  CANCEL
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="Send-button"
                >
                  Send
                </Button>
              </div>
            </>
          ) : (
            <>
              <Divider className="modal-divider" />

              <div className="Profile-buttons">
                {/* <Button className="Cancel-btn" key="back" onClick={handleCancel}>
      CANCEL
    </Button> */}
                <Button
                  type="primary"
                  className="Send-button"
                  onClick={handleCancel}
                >
                  OK
                </Button>
              </div>
            </>
          )}
        </Form>
      </Modal>
    </div>
    // </div >
  )
}
export default EditRequest
