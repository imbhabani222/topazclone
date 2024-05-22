import React, { useEffect, useState } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import {
  Layout,
  Menu,
  Breadcrumb,
  Row,
  Col,
  Dropdown,
  Button,
  Avatar,
  Badge,
} from "antd"
import loginbgimg from "../../assets/img/loginLogo.svg";
import "antd/dist/antd.css"
import "./masterLayout.css"
import userIcon from "../../assets/img/userIconTopaz.svg"
import Dashboard from "../../assets/img/Dashboard.png"
import Catalogue from "../../assets/img/Catalogue.png"
import CustomerList from "../../assets/img/customer-list.png"
import OrderIcon from "../../assets/img/order-icon.png"
import AdvIcon from "../../assets/img/adv-icon.png"
import DiscountIcon from "../../assets/img/discount-icon.png"
import OnboardIcon from "../../assets/img/customer-onboard-icon.png"
import ECatelogue from "../../assets/img/E-catalogue icon.svg"
import Rewards from "../../assets/img/Reward icon.svg"
import {
  DownOutlined,
  MenuOutlined,
  CloseOutlined,
  BellFilled,
  MailOutlined,
} from "@ant-design/icons"
import PropTypes from "prop-types"
import { useDispatch, useSelector } from "react-redux"
import { userlogout, bredCurm, getAllNotifications, notificationReadAction } from "../../action/useraction"
import axios from "axios"
import { APIs } from "../../worker"
import moment from "moment"
import { getMessaging, onMessage } from "firebase/messaging";

export const withRouter = (Component) => {
  const Wrapper = (props) => {
    const history = useNavigate()
    return <Component history={history} {...props} />
  }
  return Wrapper
}

const { Header, Content, Sider, Footer } = Layout

const MasterLayoutProduct = ({ children, history, key }) => {
  const dispatch = useDispatch()
  let navigate = useNavigate()
  const { pathname } = useLocation()

  const userloginn = useSelector((state) => state.userlogin)
  const bredKey = useSelector((state) => state.bredCurm)

  const userInfo = JSON.parse(localStorage.getItem("userinfo"))

  const [productImg, setProductImg] = useState([])
  // const [notification, setNotification] = useState({})
  const [card, setCard] = useState("")
  const [unReadmsg, setUnReadmsg] = useState(0)
  const [collapsed, setCollapsed] = useState(
    window.innerWidth <= 576 ? true : false
  )
  const allNotificationsState = useSelector((state) => state.getAllNotificationsReducer.resultData)


  window.addEventListener('resize', () => {
    setCollapsed(window.innerWidth <= 576 ? true : false)
  })

  // const notification = [
  //   {
  //     id: 11,
  //     notificationType: "Quote Requested",
  //     customerName: null,
  //     createdDate: "2023-06-07T11:53:14.048699",
  //     orderId: "ORD00495",
  //     orderItemId: 470,
  //     read: false,
  //   },
  //   {
  //     id: 10,
  //     notificationType: "Quote Requested",
  //     customerName: null,
  //     createdDate: "2023-06-07T11:52:10.797401",
  //     orderId: "ORD00494",
  //     orderItemId: 469,
  //     read: false,
  //   },
  //   {
  //     id: 9,
  //     notificationType: "message received",
  //     customerName: "Vidya Muralidhar",
  //     createdDate: "2023-06-06T19:09:38.344033",
  //     orderId: "ORD00492",
  //     orderItemId: 468,
  //     read: true,
  //   },
  //   {
  //     id: 8,
  //     notificationType: "Quote Requested",
  //     customerName: null,
  //     createdDate: "2023-06-06T19:09:01.196672",
  //     orderId: "ORD00492",
  //     orderItemId: 468,
  //     read: true,
  //   },
  //   {
  //     id: 7,
  //     notificationType: "Quote Requested",
  //     customerName: null,
  //     createdDate: "2023-06-06T18:23:57.692975",
  //     orderId: "ORD00491",
  //     orderItemId: 464,
  //     read: true,
  //   },
  //   {
  //     id: 6,
  //     notificationType: "message received",
  //     customerName: "vidya HM",
  //     createdDate: "2023-06-06T18:12:58.096174",
  //     orderId: "ORD00483",
  //     orderItemId: 456,
  //     read: true,
  //   },
  //   {
  //     id: 5,
  //     notificationType: "message received",
  //     customerName: "vidya HM",
  //     createdDate: "2023-06-06T18:12:44.921043",
  //     orderId: "ORD00483",
  //     orderItemId: 456,
  //     read: true,
  //   },
  //   {
  //     id: 4,
  //     notificationType: "message received",
  //     customerName: "vidya HM",
  //     createdDate: "2023-06-06T18:12:28.944974",
  //     orderId: "ORD00483",
  //     orderItemId: 455,
  //     read: true,
  //   },
  //   {
  //     id: 3,
  //     notificationType: "Quote Requested",
  //     customerName: null,
  //     createdDate: "2023-06-06T14:33:59.567954",
  //     orderId: "ORD00490",
  //     orderItemId: 463,
  //     read: true,
  //   },
  //   {
  //     id: 2,
  //     notificationType: "Quote Requested",
  //     customerName: null,
  //     createdDate: "2023-06-06T14:31:38.784551",
  //     orderId: "ORD00489",
  //     orderItemId: 462,
  //     read: true,
  //   },
  //   {
  //     id: 1,
  //     notificationType: "Quote Requested",
  //     customerName: null,
  //     createdDate: "2023-06-06T14:31:04.557065",
  //     orderId: "ORD00488",
  //     orderItemId: 461,
  //     read: true,
  //   },
  // ]

  let handlelogout = () => {
    dispatch(userlogout())
    navigate("/login")
  }
  let myAccount = () => {
    navigate("/profile")
  }

  // async function getNotification() {
  //   let notification = await axios.get(`${APIs.baseURL}/getAll/notification`)
  //   console.log(notification)
  //   setNotification()
  // }
  
  
  useEffect(() => {
    dispatch(getAllNotifications())
  }, [])
  
  const productImag = async () => {
    let res = await axios.get(
      `${APIs.baseURL}/manufacturer-service/v1/manufacturer-image/${userloginn?.userinfo?.manufacturerCode}`,{
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userInfo.token}`,
        }
      }
      
    )
    setProductImg(res.data.manufacturerimage.url)
  }

  const navigateFun = (params) => {
    localStorage.setItem("keys", 1)
    dispatch(bredCurm("1"))
    history(params)
  }

  useEffect(() => {
    productImag()
    // getNotification()
  }, [])

  useEffect(() => { }, [localStorage.getItem("keys")])

  const menu = (
    <Menu>
      <Menu.Item key="0">
        <a onClick={myAccount}>My Account</a>
      </Menu.Item>
      <Menu.Item key="1">
        <a onClick={handlelogout}>Logout</a>
      </Menu.Item>
    </Menu>
  )
  useEffect(() => {
    if (allNotificationsState) {
      let tempUnreadmsg = 0
      allNotificationsState.filter((item) => {
        if (item.read) tempUnreadmsg++
      })
      setUnReadmsg(tempUnreadmsg)
    }
  }, [allNotificationsState])
  const messaging = getMessaging()
  onMessage(messaging, (payload) => {
    const splittitle = payload.notification.title.split("_")
    const splitbody = payload.notification.body.split("_")
    const createdDate = new Date()
    const notificationType = splittitle[0]
    const customerName = splittitle[1]
    const orderId = splitbody[0]
    const orderItemId = parseInt(splitbody[1])
    const notificationId = parseInt(splitbody[2])
    const read = true
    const currentmessage = {
      createdDate,
      notificationType,
      customerName,
      orderId,
      orderItemId,
      notificationId,
      read
    }
    console.log("payload", payload, currentmessage)
    const updatedData = [currentmessage, ...allNotificationsState]
    dispatch({ type: "GET_ALL_NOTIFICATION_SUCCESS", payload: updatedData });
  });
  const notifications = (
    <Menu className="notificationBox">
      <Menu.Item key="0" className="notificationItem" onClick={() => navigate("/notifications")}>
        <p className="notificationType">
          Notifications <MailOutlined />
        </p>
      </Menu.Item>
      {allNotificationsState &&
        allNotificationsState.slice(0, 4).map((item) => {
          let time = moment(item.createdDate).fromNow()
          if (time === "a day ago") {
            time = "Yesterday"
          }
          return (
            <Menu.Item
              key={item.id}
              className={!item.read ? "notificationItem .notificationItem_read" : "notificationItem .notificationItem_not_read"}
              onClick={() => {
                navigate("/orders", { state: [{ orderID: item.orderId }] })
                if (item.read) {
                  let updatedData = [...allNotificationsState]
                  const ind = updatedData.findIndex((data) => data.notificationId === item.notificationId)
                  updatedData[ind].read = false
                  dispatch(notificationReadAction({ notificationId: item.notificationId, updatedData }))
                }
              }
              }
            >
              <p className="notificationType">
                {item.notificationType} from {item.customerName}{" "}
                <Badge color={`${!item.read ? "#D2D2D2" : "#EC3E3E"}`} />
              </p>
              <p className="notificationDetails">
                <span className="notificationOrderId">{item.orderId}</span>
                <span className="notificationTime">{time}</span>
              </p>
            </Menu.Item>
          )
        })}
      <Menu.Item key="-1" className="seeNotification">
        <Link to={"/notifications"}>
          <a className="seeNotificationType">See All Notifications</a>
        </Link>
      </Menu.Item>
    </Menu>
  )
  return (
    <Layout style={{ height: "100vh" }}>
      <div className="top_nav"></div>
      <div className="bottom_header">
        <Header className="header">
          <Row gutter={10} justify="space-between">
            <Col xs={2} sm={0} md={0} lg={0} xl={0}>
              <MenuOutlined onClick={() => setCollapsed(!collapsed)} />
            </Col>
            <Col xs={6} sm={6} md={6} lg={6} xl={6}>
              <div className="logo productLogo">
                <img
                  className="productImage"
                  alt="logo"
                  src={productImg ? productImg : loginbgimg}
                />
              </div>
            </Col>

            <Col xs={16} sm={12} md={12} lg={12} xl={12} className="mainIcons">
              <div className="notifications">
                <Dropdown
                  overlay={notifications}
                  trigger={["click"]}
                  placement="bottomRight"
                  arrow={{ pointAtCenter: true }}
                >
                  <a onClick={(e) => e.preventDefault()}>
                    <BellFilled />
                    <Badge
                      size="small"
                      count={unReadmsg}
                      showZero
                      offset={[-5, -15]}
                    ></Badge>
                  </a>
                </Dropdown>
              </div>
              <div className="userNmae">
                <Dropdown overlay={menu} trigger={["click"]}>
                  <a
                    className="ant-dropdown-link username"
                    onClick={(e) => e.preventDefault()}
                  >
                    <img src={userIcon} alt="userLogo" className="userLogo" />
                    {userloginn?.userinfo?.userName} <DownOutlined />
                  </a>
                </Dropdown>
              </div>
            </Col>
          </Row>
        </Header>
      </div>

      <Layout style={{ height: "100vh" }}>
        <Sider
          width={108}
          collapsedWidth="0"
          collapsed={collapsed}
          className="site-layout-background"
          style={{ background: "#095198", width: "100px" }}
        >
          <div className="logo siderlogo">
            <img
              className="productImage"
              alt="productImage"
              src={productImg !== undefined ? productImg : ""}
            ></img>
            <CloseOutlined
              onClick={() => {
                window.innerWidth <= 576 && setCollapsed(!collapsed)
              }}
            />
          </div>

          <div
            className={`sidemenubox sidemenubox1 ${pathname === "/dashboard" ? "active" : ""
              }`}
            onClick={() => {
              history("/dashboard")
              window.innerWidth <= 576 && setCollapsed(!collapsed)
            }}
          >
            <img className="menuIcon" alt="menuIcon" src={Dashboard} />
            <h3>Dashboard</h3>
          </div>
          <div
            className={`sidemenubox sidemenubox1 ${pathname === "/customer-onboarding" ? "active" : ""
              }`}
            onClick={() => {
              history("/customer-onboarding")
              window.innerWidth <= 576 && setCollapsed(!collapsed)
            }}
          >
            <img className="menuIcon" alt="menuIcon" src={OnboardIcon} />
            <h3>Customer Onboard</h3>
          </div>
          <div
            className={`sidemenubox sidemenubox1 ${pathname === "/viewcustomers" ? "active" : ""
              }`}
            onClick={() => {
              history("/viewcustomers")
              window.innerWidth <= 576 && setCollapsed(!collapsed)
            }}
          >
            <img className="menuIcon" alt="menuIcon" src={CustomerList} />
            <h3>Customer List</h3>
          </div>
          <div
            className={`sidemenubox sidemenubox1 ${pathname === "/category" ? "active" : ""
              }`}
            onClick={() => {
              navigateFun("/category")
              window.innerWidth <= 576 && setCollapsed(!collapsed)
            }}
          >
            <img className="menuIcon" alt="menuIcon" src={Catalogue} />
            <h3>Catalogue</h3>
          </div>
          <div
            className={`sidemenubox sidemenubox1 ${pathname === "/ecatalogue" ? "active" : ""
              }`}
            onClick={() => {
              navigateFun("/ecatalogue")
              window.innerWidth <= 576 && setCollapsed(!collapsed)
            }}
          >
            <img className="menuIcon" alt="menuIcon" src={ECatelogue} />
            <h3>E-Catalogue</h3>
          </div>
          <div
            className={`sidemenubox sidemenubox1 ${pathname === "/rewards" ? "active" : ""
              }`}
            onClick={() => {
              navigateFun("/rewards")
              window.innerWidth <= 576 && setCollapsed(!collapsed)
            }}
          >
            <img className="menuIcon" alt="menuIcon" src={Rewards} />
            <h3>Rewards</h3>
          </div>
          <div
            className={`sidemenubox sidemenubox1 ${pathname === "/orders" ? "active" : ""
              }`}
            onClick={() => {
              navigateFun("/orders")
              window.innerWidth <= 576 && setCollapsed(!collapsed)
            }}
          >
            <img className="menuIcon" alt="menuIcon" src={OrderIcon} />
            <h3>Orders</h3>
          </div>
          <div
            className={`sidemenubox sidemenubox1 ${pathname === "/advertisement" ? "active" : ""
              }`}
            onClick={() => {
              navigateFun("/advertisement")
              window.innerWidth <= 576 && setCollapsed(!collapsed)
            }}
          >
            <img className="menuIcon" alt="menuIcon" src={AdvIcon} />
            <h3>Advertisement</h3>
          </div>
          <div
            className={`sidemenubox sidemenubox1 ${pathname === "/discountsandoffers" ? "active" : ""
              }`}
            onClick={() => {
              navigateFun("/discountsandoffers")
              window.innerWidth <= 576 && setCollapsed(!collapsed)
            }}
          >
            <img className="menuIcon" alt="menuIcon" src={DiscountIcon} />
            <h3>Discount & Offers</h3>
          </div>
        </Sider>

        <Layout>
          <Breadcrumb
            style={{
              margin: "20px 50px",
              textAlign: "left",
              color: "#888888",
            }}
          >
            {window.location.pathname === "/orders" ||
              window.location.pathname === "/category" ||
              window.location.pathname === "/advertisement" || window.location.pathname === "/ecatalogue" ||
              window.location.pathname === "/rewards" ||
              window.location.pathname === "/discountsandoffers" ||
              window.location.pathname === "/profile" ? (
              <>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>
                  {window.location.pathname === "/viewcustomers"
                    ? "Customer"
                    : ""}{" "}
                  {window.location.pathname === "/advertisement"
                    ? "Advertisement"
                    : ""}
                  {window.location.pathname === "/category" ? "Catalogue" : ""}
                  {window.location.pathname === "/orders" ? "Orders" : ""}
                  {window.location.pathname === "/discountsandoffers"
                    ? "Discount And Offers"
                    : ""}
                  {window.location.pathname === "/ecatalogue" ? "E-Catalogue" : ""}
                  {window.location.pathname === "/rewards" ? "Rewards" : ""}
                  {window.location.pathname === "/profile" ? "Account" : ""}
                </Breadcrumb.Item>
                <Breadcrumb.Item className="second-breadcrumb">
                  {window.location.pathname === "/advertisement" &&
                    (bredKey.data === "1"
                      ? "Create Advertisement"
                      : bredKey.data === "2"
                        ? "View Advertisement"
                        : "")}
                  {window.location.pathname === "/category" &&
                    (bredKey.data === "1"
                      ? "Category"
                      : bredKey.data === "2"
                        ? "Product"
                        : "")}
                  {window.location.pathname === "/orders" &&
                    (bredKey.data === "1"
                      ? "Current Orders"
                      : bredKey.data === "2"
                        ? "Past Orders"
                        : "")}
                  {window.location.pathname === "/discountsandoffers" &&
                    (bredKey.data === "1"
                      ? "Discount"
                      : bredKey.data === "2"
                        ? "Offers"
                        : "")}
                  {window.location.pathname === "/profile" &&
                    (bredKey.data === "1"
                      ? "Profile"
                      : bredKey.data === "2"
                        ? "Payments"
                        : bredKey.data === "3"
                          ? "Settings"
                          : "")}
                  {window.location.pathname === "/ecatalogue" &&
                    (bredKey.data === "1"
                      ? "Upload E-Catalogue"
                      : bredKey.data === "2"
                        ? "View E-Catalogue" :
                        bredKey.data === "3"
                          ? "Create E-Catalogue"
                          : "")}
                  {window.location.pathname === "/rewards" &&
                    (bredKey.data === "0"
                      ? ""
                      : bredKey.data === "1"
                        ? "Reward Setup"
                        : bredKey.data === "2"
                          ? "Create Reward" :
                          bredKey.data === "3"
                            ? "Allocate Points"
                            : bredKey.data === "4"
                              ? "Redeem Points"
                              : "Customer Reward Info")}
                </Breadcrumb.Item>{" "}
              </>
            ) : (
              <>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item className="second-breadcrumb">
                  {window.location.pathname === "/dashboard" ? "Dashboard" : ""}
                  {window.location.pathname === "/customer-onboarding"
                    ? "Customer Onboard"
                    : ""}
                  {window.location.pathname === "/viewcustomers"
                    ? "Customer List"
                    : ""}
                  {window.location.pathname === "/notifications"
                    ? "Notifications"
                    : ""}
                </Breadcrumb.Item>
              </>
            )}
          </Breadcrumb>

          <Content
            className="site-layout-background custom-scrollbar"
            style={{
              padding: "0px 17px 20px",
              overflowY: "scroll",
              margin: "0 0 3% 0",
              minHeight: "calc(100vh - 100px+20px)",
            }}
          >
            {children}
          </Content>
          <Footer className="antdFooter">
            © {new Date().getFullYear()} Hutech Solutions Pvt.Ltd.All rights
            reserved. Terms of Service
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  )
}

// MasterLayoutProduct.propTypes = {
//   history: PropTypes.object,
// };

export default withRouter(MasterLayoutProduct)
