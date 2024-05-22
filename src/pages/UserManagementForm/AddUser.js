import React, { useEffect } from "react";
import {
  Row,
  Col,
  Button,
  Form,
  Select,
  Divider,
  Modal,
  Input,
  message,
} from "antd";
import { APIs } from "../../worker";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  checkNumbervalue,
} from "../onboard_manufactures/index";
function AddUser({
  handleCancel1,
  visible1,
  userData,
  userRoles,
  manufacturerName,
}) {
  const { Option } = Select;
  const [form] = Form.useForm();
  let dispatch = useDispatch();
  const userInfo = JSON.parse(localStorage.getItem("userinfo"))

  // const addResponse = useSelector((state) => state.addUser);

  // console.log(addResponse.error, "addResponse");

  // useEffect(() => {
  //   if (addResponse.error) {
  //     message.error(addResponse.error);
  //   }

  //   // if (addResponse.success) {
  //   //   message.success(addResponse.success);
  //   // }
  // }, [addResponse]);

  const onFinish = async (value) => {
    console.log(value);
    let addData = {
      userName: value.userName,
      role: {
        roleid: value.roleId,
      },
      email: value.email,
      phoneNumber: value.phone,
      manufacturerName: value.manufacturerName,
    };
    try {
      let response = await axios.post(
        `${APIs.baseURL}/user-service/v1/user`,
        addData, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userInfo.token}`,
        }
      }

      );
      console.log("response", response);
      form.resetFields();
      message.success("User Added Successfully.");
      handleCancel1();
    } catch (err) {
      message.error(err.response.data.message);
    }
    // await axios
    //   .post(`${APIs.baseURL}/usermanagment/add`, addData)
    //   .then((res) => {
    //     console.log(res);
    //     form.resetFields();
    //     message.success("User Added Successfully.");
    //     handleCancel1();
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };
  // dispatch(addUser(addData));
  const onFinishFailed = (errorInfo) => { };
  return (
    <Modal
      className="addUserModal"
      visible={visible1}
      title={"Add user"}
      centered
      onCancel={handleCancel1}
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
                      message: "User name cannot be longer than 30 characters",
                    },
                  ]}
                >
                  <Input
                    placeholder={userData.name}
                    name="userName"

                  //   onChange={saveNewUser}
                  />
                </Form.Item>
              </Col>
              <Col sm={24} md={12} xl={12} lg={12}>
                <Form.Item
                  name="roleId"
                  label="User Role"
                  requiredMark="optional"
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
                    //   onChange={roleChange}
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
                    placeholder={userData.email}
                    name="email"
                  //   onChange={saveNewUser}
                  />
                </Form.Item>
              </Col>
              <Col sm={24} md={12} xl={12} lg={12}>
                <Form.Item
                  name="phone"
                  label="Phone Number "
                  requiredMark="optional"
                  onKeyPress={(event) => {
                    if (checkNumbervalue(event)) {
                      event.preventDefault();
                    }
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Please input your phone number!",
                    },
                    {
                      max: 10,
                      message: "Please enter only 10 digits",
                    },
                  ]}
                >
                  <Input
                    type="tel"
                    placeholder={userData.phone}
                    name="phone"
                  //   onChange={saveNewUser}
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
                  //   onChange={manufacturerNameChange}
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
            </Row>
          </div>
          <Col sm={24} md={24} xl={24} lg={24}>
            <Divider id="buttons-divider" />
          </Col>
          <Col sm={24} md={24} xl={24} lg={24}>
            <div className="cancle-button">
              <Button className="cancelbtn" key="back" onClick={handleCancel1}>
                CANCEL
              </Button>

              <div className="save-edit">
                <Button htmlType="submit" className="save-btn">
                  SAVE
                </Button>
              </div>
            </div>
          </Col>
        </Form>
      </div>
    </Modal>
  );
}

export default AddUser;
