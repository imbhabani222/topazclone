import React, { useState, useEffect } from "react";
import { Layout, List, Avatar, Skeleton } from "antd";
import {
  Form,
  Input,
  Button,
  Divider,
  Modal,
  Row,
  Col,
  message,
  Card,
} from "antd";
import { useSelector } from "react-redux";

import { Tabs } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { APIs } from "../../worker";
// import "antd/dist/antd.css";
import "./OrderSum.css";
import moment from "moment";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import OrderSummaryPopUpWindow, { SummaryDocument } from "./OrderSummaryPopUpWindow";


const PastOrderSummary = ({
  // orders,
  // setOrders,
  newArrs,
  orderDetails,
  orderID,
}) => {
  // console.log(orders);
  const { Header } = Layout;
  const d = new Date();
  let navigate = useNavigate();
  const [tableData, setTableData] = useState("");

  const orderSumData = useSelector((state) => state.summary);

  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [active, setActive] = useState("");
  const [data, setData] = useState("");
  const [modalname, setModalname] = useState("");
  const [editvalue, setEditvalue] = useState("");
  const [card, setCard] = useState([]);
  const [dataSource, setDataSource] = useState({});
  const [propData, setPropData] = useState("");
  const [orderid, setOrderid] = useState("");
  const [user, setUser] = useState({
    shippinghandling: "",
    taxamount: "",
    promotionsdiscounts: "",
  });
  const [shipping, setShipping] = useState("");
  const [promotition, setPromotition] = useState("");
  const [taxamount, setTaxamount] = useState("");
  const userInfo = JSON.parse(localStorage.getItem("userinfo"))
  const [custInfo, setCustInfo] = useState("");
  console.log(card);
  // const [isAdvertisementDetails, setIsAdvertisementDetails] = useState(false);

  const handleOk = () => {
    setIsModalVisible(false);
  };
  const handleClick = () => {
    console.log("hello");
    navigate("/orders");
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    // setOrders(false);
  };
  const onClose = (e) => { };

  const svgIcon = (
    <svg
      style={{ marginLeft: "10px" }}
      width="20"
      height="20"
      viewBox="0 0 31 31"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 19.8469V22.1269C9 22.3369 9.165 22.5019 9.375 22.5019H11.655C11.7525 22.5019 11.85 22.4644 11.9175 22.3894L20.1075 14.2069L17.295 11.3944L9.1125 19.5769C9.0375 19.6519 9 19.7419 9 19.8469ZM22.2825 12.0319C22.575 11.7394 22.575 11.2669 22.2825 10.9744L20.5275 9.21937C20.235 8.92687 19.7625 8.92687 19.47 9.21937L18.0975 10.5919L20.91 13.4044L22.2825 12.0319Z"
        fill="#0A7CA7"
      />
      <rect x="0.5" y="0.5" width="30" height="30" rx="3.5" stroke="#0A7CA7" />
    </svg>
  );

  const showDiscounts = (discount) => {
    setActive("showDiscounts");
    setIsModalVisible(true);
    setModalname("Promotions & Discounts");
    setPropData(discount);
  };
  const showShipping = (shipping) => {
    setActive("showShipping");
    setIsModalVisible(true);
    setModalname("Shipping & Handling");
    setPropData(shipping);
  };
  const showGSTModal = (gst) => {
    setActive("showGSTModal");
    setIsModalVisible(true);
    setModalname("GST 18%");
    setPropData(gst);
  };

  const reduceAmount = (response) => {
    const {
      amountwithouttax,
      promotionsdiscounts,
      shippinghandling,
      taxamount,
    } = response;
    console.log(amountwithouttax, promotionsdiscounts, shippinghandling);
    console.log(parseInt(amountwithouttax) * 0.18);
    const gstamount = (
      parseInt(taxamount) +
      parseInt(shippinghandling) -
      parseInt(promotionsdiscounts) +
      parseInt(amountwithouttax)
    ).toFixed(2);

    return gstamount;
  };
  const calculateGST = (response) => {
    const { amountwithouttax } = response;
    const gstamount = (parseInt(amountwithouttax) * 0.18).toFixed(2);
    return gstamount;
  };
  useEffect(() => {
    apiCall();
  }, [shipping]);

  const apiCall = async () => {
    setIsModalVisible(false);

    await axios
      .get(`${APIs.baseURL}/order-service/v1/order/${orderSumData?.data?.orderID}`,{
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userInfo.token}`,
        }
      }
      )
      .then((res) => {
        console.log("res", res);
        setOrderid(res.data.orderid);

        setData(res.data);

        let data1 = {
          amountwithtax: res.data.amountwithtax,
          amountwithouttax: res.data.amountwithouttax,
          shippinghandling: res.data.shippinghandling,
          promotionsdiscounts: res.data.overallDiscount || 0,
          taxamount: parseInt(res.data.amountwithouttax) * 0.18,
        };
        setDataSource(data1);

        let temp = [];

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
            imagebyte: e.product.productimage?.[0]?.url,
            quantity: e.quantity,
            categoryName: e.product.categoryType.categoryName,
            thickness: e.product.thickness,
            brand: e.product.brand,
            total: e.price,
          });
          
        });
        setCard(temp);
      });
  };
  // console.log(orderSumData);


  const saveButton = async (dataSource) => {
    const savedata = {
      amountwithtax: dataSource.amountwithtax,
      orderTax: {
        taxamount: dataSource.taxamount,
      },
      shippinghandling: dataSource.shippinghandling,
      orderItems: [
        {
          orderDiscount: {
            promotionsdiscounts: dataSource.promotionsdiscounts[0],
          },
        },
      ],
    };

    await axios.put(
      `${APIs.baseURL}/order-service/v1/order/${newArrs[0].orderID}`,
      savedata,{
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userInfo.token}`,
        }
      }
      
    );
    console
      .log(savedata)
      .then((response) => setEditvalue({ updatedAt: response }));
    navigate("/orders");
    message.success("User updated Successfully.");
  };

  const onFinish = (values) => { };

  const onFinishFailed = (errorInfo) => { };

  // const [isAdvertisementDetails, setIsAdvertisementDetails] = useState(false);

  const printRef = useRef()
  const orderPrintHandler = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Order Summary",
    onAfterPrint: () => message.success("Print Success"),
  })

  return (
    <div className="order-summary" >
      {/* <Modal
        title="Past Order Details"
        centered
        visible={orders}
        onCancel={handleCancel}
        footer={null}
        width={1000}
        maskClosable={false}
        bodyStyle={{
          padding: "10px 25px"
        }}
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
      > */}
        <OrderSummaryPopUpWindow orderPage={"past"} orderSumData={orderSumData} orderPrintHandler={orderPrintHandler} card={card} dataSource={dataSource} promotition={promotition} shipping={shipping} reduceAmount={reduceAmount} />
      {/* </Modal> */}
      <Modal
        title={
          modalname == "Promotions & Discounts"
            ? " Promotions & Discounts"
            : modalname == "Shipping & Handling"
              ? "Shipping & Handling"
              : modalname == "GST 18%"
                ? "GST 18%"
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
        width="40%"
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
              label={<strong>MRP</strong>}
              name="promotionsdiscounts"
              initialValue={propData}
            >
              <Input
                placeholder="Enter Amount"
                onChange={(e) =>
                  setDataSource({
                    ...dataSource,
                    promotionsdiscounts: [parseInt(e.target.value)],
                  })
                }
                value={user.promotionsdiscounts}
              />
            </Form.Item>
          ) : active === "showShipping" ? (
            <Form.Item
              className="shipping_modal"
              name="shippinghandling"
              label={<strong>MRP</strong>}
              initialValue={propData}
            >
              <Input
                placeholder="Enter Amount"
                value={user.shippinghandling}
                onChange={(e) =>
                  setDataSource({
                    ...dataSource,
                    shippinghandling: e.target.value,
                  })
                }
              />
            </Form.Item>
          ) : active == "showGSTModal" ? (
            <Form.Item
              className="GST_modal"
              name="taxamount"
              label={<strong>MRP</strong>}
              initialValue={propData}
            >
              <Input
                placeholder="Enter your GST Amount"
                // value={user.taxamount}
                onChange={(e) =>
                  setDataSource({
                    ...dataSource,
                    taxamount: parseInt(e.target.value),
                  })
                }
              />
            </Form.Item>
          ) : (
            ""
          )}
        </Form>
        <Divider className="modal-divider" />

        <div className="Profile-buttons">
          {/* <Button className="Cancel-btn" key="back" onClick={handleCancel}>
              CANCEL
            </Button> */}

          <Button
            type="primary"
            htmlType="submit"
            className="Send-button"
            onClick={handleCancel}
          >
            Ok
          </Button>
        </div>
      </Modal>
      <SummaryDocument  printRef={printRef} orderSumData={orderSumData} card={card} dataSource={dataSource} promotition={promotition} shipping={shipping} reduceAmount={reduceAmount} />
    </div>

  );
};

export default PastOrderSummary; 