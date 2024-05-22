import React, { useState, useEffect } from "react"
import { Row, Col, Tabs } from "antd"
import { useDispatch } from "react-redux"
import { bredCurm } from "../../action/useraction"
import "./Rewards.css"
import RewardSetup from "./RewardsSetup"
import AllocatePoints from "./AllocatePoints"
import Redeem from "./Redeem"
import CreateReward from "./CreateReward"
import RewardComp from "./RewardsComp"
import { ArrowLeftOutlined } from "@ant-design/icons"
import CustomerDetails from "./rewardsComponents/CustomerDetails"

export const tempList = [
    {
        check: false,
        customerId: 10023,
        name: "Kondapuram Adithya yadav",
        email: "adithya.k@hutechsolutions.com",
        phno: 9182250815,
        points: 100,
    },
    {
        check: false,
        customerId: 10055,
        name: "ashutosh",
        email: "ashutosh@hutechsolutions.com",
        phno: 6045503567,
        points: 4000,
    },
    {
        check: false,
        customerId: 10034,
        name: "mihir",
        email: "mihir@hutechsolutions.com",
        phno: 8792025235,
        points: 9000,
    },
    {
        check: false,
        customerId: 10029,
        name: "vidya",
        email: "vidya@hutechsolutions.com",
        phno: 234568548,
        points: 1000,
    },
    {
        check: false,
        customerId: 10082,
        name: "siva",
        email: "siva@hutechsolutions.com",
        phno: 502988824,
        points: 1000,
    },
    {
        check: false,
        customerId: 10096,
        name: "laxmi",
        email: "laxmi@hutechsolutions.com",
        phno: 502988824,
        points: 1000,
    },

]


const RewardsTab = () => {
    const { TabPane } = Tabs
    const dispatch = useDispatch()
    const [key, setKey] = useState(localStorage.getItem("keys"))
    const [reward, setReward] = useState([])
    const [showmodal, setShowmodal] = useState(false)
    const [selectedCustomers, setSelectedCustomer] = useState([])
    const codeOFcustomer = selectedCustomers.map((customer) => customer.customercode)

    useEffect(() => {
        dispatch(bredCurm(key))
        localStorage.setItem("keys", key)
        setKey(key)
    }, [key])
    useEffect(() => {
        dispatch(bredCurm(localStorage.getItem("keys")))
        dispatch(bredCurm(key))
    }, [])
    return (
        <Row className="rewards_tab">
            <Col span={24} className="rewards_back_tab">
                <Tabs
                    defaultActiveKey={localStorage.getItem("keys")}
                    onChange={(e) => {
                        if (key.split("-")[2] === "6") setKey("5")
                        else setKey(e)
                    }}
                    activeKey={key}
                >
                    {key !== "0" && <TabPane tab={<ArrowLeftOutlined />} key={"0"}>
                    </TabPane>}
                    {key === "0" && <TabPane tab="Reward" key={"0"}>
                        <RewardComp setKey={setKey} />
                    </TabPane>}
                    {key === "1" && <TabPane tab="Reward Setup" key={"1"}>
                        <RewardSetup
                            setReward={setReward}
                            reward={reward}
                            key={key}
                        />
                    </TabPane>}
                    {key === "2" && <TabPane tab="Create Reward" key={"2"}>
                        <CreateReward
                            setReward={setReward}
                            reward={reward}
                            key={key}
                        />
                    </TabPane>}
                    {key === "3" && <TabPane tab="Allocate Points" key={"3"}>
                        <AllocatePoints
                            setReward={setReward}
                            reward={reward}
                            key={key}
                            showmodal={showmodal} setShowmodal={setShowmodal}
                            selectedCustomers={selectedCustomers}
                            setSelectedCustomer={setSelectedCustomer}
                            codeOFcustomer={codeOFcustomer}
                        />
                    </TabPane>}
                    {key === "4" &&
                        <TabPane tab="Redeem Points" key={"4"}>
                            <Redeem
                                setReward={setReward}
                                reward={reward}
                                key={key}
                                showmodal={showmodal} setShowmodal={setShowmodal}
                                selectedCustomers={selectedCustomers}
                                setSelectedCustomer={setSelectedCustomer}
                                codeOFcustomer={codeOFcustomer}
                            />
                        </TabPane>
                    }
                    {key === "5" && <TabPane tab="Customer Info" key={"5"}>
                        <CustomerDetails customerKey={key} setkey={setKey} />
                    </TabPane>}
                    {key.split("-")[2] === "6" && <TabPane tab={`Transaction details of ${key.split("-")[1]}`} key={key}>
                        <CustomerDetails customerKey={key} setkey={setKey} />
                    </TabPane>}
                </Tabs>
            </Col>
        </Row>
    )
}
export default RewardsTab
