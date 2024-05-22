
import React, { useEffect, useState } from "react";
import {
    Form,
    Input,
    Button,
    Row,
    Col,
    Divider,
    Typography,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import "./paymenteform.css";
import { checkNumbervalue } from "../onboard_manufactures/index";
import axios from "axios";
import "./paymenteform.css";
import { APIs } from "../../worker";
import { useDispatch } from "react-redux";
import { updateBankDetailsAction } from "../../action/useraction";

const { Text } = Typography;

const PaymentInformationForm = ({mainBankData, bank, gst, cin, deleteAccountHandler, primaryAc = false, edit = "", setEdit }) => {   
    const [bankData,setBankData] = useState(bank)

    const dispatch = useDispatch()
    let inputEdited = false
    const [form] = Form.useForm();
    const getBankNameAndNumberHandler = (ifsc) => {
        if (ifsc.length > 10) {
            axios.get(`https://ifsc.razorpay.com/${ifsc}`).then((res) => {
                console.log("hiiiiii", res?.data);
                const { BRANCH: branchName, BANK: bankName } = res?.data;
                form.setFieldsValue({
                    branchName,
                    bankName,
                });
                console.log(form)
            });
        }
    };
    
    useEffect(() => {
        if (bankData) {
            form.setFieldsValue(bankData);
        }
    }, [bankData]);

    const editAccountHandler = (e) => {
        if (e.accountNumber === edit || inputEdited) {
            if(inputEdited){
                console.log("edit-------")
                const { accountNumber, ifscCode, branchName, bankName } = e
                const updatedObj = {bankid:bankData.bankid, accountNumber, ifscCode, branchName, bankName }
                const updateInd = mainBankData.findIndex((bank)=>bank.bankid===bankData.bankid)
                mainBankData[updateInd] = updatedObj
                const updatedmainData = {bankdetails:mainBankData,gstNumber:gst,cinNumber:cin}
                dispatch(updateBankDetailsAction({updatedObj,bankid:parseInt(bankData?.bankid),updatedmainData}))
                setEdit("")
                inputEdited=false
                setBankData({ accountNumber, ifscCode, branchName, bankName,bankid:bankData.bankid})
            }else{
                setEdit("")
            }
        } else {
            setEdit(e.accountNumber)
        }
    }
    return <>
        < Form
            layout="vertical"
            className="payments_border_container"
            form={form}
            initialValues={{
                remember: true,
            }}
            onFinishFailed={""}
            autoComplete="off"
            onFinish={editAccountHandler}
            onChange={()=>inputEdited =true}
        >
            <Row>
                <Col xs={15} sm={15} md={18} lg={20} xl={20}></Col>
                <Col xs={24} sm={24} md={6} lg={4} xl={4}>
                    {!primaryAc ? edit !== bankData.accountNumber ? <button
                        className="secondary_account_delete_btn"
                        type="submit"
                    >
                        Edit <EditOutlined style={{ color: "#859094" }} />
                    </button> :
                        <button
                            className="secondary_account_delete_btn"
                            onClick={() => deleteAccountHandler(bankData.accountNumber)}
                        >
                            Delete <DeleteOutlined style={{ color: "#859094" }} />
                        </button> : <div style={{ padding: "1rem" }}>{" "}</div>}
                </Col>
            </Row>
            <Row>
                <Col xs={0} sm={0} md={2} lg={2} xl={2}></Col>
                <Col
                    xs={24}
                    sm={24}
                    md={5}
                    lg={5}
                    xl={5}
                    className="onboardCol"
                >
                    <Form.Item
                        // {...field}
                        label={<label style={edit !== bankData.accountNumber ? { color: "#9D9797" } : {}}>Account Number</label>}
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
                                message: "enter minimum 9 digits",
                            },
                        ]}
                    >
                        <Input  placeholder="Enter account number" disabled={edit !== bankData.accountNumber} style={edit !== bankData.accountNumber ? { border: "none", padding: 0, color: "#000000" } : {}} />
                    </Form.Item>
                </Col>
                <Col
                    xs={24}
                    sm={24}
                    md={5}
                    lg={5}
                    xl={5}
                    className="onboardCol"
                >
                    <Form.Item
                        // {...field}
                        label={<label style={edit !== bankData.accountNumber ? { color: "#9D9797" } : {}}>IFSC Code</label>}
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
                        <Input placeholder="Enter Ifsc code" onInput={e => e.target.value = e.target.value.toUpperCase()} onChange={(e) => getBankNameAndNumberHandler(e.target.value)} disabled={edit !== bankData.accountNumber} style={edit !== bankData.accountNumber ? { border: "none", padding: 0, color: "#000000" } : {}} />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={1} lg={1} xl={1}></Col>
                <Col
                    xs={24}
                    sm={24}
                    md={5}
                    lg={5}
                    xl={5}
                    className="onboardCol"
                >
                    <Form.Item
                        label={<label style={edit !== bankData.accountNumber ? { color: "#9D9797" } : {}}>Branch Name</label>}
                        name="branchName"
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
                        <Input placeholder="Enter branch name" disabled={edit !== bankData.accountNumber} style={edit !== bankData.accountNumber ? { border: "none", padding: 0, color: "#000000" } : {}} />
                    </Form.Item>
                </Col>
            </Row>

            <Row>
                <Col xs={0} sm={0} md={2} lg={2} xl={2}></Col>
                <Col
                    xs={24}
                    sm={24}
                    md={5}
                    lg={5}
                    xl={5}
                    className="onboardCol"
                >
                    <Form.Item
                        label={<label style={edit !== bankData.accountNumber ? { color: "#9D9797" } : {}}>Bank Name</label>}
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
                        <Input placeholder="Enter bank name" disabled={edit !== bankData.accountNumber} style={edit !== bankData.accountNumber ? { border: "none", padding: 0, color: "#000000" } : {}} />
                    </Form.Item>
                </Col>
                <Col
                    xs={24}
                    sm={24}
                    md={5}
                    lg={5}
                    xl={5}
                    className="onboardCol"
                >
                    <Form.Item
                        name="gst"
                        label={<label style={edit !== bankData.accountNumber ? { color: "#9D9797" } : {}}>GST Number</label>}
                        initialValue={gst}
                    >
                        <Input placeholder="Enter GST number" onInput={e => e.target.value = e.target.value.toUpperCase()} disabled={edit !== bankData.accountNumber} style={edit !== bankData.accountNumber ? { border: "none", padding: 0, color: "#000000" } : {}} />
                    </Form.Item>
                </Col>
                <Col xs={2} sm={2} md={1} lg={1} xl={1}></Col>
                <Col
                    xs={24}
                    sm={24}
                    md={5}
                    lg={5}
                    xl={5}
                    className="onboardCol"
                >
                    <Form.Item
                        name="cin"
                        label={<label style={edit !== bankData.accountNumber ? { color: "#9D9797" } : {}}>CIN Number</label>}
                        initialValue={cin}
                    >
                        <Input placeholder="Enter CIN number" disabled={edit !== bankData.accountNumber} style={edit !== bankData.accountNumber ? { border: "none", padding: 0, color: "#000000" } : {}} />
                    </Form.Item>
                </Col>
            </Row>
            {edit === bankData.accountNumber ? <>
                < Row >
                    <Col xs={10} sm={10} md={2} lg={2} xl={2}></Col>
                    <Col
                        xs={22}
                        sm={22}
                        md={18}
                        lg={18}
                        xl={18}
                        className="additional-delete-divider"
                    >
                        {" "}
                        <Divider />
                    </Col>
                    <Col xs={10} sm={10} md={3} lg={3} xl={3}></Col>
                </Row >
                <Row justify="end" align="top">
                    <Col xs={24} sm={24} md={10} lg={10} xl={10} >
                        <Button
                            style={{ width: "6.25rem", marginBottom: "1rem" }}
                            type="primary"
                            htmlType="submit"
                        >
                            Save
                        </Button>
                    </Col>
                </Row>
            </> :
                <Row style={{ height: "2rem" }}></Row>
            }
        </Form >
    </>

}


export default PaymentInformationForm