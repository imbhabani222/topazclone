import { Button, Checkbox, Col, Divider, Form, Input, Modal, Row, Table, message } from "antd"
import { useState } from "react"
import { tempList } from "../RewardsTabs"
import deleteIcon from "../../../assets/img/delete.svg"
import { checkNumbervalue } from "../../onboard_manufactures"
import { allocateOrRedeemPointsAction } from "../../../action/useraction"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { GiftOutlined } from "@ant-design/icons"


const PointsModal = ({ redeem = false, showmodal, setShowmodal, selectedCustomers, codeOFcustomer, setSelectedCustomer, setSelectAll }) => {
    const [form] = Form.useForm()
    const [filterTable, setFilterTable] = useState()
    const [value, setValue] = useState(1)
    const [selectedVal, setSelectedVal] = useState(6)
    const [page, setPage] = useState(1)
    const [getRewardName, setGetRewardName] = useState("")
    const dispatch = useDispatch()
    const viewCustomerList = useSelector(
        (state) => state.viewCutomer.viewCutomerResponse || [], shallowEqual
    )
    console.log("cus------", selectedCustomers)
    const decolumn = [
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
            width: "1%",
            fixed: "left"
        },
        {
            title: "Full Name",
            dataIndex: "customerName",
            key: "customerName",
            sorter: (a, b) => a.customerName.localeCompare(b.customerName),
            width: "1%",
        },
        {
            title: "Points Earned",
            dataIndex: "points",
            key: "points",
            sorter: function (a, b) {
                if (a.point > b.point) return 1
                else if (a.point < b.point) return -1
            },
            render: (f, _record) => <>{_record.point}</>,
            width: "1%",
        },
        {
            title: "Action",
            dataIndex: "action",
            key: "action",
            render: (f, _record) => <img
                src={deleteIcon}
                alt="delete icon"
                onClick={() => {
                    if (selectedCustomers.length === 1) {
                        setSelectedCustomer([])
                    } else {
                        const updatedList = [...selectedCustomers].filter((customer) => {
                            if (customer.customercode !== _record.customercode) {
                                return customer
                            }
                        })
                        setSelectedCustomer(updatedList)
                    }
                }}
            />,
            width: ".7%",
            fixed: "right",
        },
    ]

    const onallocatePointsFailHandler = () => {

    }
    const getRewardnameHandler = (e) => {
        if (redeem) {
            setGetRewardName(e.target.value)
        }
    }
    const allocatePointsHandler = (values) => {
        if (!selectedCustomers.length) {
            form.resetFields()
            setShowmodal(false)
            return message.error("Please Select Customers")
        }
        if (redeem) {
            const notValidPoints = selectedCustomers.findIndex(customer => values.point > customer.point);
            if (notValidPoints >= 0) {
                return message.error("Please Do Valid Redemption!")
            }
        }
        values["customerCodes"] = codeOFcustomer
        dispatch(allocateOrRedeemPointsAction({ values, viewCustomerList, redeem }))
        form.resetFields()
        setSelectedCustomer([])
        setShowmodal(false)
        setSelectAll(false)
    }
    return <Modal title={redeem ? "Redeem Points" : "Allocate Points"} visible={showmodal} footer={false} className="modal_points_table" onCancel={() => setShowmodal(false)}>
        <Form
            form={form}
            onFinish={allocatePointsHandler}
            name="basic"
            layout="vertical"
            onFinishFailed={onallocatePointsFailHandler}
            autoComplete="off"
        >
            <Row gutter={[16, 16]}>
                <Col xs={18} sm={12} md={12} lg={12} >
                    <Form.Item
                        name="rewardName"
                        label="Reward Name"
                        rules={[
                            {
                                required: true,
                                message: "Please enter yReward Name!",
                            },
                        ]}
                    >
                        <Input placeholder="Enter Reward Name" onChange={getRewardnameHandler} />
                    </Form.Item>
                </Col>
                <Col xs={12} sm={8} md={8} lg={8} >
                    <Form.Item
                        name="point"
                        label={redeem ? "Redemption Points" : "Assign Points"}
                        onKeyPress={(event) => {
                            if (checkNumbervalue(event)) {
                                event.preventDefault();
                            }
                        }}
                        rules={redeem ? [
                            {
                                required: true,
                                message: "Please Enter Redemption Points!",
                            },
                        ] : [
                            {
                                required: true,
                                message: "Please Assign Points!",
                            },
                        ]}
                    >
                        <Input
                            placeholder="Enter Assign Points"
                            suffix={<span>Points</span>}
                        />
                    </Form.Item>
                </Col>
                {/* {redeem &&
                        <>
                            <h4>Rewards </h4>
                            <div
                                className="reward_gift_container"
                            >
                                <h4>{getRewardName}</h4>
                                <GiftOutlined className="rewards_gift" />
                            </div>
                        </>
                    } */}
            </Row>
            <Table className="category-table "
                rowKey="categoryid"
                columns={decolumn}
                size="middle"
                scroll={{ x: "auto", y: "auto" }}
                rowClassName={(record, p2) => {
                    return record.active === false ? "disable-row" : ""
                }}
                dataSource={selectedCustomers}
                pagination={false}
                loading={false}
            />
            <Divider
                className="rewards_divider"
            />
            <div className="rewards_modal_footer">
                <Button className="Cancel-btn" key="skyblue" onClick={() => setShowmodal(false)}>
                    CANCEL
                </Button>
                <Button
                    type="primary"
                    htmlType="submit"
                    className="rewards_alc_btn"
                >
                    {redeem ? "Redeem Points" : "Allocate Points"}
                </Button>
            </div>
        </Form>
    </Modal>
}

export default PointsModal;