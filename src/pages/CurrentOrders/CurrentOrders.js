import React, { useState, useEffect } from "react";
import {
  Form,
  Table,
  Row,
  Col,
  DatePicker,
  Input,
  Menu,
  message,
} from "antd";
import {
  SearchOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import "./CurrentOrders.css";
import EditRequest from "./EditRequest/EditRequest";
import moment from "moment"
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getOrderList, getOrderStatus, getpaymentstatus, getPrioritystatus, orderStatusUpdate, orderSumm, paymentStatusUpdate, priorityStatusUpdate } from "../../action/useraction";
import CurrentOrderSummary from "../OrderSection/CurrentOrderSummary";
import Columns from "./columns";
import { useLocation } from "react-router";

function CurrentOrders({ setViewOrder, viewOrder }) {
  const [value, setValue] = useState("");
  const [filterTable, setFilterTable] = useState("");
  const [iseditOrder, setIseditOrder] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [orderSatus, setOrderSatus] = useState("");
  const [orderId, setorderId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [priorityStatus, setPriorityStatus] = useState("");
  const [page, setPage] = React.useState(1);
  const [load, setLoading] = useState(false);
  const [tableTotal, setTableTotal] = useState(0);
  const [tableResData, setTableData] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [, setEndDate] = useState();
  const [productEditState, setProductEditState] = useState(true)
  const location = useLocation();
  const [pageSize, setPageSize] = useState(10)
  // const [currentorders, setCurrentOrders] = useState(false);
  const dispatch = useDispatch();

  const reducerData = useSelector(state => state || null, shallowEqual)
  const {
    getOrderList: {
      loading, resultData
    },
    getOrderStatus: {
      resultData: orderStatusData,
    },
    getPaymentStatus: {
      resultData: paymentStatusData
    },
    getPriorityStatus: {
      resultData: priorityStatusData
    },
    OrderStatusUpdate: {
      resultData: orderStatusUpdateData
    },
    paymentStatusUpdate: {
      resultData: paymentStatusUpdateData
    },
    priorityStatusUpdate: {
      resultData: priorityStatusUpdateData
    }
  } = reducerData

  // useEffect(() => {
  //   location.state = null
  // }, [])

  useEffect(() => {
    if (productEditState) {
      dispatch(getOrderList());
      dispatch(getPrioritystatus());
      dispatch(getOrderStatus())
      dispatch(getpaymentstatus())
      setProductEditState(false)
    }
    return () => {
      dispatch({ type: "PRIORITY_STATUS_UPDATE_CLEAR" })
      dispatch({ type: "PAYMENT_STATUS_UPDATE_CLEAR" })
      dispatch({ type: "ORDER_STATUS_UPDATE_CLEAR" })
    }

  }, [productEditState])



  useEffect(() => {
    if (paymentStatusUpdateData || priorityStatusUpdateData || orderStatusUpdateData) {
      message.success(`Data updated successfully`);
      dispatch(getOrderList())
      //  clearStatusData()
    }
  }, [paymentStatusUpdateData, priorityStatusUpdateData, orderStatusUpdateData])

  useEffect(() => {
    setViewOrder(null)
    if (location.state && tableResData) {
      tableResData.forEach(item => {
        if (item.orderID === location.state[0].orderID) {
          if (item.status !== "Quote Requested") {
            filterHandler(tableResData, item.orderID)
            setValue(item.orderID)
          } else {
            setViewOrder("editRequest")
          }
          return
        }
      })
    }
    if (location.state) {
      if (!viewOrder && value !== location.state[0].orderID) {
        setValue(location.state[0].orderID)
        filterHandler(tableResData, location.state[0].orderID)
      }
    }
  }, [location.state, tableResData])
  console.log(location.state)

  useEffect(() => {
    if (resultData?.length > 0) {
      const response = resultData.filter(({ orderstatus }) => orderstatus.status === "Quote Requested" || orderstatus.status === "Quote Sent" || orderstatus.status === "Processing").map(item => {
        return {
          customerName: item.customer.customerName,
          orderID: item.orderid,
          quantity: sumofItem("Quantity", item.orderItems),
          amount: item.amountwithtax,
          paymentMode: item.paymentmode,
          addressLine: item.customer.addressLine,
          paymentstatus: item?.paymentstatus?.paymentstatus || "Pending",
          orderDate: item.createdDate,
          status: item.orderstatus.status,
          thickness: item.orderItems.map(({ thickness }) => thickness),
          size: item.orderItems.map(({ size }) => size),
          sqftprice: item.orderItems.map(({ sqftprice }) => sqftprice),
          totlaValue: item.orderItems.map(({ price }) => price),
          image: item.orderItems.map(({ product }) => product?.productimage?.imagebyte || ""),
          productName: item.orderItems.map((q) => q?.product?.productTitle),
          orderItemsId: item.orderItems.map(({ orderItemId }) => orderItemId),
          discription: item.orderItems.map((q) => q?.product?.discription),
          orderItems: item.orderItems,
          prioritystatus: item?.prioritystatus?.prioritystatus || "High",
          manufacturerCode: item?.manufacturerCode
        }
      }

      )
      setTableData([...response])
      setFilterTable([...response])
    }
    if (orderStatusData?.length > 0) {
      setOrderSatus(orderStatusData)
    }
    if (paymentStatusData?.length > 0) {
      setPaymentStatus(paymentStatusData)
    }
    if (priorityStatusData?.length > 0) {
      setPriorityStatus(priorityStatusData)
    }
  }, [resultData, orderStatusData, priorityStatusData, paymentStatusData])

  const sumofItem = (flag, value) => {
    if (flag === "Quantity") {
      return value.reduce((a, b) => a + b.quantity, 0)
    }
    if (flag === "Amount") {
      return value.reduce((a, b) => a + b.price, 0)
    }
  }
  const clearStatusData = () => {
    dispatch({ type: "PRIORITY_STATUS_UPDATE_CLEAR" })
    dispatch({ type: "PAYMENT_STATUS_UPDATE_CLEAR" })
    dispatch({ type: "ORDER_STATUS_UPDATE_CLEAR" })
  }
  const orderSummary = (record) => {
    dispatch(orderSumm(record));
    setOrderDetails(record);
    setViewOrder("current")
    // setCurrentOrders(true);
  };

  const editOrder = (record) => {
    // setIseditOrder(true);
    setOrderDetails(record);
    setViewOrder("editRequest")
  };
  const backArrowClick = () => {
    // setIseditOrder(false);
    dispatch(getOrderList());
  };

  const handleMenuClick = (menus) => {
    const item = orderSatus.filter((e) => e.statusid == menus.key);
    const data = {
      // paymentstatus: {
      //   paymentstatusid: item[0].paymentstatusid,
      //   paymentstatus: item[0].paymentstatus,
      // },
      orderstatus: { statusid: item[0].statusid, status: item[0].status },
    };
    dispatch(orderStatusUpdate({ params: orderId, body: data }))
    // await axios
    //   .put(`${APIs.baseURL}/orderdetailsStatus/update/${orderId}`, data)
    //   .then((res) => {
    //     setLoading(false);
    //     message.success(`Data updated successfully`);
    //     dispatch(getOrderList());
    //   })
    //   .catch((e) => console.log(e));
  };



  const handleMenuClick1 = (menus) => {
    const item = paymentStatus.filter((e) => e.paymentstatusid == menus.key);

    const data = {
      paymentstatus: {
        paymentstatusid: item[0].paymentstatusid,
        paymentstatus: item[0].paymentstatus,
      },
    };
    dispatch(paymentStatusUpdate({ params: orderId, body: data }))
    // await axios
    //   .put(`${APIs.baseURL}/paymentStatus/update/${orderId}`, data)
    //   .then((res) => {
    //     message.success(`Data updated successfully`);
    //     dispatch(getOrderList());
    //   })
    //   .catch((e) => console.log(e));
  };

  const handleMenuClick2 = (menus) => {
    const item = priorityStatus.filter((e) => e.prioritystatusid == menus.key);
    const data = {
      prioritystatus: {
        prioritystatusid: item[0].prioritystatusid,
        prioritystatus: item[0].prioritystatus,
      },
    };
    dispatch(priorityStatusUpdate({ params: orderId, body: data }))

  };



  const tableLoading = {
    spinning: loading,
    indicator: <SyncOutlined spin />,
  };

  const menus1 = Object.entries(paymentStatus).map((key) => {
    return (
      <Menu.Item key={key[1].paymentstatusid}>
        {key[1].paymentstatus}
      </Menu.Item>
    );
  });

  const menu1 = () => {
    return <Menu onClick={(e) => handleMenuClick1(e)}>{menus1}</Menu>;
  };

  const menus2 = Object.entries(priorityStatus).map((key) => {
    return (
      <Menu.Item key={key[1].prioritystatusid}>
        {key[1].prioritystatus}
      </Menu.Item>
    );
  });

  const menu2 = () => {
    return <Menu onClick={(e) => handleMenuClick2(e)}>{menus2}</Menu>;
  };


  const getFromDate = (data) => {
    if (data) {
      setStartDate(data)
      const startDateInput = moment(data).subtract(1, "days")
      const endDateInput = moment();
      const datas = tableResData.filter(item => {
        if (moment(item?.orderDate).isBetween(startDateInput, endDateInput)) return item
      })
      setFilterTable(datas)

    }
    else {
      setFilterTable(tableResData)
    }

  }
  const getToDate = (data) => {
    if (data) {
      setEndDate(data)
      const startDateInput = moment(startDate).subtract(1, "days") || moment().subtract(1, "days")
      const endDateInput = moment(data);
      const datas = tableResData.filter(item => {
        if (moment(item?.orderDate).isBetween(startDateInput, endDateInput)) return item
      })
      setFilterTable(datas)
    }
    else {
      setFilterTable(tableResData)
    }

  }

  const filterHandler = (tableResData, currValue) => {
    const filteredData = tableResData.filter((o) =>
      Object.keys(o).some((k) =>
        String(o[k])
          .toLowerCase()
          .includes(currValue.toLowerCase())
      )
    );
    setFilterTable(filteredData);
  }
  return (
    <>
      {
        viewOrder === "current"

        && (
          <CurrentOrderSummary
            // currentorders={currentorders}
            // setCurrentOrders={setCurrentOrders}
            orderDetails={orderDetails}
            newArrs={tableResData.filter((e) => e.orderID === orderDetails.orderID)}
          />
        )}

      {
        viewOrder === "editRequest"
        // iseditOrder
        // true 
        && (
          <EditRequest
            setProductEditState={setProductEditState}
            setViewOrder={setViewOrder}
            orderDetails={orderDetails}
            newArrs={location.state ? location.state : tableResData.filter((e) => e.orderID === orderDetails.orderID)}
            backArrowClick={() => backArrowClick()}
          // iseditOrder={iseditOrder}
          />
        )}

      {!viewOrder && <div className="current-order-container">
        {/* {currentorders && <CurrentOrderSummary currentorders={currentorders} setCurrentOrders={setCurrentOrders} />} */}
        <Form
        >
          <div className="current-order">
            <Row>
              <Col xs={24} sm={20} md={10} lg={7} xl={5}>
                <Form.Item label="Start Date">
                  <DatePicker format={"DD/MM/YYYY"}
                    onChange={getFromDate}
                    disabledDate={(current) => {
                      return current && current > moment()
                    }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={20} md={10} lg={8} xl={12} className="order-col">
                <Form.Item label="End Date" name="endDate">
                  <DatePicker format={"DD/MM/YYYY"}
                    onChange={getToDate}
                    disabledDate={(current) => {
                      return (current && current > moment()) || (current && current < moment(startDate, "DD/MM/YYYY"));
                    }}
                  />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                sm={10}
                md={6}
                lg={6}
                xl={6}
              >
                <Input
                  className="search_bar"
                  placeholder="Search"
                  bordered
                  value={value}
                  onChange={(e) => {
                    const currValue = e.target.value;
                    setValue(currValue);
                    filterHandler(tableResData, currValue)
                  }}
                  style={{ borderRadius: "5px" }}
                  prefix={
                    <SearchOutlined
                      style={{
                        color: "#CCCCCC",
                        height: "13.12",
                        width: "20px",
                      }}
                    />
                  }
                />
              </Col>
            </Row>
          </div>
        </Form>
        <div className="current-order-table">
          <Table
            columns={Columns(
              setTableTotal,
              page,
              setorderId,
              menu1,
              handleMenuClick,
              menu2,
              editOrder,
              orderSummary,
              orderSatus,
              pageSize
            )}
            pagination={{
              onChange(current) {
                setPage(current);
              },
              pageSize: pageSize
            }}
            onChange={(e) => setPageSize(e.pageSize)}
            loading={tableLoading}
            dataSource={filterTable}
            scroll={{
              x: 1500,
              xs: 500,
            }}
            className="verticalScroll"
          />
          <div className="below-table-paginatio">
            {/* Showing{" "}
            {+tableTotal % 10 === 0
              ? tableTotal - 9
              : tableTotal.toString().length === 1
                ? tableTotal - (tableTotal - 1)
                : tableTotal - (+tableTotal.toString().split("")[1] - 1)}{" "}
            to {tableTotal} of {tableResData.length} entries */}
            Showing {" "}{page * pageSize - pageSize + 1} to{" "}
            {page * pageSize} {" "}
            of {filterTable.length} entries
          </div>
        </div>
      </div>}
    </>
  );
}

export default CurrentOrders;
