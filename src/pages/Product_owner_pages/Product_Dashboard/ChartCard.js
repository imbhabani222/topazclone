import React, { useEffect, useState, useCallback } from "react"
import { Card, Col, Row } from "antd"
import "./Chartcard.css"
import ordersIcon from "../../../assets/img/orders-icon@2x.svg"
import suppliersIcon from "../../../assets/img/suppliers-icon@2x.svg"
import customerIcon from "../../../assets/img/customer-icon@2x.svg"
import productsIcon from "../../../assets/img/products-icon@2x.svg"
import axios from "axios"
import { APIs } from "../../../worker"
import { useNavigate } from "react-router"

const ChartCard = () => {
  const [productCount, setProductCount] = useState(0)
  const [customerCount, setCustomerCount] = useState(0)
  const [orders, setOrders] = useState(0)
  const navigate = useNavigate()

  const fetchAPI = useCallback(async () => {
    const userInfo = JSON.parse(localStorage.getItem("userinfo"))
    console.log(userInfo)
    let productCount = await axios.get(
      `${APIs.baseURL}/product-service/v1/count-product/${userInfo?.manufacturerCode} `,{
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userInfo.token}`,
        }
      }
      
    )
    setProductCount(productCount.data)
    let customCount = await axios.get(
      `${APIs.baseURL}/customer-service/v1/countcustomer/${userInfo?.manufacturerCode}`,{
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userInfo.token}`,
        }
      }
      
    )
    setCustomerCount(customCount.data)
    let orders = await axios.get(
      `${APIs.baseURL}/order-service/v1/count-orders/${userInfo?.manufacturerCode}`,{
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userInfo.token}`,
        }
      }      
    )
    setOrders(orders.data)
  }, [])

  useEffect(() => {
    fetchAPI()
  }, [fetchAPI])

  return (
    <div className="card-wrapper">
      <Row gutter={16}>
        <Col xs={24} sm={24} md={12} lg={6} xl={6}>
          <Card
            hoverable
            style={{
              background: "#FFF4CC",
              borderRadius: "5px",
              height: "129px",
            }}
            onClick={()=>navigate("/orders")}
          >
            <div className="Border-card1"></div>
            <div className="cardFlex">
              <div className="common_class">
                <h2 class="chart_number">{orders}</h2>
                <p className="chart_para">Orders</p>
              </div>
              <div>
                <img
                  alt="example"
                  width="50"
                  src={ordersIcon}
                  className="chart_img"
                />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={12} lg={6} xl={6}>
          <Card
            hoverable
            style={{
              background: "#DAF4FE",
              borderRadius: "5px",
              height: "129px",
            }}
            onClick={()=>navigate("/viewcustomers")}
          >
            <div className="Border-card3"></div>{" "}
            <div className="cardFlex">
              <div className="common_class">
                <h2 class="chart_number">{customerCount}</h2>
                <p className="chart_para">
                  Customer
                  <br /> Registrations
                </p>
              </div>
              <div>
                <img
                  alt="example"
                  width="50"
                  src={customerIcon}
                  className="chart_img"
                />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={12} lg={6} xl={6}>
          <Card
            hoverable
            style={{
              background: "#E8D4F8",
              borderRadius: "5px",
              height: "129px",
            }}
            onClick={()=>{
              localStorage.setItem("keys", "2")
              navigate("/category")}}
          >
            <div className="Border-card4"></div>{" "}
            <div className="cardFlex">
              <div className="common_class">
                {" "}
                <h2 class="chart_number">{productCount}</h2>
                <p className="chart_para">Products</p>
              </div>
              <div>
                {" "}
                <img
                  alt="example"
                  width="50"
                  src={productsIcon}
                  className="chart_img"
                />
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default ChartCard
