import React, { useState, useEffect } from "react"
import { Table, Row, Col, Input, Tabs, Badge } from "antd"
import { useDispatch, useSelector } from "react-redux"
import ActivationLink from "../product_popup/activatin_link"
import { SearchOutlined, SyncOutlined } from "@ant-design/icons"
import "./notifications.css"
import moment from "moment/moment"
import { useNavigate } from "react-router"
import { notificationReadAction } from "../../action/useraction"

function Notifications() {
  const { TabPane } = Tabs
  const navigate = useNavigate()


  const [filterTable, setFilterTable] = useState("")
  const [searchInputValue, setSearchInputValue] = useState("")
  const [isActive, setIsActive] = useState(false)
  const [page, setPage] = useState(1)
  const [selectedVal, setSelectedVal] = useState(10)
  // const [pagination, setPagination] = useState(10)
  const allNotificationsState = useSelector((state) => state.getAllNotificationsReducer.resultData)
  console.log(allNotificationsState)
  let tableLoading;
  console.log(selectedVal)
  useEffect(() => {
    tableLoading = {
      spinning: allNotificationsState,
      indicator: <SyncOutlined spin />,
    }
  }, [allNotificationsState])


  const dispatch = useDispatch()

  useEffect(() => {
    setFilterTable(filterTable)
  }, [filterTable, page, selectedVal])

  const columns = [
    {
      title: "",
      width: "100%",
      align: "left",

      render: (record) => {
        // console.log("record", record)
        let time = moment(record.createdDate).format("hh:mm A MMM Do YYYY")
        return (
          <div
            className={`notificationTable`}
            onClick={() => {
              navigate("/orders", { state: [{ orderID: record.orderId }] })
              if (record.read) {
                let updatedData = [...allNotificationsState]
                const ind = updatedData.findIndex((data) => data.notificationId === record.notificationId)
                updatedData[ind].read = false
                dispatch(notificationReadAction({ notificationId: record.notificationId, updatedData }))
              }
            }}
          >
            <div className={` notificationHeader ${!record.read && "read"}`}>
              <span className={`notificationType `}>
                {record.notificationType} from {record.customerName}
              </span>
              <Badge color={`${!record.read ? "#D2D2D2" : "#EC3E3E"}`} />
            </div>
            <div className={`notificationInnerRow ${!record.read && "read"}`}>
              <span>{record.orderId}</span>
              <span className={`notificationDate `}>{time}</span>
            </div>
          </div>
        )
      },
    },
  ]


  return (
    <>
      {isActive && (
        <ActivationLink isActive={isActive} setIsActive={setIsActive} />
      )}
      <div>
        <div className="view-customers-container">
          <Tabs defaultActiveKey="1">
            <TabPane tab="Notifications" key="1">
              <Row style={{ marginBottom: "20px" }}>
                <Col xs={20} sm={10} md={18} lg={18} xl={18}></Col>
                <Col
                  xs={24}
                  sm={10}
                  md={6}
                  lg={6}
                  xl={6}
                  className="search-bar"
                >
                  <Input
                    placeholder="Search"
                    className="search-customer"
                    onChange={(e) => {
                      const currValue = e.target.value
                      setSearchInputValue(currValue)
                      // console.log(value);

                      const filteredData = allNotificationsState.filter((o) =>
                        Object.keys(o).some((k) =>
                          String(o[k])
                            .toLowerCase()
                            .includes(currValue.toLowerCase())
                        )
                      )
                      setFilterTable(filteredData)
                    }}
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
              <Table
                className="category-table"
                columns={columns}
                dataSource={
                  searchInputValue.length === 0 ? allNotificationsState : filterTable
                }
                scroll={{
                  x: 500,
                }}
                pagination={{
                  total: allNotificationsState?.length,
                  pageSize: selectedVal,
                  onChange(current) {
                    console.log("cur---",current)
                    setPage(current)
                  },
                }}
                onChange={(e) => setSelectedVal(e.pageSize)}
                loading={tableLoading}
              />

              <div className="below-table-paginatio">
                Showing {page * selectedVal - selectedVal + 1} to{" "}
                {page * selectedVal < allNotificationsState?.length
                  ? page * selectedVal
                  : allNotificationsState?.length}{" "}
                of {allNotificationsState?.length} entries
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </>
  )
}

export default Notifications
