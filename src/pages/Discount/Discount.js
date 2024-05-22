import React, { useEffect, useState } from "react"
import {
  Divider,
  Row,
  Col,
  Form,
  Input,
  Slider,
  Select,
  Radio,
  Button,
  Image,
  message,
  Tooltip,
  Spin,
} from "antd"
import { MinusOutlined, PlusOutlined, LoadingOutlined } from "@ant-design/icons"
import downArrow from "../../assets/img/downArrow.svg"

import axios from "axios"
import { APIs } from "../../worker"
import "./Discount.css"
import { checkNumbervalue } from "./index"

const { Option } = Select

function Discount() {
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const [discountWillApplyToRadioValue, setDiscountWillApplyToRadioValue] =
    useState(1)
  const [discountTypeRadioValue, setDiscountTypeRadioValue] = useState(1)
  const [
    allProductsByCurrentManufacturer,
    setAllProductsByCurrentManufacturer,
  ] = useState([])
  const [selectedProductDetails, setSelectedProductDetails] = useState({})
  const [discountPercent, setDiscountPercent] = useState(0)
  const [gstAmount, setGstAmount] = useState(0)
  const [
    customersToWhichDiscountWillApply,
    setCustomersToWhichDiscountWillApply,
  ] = useState([])
  const [totalForRightBox, setTotalForRightBox] = useState(0)
  const [customerList, setCustomerList] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [addmrp, setAddMrp] = useState({
    size: "",
    sqFeetPrice: "",
  })

  const userInfo = JSON.parse(localStorage.getItem("userinfo"))
  let config = {
    headers: {
      "Content-Type": "application/json",
      "MNF-CODE": `${userInfo.manufacturerCode}`,
      "Authorization": `Bearer ${userInfo.token}`,
    },
  }

  const gstVal = (size, sqFeetPrice) => {
    let data = size
      .replaceAll("ft", "")
      .split("*")
      .reduce((a, b) => parseInt(a) * parseInt(b) * sqFeetPrice * quantity)
    const gstAmount = Number(data * (18 / 100))
    return gstAmount
  }

  const gstValue = (size, sqFeetPrice) => {
    let data = size
      .replaceAll("ft", "")
      .split("*")
      .reduce((a, b) => parseInt(a) * parseInt(b) * sqFeetPrice)
    const gstAmount = Number(data * (18 / 100))
    return gstAmount
  }
  useEffect(() => {
    if (selectedProductDetails) {
      setAddMrp({
        size: selectedProductDetails.size || "",
        sqFeetPrice: selectedProductDetails.sqFeetPrice || "",
      })
      if (selectedProductDetails?.size && selectedProductDetails?.sqFeetPrice) {
        const response = gstVal(
          selectedProductDetails.size,
          selectedProductDetails.sqFeetPrice
        )
        setGstAmount(response.toFixed(2))
        let data = selectedProductDetails?.size
          .replaceAll("ft", "")
          .split("*")
          .reduce(
            (a, b) =>
              parseInt(a) * parseInt(b) * selectedProductDetails.sqFeetPrice
          )
        setTotalForRightBox(data)
        setQuantity(1)
      }
    }
  }, [selectedProductDetails])

  const changeGstOnDiscountChange = (percent) => {
    let data = totalForRightBox * quantity * (percent ? 1 - percent / 100.0 : 1)
    return data ? data.toFixed(2) : 0
  }
  const onChangePercent = (percent) => {
    setDiscountPercent(percent)
    const qtyResponse = changeGstOnDiscountChange(percent) * 0.18
    setGstAmount(qtyResponse.toFixed(2))
  }

  const productNamesAPI = async () => {
    let response = await axios.get(
      `${APIs.baseURL}/product-service/v1/product-detail/${userInfo.manufacturerCode}`,
      config
    )
    let temp = []
    response.data.map((e) => {
      temp.push({
        active: e.active,
        option: e.productTitle,
        value: e.productTitle,
        productId: e.productid,
        sku: e.sku,
      })
    })
    setAllProductsByCurrentManufacturer(temp)
  }

  const onhandleProductID = async (e) => {
    let productDetails = allProductsByCurrentManufacturer.filter(
      (product) => product.value == e
    )
    let allDetails = await axios.get(
      `${APIs.baseURL}/product-service/v1/product-details/${productDetails[0].productId}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userInfo.token}`,
      }
    }
    )
    let temp = {
      ...allDetails.data,
      GSTAmount: gstValue(
        allDetails?.data?.size,
        allDetails?.data?.sqFeetPrice
      ),
    }
    form.setFieldsValue({ Quantity: 1 })
    setSelectedProductDetails(temp)
  }

  useEffect(() => {
    productNamesAPI()
    form.setFieldsValue(selectedProductDetails)
    form.setFieldsValue({ GSTAmount: gstAmount })
  }, [form, selectedProductDetails, gstAmount])

  function handlechange(value, d2) {
    setCustomersToWhichDiscountWillApply(value)
  }

  const viewDiscountList = async () => {
    let data1 = await axios.get(`${APIs.baseURL}/customer-service/v1/customers`, {
      headers: {
        "Content-Type": "application/json",
        "MNF-CODE": `${userInfo.manufacturerCode}`,
        "Authorization": `Bearer ${userInfo.token}`,
      },
    })
    setCustomerList(data1?.data)
  }

  const [priceoffer, setPriceoffer] = useState()
  const onhandleoffer = (e) => {
    if (+e.target.value > totalForRightBox) {
      e.target.value = e.target.value.slice(0, -1)
      e.preventDefault()
      return false
    }
    setPriceoffer(e.target.value)
    const qtyResponse = (totalForRightBox - e.target.value) * 0.18
    setGstAmount(qtyResponse)
  }

  const onFinish = async (values) => {
    setLoading(true)
    let discountdata = {}
    if (discountTypeRadioValue == 1) {
      discountdata = {
        ...values,
        discount: discountPercent ? `${discountPercent}%` : "0%",
        discounttype: "percentage",
      }
    } else {
      discountdata = {
        ...values,
        discounttype: "flat",
      }
    }
    if (discountWillApplyToRadioValue == 1) {
      let data1 = await axios.get(`${APIs.baseURL}/customer-service/v1/customers`, {
        headers: {
          "Content-Type": "application/json",
          "MNF-CODE": `${userInfo.manufacturerCode}`,
          "Authorization": `Bearer ${userInfo.token}`,
        },
      })
      let temp = []
      data1.data.map((e) => {
        temp.push({
          customercode: e.customercode,
        })
      })

      let NumArry = discountdata.size
        .split("*")
        .map((e) => e.charAt(0).replace(/\D/g, ""))
      let arrOfNum = []
      NumArry.forEach((str) => {
        arrOfNum.push(Number(str))
      })

      let data = {
        product: {
          productid: selectedProductDetails.productid,
        },

        size: discountdata.size,
        stock: discountdata.stock,
        thickness: discountdata.thickness,
        squarefeetprice: discountdata.sqFeetPrice,
        quantity: parseInt(discountdata.Quantity),
        totalprice: parseInt(
          quantity * discountdata.sqFeetPrice * arrOfNum.reduce((a, b) => a * b)
        ),
        gstamount: discountdata.GSTAmount,
        discountype: discountdata.discounttype,
        discount: discountdata.discount,
        selectcustomers: temp,
      }
      await axios
        .post(`${APIs.baseURL}/discount-service/v1/discount`, data, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userInfo.token}`,
          }
        })
        .then(() => {
          message.success("Discount data added successfully")
          setLoading(false)
          form.resetFields()
          setSelectedProductDetails([])
          setDiscountPercent()
          setGstAmount()
        })
        .catch((error) => {
          console.log(error)
          setLoading(false)
          message.error("Data has not been updated!!!", 2)
        })
    } else {
      let temp = []
      values.listcustomer.map((e) => {
        temp.push({
          customercode: e,
        })
      })

      let data = {
        productName: {
          productid: selectedProductDetails.productid,
        },
        discountype: discountdata.discounttype,
        size: discountdata.size,
        stock: discountdata.stock,
        thickness: discountdata.thickness,
        squarefeetprice: discountdata.sqFeetPrice,
        quantity: discountdata.Quantity,
        totalprice: discountdata.price,
        gstamount: discountdata.GSTAmount,
        selectcustomers: temp,
        discount: discountdata.discount,
      }
      await axios
        .post(`${APIs.baseURL}/discount-service/v1/discount`, data, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userInfo.token}`,
          }
        })
        .then(() => {
          message.success("Discount data added successfully")
          setLoading(false)
          form.resetFields()
          setSelectedProductDetails([])
          setDiscountPercent()
          setGstAmount()
        })
        .catch((error) => {
          console.log(error)
          setLoading(false)
          message.error("Discount has already provided to this Customer", error)
        })
    }
  }

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo)
    setLoading(false)
  }

  const increase = () => {
    let percent = discountPercent + 1
    if (percent > 100) {
      percent = 100
    }
    setDiscountPercent(percent)
    const qtyResponse = changeGstOnDiscountChange(percent) * 0.18
    setGstAmount(qtyResponse.toFixed(2))
  }

  const decline = () => {
    let percent = discountPercent - 1
    if (percent < 0) {
      percent = 0
    }
    setDiscountPercent(percent)
    const qtyResponse = changeGstOnDiscountChange(percent) * 0.18
    setGstAmount(qtyResponse.toFixed(2))
  }

  const onChangeDiscountWillApplyTo = (e) => {
    setDiscountWillApplyToRadioValue(e.target.value)
  }

  const onChangeDiscountType = (e) => {
    setDiscountTypeRadioValue(e.target.value)
  }

  const quantitytotalChange = (quant) => {
    let data = addmrp.size
      .replaceAll("ft", "")
      .split("*")
      .reduce(
        (a, b) =>
          parseInt(a) *
          parseInt(b) *
          addmrp.sqFeetPrice *
          quant *
          (discountPercent ? discountPercent / 100.0 : 1)
      )
    return data ? data.toFixed(2) : 0
  }

  const onhandleQuantity = (e) => {
    console.log(e.target.value)
    setQuantity(+e.target.value)
    setTotalForRightBox(quantitytotalChange(e.target.value))
    const qtyResponse = quantitytotalChange(e.target.value) * 0.18
    setGstAmount(qtyResponse.toFixed(2))
  }

  const calSize = (size, sqPrice) => {
    let data = addmrp.size
      .replaceAll("ft", "")
      .split("*")
      .reduce(
        (a, b) => parseInt(a) * parseInt(b) * addmrp.sqFeetPrice * quantity
      )
    // setTotalPrice(data * (18 / 100.0))
    return data
  }

  const children = []
  for (let i = 10; i < 36; i++) {
    children.push(
      <Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>
    )
  }

  return (
    <div className={loading ? "onsubmit_loader_container" : ""}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <div className="discounts-container">
          <Row>
            <Col xs={24} sm={24} md={24} lg={24} xl={15}>
              <div className="discounts-form">
                <Row>
                  <Col
                    xs={24}
                    sm={24}
                    md={10}
                    lg={10}
                    xl={10}
                    className="discountCol"
                  >
                    <Form.Item
                      name="Product Name"
                      label="Product"
                      rules={[{ required: true, message: "Select a product" }]}
                    >
                      <Select
                        suffixIcon={<img src={downArrow} alt="downArrow" />}
                        onChange={onhandleProductID}
                        allowClear
                      >
                        {allProductsByCurrentManufacturer.map(
                          (e) =>
                            e.active && (
                              <Option
                                key={e.sku}
                                name="Product"
                                value={e.option}
                              >
                                <Tooltip
                                  placement="topLeft"
                                  title={e.sku}
                                  arrowPointAtCenter
                                >
                                  <p>{e.value.charAt(0).toUpperCase() + e.value.slice(1)} </p>
                                </Tooltip>{" "}
                              </Option>
                            )
                        )}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={10}
                    lg={10}
                    xl={10}
                    className="discountCol"
                  >
                    <Form.Item label="S /Ft Price" name="sqFeetPrice">
                      <Input name="sqFeetPrice" disabled />
                    </Form.Item>
                  </Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={10}
                    lg={10}
                    xl={10}
                    className="discountCol"
                  >
                    <Form.Item
                      name="Quantity"
                      // value={productDetails.Quatity}
                      initialValue={1}
                      label="Quantity"
                      rules={[
                        { required: true, message: "Please input Quantity!" },
                      ]}
                      onKeyPress={(event) => {
                        if (checkNumbervalue(event)) {
                          event.preventDefault()
                        }
                      }}
                    >
                      <Input name="quantity" onChange={onhandleQuantity} />
                      {/* <Select
                        
                        suffixIcon={<img src={downArrow} alt="downArrow" />}
                      >
                        <Option value={1}>1</Option>
                        <Option value={2}>2</Option>
                        <Option value={3}>3</Option>
                        <Option value={4}>4</Option>
                        <Option value={5}>5</Option>
                        <Option value={6}>6</Option>
                        <Option value={7}>7</Option>
                        <Option value={8}>8</Option>
                        <Option value={9}>9</Option>
                        <Option value={10}>10</Option>
                      </Select> */}
                    </Form.Item>
                  </Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={10}
                    lg={10}
                    xl={10}
                    className="discountCol"
                  >
                    <Form.Item label="Stock" name="stock">
                      <Input name="stock" disabled />
                    </Form.Item>
                  </Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={10}
                    lg={10}
                    xl={10}
                    className="discountCol"
                  >
                    <Form.Item name="thickness" label="Thickness">
                      <Input disabled />
                    </Form.Item>
                  </Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={10}
                    lg={10}
                    xl={10}
                    className="discountCol"
                  >
                    <Form.Item name="size" label="Size(Sq/Ft)">
                      <Input disabled />
                    </Form.Item>
                  </Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={10}
                    lg={10}
                    xl={10}
                    className="discountCol"
                  >
                    <Form.Item label="Total Price">
                      <Input
                        name="price"
                        value={
                          calSize(addmrp.size, addmrp.sqFeetPrice) == 0
                            ? selectedProductDetails.price
                            : calSize(addmrp.size, addmrp.sqFeetPrice)
                        }
                        disabled
                      />
                    </Form.Item>
                  </Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={12}
                    lg={10}
                    xl={10}
                    className="discountCol"
                  >
                    <Form.Item label="GST Amount(18%)" name="GSTAmount">
                      <Input value={gstAmount} disabled onInput={e => e.target.value = e.target.value.toUpperCase()} />
                    </Form.Item>
                  </Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={12}
                    lg={10}
                    xl={10}
                    className="discountCol"
                  >
                    <Form.Item
                      name="DiscountType"
                      valuePropName="checked"
                      className="offer-display"
                    >
                      <Radio.Group
                        onChange={onChangeDiscountType}
                        value={discountTypeRadioValue}
                      >
                        <Radio value={1}>Percentage (%)</Radio>
                        <Radio value={2}>FlatDiscount</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={10}
                    lg={10}
                    xl={10}
                    className="discountCol"
                  ></Col>
                  {discountTypeRadioValue == 2 ? (
                    <>
                      {" "}
                      <Col
                        xs={24}
                        sm={24}
                        md={10}
                        lg={10}
                        xl={10}
                        className="discountCol"
                      >
                        <Form.Item
                          label="Flat Discount"
                          name="discount"
                          rules={[
                            {
                              required: true,
                              message: "Please input Flat Discount!",
                            },
                            {
                              validator: (_, value) => {
                                if (
                                  !value ||
                                  +value <
                                  calSize(addmrp.size, addmrp.sqFeetPrice)
                                ) {
                                  return Promise.resolve()
                                }
                                return Promise.reject(
                                  "Flat Discount should be lesser then Total Price"
                                )
                              },
                            },
                          ]}
                          onChange={onhandleoffer}
                        >
                          <Input
                            maxLength={totalForRightBox.toString().length}
                          />
                        </Form.Item>
                      </Col>
                      <Col
                        xs={24}
                        sm={24}
                        md={10}
                        lg={10}
                        xl={10}
                        className="discountCol"
                      ></Col>{" "}
                    </>
                  ) : (
                    <Col
                      xs={24}
                      sm={24}
                      md={22}
                      lg={22}
                      xl={22}
                      className="discountCol percent-bar"
                    >
                      <h4 className="discount-percent-title">
                        Set Discount Percentage
                      </h4>
                      <Row align="middle" gutter={16}>
                        <Col span={22}>
                          <Slider
                            onChange={onChangePercent}
                            defaultValue={0}
                            value={discountPercent}
                            min={0}
                            max={100}
                          />
                        </Col>
                        <Col span={2}>
                          <span> {discountPercent}</span>
                        </Col>
                      </Row>

                      {/* <Progress percent={discountPercent} /> */}
                      <Button.Group>
                        <Button onClick={decline} icon={<MinusOutlined />} />
                        <Button onClick={increase} icon={<PlusOutlined />} />
                      </Button.Group>
                    </Col>
                  )}
                  <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                    <Form.Item
                      name="CustomersSelected"
                      valuePropName="checked"
                      className="offer-display"
                    >
                      <Radio.Group
                        onChange={onChangeDiscountWillApplyTo}
                        value={discountWillApplyToRadioValue}
                      >
                        <Radio value={1}>Apply all</Radio>
                        <Radio value={2} onClick={viewDiscountList}>
                          Select Customer
                        </Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  {discountWillApplyToRadioValue === 1 ? (
                    <Col></Col>
                  ) : (
                    <>
                      <Col
                        xs={24}
                        sm={24}
                        md={20}
                        lg={22}
                        xl={22}
                      // className="listCol"
                      >
                        <Form.Item
                          name="listcustomer"
                          label="List of Customers"
                          requiredMark={"optional"}
                          rules={[
                            { required: true, message: "Select a Customer" },
                          ]}
                          wrapperCol={{
                            span: 23,
                          }}
                        >
                          <Select
                            mode="tags"
                            showArrow
                            optionFilterProp="children"
                            placeholder="Please select"
                            onChange={handlechange}
                            filterOption={(input, option) =>
                              option.props.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0 ||
                              option.props.value
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                            suffixIcon={<img src={downArrow} alt="downArrow" />}
                          >
                            {customerList
                              ? customerList.map((item, key) => {
                                return (
                                  <Option key={key} value={item.customercode}>
                                    <Tooltip
                                      placement="topLeft"
                                      title={item.customercode}
                                      arrowPointAtCenter
                                    >
                                      <p>{item.customerName.charAt(0).toUpperCase() + item.customerName.slice(1)} </p>
                                    </Tooltip>
                                  </Option>
                                )
                              })
                              : ""}
                          </Select>
                        </Form.Item>
                      </Col>
                    </>
                  )}
                </Row>
              </div>
            </Col>
            <Col xs={24} sm={20} md={12} lg={12} xl={9}>
              {selectedProductDetails?.length != 0 ? (
                <div className="discount-product-details">
                  <Row gutter={[20]} align="center">
                    <Col
                      xs={10}
                      sm={10}
                      md={10}
                      lg={10}
                      xl={10}
                      className="discount-image"
                    >
                      {/* {JSON.stringify(
                        productDetails?.productimage[0]?.imagebyte
                      )} */}
                      {selectedProductDetails?.productimage?.length > 0 ? (
                        <Image
                          src={
                            selectedProductDetails?.productimage !== undefined
                              ? selectedProductDetails?.productimage[0]?.url
                              : ""
                          }
                        />
                      ) : (
                        ""
                      )}
                    </Col>
                    <Col xs={13} sm={13} md={14} lg={12} xl={12}>
                      <h2 id="product-title">
                        {selectedProductDetails.productTitle}
                        {/* Thickness:{" "}
                        {selectedProductDetails.thickness &&
                          selectedProductDetails.thickness} */}
                      </h2>
                      <h1 style={{ textAlign: "left" }}>
                        <span id="product-price">
                          Rs&nbsp;
                          {discountTypeRadioValue === 1
                            ? totalForRightBox
                              ? (
                                totalForRightBox *
                                (discountPercent
                                  ? 1 - discountPercent / 100.0
                                  : 1)
                              ).toFixed(2)
                              : 0
                            : totalForRightBox
                              ? priceoffer
                                ? totalForRightBox - +priceoffer
                                : totalForRightBox
                              : 0}
                        </span>
                      </h1>
                      <div className="align-product-details">
                        <h4 className="strike-text">
                          Rs {totalForRightBox ? totalForRightBox : 0}{" "}
                        </h4>
                        <h4 className="percent-off-text">
                          {discountTypeRadioValue == 1
                            ? `${discountPercent}%`
                            : priceoffer
                              ? `Flat ₹ ${priceoffer}`
                              : "₹ 0"}{" "}
                          off
                        </h4>
                      </div>
                      <Row>
                        <Col
                          xs={15}
                          sm={12}
                          md={12}
                          lg={11}
                          xl={11}
                          className="discount-image"
                        >
                          <h4>Quantity</h4>
                        </Col>
                        <Col
                          xs={9}
                          sm={12}
                          md={12}
                          lg={13}
                          xl={13}
                          className="discount-image"
                        >
                          <h4>{quantity}</h4>
                        </Col>
                      </Row>
                      <Row>
                        <Col
                          xs={15}
                          sm={12}
                          md={12}
                          lg={11}
                          xl={11}
                          className="discount-image"
                        >
                          <h4>Size</h4>
                        </Col>
                        <Col
                          xs={9}
                          sm={12}
                          md={12}
                          lg={13}
                          xl={13}
                          className="discount-image"
                        >
                          <h4>{addmrp?.size}</h4>
                        </Col>
                      </Row>
                      <Row>
                        <Col
                          xs={15}
                          sm={12}
                          md={12}
                          lg={11}
                          xl={11}
                          className="discount-image"
                        >
                          <h4>Thickness</h4>
                        </Col>
                        <Col
                          xs={9}
                          sm={12}
                          md={12}
                          lg={13}
                          xl={13}
                          className="discount-image"
                        >
                          <h4>
                            {selectedProductDetails.thickness &&
                              selectedProductDetails.thickness}
                          </h4>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </div>
              ) : (
                ""
              )}
            </Col>
          </Row>
        </div>
        <Divider className="product-divide-button" />

        <div
          style={{
            display: "flex ",
            justifyContent: "flex-end",
            alignItems: "center",
            marginBottom: "12px",
            gap: "20px",
          }}
        >
          <Button
            type="primary"
            htmlType="submit"
            id="discount-cancelBtn"
            className="advert-cancel"
          >
            CANCEL
          </Button>
          <Button type="primary" htmlType="submit" id="discount-saveBtn">
            SUMBIT
          </Button>
          {loading && <Spin className="onsubmit_loader" />}
        </div>
      </Form>
    </div>
  )
}

export default Discount
