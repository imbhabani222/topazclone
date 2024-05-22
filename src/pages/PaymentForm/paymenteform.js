import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Space,
  Row,
  Col,
  Divider,
  message,
  Table,
  Typography,
  Modal,
} from "antd";
import { DeleteOutlined, EditOutlined, MinusCircleOutlined, PlusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import "./paymenteform.css";
import { checkNumbervalue } from "../onboard_manufactures/index";
import axios from "axios";
import { APIs } from "../../worker";
import PaymentInformationForm from "./PaymentInformation";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addBankAccountAction, deleteBankAccountDetailsAction, getBankAccountDetailsAction } from "../../action/useraction";

// import {
//     ArrowLeftOutlined,

//     PlusCircleOutlined,
//   } from "@ant-design/icons";
const { Text } = Typography;



const Paymentform = () => {
  // const [tableData, setTableData] = useState([]);
  const bankDataSelector = useSelector((state) => state?.accountDetails?.data)


  console.log("data--------------------------", bankDataSelector)
  const [mainBankData, setmainBankData] = useState({ bankData: [], gst: "", cin: '' });
  // const [cin, setCin] = useState("");
  // const [gst, setGst] = useState("");
  const { bankData, gst, cin } = mainBankData
  useEffect(() => {
    if (bankDataSelector) {
      const detailsObject = {
        bankData: bankDataSelector.bankdetails,
        cin: bankDataSelector.cinNumber,
        gst: bankDataSelector.gstNumber
      }
      setmainBankData(detailsObject)
      // setGst(bankDataSelector.gstNumber)
      // cin=bankDataSelector.cinNumber
      // console.log(bankDataSelector.gstNumber,bankDataSelector.cinNumber)
    }
  }, [bankDataSelector])
  const [addAccountBtn, setAddAccountBtn] = useState(true)
  const [edit, setEdit] = useState(null)
  const scrollRefForAccount = useRef(null)
  const dispatch = useDispatch()


  const [form] = Form.useForm();
  // useEffect(() => {
  //   if (bankData.length > 3) {

  //   }
  // }, [bankData])

  useEffect(() => {
    if (!addAccountBtn) {
      scrollRefForAccount.current.scrollIntoView({
        behavior: "smooth"
      })
    }
  }, [addAccountBtn])
  const userInfo = JSON.parse(localStorage.getItem("userinfo"));
  const onFinish = async (values) => {
    console.log("val----------------", values)
    let stop = false

    bankData.forEach((bank) => {
      if (bank.accountNumber === values.accountNumber) {
        message.error("Account Already Added")
        return stop = true
      }
    })
    if (stop) {
      return
    }
    setAddAccountBtn(true)
    // console.log("Received values of form:", values);
    dispatch(addBankAccountAction({ values }))
    form.resetFields();
  };
  console.log("gst-----------------------c-----------", gst, cin)
  const apiCall = () => {
    const userInfo = JSON.parse(localStorage.getItem("userinfo"));
    console.log(userInfo, "userInfo");
    // const { headers } = { Authorization: `Bearer ${userInfo?.token}` };

    dispatch(getBankAccountDetailsAction())

    // .then((res) => {
    //   console.log(res)
    // if(res.status !== 200){
    //   return message.error(`${res}`)
    // }
    // const { cinNumber, gstNumber, bankdetails } = res.data;
    // setGst(gstNumber);
    // setCin(cinNumber);
    // setBankData(bankdetails);
    // const newArray = bankdetails.map((item) => ({
    //   bankid:item.bankid,
    //   accountNumber: item.accountNumber,
    //   ifscCode: item.ifscCode,
    //   branchName: item.branchName,
    //   bankName: item.bankName,
    //   gstNumber: item.gstNumber,
    //   cinNumber,
    //   gstNumber,
    // }));
    // // setGSTNumber(res?.data?.cinNumber);
    // // setCINNumber(res?.data?.gstNumber);
    // // setBankData(res?.data?.bankdetails);
    // // newArr.push({ bankData, gstNumber, cinNumber });
    // setTableData(newArray);
    // console.log(newArray);
    // });
  };
  const getBankNameAndNumberHandler = (ifsc) => {
    if (ifsc.length > 10) {
      axios.get(`https://ifsc.razorpay.com/${ifsc}`).then((res) => {
        console.log("hiiiiii", res?.data);
        const { BRANCH: branchName, BANK: bankName } = res?.data;
        form.setFieldsValue({
          branchName,
          bankName,
        });
      });
    }
  };
  useEffect(() => {
    apiCall();
  }, []);
  const deleteAccountHandler = async (Acno) => {
    const { confirm } = Modal;
    return new Promise((resolve, reject) => {
      confirm({
        title: "Are you sure you want to Delete ?",
        onOk: () => {
          resolve(true);
          const deleteInd = bankData.findIndex((bank) => bank.accountNumber === Acno)
          bankData.splice(deleteInd, 1)
          const updatedBankData = {
            bankdetails: bankData,
            gstNumber: gst,
            cinNumber: cin
          }
          dispatch(deleteBankAccountDetailsAction({ Acno, updatedBankData }))
          form.resetFields()
        },
        onCancel: () => {
          reject(true);
        },
      });
    });

  }
  return (
    <div className="additional-details-container">
      <div className="onboardForm" id="onboard_payments" style={{ padding: 0 }}>
        <div className="payment_title">
          <h3 id="para">Primary Account</h3>
          {bankData.length < 3 && addAccountBtn && <Button
            type="primary"
            style={{ width: "9rem" }}
            onClick={() => {
              setAddAccountBtn(false)
            }}
            icon={
              <PlusOutlined />
            }
            disabled={!addAccountBtn}
          >
            Add Account
          </Button>}
        </div>
        <Divider />
        {bankData.map((bank) => {
          if (bank.bankid !== bankData[0].bankid) {
            return
          }
          return <PaymentInformationForm mainBankData={bankData} edit={edit} setEdit={setEdit} key={bank.accountNumber} bank={bank} gst={gst} cin={cin} deleteAccountHandler={deleteAccountHandler} primaryAc={true} />
        })}
        <div className="payment_title">
          <h3 id="para">Secondary Accounts</h3>
        </div>
        <Divider className="payment_header_divider" />
        {
          bankData.map((bank) => {
            if (bank.bankid === bankData[0].bankid) {
              return
            }
            return <PaymentInformationForm mainBankData={bankData} edit={edit} setEdit={setEdit} key={bank.accountNumber} bank={bank} gst={gst} cin={cin} deleteAccountHandler={deleteAccountHandler} />
          })
        }
        {!addAccountBtn && <Form
          layout="vertical"
          form={form}
          initialValues={{
            remember: true,
          }}
          name="dynamic_form_nest_item"
          onFinish={onFinish}
          autoComplete="off"
          className="payments_border_container">
          <Row style={{ padding: "1rem" }}>
            <Col xs={20} sm={20} md={6} lg={6} xl={4}>
              <Form.Item>
                <Text strong>Secondary Account</Text>
              </Form.Item>
            </Col>
            <Col xs={20} sm={20} md={16} lg={18} xl={20}>
              <Form.Item>
                <button
                  className="secondary_account_delete_btn"
                  onClick={() => setAddAccountBtn(true)}
                >
                  Delete <DeleteOutlined style={{ color: "#859094" }} />
                </button>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xs={24} sm={24} md={1} lg={1} xl={1}></Col>
            <Col
              xs={24}
              sm={24}
              md={6}
              lg={6}
              xl={6}
              className="onboardCol"
            >
              <Form.Item
                label="Bank Account Number"
                name="accountNumber"
                onKeyPress={(event) => {
                  if (checkNumbervalue(event)) {
                    event.preventDefault();
                  }
                }}
                rules={[
                  {
                    max: 18,
                    message: "Cannot enter more than 18 digits",
                  },
                  {
                    min: 9,
                    message: "Enter minimum 9 digits",
                  },
                ]}
              >
                <Input placeholder="Enter bank account" />
              </Form.Item>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={6}
              lg={6}
              xl={6}
              className="onboardCol"
            >
              <Form.Item
                label="IFSC Code"
                name="ifscCode"
                rules={[
                  {
                    pattern: "^[A-Za-z]{4}0[A-Z0-9a-z]{6}$",
                    message: "Invalid IFCS code",
                  },
                  {
                    max: 12,
                    message: "Value should be less than 12 character",
                  },
                ]}
              >
                <Input placeholder="Enter Ifsc code" onInput={e => e.target.value = e.target.value.toUpperCase()} onChange={(e) => getBankNameAndNumberHandler(e.target.value)} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={1} lg={1} xl={1}></Col>
            <Col
              xs={24}
              sm={24}
              md={6}
              lg={6}
              xl={6}
              className="onboardCol"
            >
              <Form.Item
                label="Branch Name"
                name="branchName"
                // name={[field.name, "branchName"]}
                rules={[
                  {
                    required: true,
                    message: "Enter bank name!",
                  },
                  { whitespace: true },
                  {
                    min: 2,
                    message: "Branch name must be atleast 2 characters",
                  },
                  {
                    max: 35,
                    message:
                      "Branch name cannot be longer than 35 characters",
                  },
                ]}
              >
                <Input placeholder="Enter branch name" disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row >
            <Col xs={24} sm={24} md={1} lg={1} xl={1}></Col>
            <Col
              xs={24}
              sm={24}
              md={6}
              lg={6}
              xl={6}
              className="onboardCol"
            >
              <Form.Item
                requiredMark={"optional"}
                label="Bank Name"
                name="bankName"
                rules={[
                  {
                    required: true,
                    message: "Enter bank name!",
                  },
                  { whitespace: true },
                  {
                    min: 2,
                    message: "Bank name must be atleast 2 characters",
                  },
                  {
                    max: 35,
                    message:
                      "Bank name cannot be longer than 35 characters",
                  },
                ]}
              >
                <Input type="text" placeholder="Enter bank name" disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xs={24} sm={24} md={1} lg={1} xl={1}></Col>
            <Col
              xs={24}
              sm={24}
              md={22}
              lg={22}
              xl={22}
              className="additional-delete-divider"
            >
              {" "}
              <Divider />
            </Col>
            <Col xs={24} sm={24} md={1} lg={1} xl={1}></Col>
          </Row>
          <Row justify="end" align="top">
            <Col xs={24} sm={24} md={5} lg={5} xl={5} >
              <Button
                style={{ width: "6.25rem", marginBottom: "1rem" }}
                type="primary"
                htmlType="submit"
              >
                Save
              </Button>
            </Col>
          </Row>
        </Form>}
        <span ref={scrollRefForAccount}></span>
      </div>
    </div >
  );
};
export default Paymentform;




