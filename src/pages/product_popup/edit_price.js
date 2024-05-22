import React, { useState, useEffect } from "react"
import { Button, Form, Input, Modal, Divider, Col, Row } from "antd"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { APIs } from "../../worker"
import { editprice } from "../../action/useraction"
import "./edit_price.css"
import "antd/dist/antd.css"

const EditPrice = ({ setEditPrice, editPrice, idForPrice, viewId }) => {
  const [data, setData] = useState("")
  const dispatch = useDispatch()
  const editPrice1 = useSelector((state) => state.editPrice)
  console.log(editPrice1)
  const userInfo = JSON.parse(localStorage.getItem("userinfo"))

  const onFinish = async (value) => {
    const id = idForPrice.id
    console.log("Success:", value, id)
    const newdata = {
      price: value.mrp,
      sqFeetPrice: (value.mrp / data.size).toFixed(2),
    }
    // dispatch(editprice(data,id))
    await axios
      .put(
        `${APIs.baseURL}/product-service/v1/product-price/` + id,
        newdata,{
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userInfo.token}`,
          }
        }
        
        //config
      )
      .then((response) => {
        console.log(response)
        if (response.status == 200) {
          setEditPrice()
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const onFinishFailed = (errorInfo) => {
    // console.log("Failed:", errorInfo);
  }

  const apiCall = async () => {
    let res = await axios.get(`${APIs.baseURL}/product-service/v1/product-details/${viewId}`,{
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userInfo.token}`,
      }
    }
    )
    console.log("res", res.data)
    const calSize = (size) => {
      let NumArry = size.split("*").map((e) => e.charAt(0).replace(/\D/g, ""))
      let arrOfNum = []
      NumArry.forEach((str) => {
        arrOfNum.push(Number(str))
      })
      return parseInt(arrOfNum.reduce((a, b) => a * b))
    }
    let size = calSize(res.data.size)
    console.log(size, "Price size")
    setData({ sku: res.data.sku, size: size })
  }

  useEffect(() => {
    apiCall()
  }, [dispatch])

  return (
    <div>
      <Form
        name="basic"
        initialValues={{
          remember: true,
        }}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        className="edit-form"
      >
        <>
          <Row style={{ marginLeft: "6%", marginRight: "6%" }}>
            {/* <Col xs={0} sm={0} md={3} lg={6} xl={6} ></Col> */}
            {console.log("data", data.sku)}
            <h3>SKU Id: {data.sku}</h3>
            <Col xs={24} sm={24} md={18} lg={24} xl={24}>
              <Form.Item
                label="MRP"
                name="mrp"
                initialValue={idForPrice?.price}
              >
                <Input placeholder="Enter price" />
              </Form.Item>
            </Col>
          </Row>
        </>
        {/* <Form.Item label="MRP" name="mrp" initialValue={idForPrice.price}>
            <Input required="required" placeholder="Enter price" />
          </Form.Item> */}
        <Divider className="divider" />
        <div className="Profile-buttons">
          <Button
            className="Cancel-btn"
            key="back"
            onClick={() => setEditPrice()}
          >
            CANCEL
          </Button>

          <Button type="primary" htmlType="submit" className="Send-button">
            SUBMIT
          </Button>
        </div>
        {/* <div style={{ marginLeft: "40%", marginTop: "20px" }}>
            <Button className="cancelbtn" key="back" onClick={() => setEditPrice()} >
              Cancel
            </Button>
            <Button htmlType="submit" className="submit-btn">
              Submit
            </Button>
          </div> */}
      </Form>
    </div>
  )
}

export default EditPrice
