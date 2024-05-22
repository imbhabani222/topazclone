import React, { useState, useEffect } from "react"
import { Tabs } from "antd"
import Advertisement from "../AdvertisementTab/Advertisement"
import ViewAdvertisement from "./ViewAdvertisement"
import { bredCurm } from "../../action/useraction"
import { useSelector, useDispatch } from "react-redux"

const AdvertisementTab = () => {
  const { TabPane } = Tabs
  const [key, setKey] = useState("2")
  const dispatch = useDispatch()
  const [advertisement, setAdvertisement] = useState([])
  function onKeyChange(key) {
    localStorage.setItem("keys", key)
    dispatch(bredCurm(key))
    setKey(key)
  }
  useEffect(() => {
    dispatch(bredCurm(localStorage.getItem("keys")))
  }, [])
  return (
    <div className="discounts-offers-tabs-container">
      <Tabs
        defaultActiveKey={localStorage.getItem("keys")}
        onChange={onKeyChange}
        activeKey={key}
      >
        {/* <Tabs defaultActiveKey={localStorage.getItem("keys")} onChange={onKeyChange}> */}

        <TabPane tab="Create Advertisement" key="1">
          <Advertisement
            setAdvertisement={setAdvertisement}
            advertisement={advertisement}
            onKeyChange={() => onKeyChange("2")}
            key={key}
          />
        </TabPane>
        <TabPane tab="View Advertisement" key="2">
          <ViewAdvertisement
            key={key}
            setAdvertisement={setAdvertisement}
            advertisement={advertisement}
          />

          {/* <button onClick={() => onKeyChange('1')}>BACK</button> */}
        </TabPane>
      </Tabs>
    </div>
  )
}

export default AdvertisementTab
