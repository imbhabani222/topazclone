import { Button, Col, Input, Row, Table } from "antd"
import { useEffect } from "react"
import { useState } from "react"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { SearchOutlined, SyncOutlined } from "@ant-design/icons"
import AllocateReddemColumns from "./AllocateReddemColumns"
import { getRewardInfo, viewCutomer, recentTransaction } from "../../../action/useraction"
import RecentTransactions from "./RecentTransactions"





const Points = ({ currentpage = "customer", setShowmodal, codeOFcustomer, columns, selectedCustomers = 0, setSelectedCustomer, selectAll, setSelectAll, customerKey = "", setkey = () => { }, setCustomerPage }) => {
    const dispatch = useDispatch()
    const [filterTable, setFilterTable] = useState([])
    const [page, setPage] = useState(1)
    const [detailsData, setDetailsData] = useState([])
    const showTransactions = customerKey.split("-")[2] === "6"
    const viewCustomerState = useSelector(
        (state) => state.viewCutomer || [], shallowEqual
    )
    const getRewardData = useSelector(
        (state) => state.getRewardInfoReducer || [], shallowEqual
    )
    const { rewardInfo, loadingreward } = getRewardData
    const { viewCutomerResponse, loading } = viewCustomerState

    useEffect(() => {
        dispatch(viewCutomer())
        dispatch(getRewardInfo())
    }, [])

    useEffect(() => {
        if (currentpage === "customerDetails") {
            if (rewardInfo) {
                setFilterTable(rewardInfo)
            }
        } else {
            if (viewCutomerResponse) {
                setFilterTable(viewCutomerResponse)
            }
        }
    }, [viewCutomerResponse, rewardInfo])

    const tableLoading = {
        spinning: loading || loadingreward || false,
        indicator: <SyncOutlined spin />,
    }
    const { TextArea } = Input;
    const searchFilterHandler = (e) => {
        const currValue = e.target.value
        if (currValue === "") {
            setFilterTable(viewCutomerResponse)
        } else {
            const filteredData = viewCutomerResponse.filter((o) =>
                Object.keys(o).some((k) =>
                    String(o[k])
                        .toLowerCase()
                        .includes(currValue.toLowerCase())
                )
            )
            setFilterTable(filteredData)
        }
    }
    useEffect(async () => {
        if (customerKey !== "5") {
            const data = await recentTransaction({ key: customerKey.split("-")[0] })
            setDetailsData(data)
        }
    }, [customerKey])

    return (<div className="allocate_reward_container">
        <Row gutter={[15, 15]}>
            {currentpage !== "customer" && currentpage !== "customerDetails" && <Col sm={24} md={12} lg={12} xl={5}>
                <h3>{currentpage === "redeem" ? "Reward Redemption" : currentpage === "allocate" && "Customer Point Allocation"}</h3>
            </Col>}
            {!showTransactions && <Col sm={24} md={12} lg={12} xl={8}>
                <Input
                    placeholder="Search Customer"
                    className="search_customer"
                    onChange={searchFilterHandler}
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
            </Col>}
            {currentpage !== "customer" && currentpage !== "customerDetails" && <>
                <Col sm={24} md={8} lg={8} xl={3}>
                    <h4>Selected : {selectedCustomers.length}</h4>
                </Col>
                <Col sm={24} md={8} lg={8} xl={4}>
                    <h4>Total Customers: {viewCutomerResponse ? viewCutomerResponse.length : 0}</h4>
                </Col>
                <Col sm={24} md={8} lg={8} xl={4}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="rewards_alc_btn"
                        onClick={() => setShowmodal(true)}
                    >
                        {currentpage === "allocate" ? "Allocate Points" : "Redeem Points"}
                    </Button>
                </Col>
            </>}
        </Row>
        <Table
            className="category-table"
            rowKey="categoryid"
            columns={currentpage === "customer" ? columns : showTransactions ? RecentTransactions(page) : AllocateReddemColumns(page, selectedCustomers, setSelectedCustomer, selectAll, setSelectAll, codeOFcustomer, viewCutomerResponse, currentpage, setkey)}
            scroll={{
                x: 1000,
                xs: 500,
            }}
            rowClassName={(record, p2) => {
                return record.active === false ? "disable-row" : ""
            }}
            dataSource={showTransactions ? detailsData : filterTable}
            pagination={{
                total: filterTable?.length,
                pageSize: 10,
                onChange(current) {
                    if (currentpage === "customer") {
                        setCustomerPage(current)
                    } else setPage(current)
                },
            }}
            loading={tableLoading}
        />
        <div className="below-table-paginatio">
            Showing {" "}{page * 10 - 10 + 1} to{" "}
            {page * 10 < filterTable.length
                ? page * 10
                : filterTable.length}{" "}
            of {filterTable.length} entries
        </div>
    </div>

    )
}

export default Points

