import React, { useState, useEffect } from "react"
import { Button, Modal, Form, Divider, Input, Row, Col, Img } from "antd"
import plywd from "../../../assets/img/plywd.jpg"
import axios from "axios"
import { APIs } from "../../../worker"
import "./product_details.css"
import { Image } from "antd"
import { singleProductDetails } from "../../../action/useraction"
import { useDispatch, useSelector } from "react-redux"

const ProductDetails = ({
  isViewProductDetails,
  backToViewProduct,
  viewId,
}) => {
  console.log(viewId)
  console.log(viewId, "viewId")
  console.log(isViewProductDetails, "viewProductDetails")
  const [data, setData] = useState("")
  const userInfo = JSON.parse(localStorage.getItem("userinfo"))

  let dispatch = useDispatch()
  const apiCall = async () => {
    const res = await axios.get(`${APIs.baseURL}/product-service/v1/product-details/${viewId}`,{
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
  }, [isViewProductDetails])

  // const viewSingelProduct = useSelector((state) => state.singleProduct);
  // setData(viewSingelProduct)
  // console.log(viewSingelProduct);
  // const { singleProductResponse } = viewSingelProduct;
  // console.log(singleProductResponse);
  //  if(viewSingelProduct != undefined){
  //     setData(viewSingelProduct)
  //  }

  return (
    <div className="">
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
              <h3
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

export default ProductDetails
