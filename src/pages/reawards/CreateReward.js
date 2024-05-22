import { CKEditor } from "@ckeditor/ckeditor5-react"
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"
import { Button, Col, DatePicker, Divider, Form, Input, Radio, Row, message } from "antd"
import moment from "moment"
import { useState } from "react"
import { createRewardAction } from "../../action/useraction"
import { checkNumbervalue } from "../onboard_manufactures"

const CreateReward = () => {
    const [reqFrequency, setFrequency] = useState("onetime")
    const [targetPoint, setTargetPoints] = useState("mandatory")
    const [recurringVal, setRecurringVal] = useState("monthly")
    const [description, setDescription] = useState(`<p>At [Company Name], we are committed to providing exceptional products and services to our valued customers. Our customer policy outlines the principles and guidelines that govern our interactions and relationships with customers. This policy is designed to ensure a positive and satisfying experience for all customers. Please take the time to read and understand the following key points:</p>
    <b>1. Quality Products and Services:</b>
    <p>We strive to deliver products and services of the highest quality. Our team is dedicated to maintaining rigorous standards to meet or exceed customer expectations. If you encounter any issues with our products or services, please do not hesitate to contact our customer support team for assistance.</p>
    <b>2. Transparent Pricing:</b>
    <p> We believe in transparency and will always provide clear and upfront pricing for our products and services. Any additional fees or charges will be communicated clearly before any purchase is made.</p>
    <b> 3. Privacy and Data Security:</b>
    <p> We respect your privacy and are committed to protecting your personal information. Our privacy policy outlines how we collect, use, and safeguard your data. Rest assured that your information will only be used for the purposes stated in our policy and will not be shared with any unauthorized third parties.</p>
    <b>4. Customer Support:</b>
    <p> Our customer support team is here to assist you with any questions, concerns, or issues you may have. Whether it's pre-sales inquiries or post-purchase support, we will respond promptly and strive to resolve your queries to your satisfaction.</p>
    <b> 5. Return and Refund Policy:</b>
    <p> If you are not completely satisfied with your purchase, we offer a fair and hassle-free return and refund policy. Please review our policy to understand the specific conditions and steps for initiating a return or refund.</p>
    </p >`
    )
    const [terms, setTerms] = useState(1000)
    const [form] = Form.useForm()

    const handleTerms = (event, editor) => {
        var spdata = editor.getData().replace("<p>", "")
        var epdata = spdata.replace("</p>", "")
        var ssdata = epdata.replace("<strong>", "")
        var esdata = ssdata.replace("</strong>", "")
        esdata = esdata.replace("</h2>", "")
        esdata = esdata.replace("<h2>", "")
        esdata = esdata.replace("<h3>", "")
        esdata = esdata.replace("<h4>", "")
        esdata = esdata.replace("</h4>", "")
        esdata = esdata.replace("</h3>", "")
        esdata = esdata.replace("<i>", "")
        esdata = esdata.replace("</i>", "")
        console.log(esdata)
        if (esdata.length >= 3500) {
            message.error("Description cannot be more than 1000 characters")
            event.preventDefault()
        } else {
            setDescription(editor.getData())
            setTerms(3500 - esdata.length)
        }
    }

    function convertDate(d) {
        let date = new Date(d),
            month = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), month, day].join("-");
    }

    const CreateRewardHandler = (values) => {
        const { creation, Validity, assignPoints, endDate, rewardName, startDate, title } = values
        const data = {
            DateofCreation: convertDate(creation),
            publicationStartDate: convertDate(startDate),
            publicationEndDate: convertDate(endDate),
            description,
            Validity,
            rewardName,
            title,
            frequency: reqFrequency === "onetime" ? "onetime" : "recurring",
            reqFrequency: reqFrequency === "onetime" ? null : recurringVal,
            targetPoints: targetPoint === "mandatory" ? "mandatory" : "optional",
            assignPoints: targetPoint === "mandatory" ? assignPoints : null
        }
        createRewardAction({ data })
        form.resetFields()
        message.success("Reward Successfully Created")
    }

    const onCreateRewardFailHandler = () => {
        message.error("Please Enter Input Fields")
    }

    return <div className="create_rewards_container">
        <h3>Fill the Details</h3>
        <Form
            form={form}
            onFinish={CreateRewardHandler}
            name="basic"
            layout="vertical"
            onFinishFailed={onCreateRewardFailHandler}
            autoComplete="off"
        >
            <div className="inner_container_c_rewards_header">
                <div className="inner_container_c_rewards_left">
                    <Row gutter={[15, 15]}>
                        <Col xs={18} sm={12} md={12} lg={12} >
                            <Form.Item
                                name="rewardName"
                                className="cRewards_formItems"
                                label="Reward Name"
                                rules={[
                                    { required: true, message: "Please Enter Reward Name!" },
                                    { whitespace: true },
                                    {
                                        min: 2,
                                        message: "Title should be atleast 2 characters ",
                                    },
                                    {
                                        max: 25,
                                        message: "Title cannot be longer than 25 characters ",
                                    },
                                ]} >
                                <Input placeholder="Enter Here" />
                            </Form.Item>
                        </Col>
                        <Col xs={12} sm={8} md={8} lg={8} >
                            <Form.Item
                                name="creation"
                                className="cRewards_formItems"
                                label="Date of Creation"
                                rules={[
                                    { required: true, message: "Please Select Date!" },
                                ]}>
                                <DatePicker
                                    defaultValue={moment()}
                                    disabledDate={(current) => {
                                        return current && current < moment() - 86400000
                                    }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <div className="cRewards_formItems">
                        <h4>Frequency</h4>
                        <Radio.Group onChange={(e) => setFrequency(e.target.value)} value={reqFrequency}>
                            <Radio value={"onetime"}>One Time</Radio>
                            <Radio value={"recurring"}>Recurring</Radio>
                        </Radio.Group>
                        {reqFrequency === "recurring" &&
                            <div class="radio_group_rewards">
                                <input type="radio" checked={recurringVal === "monthly"} value="monthly" id="monthly" onChange={(e) => setRecurringVal(e.target.value)} />
                                <label for="monthly">Monthly</label>
                                <input type="radio" checked={recurringVal === "quality"} value="quality" id="quality" onChange={(e) => setRecurringVal(e.target.value)} />
                                <label for="quality">Quaterly</label>
                                <input type="radio" checked={recurringVal === "halfyear"} value="halfyear" id="halfyear" onChange={(e) => setRecurringVal(e.target.value)} />
                                <label for="halfyear">Half Yearly</label>
                                <input type="radio" checked={recurringVal === "annual"} value="annual" id="annual" onChange={(e) => setRecurringVal(e.target.value)} />
                                <label for="annual">Annually</label>
                            </div>
                        }
                    </div>
                    <Row gutter={[15, 15]}>
                        <Col xs={24} sm={12} md={12}>
                            <div className="cRewards_formItems">
                                <h4>Target Points</h4>
                                <Radio.Group onChange={(e) => setTargetPoints(e.target.value)} value={targetPoint} >
                                    <Radio value={"mandatory"}>Mandatory</Radio>
                                    <Radio value={"optional"}>Optional</Radio>
                                </Radio.Group>
                            </div>
                        </Col>
                        <Col xs={24} sm={12} md={12}>
                            {targetPoint === "mandatory" &&
                                <Form.Item
                                    name="assignPoints"
                                    className="cRewards_formItems"
                                    label="Assign Points"
                                    onKeyPress={(event) => {
                                        if (checkNumbervalue(event)) {
                                            event.preventDefault();
                                        }
                                    }}
                                    rules={[
                                        { required: true, message: "Please Enter Assign Points!" },
                                    ]}
                                >
                                    <Input placeholder="Enter Assign Points Here" />
                                </Form.Item>}
                        </Col>
                    </Row>
                    <Row gutter={[15, 15]}>
                        <Col xs={24} sm={12} md={12}>
                            <div className="reward_validity">
                                <Form.Item
                                    name="Validity"
                                    className="cRewards_formItems"
                                    label="Reward Validity"
                                    rules={[
                                        { required: true, message: "Please Enter Reward Validity!" },
                                    ]}
                                    onKeyPress={(event) => {
                                        if (checkNumbervalue(event)) {
                                            event.preventDefault();
                                        }
                                    }}
                                >
                                    <Input placeholder="Enter Reward Validity" />
                                </Form.Item>
                                <h4>in days</h4>
                            </div>
                        </Col>
                        <Col xs={24} sm={12} md={12}>
                            <h4>Date of Publication</h4>
                            <Form.Item
                                className="cRewards_formItems"
                                name="startDate"
                                rules={[
                                    { required: true, message: "Please Select Start Date!" },
                                ]}>
                                <DatePicker
                                    disabledDate={(current) => {
                                        return current && current < moment() - 86400000
                                    }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <h3>General Policy</h3>
                    <Form.Item
                        className="cRewards_formItems"
                        label="Title"
                        name="title"
                        initialValue="Customer Policy"
                        rules={[
                            { required: true, message: "Please input title!" },
                            { whitespace: true },
                            {
                                min: 2,
                                message: "Title should be atleast 2 characters ",
                            },
                            {
                                max: 25,
                                message: "Title cannot be longer than 25 characters ",
                            },
                        ]}
                    >
                        <Input name="title" maxLength={50} />
                    </Form.Item>
                    <Form.Item
                        className="cRewards_formItems"
                        name="description"
                        label="Description"
                        getValueFromEvent={(event, editor) => {
                            const data = editor.getData()
                            return data
                        }}
                        rules={[
                            { message: "Please enter the description" },
                            { whitespace: true },
                            { min: 2 },
                            {
                                max: 3500,
                                message: "Description cannot be longer than 1000 characters",
                            },
                        ]}
                    >
                        <CKEditor
                            data={description}
                            editor={ClassicEditor}
                            onChange={(event, editor) => {
                                handleTerms(event, editor)
                            }}
                        />
                        <p style={{ textAlign: "right" }}>{terms}/3500</p>
                    </Form.Item>
                </div>
                <div className="inner_container_c_rewards_right">

                </div>
            </div>
            <Form.Item className='rewards_inner_container'>
                <Divider
                    className="rewards_divider"
                />
                <Button
                    type="primary"
                    htmlType="submit"
                    className="rewards_submit"
                >
                    Create Reward
                </Button>
            </Form.Item>
        </Form>
    </div>
}

export default CreateReward