import React, { useState, useEffect } from "react";
import {
  Form,
  Table,
  Row,
  Col,
  Input,
  Menu,
  message,
  Modal,
  DatePicker
} from "antd";
import {
  SearchOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import PastOrderSummary from "../OrderSection/PastOrderSummaryPage";
import { orderStatusUpdate, orderSumm } from "../../action/useraction";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import moment from "moment";
import Columns from "./columns";
import { getOrderList } from "../../action/useraction";
import "./PastOrders.css";

function PastOrders({ tabt , setViewOrder,viewOrder}) {
  const [filterTable, setFilterTable] = useState("");
  const [value, setValue] = useState("");
  const [orderId, setorderId] = useState("");
  const [page, setPage] = React.useState(1);
  const [tableTotal, setTableTotal] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [,setEndDate] =useState();
  const [orderSatus, setOrderSatus] = useState("");
  const [tableResData, setTableData] = useState([]);
  // const [orders, setOrders] = useState(false);

  const dispatch = useDispatch();
  const reducerData = useSelector(state => state || null, shallowEqual)
  
  const { 
    getOrderList : {
      loading, resultData 
    },
    getOrderStatus : {
      resultData: orderStatusData
    },
    OrderStatusUpdate: {
      resultData: orderStatusUpdateData
    },
  } =  reducerData

  const tableLoading = {
    spinning: loading,
    indicator: <SyncOutlined spin />,
  };


  useEffect(() => {
    return () => {
      dispatch({type: "ORDER_STATUS_UPDATE_CLEAR"})
    }
  }, []);

useEffect(()=>{
  if(orderStatusUpdateData){
     message.success("Data updated successfully")
     dispatch(getOrderList())
  }
},[orderStatusUpdateData])

  useEffect(()=>{
    if(resultData?.length > 0) {
    const response =  resultData.filter(({orderstatus}) =>orderstatus.status === "Completed" || orderstatus.status === "Delivered" || orderstatus.status === "Cancelled" || orderstatus.status === "Refunded" || orderstatus.status === "Failed" ).map(item => {
        return {
          customerName : item.customer.customerName,
          orderID: item.orderid,
          quantity : sumofItem("Quantity", item.orderItems),
          amount: item.amountwithtax,
          paymentMode: item.paymentmode,
          addressLine: item.customer.addressLine,
          paymentStatus: item?.paymentStatus?.paymentstatus ||  "Pending",
          orderDate: item.createdDate,
          status: item.orderstatus.status,
          thickness: item.orderItems.map(({thickness}) => thickness),
          size: item.orderItems.map(({size}) => size),
          sqftprice: item.orderItems.map(({sqftprice}) => sqftprice),
          totlaValue: item.orderItems.map(({price}) => price),
          image: item.orderItems.map(({product}) => product?.productimage?.imagebyte || ""),
          productName: item.orderItems.map((q) => q?.product?.productTitle),
          orderItemsId: item.orderItems.map(({orderItemId}) => orderItemId),
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
    if(orderStatusData?.length > 0) {
      setOrderSatus(orderStatusData)
    }
   },[resultData, orderStatusData])

  useEffect(()=>{
     if(orderStatusData) {
      setOrderSatus(orderStatusData)
     }
  },[orderStatusData])


  const handleMenuClick = async (menus) => {
    const { confirm } = Modal;
    console.log(menus);
    if (menus.key === "4" || menus.key === "7" || menus.key === "8") {
      console.log("entered in if statement ");
      return new Promise((resolve, reject) => {
        confirm({
          title: "Are you sure to send data in current orders?",
          onOk: () => {
            resolve(true);
            console.log(menus.key);
            const item = orderSatus.filter((e) => e.statusid === menus.key);
            const data = {
              orderstatus: {
                statusid: item[0].statusid,
                status: item[0].status,
              },
            };
            dispatch(orderStatusUpdate({params: orderId, body: data}))
          },

          onCancel: () => {
            reject(true);
          },
        });
      });
    } else {
      console.log(menus.key);
      const item = orderSatus.filter((e) => e.statusid === menus.key);
      const data = {
        orderstatus: {
          statusid: item[0].statusid,
          status: item[0].status,
        },
      };
      dispatch(orderStatusUpdate({params: orderId, body: data}))
    }
  };
  
  const menus = Object.entries(orderSatus).map((key) => {
    return <Menu.Item key={key[1].statusid}>{key[1].status}</Menu.Item>;
  });
  const menu = () => {
    return <Menu onClick={handleMenuClick}>{menus}</Menu>;
  };


   const sumofItem = (flag, value) => {
    if(flag === "Quantity"){
      console.log(value.reduce((a,b) => a + b.quantity, 0))
       return value.reduce((a,b) => a + b.quantity, 0)
    }
    if(flag === "Amount"){
      return value.reduce((a,b) => a + b.price, 0)
   }
   }

  const orderSummary = (record) => {
    dispatch(orderSumm(record));
    setViewOrder('past')
    // setOrders(true);
  };
 
  const getFromDate = (data) => {
    if(data) {
      setStartDate(data)
      const startDateInput =  moment(data).subtract(1)
      const endDateInput =  moment().add(1);
      const datas = tableResData.filter(item => {
      if(moment(item?.orderDate).isBetween(startDateInput, endDateInput)) return item
     })
     setFilterTable(datas)

    }
    else {
     setFilterTable(tableResData)
    }
   }

  const getToDate = (data) => {
    if(data) {
      setEndDate(data)
      const startDateInput =  moment(startDate).subtract(1) || moment().subtract(1)
      const endDateInput =  moment(data).add(1);
      const datas = tableResData.filter(item => {
      if(moment(item?.orderDate).isBetween(startDateInput, endDateInput)) return item
     })
      setFilterTable(datas)
    }
    else{
      setFilterTable(tableResData)
    }
  }
  
  return (
    <>
      {viewOrder === "past" && (
        <PastOrderSummary
        //  orders={orders} 
        // setOrders={setOrders}
         newArrs={tableResData} />
      )}
      {!viewOrder && <div className="past-order-container">
        <Form>
          <div className="past-order">
            <Row>
            <Col xs={24} sm={20} md={10} lg={7} xl={5}>
                <Form.Item label="Start Date">
                  <DatePicker format={"DD/MM/YYYY"}
                    onChange = {getFromDate}
                     disabledDate = { (current) =>{
                      return current && current > moment()
                     }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={20} md={10} lg={8} xl={12} className="order-col">
                <Form.Item label="End Date" name="endDate">
                  <DatePicker format={"DD/MM/YYYY"}
                  onChange = {getToDate}
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

                    const filteredData = tableResData.filter((o) =>
                      Object.keys(o).some((k) =>
                        String(o[k])
                          .toLowerCase()
                          .includes(currValue.toLowerCase())
                      )
                    );
                    setFilterTable(filteredData);
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
        <Table
          className="past-order-table"
          columns={Columns(setTableTotal, page, orderSummary, menu, setorderId)}
          pagination={{
            onChange(current) {
              setPage(current);
            },
          }}
          loading={tableLoading}
          dataSource={filterTable}
          scroll={{
            x: 1500,
            xs: 500,
            // y: 300,
          }}
        />
        <div className="below-table-paginatio">
          Showing{" "}
          {+tableTotal % 10 === 0
            ? tableTotal - 9
            : tableTotal.toString().length === 1
            ? tableTotal - (tableTotal - 1)
            : tableTotal - (+tableTotal.toString().split("")[1] - 1)}{" "}
          to {tableTotal} of {tableResData.length} entries
        </div>
      </div>}
    </>
  );
}

export default PastOrders;
