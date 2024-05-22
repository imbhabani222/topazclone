import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import "./profile.css";
import ProfileForm from "../ProfileForm/ProfileForm";
import Paymentform from "../PaymentForm/paymenteform";
import { useDispatch } from "react-redux";
import { bredCurm } from "../../action/useraction";

import Setting from "../setting/setting";

const Profile = () => {
  const { TabPane } = Tabs;
  const dispatch = useDispatch();
  const [key, setKey] = useState("1");

  // function callback(key) {
  //   console.log("keybbbbb----------b-b-----",key);
  //   dispatch(bredCurm(key));
  //   localStorage.setItem("keys", key);
  //   setKey(key);
  // }
  // useEffect(() => {
    // }, []);
      dispatch(bredCurm(key));

  return (
    <div className="profile-container">
      <Tabs defaultActiveKey={
        // localStorage.getItem("keys")
        "1"
    }
     onChange={
      (key)=>setKey(key)
      // callback
    }
    >
        <TabPane tab="Profile" key="1">
          <ProfileForm />
        </TabPane>
        <TabPane tab="Payments" key="2">
          <Paymentform />
        </TabPane>
        <TabPane tab="Settings" key="3">
          <Setting />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Profile;
