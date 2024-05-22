import React, { useState, useEffect } from "react"
import { Layout, List, Avatar, Skeleton, message } from "antd"
import { Button, Modal, Row, Col, Card } from "antd"
import { useSelector } from "react-redux"
import { Tabs } from "antd"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { APIs } from "../../worker"
import "antd/dist/antd.css"
import "./OrderSum.css"
import moment from "moment"
import { useReactToPrint } from "react-to-print"
import { useRef } from "react"
import OrderSummaryPopUpWindow, {
  SummaryDocument,
} from "./OrderSummaryPopUpWindow"

const CurrnOrderSummary = ({
  // currentorders,
  // setCurrentOrders,
  newArrs,
  orderDetails,
  currentScrollOrder,
}) => {
  const { Header } = Layout
  const { TabPane } = Tabs
  let navigate = useNavigate()
  const orderSumData = useSelector((state) => state.summary)

  const [card, setCard] = useState([])
  const [dataSource, setDataSource] = useState({})
  const [user, setUser] = useState({
    shippinghandling: "",
    taxamount: "",
    promotionsdiscounts: "",
  })
  const [shipping, setShipping] = useState("")
  const [promotition, setPromotition] = useState("")
  const [taxamount, setTaxamount] = useState("")
  const userInfo = JSON.parse(localStorage.getItem("userinfo"))
  const [custInfo, setCustInfo] = useState("")
  console.log(card)

  const reduceAmount = (response) => {
    const {
      amountwithouttax,
      promotionsdiscounts,
      shippinghandling,
      taxamount,
    } = response
    console.log(parseInt(amountwithouttax) * 0.18)
    const gstamount = (
      parseInt(taxamount) +
      parseInt(shippinghandling) -
      parseInt(promotionsdiscounts) +
      parseInt(amountwithouttax)
    ).toFixed(2)

    return gstamount
  }

  useEffect(() => {
    apiCall()
  }, [shipping])

  const apiCall = async () => {
    await axios
      .get(`${APIs.baseURL}/order-service/v1/order/${newArrs[0].orderID}`,{
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userInfo.token}`,
        }
      }
      )
      .then((res) => {
        let data1 = {
          amountwithtax: res.data.amountwithtax,
          amountwithouttax: res.data.amountwithouttax,
          shippinghandling: res.data.shippinghandling,
          promotionsdiscounts: res.data.overallDiscount || 0,
          taxamount: parseInt(res.data.amountwithouttax) * 0.18,
        }
        setDataSource(data1)

        let temp = []

        res.data.orderItems.map((e) => {
          temp.push({
            id: user.orderid,
            productid: e.product.productid,
            productTitle: e.product.productTitle,
            subcategory: e.product.categoryType.subcategory[0].subcategory,
            imagebyte: e.product.productimage?.[0].url,
            quantity: e.quantity,
            categoryName: e.product.categoryType.categoryName,
            thickness: e.product.thickness,
            brand: e.product.brand,
            total: e.price,
          })
        })
        setCard(temp)
      })
  }

  const printRef = useRef()
  const orderPrintHandler = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Order Summary",
    // onAfterPrint: () => message.success("Print Success"),
  })

  return (
    <div className="order_summary">
      <OrderSummaryPopUpWindow
        currentScrollOrder={currentScrollOrder}
        orderPage={"current"}
        orderSumData={orderSumData}
        orderPrintHandler={orderPrintHandler}
        card={card}
        dataSource={dataSource}
        promotition={promotition}
        shipping={shipping}
        reduceAmount={reduceAmount}
      />
      {/* </Modal> */}
      <SummaryDocument
        printRef={printRef}
        orderSumData={orderSumData}
        card={card}
        dataSource={dataSource}
        promotition={promotition}
        shipping={shipping}
        reduceAmount={reduceAmount}
      />
    </div>
  )
}

export default CurrnOrderSummary
