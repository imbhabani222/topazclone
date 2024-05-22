import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Table,
  Space,
  Button,
  Form,
  Select,
  Divider,
  Modal,
  Input,
  Tooltip,
  message,
} from "antd";
import AddUser from "./AddUser";
import {
  PlusCircleOutlined,
  EditFilled,
  StopFilled,
  SyncOutlined,
} from "@ant-design/icons";
import "./UserManagementForm.css";
import { useDispatch, useSelector } from "react-redux";
import { addUser, listUsers } from "../../action/useraction";
import axios from "axios";
import { APIs } from "../../worker";
import { SearchOutlined } from "@ant-design/icons";
import { getmanufecturelist } from "../../action/useraction";
import { checkNumbervalue } from "../onboard_manufactures/index";

function UserManagementForm() {
  let dispatch = useDispatch();
  const [form] = Form.useForm();
  const { Option } = Select;

  const [userData, setUserData] = useState([]);
  const [userRoles, setUserRoles] = useState([]);
  const [active, setActive] = useState("add");
  const [userId, setUserId] = useState("");
  const [value, setValue] = useState("");
  const [filterTable, setFilterTable] = useState("");
  const [page, setPage] = React.useState(1);
  const [tableTotal, setTableTotal] = useState(0);
  const [visible, setVisible] = useState(false);
  const [visible1, setVisible1] = useState(false);
  const [manufacturerName, setManufacturerName] = useState([]);
  const [newUser, setNewUser] = useState({
    userName: "",
    email: "",
    phone: "",
    doj: "",
    manufacturerName: "",
  });
  const [addRoleId, setAddRoleId] = useState();
  const [newManufacturer, setNewManufacturer] = useState("");
  const userInfo = JSON.parse(localStorage.getItem("userinfo"))
  const listData = useSelector((state) => state.listUser.listUserResponse);
  const manufecturee = useSelector((state) => state.manufecture);
  const tableLoading = {
    spinning: useSelector((state) => state.listUser.loading),
    indicator: <SyncOutlined spin />,
  };

  const newArr = [];
  if (listData !== undefined) {
    listData.map((e) =>
      newArr.push({
        ...e,
        roles: e.role.userType,
      })
    );
  }
  const columns = [
    {
      title: "SI No",
      dataIndex: "Index",
      key: "index",
      render: (text, record, index) => {
        setTableTotal((page - 1) * 10 + index + 1);
        return (page - 1) * 10 + index + 1;
      },
      width: "1%",
      fixed: "left",
    },
    {
      title: "User",
      dataIndex: "userName",
      key: "User",
      width: "2%",
      render: (data) => <>{data.charAt(0).toUpperCase() + data.slice(1)}</>,
    },
    {
      title: "Role",
      dataIndex: "roles",
      key: "roles",
      width: "2%",
      render: (data) => {
        if (data !== null) {
          return <>{data.charAt(0).toUpperCase() + data.slice(1)}</>
        }
      }
    },
    {
      title: "Manufacturer Name",
      dataIndex: "manufacturerName",
      key: "manufacturerName",
      width: "4%",
      render: (data) => {
        if (data !== null) {
          return <>{data.charAt(0).toUpperCase() + data.slice(1)}</>
        }
      }
    },
    {
      title: "Email Address",
      dataIndex: "email",
      key: "email",
      width: "4%",
    },
    {
      title: "Contact",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: "2%",
    },
    {
      title: "Date of Join",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (text, record) => {
        const reverseDate = record?.createdDate?.split("-").reverse().join("-")
        return reverseDate
      },
      width: "2%",
    },
    {
      title: "Action",
      key: "action",
      width: "1%",
      fixed: "right",
      render: (record) => (
        <Space size="middle">
          <a>
            <Tooltip placement="topLeft" title="Edit" arrowPointAtCenter>
              <svg
                width="14"
                height="14"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => editUser(record)}
                className="editfilled_style"
                cursor="pointer"
              >
                <path
                  d="M15.5903 6.05716C15.7856 6.25242 16.1022 6.25242 16.2974 6.05716L17.0997 5.25486C18.3001 4.05448 18.3001 2.1009 17.0997 0.900048C16.5185 0.31928 15.7459 0 14.9221 0C14.0983 0 13.3252 0.319754 12.7444 0.900522L11.9426 1.70235C11.7473 1.89761 11.7473 2.21419 11.9426 2.40945L15.5903 6.05716ZM10.9379 3.41415C10.7426 3.21891 10.426 3.21892 10.2308 3.41417L2.02485 11.6201C1.84248 11.8025 1.70368 12.0275 1.62315 12.2714L0.0362214 17.0659C-0.0485726 17.3207 0.0182204 17.6016 0.208178 17.7916C0.344133 17.9271 0.52509 17.9995 0.710784 17.9995C0.78563 17.9995 0.86095 17.9877 0.934375 17.9635L5.72737 16.3761C5.97228 16.2956 6.19776 16.1568 6.38014 15.974L14.5856 7.76855C14.7808 7.57328 14.7808 7.25668 14.5855 7.06142L10.9379 3.41415Z"
                  fill="#0A7CA7"
                />
              </svg>
            </Tooltip>
          </a>
          <a onClick={() => disableUser(record.userid)}>
            <Tooltip
              placement="topLeft"
              title={record.enabled === true ? "Disable" : "Enable"}
              arrowPointAtCenter
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.24605 15.0439C0.205656 12.7133 -0.504458 9.50286 0.363145 6.5291C1.23069 3.55569 3.55584 1.23055 6.52914 0.363115C9.50278 -0.504431 12.713 0.205659 15.0439 2.24602L2.24605 15.0439ZM2.96158 15.7594C5.29346 17.798 8.50487 18.5055 11.4775 17.6356C14.4503 16.7658 16.7736 14.4388 17.6389 11.4644C18.504 8.49038 17.7916 5.28001 15.7493 2.95136L2.96158 15.7594Z"
                  fill="#0A7CA7"
                />
              </svg>
            </Tooltip>
          </a>
        </Space>
      ),
    },
  ];
  const onFinishFailed = (errorInfo) => {
    console.log(errorInfo);
  };
  const onFinish = async (value) => {
    console.log(value);
    let data = {
      userName: value.userName,
      role: { roleid: value.roleId },
      email: value.email,
      phoneNumber: value.phone,
      manufacturerName: value.manufacturerName,
    };
    let res = await axios.put(`${APIs.baseURL}/user-service/v1/user/` + userId, data,{
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userInfo.token}`,
      }
    }
    );
    form.resetFields();
    message.success("User updated Successfully.");
    setVisible(false);
    list();
  };
  const editUser = (id) => {
    let temp = [];
    manufecturee.manufectureinfo.map((e) =>
      temp.push({
        option: e.manufacturerName,
        value: e.manufacturerName,
      })
    );
    setManufacturerName(temp);
    setActive("edit");
    setUserId(id.userid);
    let finData = listData.find((e) => e.userid === id.userid);
    let final = {
      ...userData,
      name: finData.userName,
      roleId: finData.role.roleid,
      email: finData.email,
      phone: finData.phoneNumber,
      doj: finData.createdDate,
      Role: finData.role.userType,
      manufacturerName: finData.manufacturerName,
    };

    setUserData(final);
    if (id.enabled) setVisible(true);
    setAddRoleId(final.roleId);
    // setVisible(true);
  };
  const userRole = async () => {
    let res = await axios.get(`${APIs.baseURL}/user-service/v1/role`,{
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userInfo.token}`,
      }
    }
    );
    let temp = [];
    res.data.map((e) => {
      return temp.push({
        option: e.userType,
        value: e.roleid,
      });
    });
    setUserRoles(temp);
  };

  useEffect(() => {
    userRole();
    dispatch(listUsers());
    dispatch(getmanufecturelist());
  }, [dispatch, visible1]);
  useEffect(() => {
    form.resetFields();
  }, [form, userData, visible1]);
  useEffect(() => {
    setFilterTable(filterTable);
  }, [filterTable]);

  const disableUser = async (id) => {
    let res = await axios.put(`${APIs.baseURL}/user-service/v1/user/status/${id}`,{},{
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userInfo.token}`,
      }
    }
    );
    dispatch(listUsers());
    message.success(res.data);
  };
  const saveNewUser = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };
  const showModal = () => {
    setActive("add");
    let temp = [];
    manufecturee.manufectureinfo.map((e) =>
      temp.push({
        option: e.manufacturerName,
        value: e.manufacturerName,
      })
    );
    setManufacturerName(temp);
    let data = {
      name: "Enter Username",
      roleId: "Select Role",
      email: "Enter your email",
      phone: "Enter your phonenumber",
      doj: "Select date",
      manufacturerName: "Select Manufacturer Name",
    };
    setUserData(data);
    setVisible1(true);
  };
  const list = () => {
    dispatch(listUsers());
  };

  const handleCancel1 = () => {
    setVisible1(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const roleChange = (value) => {
    setAddRoleId(value);
  };
  const manufacturerNameChange = (value) => {
    setNewManufacturer(value);
  };

  return (
    <div className="user-container">
      <Row className="user_headers">
        <Col xs={24} sm={8} md={8} lg={7} xl={10}>
          {/* <h4 id="user-management-text">User Management</h4> */}
        </Col>

        <Col xs={24} sm={8} md={8} lg={10} xl={10}>
          <Input
            placeholder="Search"
            className="search-user-btn"
            bordered
            onChange={(e) => {
              const currValue = e.target.value;
              setValue(currValue);

              const filteredData = newArr.filter((o) =>
                Object.keys(o).some((k) =>
                  String(o[k]).toLowerCase().includes(currValue.toLowerCase())
                )
              );
              setFilterTable(filteredData);
            }}
            prefix={<SearchOutlined style={{ color: "#CCCCCC" }} />}
          ></Input>
        </Col>

        <Col xs={24} sm={8} md={8} lg={7} xl={4}>
          <Button
            className="add-user-btn"
            icon={<PlusCircleOutlined />}
            onClick={showModal}
          >
            Add User
          </Button>
        </Col>
      </Row>

      <Divider className="view-table-divider" />
      <div className="table-view-cat">
        <Table
          scroll={{
            x: 1500,
            // y: 300,
          }}
          columns={columns}
          dataSource={value.length === 0 ? newArr : filterTable}
          rowClassName={(record) =>
            record.enabled === false ? "disabled-row" : ""
          }
          loading={tableLoading}
          pagination={{
            onChange(current) {
              setPage(current);
            },
          }}
        />
        <div className="below-table-paginatio">
          Showing{" "}
          {+tableTotal % 10 === 0
            ? tableTotal - 9
            : tableTotal.toString().length === 1
              ? tableTotal - (tableTotal - 1)
              : tableTotal - (+tableTotal.toString().split("")[1] - 1)}{" "}
          to {tableTotal} of {newArr.length} entries
        </div>
      </div>

      <Modal
        className="addUserModal"
        centered
        visible={visible}
        title={
          active === "add" ? "Add user" : active === "edit" ? "Edit user" : ""
        }
        onCancel={handleCancel}
        maskClosable={false}
        closeIcon={
          <div className="product_details" style={{ marginRight: "15px" }}>
            <svg
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.5912 14.4788L22.0783 8.99175C22.2016 8.84776 22.2661 8.66254 22.2588 8.47311C22.2514 8.28367 22.1729 8.10398 22.0389 7.96993C21.9048 7.83588 21.7251 7.75735 21.5357 7.75003C21.3463 7.74271 21.161 7.80715 21.017 7.93046L15.5299 13.4176L10.0429 7.92293C9.89886 7.79962 9.71364 7.73519 9.52421 7.7425C9.33478 7.74982 9.15508 7.82835 9.02103 7.9624C8.88698 8.09645 8.80845 8.27615 8.80113 8.46558C8.79382 8.65501 8.85825 8.84023 8.98156 8.98422L14.4687 14.4788L8.97404 19.9659C8.89524 20.0334 8.83125 20.1165 8.78607 20.2098C8.74089 20.3032 8.7155 20.4049 8.7115 20.5086C8.70749 20.6123 8.72496 20.7156 8.7628 20.8122C8.80064 20.9088 8.85804 20.9965 8.9314 21.0699C9.00475 21.1432 9.09247 21.2006 9.18906 21.2385C9.28565 21.2763 9.38902 21.2938 9.49268 21.2898C9.59634 21.2858 9.69805 21.2604 9.79143 21.2152C9.88481 21.17 9.96785 21.106 10.0353 21.0272L15.5299 15.5401L21.017 21.0272C21.161 21.1505 21.3463 21.215 21.5357 21.2077C21.7251 21.2003 21.9048 21.1218 22.0389 20.9878C22.1729 20.8537 22.2514 20.674 22.2588 20.4846C22.2661 20.2952 22.2016 20.1099 22.0783 19.9659L16.5912 14.4788Z"
                fill="#0A7CA7"
              />
              <rect
                x="0.5"
                y="0.5"
                width="29"
                height="29"
                rx="3.5"
                stroke="#0A7CA7"
              />
            </svg>
          </div>
        }
        footer={null}
        width="56%"
      >
        <div className="add-user-inputs">
          <Form
            form={form}
            name="basic"
            layout="vertical"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <div
              className="add-users"
              style={{ paddingLeft: "30px", paddingRight: "30px" }}
            >
              <Row gutter={80}>
                <Col sm={24} md={12} xl={12} lg={12}>
                  <Form.Item
                    label="User Name"
                    name="userName"
                    requiredMark="optional"
                    initialValue={active === "edit" ? userData.name : ""}
                    rules={[
                      {
                        required: true,
                        message: "Please input User name",
                      },
                      { whitespace: true },
                      {
                        min: 2,
                        message: "Username must be more than 2 characters",
                      },
                      {
                        max: 30,
                        message:
                          "User name cannot be longer than 30 characters",
                      },
                    ]}
                  >
                    <Input
                      placeholder={active === "Add user" && "Enter Username"}
                      name="userName"
                      onChange={saveNewUser}
                    />
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} xl={12} lg={12}>
                  <Form.Item
                    name="roleId"
                    label="User Role"
                    requiredMark="optional"
                    initialValue={active === "edit" && userData.roleId}
                    rules={[
                      {
                        required: true,
                        message: "Please select user role!",
                      },
                    ]}
                  >
                    <Select
                      className="select-btn"
                      required="required"
                      name="roleId"
                      onChange={roleChange}
                      placeholder={userData.roleId}
                    >
                      {userRoles.map((item) => {
                        return (
                          <Option className="select-btn" value={item.value}>
                            {item.option.charAt(0).toUpperCase() +
                              item.option.slice(1)}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={80}>
                <Col sm={24} md={12} xl={12} lg={12}>
                  <Form.Item
                    name="email"
                    label="Email Address"
                    requiredMark="optional"
                    initialValue={active === "edit" && userData.email}
                    rules={[
                      {
                        type: "email",
                        message: "The input is not valid",
                      },
                      {
                        required: "true",
                        message: "Please input your E-mail",
                      },
                    ]}
                  >
                    <Input
                      disabled
                      placeholder={userData.email}
                      name="email"
                      onChange={saveNewUser}
                    />
                  </Form.Item>
                </Col>
                <Col sm={24} md={12} xl={12} lg={12}>
                  <Form.Item
                    name="phone"
                    label="Phone Number"
                    requiredMark="optional"
                    initialValue={userData.phone}
                    onKeyPress={(event) => {
                      if (checkNumbervalue(event)) {
                        event.preventDefault();
                      }
                    }}
                    rules={[
                      // {
                      //   max: 10,
                      //   message: "Enter only 10 digits",
                      // },
                      {
                        required: true,
                        message: "Please input your phone number!",
                      },
                    ]}
                  >
                    <Input
                      disabled
                      minLength={10}
                      maxLength={10}
                      placeholder={userData.phone}
                      name="phone"
                    // onChange={saveNewUser}
                    ></Input>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={80}>
                <Col sm={24} md={12} xl={12} lg={12}>
                  <Form.Item
                    label="Manufacturer Name"
                    name="manufacturerName"
                    requiredMark="optional"
                    initialValue={userData.manufacturerName}
                    rules={[
                      {
                        required: true,
                        message: "Please select manufacturer name!",
                      },
                    ]}
                  >
                    <Select
                      placeholder={userData.manufacturerName}
                      name="manufacturerName"
                      onChange={manufacturerNameChange}
                    >
                      {manufacturerName.map((e, index) => {
                        return (
                          <Option key={"MAN" + index} value={e.option}>
                            {e.option}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                {active === "edit" ? (
                  <Col sm={24} md={12} xl={12} lg={12}>
                    <Form.Item
                      name="joinDate"
                      label="Date of Join"
                      initialValue={userData.doj}
                    >
                      <Input
                        disabled
                        name="doj"
                        onChange={saveNewUser}
                        placeholder={userData.doj}
                      ></Input>
                    </Form.Item>
                  </Col>
                ) : (
                  ""
                )}
              </Row>
            </div>
            <Col sm={24} md={24} xl={24} lg={24}>
              <Divider id="buttons-divider" />
            </Col>
            <Col sm={24} md={24} xl={24} lg={24}>
              <div className="cancle-button">
                <Button className="cancelbtn" key="back" onClick={handleCancel}>
                  CANCEL
                </Button>

                <div className="save-edit">
                  <Button
                    htmlType="submit"
                    className="save-btn"
                  // onClick={updateUser}
                  >
                    SAVE
                  </Button>
                </div>
              </div>
            </Col>
          </Form>
        </div>
      </Modal>
      {visible1 === true && (
        <AddUser
          visible1={visible1}
          handleCancel1={handleCancel1}
          manufacturerName={manufacturerName}
          userRoles={userRoles}
          userData={userData}
        />
      )}
    </div>
  );
}

export default UserManagementForm;
