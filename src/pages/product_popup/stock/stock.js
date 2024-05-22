import React, { useState } from "react";
import {Button, Input, Form, Row, Col, Divider } from "antd";
import "antd/dist/antd.css";
import { useDispatch, useSelector } from "react-redux";
import { stockAndThreshold } from "../../../action/useraction";
import axios from "axios";
import { APIs } from "../../../worker";
import "./stock.css";

const Stock = ({ isStock, setIsStock, stockAndThreeshold }) => {
  const [stock, setStock] = useState(stockAndThreeshold.stock);
  const [threShold, setThreShold] = useState(stockAndThreeshold.threshold);
  let dispatch = useDispatch();
  const userInfo = JSON.parse(localStorage.getItem("userinfo"))

  const onFinish = async (value) => {
    console.log("Success:", value);
    const data = {
      stock: value.stock,
      threshold: value.threshold,
    };
    // dispatch(stockAndThreshold(data,stockAndThreeshold.productid))
    await axios
      .put(
        `${APIs.baseURL}/product-service/v1/product-stock-threshold/` +
          stockAndThreeshold.productid,
        data,{
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userInfo.token}`,
          }
        }
        
      )
      .then((res) => {
        if (res.status === 200) {
          setIsStock(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    // setIsModalVisible(false);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const [form] = Form.useForm();

  return (
      <div>
        <Form
          name="basic"
          // form={form}
          initialValues={{
            remember: true,
          }}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <h3 style={{ marginLeft: "4%" }}>SKU Id: {stockAndThreeshold.sku}</h3>
          <Row className="stock-form">
            <Col xs={24} sm={24} md={10} lg={10} xl={10} className="profileCol">
              {console.log(stockAndThreeshold.productTitle)}
              <Form.Item
                label="Stock"
                name="stock"
                dependencies={["threshold"]}
                initialValue={stockAndThreeshold.stock}
                // onChange={(e) => setStock(e.target.value) }
                rules={[
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      console.log("non-list field1 validator");
                      if (
                        parseInt(getFieldValue("threshold")) >= parseInt(value)
                      ) {
                        return Promise.reject(["Stock should be greater"]);
                      }
                      return Promise.resolve();
                    },
                  }),
                  {
                    required: true,
                    message: "Enter stock",
                  },
                ]}
              >
                <Input
                  required={true}
                  className="input-field"
                  placeholder="Enter Stock"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={10} lg={10} xl={10} className="profileCol">
              <Form.Item
                label="Threshold"
                name="threshold"
                dependencies={["stock"]}
                initialValue={stockAndThreeshold.threshold}
                //onChange={(e) => setThreShold(e.target.value)}
                rules={[
                  {
                    required: true,
                    message: "Enter threshold",
                  },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      console.log("non-list field2 validator");
                      if (parseInt(getFieldValue("stock")) <= parseInt(value)) {
                        return Promise.reject(["Threshold should be smaller"]);
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Input
                  required={true}
                  className="input-field"
                  placeholder="Enter Threshold"
                  disabled={stock == "" ? true : false}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider className="divider" />
          <div className="subCan">
            <Button
              className="cancelbtn"
              key="back"
              onClick={() => setIsStock(false)}
            >
              CANCEL
            </Button>
            <Button htmlType="submit" className="submit-btn">
              SUBMIT
            </Button>
          </div>
        </Form>
      </div>
  );
};

export default Stock;
