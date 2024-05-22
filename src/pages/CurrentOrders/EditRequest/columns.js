import { Image, Input } from "antd";
import { checkNumbervalue } from "../../onboard_manufactures";
import MessageIcon from "../../../../src/assets/img/message.svg"

const Columns = (deleteOrder, onInputChange, editRow, edit, setIsModalVisible, setModalname, setActive) => [
    {
        title: "Product",
        dataIndex: "productimage",
        key: "productimage",
        width: "100px",
        render: (item, record) => <Image width={53} height={50} src={record?.product?.productimage?.[0]?.url} />,
      },
      {
        title: "Name",
        dataIndex: "productTitle",
        key: "productTitle",
        render: (item, record) => (
          <span style={{ color: "#295A9F", fontWeight: "bold" }}>{record?.product?.productTitle}</span>
        ),
      },
      {
        title: "Quantity",
        dataIndex: "quantity",
        key: "quantity",
        width: "100px",
        render: (text, record, index) => (
          <Input
            value={text}
            disabled={true}
            className="table-box"
            onKeyPress={(event) => {
              if (checkNumbervalue(event)) {
                event.preventDefault();
              }
            }}
            onChange={onInputChange("quantity", index, "price")}
          />
        ),
      },
  
      {
        title: "Thickness",
        dataIndex: "thickness",
        key: "thickness",
        width: "100px",
        render: (text, record, index) => (
          <Input
            value={text}
            disabled={true}
            className="table-box"
            onChange={onInputChange("thickness", index)}
          />
        ),
      },
      {
        title: "Size (Feet)",
        dataIndex: "size",
        key: "size",
        width: "100px",
        render: (text, record, index) => (
          <Input
            value={text}
            disabled={true}
            className="table-box"
            onChange={onInputChange("size", index)}
          />
        ),
      },
  
      {
        title: "S/ft Price",
        dataIndex: "orderSqFeetPrice",
        key: "orderSqFeetPrice",
        width: "100px",
        render: (text, record, index) => (
          <Input
            value={text}
            className= {record.orderItemId === edit ? "table-box-edit" : "table-box" }
            disabled={record.orderItemId === edit ? false : true}
            onKeyPress={(event) => {
              if (checkNumbervalue(event)) {
                event.preventDefault();
              }
            }}
            onChange={onInputChange("sqftprice", index, "price")}
          />
        ),
      },
      {
        title: "Discount (%)",
        dataIndex: "promotionsdiscounts",
        key: "promotionsdiscounts",
        width: "100px",
        render: (text, record, index) => {
          return (
            <Input
              value={text}
              key={index}
              className= {record.orderItemId === edit ? "table-box-edit" : "table-box" }
              disabled={record.orderItemId === edit ? false : true}
              onKeyPress={(event) => {
                if (checkNumbervalue(event)) {
                  event.preventDefault();
                }
              }}
              onChange={onInputChange("orderDiscount", index, "price")}
            />
          );
        },
      },
      {
        title: "Total Value(₹)",
        dataIndex: "orderPrice",
        key: "orderPrice",
        width: "120px",
        render: (text, record, index) => {
          let string = record.size;
          let newstring = string.split("ft").join("").split("SQFT").join("");
          return (
            <Input
              style={{width:"93px"}}
              // value={
              //   record.sqftprice *
              //   record.quantity *
              //   newstring.split("*").reduce((a, b) => parseInt(a) * parseInt(b))
              // }
              value={text}
              className="table-box"
              disabled={record.orderItemsId === edit ? false : true}
              // onChange={onInputChange("totlaValue", index)}
            />
          );
        },
      },
      {
        dataIndex: "totlaValue",
        key: "totlaValue",
        width:"30px",
        render: (text, record, index) => (
          <div className="icons" >
            <a onClick={() => editRow(record)}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.96777 15.3655V17.1306C6.96777 17.2932 7.09552 17.421 7.2581 17.421H9.02326C9.09874 17.421 9.17423 17.3919 9.22648 17.3339L15.5671 10.999L13.3897 8.82161L7.05487 15.1564C6.99681 15.2145 6.96777 15.2842 6.96777 15.3655ZM17.251 9.31515C17.4775 9.0887 17.4775 8.7229 17.251 8.49644L15.8923 7.13773C15.6658 6.91128 15.3 6.91128 15.0736 7.13773L14.011 8.20031L16.1884 10.3777L17.251 9.31515Z"
                  fill="#0A7CA7"
                />
                <rect
                  x="0.5"
                  y="0.5"
                  width="23"
                  height="23"
                  rx="3.5"
                  stroke="#0A7CA7"
                />
              </svg>
            </a>
          </div>
        ),
      },
      {
        dataIndex: "totlaValue",
        key: "totlaValue",
        width:"30px",
        render: (text, record, index) => (
            <div className="icons">
                        <a onClick={() => deleteOrder(record)}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="0.5" y="0.5" width="23" height="23" rx="3.5" stroke="#0A7CA7" />
                                <path d="M15.4572 9.35925H8.54199V16.3016C8.67216 17.2779 9.53634 17.4496 9.95216 17.4135H14.3996C15.3759 17.2399 15.5115 16.5999 15.4572 16.3016V9.35925Z" fill="#0A7CA7" />
                                <path d="M8 7.56949V8.70847H16V7.56949H14.0746L13.4508 7H10.5492L10.0068 7.56949H8Z" fill="#0A7CA7" />
                            </svg>
                        </a>
        </div>
        ),
      },
      {
        dataIndex: "customerconversation",
        key: "customerconversation",
        width:"30px",
        render: (text, record, index) => (
            <div className="icons" style={{marginTop:"-5px"}}>
                        <img src={MessageIcon} onClick = { () => {
                          editRow(record, "customerconversation")
                        }} />
          </div>
        ),
      },
]

export default Columns;