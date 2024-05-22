import React, { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Layout, Menu, Breadcrumb, Row, Col, Dropdown } from "antd"
import "antd/dist/antd.css"
import "./masterLayout.css"
import toazLogo from "../../assets/img/topazlogo.svg"
import userIcon from "../../assets/img/userIconTopaz.svg"
import ViewManufacturers from "../../assets/img/ViewManufacturers.png"
import OnboardManufacturers from "../../assets/img/OnboardManufacturers.png"
import UserManagement from "../../assets/img/UserManagement.png"
import { DownOutlined } from "@ant-design/icons"
import PropTypes from "prop-types"
import { useDispatch, useSelector } from "react-redux"
import { bredCurm, userlogout } from "../../action/useraction"
export const withRouter = (Component) => {
  const Wrapper = (props) => {
    const history = useNavigate()
    return <Component history={history} {...props} />
  }
  return Wrapper
}

const { Header, Content, Sider, Footer } = Layout

const MasterLayout = ({ children, history }) => {
  const onboardandViewKeyForKey = useSelector((state) => state.vieandOnboard)
  const dispatch = useDispatch()
  const [show, setShow] = useState(false)
  let navigate = useNavigate()
  const { pathname } = useLocation()
  const userloginn = useSelector((state) => state.userlogin)
  const bredKey = useSelector((state) => state.bredCurm)
  let handlelogout = () => {
    dispatch(userlogout())
    navigate("/login")
  }
  useEffect(() => {
    if (bredKey.data) {
      bredKey?.data === "2"
        ? navigate("/view-manufacturers")
        : navigate("/onboard-manufactures")
    }
  }, [bredKey])

  const menu = (
    <Menu className="logout_menu">
      <Menu.Item key="0">
        <a onClick={handlelogout}>Logout</a>
      </Menu.Item>
    </Menu>
  )

  function navigateFun(params) {
    if (params === "/onboard-manufactures") {
      dispatch(bredCurm("1"))
      navigate("/onboard-manufactures")
    } else if (params === "/view-manufacturers") {
      dispatch(bredCurm("2"))
      navigate("/view-manufacturers")
    } else history(params)
  }
  return (
    <Layout
      style={{
        overflowY: "hidden",
        height: "100vh",
      }}
    >
      <div className="top_nav"></div>
      <div className="bottom_header">
        <Header className="header">
          <Row>
            <Col xs={6} sm={6} md={6} lg={6} xl={6}>
              <div className="logo">
                <img
                  src={toazLogo}
                  alt="toazLogo"
                  style={{ marginBottom: "7px" }}
                />
              </div>
            </Col>
            <Col
              xs={18}
              sm={18}
              md={18}
              lg={18}
              xl={18}
              style={{ display: "flex", justifyContent: "end" }}
            >
              <div className="userNmae">
                <Dropdown overlay={menu} trigger={["click"]}>
                  <a
                    className="ant-dropdown-link username"
                    onClick={(e) => e.preventDefault()}
                  >
                    <img src={userIcon} alt="userIcon" className="userLogo" />
                    {userloginn.userinfo.userName}{" "}
                    <DownOutlined style={{ paddingLeft: "3px" }} />
                  </a>
                </Dropdown>
              </div>
            </Col>
          </Row>
        </Header>
      </div>

      <Layout
        style={{ height: "100vh", display: "flex", flexDirection: "row" }}
      >
        <Sider
          breakpoint="md"
          collapsedWidth="0"
          width={100}
          style={{
            height: "100vh",
            position: "sticky",
            // top: 0,
            zIndex: 1,
          }}
          className="site-layout-background"
        >
          <div
            className={`sidemenubox ${pathname === "/onboard-manufactures" ? "active" : ""
              }`}
            onClick={() => navigateFun("/onboard-manufactures")}
          >
            <img src={OnboardManufacturers} alt="OnboardManufacturers" />
            <h3>Onboard Manufacturers</h3>
          </div>
          <div
            className={`sidemenubox ${pathname === "/view-manufacturers" ? "active" : ""
              }`}
            onClick={() => navigateFun("/view-manufacturers")}
          >
            <img src={ViewManufacturers} alt="ViewManufacturers" />
            <h3>View Manufacturers</h3>
          </div>
          <div
            className={`sidemenubox ${pathname === "/user-management" ? "active" : ""
              }`}
            onClick={() => navigateFun("/user-management")}
          >
            <img src={UserManagement} alt="ViewManufacturers" />
            <h3>User Management</h3>
          </div>
        </Sider>
        <Layout>
          <Breadcrumb className="user_management_breadcrum" >
            <Breadcrumb.Item className="home-breadcrumb">Home</Breadcrumb.Item>
            {window.location.pathname === "/user-management" ? (
              <Breadcrumb.Item>
                <strong>User Management</strong>
              </Breadcrumb.Item>
            ) : window.location.pathname === "/onboard-manufactures" ? (
              <Breadcrumb.Item>
                <strong>Onboard Manufactures</strong>
              </Breadcrumb.Item>
            ) : window.location.pathname === "/view-manufacturers" ? (
              <Breadcrumb.Item>
                <strong>View Manufactures</strong>
              </Breadcrumb.Item>
            ) : (
              ""
            )}
          </Breadcrumb>

          <Content
            className="site-layout-background"
            style={{
              padding: "0px 50px 20px 50px",
              overflowY: "visible",
              margin: "0 0 -6% 0",
              height: "maxContent",
            }}
          >
            <Content
              className="site-layout-background"
              style={{
                margin: "0 0 3% 0",
                minHeight: 280,
              }}
            >
              {" "}
              {children}
            </Content>
          </Content>
        </Layout>
        <Footer className="antdFooter">
          © {new Date().getFullYear()} Hutech Solutions Pvt.Ltd.All rights
          reserved. Terms of Service
        </Footer>
      </Layout>
    </Layout>
  )
}

MasterLayout.propTypes = {
  history: PropTypes.object,
}

export default withRouter(MasterLayout)
