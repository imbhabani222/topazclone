import { PrinterOutlined, ShareAltOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Col, Input, List, Modal, Row, Skeleton } from "antd";
import moment from "moment";
import { useState } from "react";
import { EmailIcon, EmailShareButton, FacebookIcon, FacebookShareButton, TelegramIcon, TelegramShareButton, TwitterIcon, TwitterShareButton, WhatsappIcon, WhatsappShareButton } from "react-share";
import { Header } from "antd/lib/layout/layout";
import { Tabs } from "antd";


const ShareModal = ({ printRef }) => {
  return <>
    <div className="share_icons_container">
      <WhatsappShareButton
        ref={printRef}
        url="https://www.hutechsolutions.com/"
        quote="Order Summary"
        hashtag="#React"
        className="share_icon_btn"
      >
        <WhatsappIcon round />
      </WhatsappShareButton>
      <EmailShareButton
        url="https://www.hutechsolutions.com/"
        quote="Order Summary"
        hashtag="#React"
        className="share_icon_btn"
      >
        <EmailIcon round />
      </EmailShareButton>
      <FacebookShareButton
        url="https://www.hutechsolutions.com/"
        quote="Order Summary"
        hashtag="#React"
        className="share_icon_btn"
      >
        <FacebookIcon round />
      </FacebookShareButton>
      <TwitterShareButton
        url="https://www.hutechsolutions.com/"
        quote="Order Summary"
        hashtag="#React"
        className="share_icon_btn"
      >
        <TwitterIcon round />
      </TwitterShareButton>
      <TelegramShareButton
        url="https://www.hutechsolutions.com/"
        quote="Order Summary"
        hashtag="#React"
        className="share_icon_btn"
      >
        <TelegramIcon round />
      </TelegramShareButton>
    </div>
    <h4>Or Share this link</h4>
    <div className="share_footer">
      <Input placeholder="https://igor.vn/subscribe/like" /> <Button className="order-btn2">Copy URL</Button>
    </div>
  </>
}




export const SummaryDocument = ({ printRef, orderSumData, card, dataSource, promotition, shipping, reduceAmount }) => {
  return <div className="orders_document_outerContainer" ref={printRef}>
    <h4 className="doc_topRight_header">Order </h4>
    <div className="orders_document_innerContainer">
      <div className="order_doc_top">
        <div className="doc_orderId">
          <div>
            <span>Order Id: &nbsp;</span>
            <span className="order-btn1">
              #{orderSumData?.data?.orderID}
            </span>
          </div>
          <p>
            <strong>Placed by :</strong>{" "}
            {orderSumData?.data?.customerName}
          </p>
          <p>Payment method : {orderSumData?.data?.paymentMode}</p>
        </div>
        <div className="doc_details">
          <p>
            Placed on{" "}
            {moment(orderSumData?.data?.orderDate).format("MMMM D, YYYY")}
          </p>
          <p>
            Billed To : {" "}
            {orderSumData?.data?.addressLine}
          </p>
        </div>
      </div>
      <div className="orders_document_header">
        <h3>Order Summary</h3>
      </div>
      <OrderSummaryDataField doc={true} card={card} dataSource={dataSource} promotition={promotition} shipping={shipping} reduceAmount={reduceAmount} />
    </div>
  </div>
}






const OrderSummaryDataField = ({ doc = false, card, dataSource, promotition, shipping, reduceAmount }) => {
  return <>
    <div className="order-div2">
      <Row>
        <Col xs={24} sm={24} md={doc ? 24 : 17} lg={doc ? 24 : 17} xl={doc ? 24 : 17} >
          <List
            className="demo-loadmore-list"
            size="large"
            itemLayout="horizontal"
            dataSource={card}

            renderItem={(item) => (
              <List.Item key={item.productid} >
                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                  <Skeleton
                    avatar

                    title={false}
                    loading={item?.loading}
                    active
                  >
                    <List.Item.Meta
                      className="headingt product-title"
                      avatar={<Avatar shape="square" size={64} src={item.imagebyte} />}
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
                  <div className="prod_order_head">
                    <h2 className="headingt prod-deails-heading">Category</h2>
                    <p className="headingt pro-details-sub">
                      {item.categoryName}
                    </p>
                  </div>
                </Col>
                <Col xs={24} sm={4} md={4} lg={4} xl={4}>
                  <div className="prod_order_head">
                    <h2 className="headingt prod-deails-heading">Quantity</h2>
                    <p className="headingt pro-details-sub">
                      {item.quantity}
                    </p>
                  </div>
                </Col>
                <Col xs={24} sm={4} md={4} lg={4} xl={4}>
                  <div className="prod_order_head">
                    <h2 className="headingt prod-deails-heading">Total</h2>
                    <p className="headingt pro-details-sub">
                      {/* ₹{reduceAmount(dataSource)} */}₹{item.total}
                    </p>
                  </div>
                </Col>
              </List.Item>
            )}
          />
        </Col>

        <Col xs={24} sm={24} md={doc ? 24 : 7} lg={doc ? 24 : 7} xl={doc ? 24 : 7}>
          <Card bodyStyle={{ padding: "0px" }}>
            <div className="Subdiv_orders">
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

                <tr style={{ background: "#EDF0F1", borderTop: "1px solid #D0CACA" }}>
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

  </>
}






const OrderSummaryPopUpWindow = ({ orderPage, printRef, orderSumData, orderPrintHandler, card, dataSource, promotition, shipping, reduceAmount }) => {
  // console.log(orderSumData?.data?.status,"da---")
  const [showshareonHover, setShowshareonHover] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const { TabPane } = Tabs;
  const [orderCard,setOrderCart] = useState(true)
  console.log("order------dat------",orderSumData)
  return <>
    <Modal visible={showShare} title={<h3 style={{ marginBottom: 0 }}><b>Share</b></h3>} footer={null} className="share_modal" onCancel={() => setShowShare(false)}>
      <h4>Share the link via</h4>
      <ShareModal />
    </Modal>

    <Header className="order-header"  >

      <Row gutter={[32, 32]} style={{ rowGap: 0 }}>
        <Col xs={24} sm={24} md={24} lg={10} xl={10}>
          <div className="left_order_div">
            <Button className="order-btn1">
              #{orderSumData?.data?.orderID}
            </Button>
            <span>
              Placed on{" "}
              {moment(orderSumData?.data?.orderDate).format("MMMM D, YYYY")}
            </span>
          </div>
        </Col>
        <Col xs={16} sm={18} md={18} lg={8} xl={10}>
          {orderPage === "current" && orderSumData?.data?.status === "Processing" && <div className="middle_order_div">
            <span>Status: {orderSumData?.data?.status}</span>
            <Button className="order-btn2">Track</Button>
          </div>}
        </Col>
        <Col xs={3} sm={3} md={3} lg={4} xl={3}>
          <div className="right_order_div">
            <Button className="order_btnIcon" onClick={() => setShowShare(true)} onMouseEnter={() => setShowshareonHover(true)} onMouseLeave={() => setShowshareonHover(false)}><ShareAltOutlined /></Button>
            <Button className="order_btnIcon" onClick={orderPrintHandler}><PrinterOutlined /></Button>
            {showshareonHover && <div className="share_model_hover" onClick={() => setShowShare(true)} onMouseEnter={() => setShowshareonHover(true)} onMouseLeave={() => setShowshareonHover(false)}>
              <h5>Share:</h5>
              <ShareModal printRef={printRef} />
            </div>}
          </div>
        </Col>
      </Row>
    </Header>
    <div className="order-div1">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={15} lg={15} xl={15}>
          <div className="order-subdiv">
            <br />
            <p>
              <strong>Placed by :</strong>{" "}
              {orderSumData?.data?.customerName}
            </p>
            <p>Payment method : {orderSumData?.data?.paymentMode}</p>
          </div>
        </Col>

        <Col xs={24} sm={24} md={9} lg={9} xl={9}>
          <div className="order-card">
              <div className="order_card_headers">
                <span onClick={()=>setOrderCart(true)} style={orderCard ? {backgroundColor:"#ffffff",borderRight:"1px solid #D7D7D7"}: {borderRight:"1px solid #D7D7D7",borderBottom:"1px solid #D7D7D7"}}>Billed To</span>
                <span onClick={()=>setOrderCart(false)} style={!orderCard ? {backgroundColor:"#ffffff"}: {borderBottom:"1px solid #D7D7D7"}}>Shipped To</span>
              </div>
              <div className="order_card_body">
                {orderCard ? <p>
                  {orderSumData?.data?.addressLine}
                </p> :
                <p>
                  {orderSumData?.data?.addressLine}
                </p>}
              </div>
          </div>
          {/* <Tabs defaultActiveKey="1" type="card" className="order-card">
            <TabPane tab="Billed To " key="1">
              <p>
                {orderSumData?.data?.addressLine}
              </p>
            </TabPane>
            <TabPane tab="  Shipped To " key="2">
              <p>
                {orderSumData?.data?.addressLine}
              </p>
            </TabPane>
          </Tabs> */}
        </Col>
      </Row>
    </div>
    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
      <div className="grey-box">
        <h4><b>Order Summary</b></h4>
      </div>
    </Col>
    <OrderSummaryDataField orderSumData={orderSumData} card={card} dataSource={dataSource} promotition={promotition} shipping={shipping} reduceAmount={reduceAmount} />
  </>
}

export default OrderSummaryPopUpWindow  