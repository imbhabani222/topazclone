import React, { useState, useEffect } from "react"
import { Row, Col, Tabs } from "antd"
import UploadCatelogue from "./uploadCatelogue"
import { useDispatch } from "react-redux"
import { bredCurm } from "../../action/useraction"
import "./ecatelogue.css"
import ViewECatelogue from "./ViewECatelogue"
import CreateCatalogue from "./CreateCatalogue"

const ECatelogueTab = () => {
  const { TabPane } = Tabs
  const dispatch = useDispatch()
  const [key, setKey] = useState(localStorage.getItem("keys"))
  const [tabt, setTabt] = useState(true)
  const [eCatalogue, setECatalogue] = useState([])
  function onKeyChange(key) {
    setTabt(!tabt)
    dispatch(bredCurm(key))
    localStorage.setItem("keys", key)
    setKey(key)
  }

  useEffect(() => {
    dispatch(bredCurm(key))
  }, [])

  return (
    <Row className="eCatelogue_tab">
      <Col span={24}>
        <Tabs
          defaultActiveKey={localStorage.getItem("keys")}
          onChange={onKeyChange}
          activeKey={key}
        >
          <TabPane tab="Upload E-catalogue" key={"1"}>
            <UploadCatelogue
              setECatalogue={setECatalogue}
              onKeyChange={() => onKeyChange("2")}
              eCatalogue={eCatalogue}
              key={key}
            />
          </TabPane>
          <TabPane tab="View E-catalogue" key={"2"}>
            <ViewECatelogue
              setECatalogue={setECatalogue}
              eCatalogue={eCatalogue}
              key={key}
            />
          </TabPane>
          <TabPane tab="Create E-catalogue" key={"3"}>
            <CreateCatalogue  setECatalogue={setECatalogue}
              onKeyChange={() => onKeyChange("2")}
              eCatalogue={eCatalogue}
              key={key} />
          </TabPane>
        </Tabs>
      </Col>
    </Row>
  )
}
export default ECatelogueTab
