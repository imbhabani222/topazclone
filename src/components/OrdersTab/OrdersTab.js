import React, { useState, useEffect } from "react";
import "./Orders.css";
import { Tabs } from "antd";
import PastOrders from "../../pages/PastOrders/PastOrders";
import CurrentOrders from "../../pages/CurrentOrders/CurrentOrders";
import { bredCurm } from "../../action/useraction";
import { useDispatch } from "react-redux";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useLocation } from "react-router";

function OrdersTab() {
  const { TabPane } = Tabs;
  const [key, setKey] = useState("1");
  const dispatch = useDispatch();
  const [viewOrder, setViewOrder] = useState(null)
  const location = useLocation()
  // function callback(key) {
  //   setTabt(!tabt);
  //   dispatch(bredCurm(key));
  //   localStorage.setItem("keys", key);
  //   setKey(key);
  // }

  useEffect(() => {
    if(location.state){
      setKey("1")
      dispatch(bredCurm(key));
    }else{
      dispatch(bredCurm(key));
    }
  }, [location.state]);


  // if (typeof viewOrder === 'object' &&
  //   !Array.isArray(viewOrder) &&
  //   viewOrder !== null) {
  //     setViewOrder("current")
  //   }
    
  return (
    <div>
      <div className={!viewOrder ? "orders-tab" :"orders-tab view_order_class"}>
        <Tabs
          defaultActiveKey={key}
          onChange={(e)=>setKey(e)}
          activeKey={key}
        >
          {viewOrder !== "past" && <TabPane tab={!viewOrder ? "Current Orders" : (viewOrder === "current" || viewOrder === "editRequest") &&
           <div onClick={() => setViewOrder(null)} ><ArrowLeftOutlined /><span>{viewOrder === "current"  ?  "Current Orders" :viewOrder === "editRequest" && "Current Orders" } </span></div>
          }
          key="1" 
          >
            <CurrentOrders setViewOrder={setViewOrder} viewOrder={viewOrder} />
          </TabPane>}
          <TabPane tab={!viewOrder   ? "Past Orders" : viewOrder === "past" && <div onClick={() => setViewOrder(null)} ><ArrowLeftOutlined /><span>Past Orders </span></div>} key="2" >
            <PastOrders setViewOrder={setViewOrder} viewOrder={viewOrder} />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}

export default OrdersTab;
