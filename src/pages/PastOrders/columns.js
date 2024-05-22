import { Tooltip, Space, Tag, Dropdown } from "antd"
import { DownOutlined } from "@ant-design/icons"
import moment from "moment"

const Columns = (setTableTotal, page, orderSummary, setorderId) => [
  {
    title: "SI No",
    dataIndex: "key",
    key: "key",
    width: "5%",
    fixed: "left",
    render: (text, record, index) => {
      setTableTotal((page - 1) * 10 + index + 1)
      return (page - 1) * 10 + index + 1
    },
  },
  {
    title: "Customer Name",
    dataIndex: "customerName",
    key: "customerName",
    width: "10%",
    sorter: (a, b) => a.customerName.localeCompare(b.customerName),
    render: (value) =>
      `${value.charAt(0).toLocaleUpperCase()}${value.substring(1)}`,
  },
  {
    title: "Order ID",
    dataIndex: "orderID",
    key: "orderID",
    width: "8%",
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
    width: "8%",
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
    key: "quantity",
    width: "8%",
    sorter: (a, b) => a.quatity - b.quatity,
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    width: "8%",

    sorter: (a, b) => {
      return a?.amount - b?.amount
    },
    render: (value) =>
      Number(value).toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
      }),
  },
  {
    title: "Payment Mode",
    dataIndex: "paymentMode",
    key: "paymentMode",
    width: "8%",
    sorter: (a, b) => a.paymentMode.localeCompare(b.paymentMode),
  },
  {
    title: "Payment Status",
    dataIndex: "paymentStatus",
    key: "paymentStatus",
    width: "8%",
    sorter: (a, b) => a.paymentStatus.localeCompare(b.paymentStatus),
  },
  {
    title: "Order Date",
    dataIndex: "orderDate",
    key: "orderDate",
    width: "10%",
    sorter: (a, b) => a.orderDate.localeCompare(b.orderDate),
    render: (value) => moment(value).format("DD/MM/YYYY"),
  },

  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: "9%",
    render: (status, record) => (
      <a onClick={() => setorderId(record.orderID)}>
        <Tag
          className={
            status === "Delivered" || status === "Completed"
              ? "order-green"
              : status === "Cancelled" ||
                status === "Delivering" ||
                status === "Failed"
              ? "order-pink"
              : status === "Refunded"
              ? "order-blue"
              : "order-yellow"
          }
          key={status}
        >
          {status}
        </Tag>
      </a>
    ),
  },
  {
    title: "Action",
    key: "action",
    width: "4%",
    fixed: "right",
    render: (record) => (
      <Space size="middle">
        <a
          onClick={() => {
            orderSummary(record)
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
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M10.1421 12C15.5851 12 20.1065 6.68539 20.1065 6.68539C20.4601 6.30685 20.47 5.68168 20.1176 5.30005C20.1176 5.30005 15.8198 0 10.1891 0C4.55834 0 0.260548 5.30005 0.260548 5.30005C-0.0869669 5.68666 -0.0887718 6.31413 0.266688 6.69119C0.266688 6.69119 4.69926 12 10.1422 12L10.1421 12ZM10.1891 10.2353C12.5214 10.2353 14.4121 8.33919 14.4121 6.00012C14.4121 3.66107 12.5213 1.76491 10.1891 1.76491C7.85666 1.76491 5.96611 3.66116 5.96611 6.00012C5.96611 8.33916 7.85678 10.2353 10.1891 10.2353ZM10.1891 7.88243C11.2257 7.88243 12.066 7.03972 12.066 6.00017C12.066 4.96063 11.2257 4.11781 10.1891 4.11781C9.15252 4.11781 8.31209 4.96063 8.31209 6.00017C8.31209 7.03972 9.15252 7.88243 10.1891 7.88243Z"
                fill="#0A7CA7"
              />
            </svg>
          </Tooltip>
        </a>
      </Space>
    ),
  },
]

export default Columns
