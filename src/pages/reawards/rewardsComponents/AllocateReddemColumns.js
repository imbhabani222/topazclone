import { Button, Checkbox } from "antd"


const AllocateReddemColumns = (
    page,
    selectedCustomers,
    setSelectedCustomer,
    selectAll,
    setSelectAll,
    codeOFcustomer,
    viewCustomerList,
    currentpage,
    setkey
) => {
    if (currentpage === "customerDetails") {
        return [{
            title: "SI No",
            dataIndex: "key",
            render: (text, record, index) => {
                return (page - 1) * 10 + index + 1
            },
            width: ".8%",
            key: "key",
            fixed: "left"
        },
        {
            title: "Customer ID",
            dataIndex: "customercode",
            key: "customercode",
            sorter: (a, b) => a.customercode.localeCompare(b.customercode),
            sorter: (a, b) => {
                let aCat = parseInt(a.customercode.replace("CUS", ""))
                let bCat = parseInt(b.customercode.replace("CUS", ""))
                if (aCat > bCat) return 1
                else if (aCat < bCat) return -1
            },
            render: (r, record) => <Button type="link" onClick={() => {
                setkey(`${record.customercode}-${record.customerName}-6`)
            }}>{record.customercode}</Button>,
            width: "1.5%",
        },
        {
            title: "Full Name",
            dataIndex: "customerName",
            key: "customerName",
            sorter: (a, b) => a.customerName.localeCompare(b.customerName),
            width: "2%",
        },
        {
            title: "Email Address",
            dataIndex: "email",
            key: "email",
            sorter: (a, b) => a.email.localeCompare(b.email),
            width: "3%",
        },
        {
            title: "Phone Number",
            dataIndex: "primaryPhonenumber",
            key: "primaryPhonenumber",
            width: "1.5%",
        },
        {
            title: "Points Earned",
            dataIndex: "point",
            key: "point",
            sorter: function (a, b) {
                if (a.point > b.point) return 1
                else if (a.point < b.point) return -1
            },
            width: "1.5%",
        },
        {
            title: "Redeemed Points",
            dataIndex: "redeemPoint",
            key: "redeemPoint",
            sorter: function (a, b) {
                if (a.redeemPoint > b.redeemPoint) return 1
                else if (a.redeemPoint < b.redeemPoint) return -1
            },
            width: "1.5%",
            fixed: "right",
        },
        ]
    } else {
        return [
            {
                title: <Checkbox onChange={(e) => {
                    if (e.target.checked) {
                        setSelectAll(true)
                        setSelectedCustomer(viewCustomerList)
                    } else {
                        setSelectAll(false)
                        setSelectedCustomer([])
                    }
                }}>All</Checkbox>,
                dataIndex: "checkbox",
                key: "checkbox",
                width: ".8%",
                fixed: "left",
                render: (f, _record) => <>
                    <Checkbox
                        checked={selectAll || codeOFcustomer.includes(_record.customercode)}
                    ></Checkbox>
                    <span className="hiddenbox" onClick={(e) => {
                        if (!codeOFcustomer.includes(_record.customercode)) {
                            setSelectedCustomer([...selectedCustomers, _record])
                        } else {
                            if (selectedCustomers.length === 1) {
                                setSelectedCustomer([])
                            } else {
                                const ind = selectedCustomers.findIndex((customer) => customer.customercode === _record.customercode)
                                const updatedList = [...selectedCustomers].filter((customer) => customer.customercode !== _record.customercode)
                                setSelectedCustomer(updatedList)
                            }
                        }
                    }}></span>
                </>
            },
            {
                title: "SI No",
                dataIndex: "key",
                render: (text, record, index) => {
                    return (page - 1) * 10 + index + 1
                },
                width: ".8%",
                key: "key",
            },
            {
                title: "Customer ID",
                dataIndex: "customercode",
                key: "customercode",
                sorter: (a, b) => a.customercode.localeCompare(b.customercode),
                sorter: (a, b) => {
                    let aCat = parseInt(a.customercode.replace("CUS", ""))
                    let bCat = parseInt(b.customercode.replace("CUS", ""))
                    if (aCat > bCat) return 1
                    else if (aCat < bCat) return -1
                },
                width: "1.5%",
            },
            {
                title: "Full Name",
                dataIndex: "customerName",
                key: "customerName",
                sorter: (a, b) => a.customerName.localeCompare(b.customerName),
                width: "2%",
                render: (data) => <>{data.charAt(0).toUpperCase() + data.slice(1)}</>,
            },
            {
                title: "Email Address",
                dataIndex: "email",
                key: "email",
                sorter: (a, b) => a.email.localeCompare(b.email),
                width: "3%",
            },
            {
                title: "Phone Number",
                dataIndex: "primaryPhonenumber",
                key: "primaryPhonenumber",
                width: "1.5%",
            },
            {
                title: "Points Earned",
                dataIndex: "point",
                key: "point",
                sorter: function (a, b) {
                    if (a.point > b.point) return 1
                    else if (a.point < b.point) return -1
                },
                ellipsis: true,
                width: "1.5%",
                fixed: "right",
            },
        ]
    }
}
export default AllocateReddemColumns