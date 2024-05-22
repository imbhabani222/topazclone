import React, { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import QRCode from "qrcode.react"
import { Button, Modal, Form, Divider, Input, Row, Col, Img } from "antd"
import plywd from "../../assets/img/plywd.jpg"
import axios from "axios"
import { APIs } from "../../worker"
import "./product_previewqr.css"
import { Image } from "antd"
import { DownloadOutlined } from "@ant-design/icons"
import { singleProductDetails } from "../../action/useraction"
import { useDispatch, useSelector } from "react-redux"
import ShareQrCode from "./ShareQrCode/ShareQrCode"

const ProductPreviewQR = () => {
  const [data, setData] = useState("")
  const location = useLocation()
  const { pathname } = location
  const userInfo = JSON.parse(localStorage.getItem("userinfo"))

  const productId = pathname.split("/")[2]
  console.log(pathname.split("/"), "pathname")
  console.log(productId, "prodid")
  let dispatch = useDispatch()
  const apiCall = async () => {
    const res = await axios.get(
      `${APIs.baseURL}/product-service/v1/product-details/${productId}`,{
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userInfo.token}`,
        }
      }
      
    )
    setData(res)
  }
  console.log(data)
  useEffect(() => {
    // dispatch(singleProductDetails(viewId));
    apiCall()
  }, [])

  const downloadQRCode = () => {
    const canvas = document.getElementById("productqr")
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream")
    let downloadLink = document.createElement("a")
    downloadLink.href = pngUrl
    downloadLink.download = `QR_CodeProductId${productId}.png`
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  }

  return (
    <div className="productPreviewQR">
      {data && (
        <div className="view_details">
          <Row>
            <Col xs={24} sm={24} md={7} lg={7} xl={7}>
              <div className="image-bg">
                <Image
                  style={{ padding: "8px" }}
                  width={150}
                  height={150}
                  src={data?.data?.productimage[0]?.url}
                />
              </div>
            </Col>

            <Col xs={24} sm={24} md={17} lg={17} xl={17}>
              <Row gutter={5}>
                <Col xs={12} sm={12} md={8} lg={8} xl={8}>
                  <p className="description">{data.data.productTitle}</p>
                  <p className="des_para">
                    Price:
                    <span
                      style={{
                        color: "#00ADEF",
                        fontWeight: "700",
                        fontSize: "20px",
                        marginLeft: "8px",
                      }}
                    >
                      ₹ {data.data.price}
                    </span>
                  </p>
                </Col>
                <Col
                  xs={12}
                  sm={12}
                  md={16}
                  lg={16}
                  xl={16}
                  className="productQRBox"
                >
                  <QRCode
                    id="productqr"
                    size={128}
                    style={{ height: "auto", maxWidth: "128px", width: "100%" }}
                    value={`https://topaz.hutechweb.com/product-preview-qr/${productId}`}
                  />
                  <div className="productPreviewIcons">
                    <a className="downloadProductQr" onClick={downloadQRCode}>
                      <DownloadOutlined />
                      <span className="downloadProductQrText">Download QR</span>
                    </a>
                    <div className="shareQr">
                      <ShareQrCode />
                      <span className="downloadProductQrText">
                        Send QR To Whatsapp
                      </span>
                    </div>
                  </div>
                </Col>
              </Row>

              <h3
                className="previewheading"
                style={{
                  color: "#095198",
                  fontSize: "16px",
                  lineHeight: "19.2px",
                  fontWeight: 700,
                }}
              >
                General
              </h3>
              <Divider
                className="divider"
                style={{ marginTop: "0px", marginBottom: "15px" }}
              />
              <Row>
                <Col className="tr-data" xs={12} sm={12} md={8} lg={8} xl={10}>
                  Brand
                </Col>
                <Col className="td-data" xs={12} sm={12} md={8} lg={8} xl={14}>
                  {data.data.brand}
                </Col>
                <Col className="tr-data" xs={12} sm={12} md={8} lg={8} xl={10}>
                  Category Type
                </Col>
                <Col className="td-data" xs={12} sm={12} md={8} lg={8} xl={14}>
                  {data.data.categoryType.categoryName}
                </Col>
                <Col className="tr-data" xs={12} sm={12} md={8} lg={8} xl={10}>
                  Wood Type
                </Col>
                <Col className="td-data" xs={12} sm={12} md={8} lg={8} xl={14}>
                  {data.data.woodType}
                </Col>
                <Col className="tr-data" xs={12} sm={12} md={8} lg={8} xl={10}>
                  Thickness
                </Col>
                <Col className="td-data" xs={12} sm={12} md={8} lg={8} xl={14}>
                  {data.data.thickness}
                </Col>

                <Col className="tr-data" xs={12} sm={12} md={8} lg={8} xl={10}>
                  Size
                </Col>
                <Col className="td-data" xs={12} sm={12} md={8} lg={8} xl={14}>
                  {data.data.size}
                </Col>

                <Col className="tr-data" xs={12} sm={12} md={8} lg={8} xl={10}>
                  Color
                </Col>
                <Col className="td-data" xs={12} sm={12} md={8} lg={8} xl={14}>
                  {data.data.color}
                </Col>
              </Row>
              <br />
              <h3
                className="previewheading"
                style={{
                  color: "#095198",
                  fontSize: "16px",
                  lineHeight: "19.2px",
                  fontWeight: "700",
                }}
              >
                Descriptions
              </h3>
              <Divider
                className="divider"
                style={{ marginTop: "0px", marginBottom: "12px" }}
              />
              {/* <p className="para">{ data.data.discription !== ""? data.data.discription.replace(/<[^>]*>?/gm, '') :""}</p> */}
              <p
                className="para"
                dangerouslySetInnerHTML={{ __html: data?.data?.discription }}
              ></p>
            </Col>
          </Row>
        </div>
      )}
    </div>
  )
}

export default ProductPreviewQR
