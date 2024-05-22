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
import "antd/dist/antd.css";
import "./OrderSum.css";
import moment from "moment";
import { DownloadOutlined, PrinterOutlined, ShareAltOutlined } from "@ant-design/icons";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { EmailIcon, EmailShareButton, FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton, WhatsappIcon, WhatsappShareButton } from "react-share";

const OrderSummary = ({
  orders,
  setOrders,
  newArrs,
  orderDetails,
  orderID,
}) => {
  console.log("order-----",orders);
  const { Header } = Layout;
  const d = new Date();
  const { TabPane } = Tabs;
  let navigate = useNavigate();
  const [tableData, setTableData] = useState("");
  const [pastordersummary, setPastOrderSummary] = useState(true);

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
    setOrders(false);
  };
  console.log(dataSource);
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
          promotionsdiscounts: res.data.orderItems.map(
            (pro) => pro.orderDiscount.promotionsdiscounts
          ),
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
  console.log(orderSumData);

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
  const [showShare,setShowShare] = useState(false)
  const printRef = useRef()
  const orderPrintHandler = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Order Summary",
    // onAfterPrint: () => message.success("Print Success"),
  })

  return (
    <div className="order-summary" >
      <Modal visible={showShare} title="Share" className="share_modal" onCancel={()=>setShowShare(false)}>
        <div className="share_icons_container">
          <FacebookShareButton
            url="https://www.hutechsolutions.com/"
            quote="Order Summary"
            hashtag="#React"
            className="share_icon_btn"
          >
            <FacebookIcon /> <h2>Facebook</h2>
          </FacebookShareButton>
          <WhatsappShareButton
            url="https://www.hutechsolutions.com/"
            quote="Order Summary"
            hashtag="#React"
            className="share_icon_btn"
          >
            <WhatsappIcon /> <h2>Whatsapp</h2>
          </WhatsappShareButton>
          <TwitterShareButton
            url="https://www.hutechsolutions.com/"
            quote="Order Summary"
            hashtag="#React"
            className="share_icon_btn"
          >
            <TwitterIcon /><h2>Twitter</h2>
          </TwitterShareButton> 
          <EmailShareButton
            url="https://www.hutechsolutions.com/"
            quote="Order Summary"
            hashtag="#React"
            className="share_icon_btn"
          >
            <EmailIcon /> <h2>Email</h2>
          </EmailShareButton>
        </div>
      </Modal>
      <Modal
        title="Past Order Details"
        centered
        visible={orders}
        onCancel={handleCancel}
        footer={null}
        width={1000}
        maskClosable={false}
        bodyStyle = {{
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
      >


        <Header className="order-header" >
          <Row gutter={[32, 32]}>
            <Col xs={24} sm={24} md={11} lg={11} xl={11}>
              <div className="left_order_div">
                <Button className="order-btn1">
                  #{orderSumData?.data?.orderID}
                </Button>
                <span>
                  {` Placed on ${orderSumData?.data?.orderDate}`} 
                </span>
              </div>
            </Col>
            <Col xs={24} sm={24} md={10} lg={10} xl={10}>
              <div className="middle_order_div">
                <span>{`Status: ${orderSumData?.data?.status}`}</span>
                <Button className="order-btn2">Track</Button>
              </div>
            </Col>
            <Col xs={24} sm={24} md={3} lg={3} xl={3}>
              <div className="right_order_div">
                <Button className="order_btnIcon" onClick={()=>setShowShare(true)}><ShareAltOutlined /></Button>
                <Button className="order_btnIcon" onClick={orderPrintHandler}><PrinterOutlined /></Button>
              </div>
            </Col>
          </Row>
        </Header>
        <div className="order-div1">
          <Row gutter={[12, 12]}>
            <Col xs={24} sm={24} md={15} lg={15} xl={15}>
              <div className="order-subdiv">
                <br />
                <p>
                  <strong>Placed by :</strong>{" "}
                  {orderSumData?.data?.customerName}
                </p>
                {/* <p>Payment method:Bank Transfer</p> */}
                <p>Payment method : {orderSumData?.data?.paymentMode}</p>
              </div>
            </Col>

            <Col xs={24} sm={24} md={9} lg={9} xl={9}>
              <Tabs defaultActiveKey="1" type="card" className="order-card">
                <TabPane tab="Billed To " key="1">
                  <p style={{ paddingLeft: "19px" }}>
                    {orderSumData?.data?.addressLine}
                  </p>
                </TabPane>
                <TabPane tab="  Shipped To " key="2">
                  <p style={{ paddingLeft: "19px" }}>
                    {orderSumData?.data?.addressLine}
                  </p>
                </TabPane>
              </Tabs>
            </Col>
          </Row>
        </div>

        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <div className="grey-box">
            <h4>Order Summary</h4>
          </div>
        </Col>
        <div className="order-div2" ref={printRef}>
          <Row>
            <Col xs={24} sm={24} md={17} lg={17} xl={17} >
              <List
                className="demo-loadmore-list"
                size="large"
                itemLayout="horizontal"
                dataSource={card}
                renderItem={(item) => (
                  <List.Item >
                    <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                      <Skeleton
                        avatar
                        title={false}
                        loading={item?.loading}
                        active
                      >
                        <List.Item.Meta
                          className="headingt product-title"
                          avatar={<Avatar src={item.imagebyte} style ={{height : "86px", width:"91px"}} />}
                          title={<a>{item.productTitle}</a>}
                          description={
                            <p className="headingt product-subtitle">
                              product ID:#{item?.productid}
                            </p>
                          }
                        />
                      </Skeleton>
                    </Col>
                    <Col xs={24} sm={5} md={4} lg={4} xl={4}>
                      <h2 className="headingt prod-deails-heading">Category</h2>
                      <p className="headingt pro-details-sub">
                        {item.categoryName}
                      </p>
                    </Col>
                    <Col xs={24} sm={4} md={4} lg={4} xl={4}>
                      <h2 className="headingt prod-deails-heading">Quantity</h2>
                      <p className="headingt pro-details-sub">
                        {item.quantity}
                      </p>
                    </Col>
                    <Col xs={24} sm={4} md={4} lg={4} xl={4}>
                      <h2 className="headingt prod-deails-heading">Total</h2>
                      <p className="headingt pro-details-sub">
                        {/* ₹{reduceAmount(dataSource)} */}₹{item.total}
                      </p>
                    </Col>
                  </List.Item>
                )}
              />
            </Col>

            <Col xs={24} sm={24} md={7} lg={7} xl={7}>
              <Card bodyStyle= {{padding:"0px"}}>
                <div className="Subdiv">
                  <table width="100%">
                    <tr>
                      <td>
                        <h4>Item Subtotal</h4>
                      </td>
                      <td>
                        {" "}
                        <p>
                          {" "}
                          <strong>₹{dataSource.amountwithouttax}</strong>
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
                              - ₹{dataSource.promotionsdiscounts}
                            </strong>
                          </p>
                        ) : (
                          <p>{promotition}</p>
                        )}
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
                            <strong>₹{dataSource.shippinghandling}</strong>
                          </p>
                        ) : (
                          <p>{shipping}</p>
                        )}
                      </td>
                    </tr>

                    <tr>
                      <td>
                        {" "}
                        <h4>GST 18%</h4>
                      </td>

                      <td>
                        <p>
                          <strong>₹{dataSource.taxamount}</strong>
                        </p>
                      </td>
                    </tr>

                    <tr  style={{background: "#EDF0F1", borderTop: "1px solid #D0CACA"}}>
                      <td>
                        <h4>Order Total</h4>
                      </td>
                      <td>
                        {" "}
                        <p>
                          <strong>₹{reduceAmount(dataSource)}</strong>
                        </p>
                      </td>
                    </tr>
                  </table>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </Modal>

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
    </div>
  );
};
//gt
export default OrderSummary;
