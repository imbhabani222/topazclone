import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import "./ManufacturerTabs.css";
import ViewManufacturer from "../ViewManufacturer/ViewManufacturer";
import OnboardManufactures from "../onboard_manufactures/onboard_manufactures";
import { useDispatch, useSelector } from "react-redux";
import { bredCurm } from "../../action/useraction";
import { Row, Col } from "antd";

function ManufacturerTabs() {
  const dispatch = useDispatch();
  const bredKey = useSelector((state) => state.bredCurm);
  const [key, setKey] = useState(
    window.location.pathname === "/onboard-manufactures"
      ? "1"
      : window.location.pathname === "/view-manufacturers"
      ? "2"
      : "1"
  );
  const { TabPane } = Tabs;
  function callback(key) {
    dispatch(bredCurm(key));
    localStorage.setItem("keys", key);
    setKey(key);
  }
  useEffect(() => {
    setKey(bredKey.data);
  }, [bredKey]);
  return (
    <div className="onboard-tabs-container">
      <Row>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Tabs
            activeKey={key}
            defaultActiveKey={bredKey.data}
            className="onboard-tabs-field"
            onChange={callback}
          >
            <TabPane tab="Onboard Manufacturers" key="1" >
              <OnboardManufactures />
            </TabPane>
            <TabPane tab="View Manufacturers" key="2">
              <ViewManufacturer callback={callback} />
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </div>
  );
}
export default ManufacturerTabs;
