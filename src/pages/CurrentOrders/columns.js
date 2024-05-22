import { Tooltip, Tag, Space, Dropdown, Menu } from "antd"
import moment from "moment"
import { DownOutlined } from "@ant-design/icons"

const Columns = (
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
) => [
    {
      title: "SI No",
      dataIndex: "key",
      key: "key",
      // render: (text, record, index) => (page - 1) * 10 + index + 1,
      render: (t, r, ind) => {
        return (page - 1) * pageSize + ind + 1
      },
      width: "3%",
      fixed: "left",
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      width: "8%",
      sorter: (a, b) => a.customerName.localeCompare(b.customerName),
      render: (value) =>
        `${value.charAt(0).toLocaleUpperCase()}${value.substring(1)}`,
    },
    {
      title: "Order ID",
      dataIndex: "orderID",
      key: "orderID",
      width: "6%",
      sorter: (a, b) =>
        a.orderID.localeCompare(b.orderID, undefined, {
          numeric: true,
          sensitivity: "base",
        }),
    },
    {
      title: "MNF Code",
      dataIndex: "manufacturerCode",
      key: "manufacturerCode",
      width: "6%",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      sorter: function (a, b) {
        // console.log(a.quantity - b.quantity, "Sort Quantity")
        return a.quantity - b.quantity
      },
      width: "6%",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      // sorter: (a, b) => a.amount - b.amount,
      sorter: (a, b) => a.amount - b.amount,
      render: (value) =>
        Number(value).toLocaleString("en-IN", {
          style: "currency",
          currency: "INR",
        }),
      width: "6%",
    },

    {
      title: "Priority Status",
      dataIndex: "prioritystatus",
      key: "prioritystatus",
      width: "8%",
      sorter: function (a, b) {
        if (a.prioritystatus === "High" && b.prioritystatus === "Low") return 1
        else if (a.prioritystatus === "High" && b.prioritystatus === "Medium")
          return 1
        else if (a.prioritystatus === "High" && b.prioritystatus === "High")
          return 0
        else if (a.prioritystatus === "Low" && b.prioritystatus === "High")
          return -1
        else if (a.prioritystatus === "Low" && b.prioritystatus === "Medium")
          return -1
        else if (a.prioritystatus === "Low" && b.prioritystatus === "Low")
          return 0
        else if (a.prioritystatus === "Medium" && b.prioritystatus === "High")
          return -1
        else if (a.prioritystatus === "Medium" && b.prioritystatus === "Low")
          return 1
        else if (a.prioritystatus === "Medium" && b.prioritystatus === "Medium")
          return 0
      },
      // (a, b) => a.prioritystatus.localeCompare(b.prioritystatus),
      render: (prioritystatus, record) => (
        <a key={record.orderID} onClick={() => setorderId(record.orderID)}>
          <Dropdown overlay={menu2} trigger={["click"]}>
            <Tag
              className={
                prioritystatus === "High"
                  ? "current-order-red"
                  : prioritystatus === "Medium"
                    ? "current-order-yellow"
                    : prioritystatus === "Low"
                      ? "current-order-green"
                      : "current-order-yellow"
              }
              key={prioritystatus}
            >
              {prioritystatus} <DownOutlined className="arrow" />
            </Tag>
          </Dropdown>
        </a>
      ),
    },
    {
      title: "Payment Mode",
      dataIndex: "paymentMode",
      key: "paymentMode",
      width: "6%",
      sorter: (a, b) => a.paymentMode.localeCompare(b.paymentMode),
    },
    {
      title: "Payment Status",
      dataIndex: "paymentstatus",
      key: "paymentstatus",
      width: "8%",
      sorter: (a, b) => a.paymentstatus.localeCompare(b.paymentstatus),
      render: (paymentstatus, record) => (
        <a key={record.orderID} onClick={() => setorderId(record.orderID)}>
          <Dropdown overlay={menu1} trigger={["click"]}>
            <Tag
              className={
                paymentstatus == "Success"
                  ? "current-order-green"
                  : paymentstatus == "Failed"
                    ? "current-order-red"
                    : paymentstatus == "Pending"
                      ? "current-order-yellow"
                      : "current-order-yellow"
              }
              key={paymentstatus}
            >
              {paymentstatus} <DownOutlined className="arrow" />
            </Tag>
          </Dropdown>
        </a>
      ),
    },
    {
      title: "Order Date",
      dataIndex: "orderDate",
      key: "orderDate",
      width: "6%",
      sorter: (a, b) => a.orderDate.localeCompare(b.orderDate),
      render: (value) => moment(value).format("DD/MM/YYYY"),
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "8%",
      render: (status, record) => (

        <a key={record.orderID} onClick={() => setorderId(record.orderID)}>
          <Dropdown overlay={<Menu onClick={(e) => handleMenuClick(e)}>{
            Object.entries(orderSatus).map((key) => {
              if (status === "Processing") {
                if (key[1].status !== "Quote Requested" && key[1].status !== "Quote Sent" && key[1].status !== "Processing") {
                  return <Menu.Item key={key[1].statusid}>{key[1].status}</Menu.Item>;
                }
              } else if (status === "Quote Requested") {
                if (key[1].status === "Quote Sent") {
                  return <Menu.Item key={key[1].statusid}>{key[1].status}</Menu.Item>;
                }
              } else if (status === "Quote Sent") {
                if (key[1].status !== "Quote Requested" && key[1].status !== "Quote Sent") {
                  return <Menu.Item key={key[1].statusid}>{key[1].status}</Menu.Item>;
                }
              }
            })
          }</Menu>} trigger={["click"]}>
            <Tag
              className={
                status == "Delivered" || status == "Completed"
                  ? "current-order-green"
                  : status == "cancelled" ||
                    status == "Delivering" ||
                    status == "Failed"
                    ? "current-order-pink"
                    : status == "Processing"
                      ? "current-order-blue"
                      : "current-order-yellow"
              }
              key={status}
            >
              {status} <DownOutlined className="arrow" />
            </Tag>
          </Dropdown>
        </a>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: "4%",
      fixed: "right",
      render: (record) => (
        <Space key={record.orderID} size="middle">
          <a
            onClick={() => {
              orderSummary(record)
              window.scrollTo(0, -200)
            }}
          >
            <Tooltip placement="topLeft" title="View" arrowPointAtCenter>
              <svg
                width="21"
                height="12"
                viewBox="0 0 21 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10.1421 12C15.5851 12 20.1065 6.68539 20.1065 6.68539C20.4601 6.30685 20.47 5.68168 20.1176 5.30005C20.1176 5.30005 15.8198 0 10.1891 0C4.55834 0 0.260548 5.30005 0.260548 5.30005C-0.0869669 5.68666 -0.0887718 6.31413 0.266688 6.69119C0.266688 6.69119 4.69926 12 10.1422 12L10.1421 12ZM10.1891 10.2353C12.5214 10.2353 14.4121 8.33919 14.4121 6.00012C14.4121 3.66107 12.5213 1.76491 10.1891 1.76491C7.85666 1.76491 5.96611 3.66116 5.96611 6.00012C5.96611 8.33916 7.85678 10.2353 10.1891 10.2353ZM10.1891 7.88243C11.2257 7.88243 12.066 7.03972 12.066 6.00017C12.066 4.96063 11.2257 4.11781 10.1891 4.11781C9.15252 4.11781 8.31209 4.96063 8.31209 6.00017C8.31209 7.03972 9.15252 7.88243 10.1891 7.88243Z"
                  fill="#0A7CA7"
                />
              </svg>
            </Tooltip>
          </a>
          {record?.status === "Quote Requested" || record?.status === "Quote Sent" ? (
            <a onClick={() => editOrder(record)}>
              <Tooltip placement="topLeft" title="Edit" arrowPointAtCenter>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.5903 6.05716C15.7856 6.25242 16.1022 6.25242 16.2974 6.05716L17.0997 5.25486C18.3001 4.05448 18.3001 2.1009 17.0997 0.900048C16.5185 0.31928 15.7459 0 14.9221 0C14.0983 0 13.3252 0.319754 12.7444 0.900522L11.9426 1.70235C11.7473 1.89761 11.7473 2.21419 11.9426 2.40945L15.5903 6.05716ZM10.9379 3.41415C10.7426 3.21891 10.426 3.21892 10.2308 3.41417L2.02485 11.6201C1.84248 11.8025 1.70368 12.0275 1.62315 12.2714L0.0362214 17.0659C-0.0485726 17.3207 0.0182204 17.6016 0.208178 17.7916C0.344133 17.9271 0.52509 17.9995 0.710784 17.9995C0.78563 17.9995 0.86095 17.9877 0.934375 17.9635L5.72737 16.3761C5.97228 16.2956 6.19776 16.1568 6.38014 15.974L14.5856 7.76855C14.7808 7.57328 14.7808 7.25668 14.5855 7.06142L10.9379 3.41415Z"
                    fill="#0A7CA7"
                  />
                </svg>
              </Tooltip>
            </a>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.5903 6.05716C15.7856 6.25242 16.1022 6.25242 16.2974 6.05716L17.0997 5.25486C18.3001 4.05448 18.3001 2.1009 17.0997 0.900048C16.5185 0.31928 15.7459 0 14.9221 0C14.0983 0 13.3252 0.319754 12.7444 0.900522L11.9426 1.70235C11.7473 1.89761 11.7473 2.21419 11.9426 2.40945L15.5903 6.05716ZM10.9379 3.41415C10.7426 3.21891 10.426 3.21892 10.2308 3.41417L2.02485 11.6201C1.84248 11.8025 1.70368 12.0275 1.62315 12.2714L0.0362214 17.0659C-0.0485726 17.3207 0.0182204 17.6016 0.208178 17.7916C0.344133 17.9271 0.52509 17.9995 0.710784 17.9995C0.78563 17.9995 0.86095 17.9877 0.934375 17.9635L5.72737 16.3761C5.97228 16.2956 6.19776 16.1568 6.38014 15.974L14.5856 7.76855C14.7808 7.57328 14.7808 7.25668 14.5855 7.06142L10.9379 3.41415Z"
                fill="#d9d9d9"
              />
            </svg>
          )}
        </Space>
      ),
    },
  ]

export default Columns
