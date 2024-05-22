import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import Offers from '../../pages/Offers/Offers';
import './DiscountsAndOffers.css';
import Discount from '../../pages/Discount/Discount';
import { useSelector,useDispatch } from 'react-redux';
import { bredCurm } from "../../action/useraction";


function DiscountsAndOffersTab() {
  const { TabPane } = Tabs;
  const [key, setKey] = useState("1");
  const  dispatch = useDispatch();
  function callback(key) {
    dispatch(bredCurm(key));
    localStorage.setItem("keys", key)
    setKey(key);
  }

  useEffect(() => {
    dispatch(bredCurm(localStorage.getItem("keys")))
  },[])
  return (
    <div className="discounts-offers-tabs-container">
      <Tabs defaultActiveKey={localStorage.getItem("keys")} onChange={callback}>
        <TabPane tab="Discount" key="1">
          <Discount />
        </TabPane>
        <TabPane tab="Offers" key="2">
          <Offers />
        </TabPane>
      </Tabs>
    </div>
  )
}

export default DiscountsAndOffersTab
