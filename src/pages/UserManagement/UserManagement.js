import React from "react";
import { Tabs } from "antd";
import UserManagementForm from "../../pages/UserManagementForm/UserManagementForm";
import "./UserManagement.css";
function UserManagement() {
  const { TabPane } = Tabs;
  return (
    <div className="orders-tab">
      <Tabs defaultActiveKey="1">
        <TabPane tab="User Management" key="1">
          <UserManagementForm />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default UserManagement;
