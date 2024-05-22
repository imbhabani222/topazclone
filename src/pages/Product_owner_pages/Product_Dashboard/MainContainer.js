import React, { useState } from "react";
import DonutPo from "./DonutPo";
import PODashboard from "./PODashboard";
import ChartCard from "./ChartCard";
import { Divider, message } from "antd";
import "./MainContainer.css";
import { Col, Row } from "antd";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getMostViewList, getOrderList } from "../../../action/useraction";
import axios from "axios";
import { APIs } from "../../../worker";
import ResponsiveBarFunc from "./ResponsiveBarFunc";


const MainContainer = () => {
  // const [salesHeader,setSalesHeader] = useState("weekly")
  // const reducerData = useSelector(state=>state || null, shallowEqual)
  // const [saleData,setSaleData] = useState({})

  // const dispatch = useDispatch()
  // const {
  //   getOrderList : {
  //     loading, resultData 
  //   },
  // } = reducerData

  // const chartMainData = {}



  // useEffect(()=>{
  //   console.log("sale----",resultData)
  //   if(resultData !== undefined){
  //     resultData.forEach(data => {
  //       data.orderItems.forEach(item=>{
  //         if(item.product.productTitle in chartMainData){
  //           chartMainData[item.product.productTitle].quantity += item.quantity
  //           chartMainData[item.product.productTitle].threshold =  item.product.stock
  //           chartMainData[item.product.productTitle].dates = [...chartMainData[item.product.productTitle].dates,data.createdDate]

  //         }else{
  //           chartMainData[item.product.productTitle] = {quantity:item.quantity,threshold:item.product.stock-item.quantity,dates:[data.createdDate]}
  //         }
  //       })
  //     });
  //     setSaleData(chartMainData)
  //   }
  // },[ resultData])
  // console.log("chart--------------",saleData)

  // useEffect(async()=>{
  //   dispatch(getOrderList())
  // },[])


  return (
    <div className="main-container">
      <h1>Dashboard</h1>
      <Divider className="chart-divider" />
      <ChartCard />
      <div className="Sub-container">
        {/* <h2>Something exciting coming soon....</h2> */}
        <Row gutter={[8, 8]}>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <DonutPo />
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <PODashboard />
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <div className="container-dash">
              <h3 className="donut_header">Top 5 Orders</h3>
              <ResponsiveBarFunc currentTab={"TOPFIVE"} />
            </div>
          </Col>
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <div className="container-dash">
              <h3 className="donut_header">Threshold and Stock</h3>
              <ResponsiveBarFunc currentTab={"THRESHOLD"} />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default MainContainer;
