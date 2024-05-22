import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import ViewCategory from "../../pages/ViewCategory/ViewCategory";
import ViewProduct from "../../pages/ViewProduct/viewproduct";
import { useDispatch } from "react-redux";
import { bredCurm } from "../../action/useraction";
import "./CategoryTab.css";
function CategoryTab() {
  const { TabPane } = Tabs;
  const dispatch = useDispatch();
  const [key, setKey] = useState("1");

  function callback(key) {
    dispatch(bredCurm(key));
    localStorage.setItem("keys", key);
    setKey(key);
  }
  useEffect(() => {
    dispatch(bredCurm(localStorage.getItem("keys")));
  }, []);

  return (
    <div className="category-tabs-container">
      <Tabs defaultActiveKey={localStorage.getItem("keys")} onChange={callback}>
        <TabPane tab="Category" key="1">
          <ViewCategory />
        </TabPane>
        <TabPane tab="Product" key="2" className="tab2">
          <ViewProduct />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default CategoryTab;
