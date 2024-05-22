import { Col, Form, Row, Input, message } from "antd";
import { checkNumbervalue } from "../onboard_manufactures";
import axios from "axios";

const AddressForm = ({ profileDatas = null, edit = true, form = null, addressline }) => {
  const setZipData = (zip) => {
    if (zip.length > 5) {
      axios.get(`https://api.postalpincode.in/pincode/${zip}`).then((res) => {
        console.log(res?.data[0]?.PostOffice[0], addressline);
        if (addressline === "1") {
          form.setFieldsValue({
            state: res?.data[0]?.PostOffice[0]?.State,
            city: res?.data[0]?.PostOffice[0]?.District,
            country: res?.data[0]?.PostOffice[0]?.Country,
          })
        } else {
          form.setFieldsValue({
            state2: res?.data[0]?.PostOffice[0]?.State,
            city2: res?.data[0]?.PostOffice[0]?.District,
            country2: res?.data[0]?.PostOffice[0]?.Country,
          })
        }

      }).catch((err)=>{
        message.error("Please Enter Valid Zip Code")
      })
    }
  };
  const line = addressline === "1"
  return <Col xs={24} sm={24} md={24} lg={24} xl={24} >
    <Row>
      <Col xs={24} sm={3} md={3} lg={6} xl={6}></Col>
      <Col xs={24} sm={18} md={18} lg={12} xl={12}>
        <Row>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <Form.Item
              requiredMark={"optional"}
              label={line ? "addressLine 1" : "Address Line 2"}
              name={line ? "addressline1" : "addressline2"}
              initialValue={
                profileDatas && line ? profileDatas.profileReducerResponse.addressLine : null
              }
              rules={[
                {
                  required: true,
                  message: "Please enter your address!",
                },
              ]}
            >
              <Input disabled={!edit} style={!edit ? { border: "none", padding: 0, color: "#000000" } : {}}
              />
            </Form.Item>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={11}
            className="profileCol"
          >
            <Form.Item
              requiredMark={"optional"}
              label="Country"
              name={line ? "country" : "country2"}
              initialValue={
                profileDatas && line ? profileDatas.profileReducerResponse.country
                  .countryName : null
              }
              rules={[
                {
                  required: true,
                  message: "Please select country!",
                },
              ]}
            >
              <Input
                placeholder="Enter Country"
                disabled={true}
                style={!edit ? { border: "none", padding: 0, color: "#000000" } : {}}
              ></Input>
              {/* <Select
                suffixIcon={
                  <img src={downArrow} alt="downArrow" />
                }
              >
                {country.map((e) => {
                  return (
                    <Option value={e.option}>{e.option}</Option>
                  );
                })}
              </Select> */}
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={11} lg={11} xl={11}>
            <Form.Item
              requiredMark={"optional"}
              label="State"
              name={line ? "state" : "state2"}
              initialValue={
                profileDatas && line ? profileDatas.profileReducerResponse.state
                  .stateName : null
              }
              rules={[
                {
                  required: true,
                  message: "Please select state!",
                },
              ]}
            >
              <Input
                placeholder="Enter State"
                disabled={true}
                style={!edit ? { border: "none", padding: 0, color: "#000000" } : {}}

              ></Input>
              {/* <Select
                suffixIcon={
                  <img src={downArrow} alt="downArrow" />
                }
                placeholder="Please select a State"
                optionFilterProp="children"
                //showSearch
                filterOption={(input, option) =>
                  option.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                filterSort={(optionA, optionB) =>
                  optionA.children
                    .toLowerCase()
                    .localeCompare(optionB.children.toLowerCase())
                }
              >
                {states.map((e) => {
                  return (
                    <Option value={e.option}>{e.option}</Option>
                  );
                })}
              </Select> */}
            </Form.Item>
          </Col>

          <Col
            xs={24}
            sm={24}
            md={11}
            lg={11}
            xl={11}
            className="profileCol"
          >
            <Form.Item
              requiredMark={"optional"}
              label="City"
              name={line ? "city" : "city2"}
              initialValue={
                profileDatas && line ? profileDatas.profileReducerResponse.city : null
              }
              rules={[
                {
                  required: true,
                  message: "Please select city!",
                },
              ]}
            >
              <Input
                placeholder="Enter City"
                disabled={true}
                style={!edit ? { border: "none", padding: 0, color: "#000000" } : {}}

              ></Input>
              {/* <Select
                required="required"
                suffixIcon={
                  <img src={downArrow} alt="downArrow" />
                }
              >
                <Option value="agartala">Agartala</Option>
                <Option value="aizawl">Aizawl</Option>
                <Option value="amaravati">Amaravati</Option>
                <Option value="bengaluru">Bengaluru</Option>
                <Option value="bhopal">Bhopal</Option>
                <Option value="bhubaneswar">Bhubaneswar</Option>
                <Option value="chandigarh">Chandigarh</Option>
                <Option value="chennai">Chennai</Option>
                <Option value="dehradun">Dehradun</Option>
                <Option value="dispur">Dispur</Option>
                <Option value="gandhinagar">Gandhinagar</Option>
                <Option value="gangtok">Gangtok</Option>
                <Option value="hyderabad">Hyderabad</Option>
                <Option value="imphal">Imphal</Option>
                <Option value="itanagr">Itanagr</Option>
                <Option value="jaipur">Jaipur</Option>
                <Option value="kohima">Kohima</Option>
                <Option value="kolkata">Kolkata</Option>
                <Option value="lucknow">Lucknow</Option>
                <Option value="mumbai">Mumbai</Option>
                <Option value="panaji">Panaji</Option>
                <Option value="patna">Patna</Option>
                <Option value="raipur">Raipur</Option>
                <Option value="ranchi">Ranchi</Option>
                <Option value="shillong">Shillong</Option>
                <Option value="shimla">Shimla</Option>
                <Option value="thiruvananthapuram">
                  Thiruvananthapuram
                </Option>
              </Select> */}
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={11} lg={11} xl={11}>
            <Form.Item
              label="Zip Code"
              name={line ? "zipcode" : "zipcode2"}
              onKeyPress={(event) => {
                if (checkNumbervalue(event)) {
                  event.preventDefault();
                }
              }}
              rules={[
                {
                  required: true,
                  message: "Please enter zip code",
                },
                // {
                //   max: 6,
                //   message: "Please enter only 6 digits",
                // },
                // {
                //   min: 6,
                //   message: "please enter only 6 digits",
                // },
              ]}
              initialValue={
                profileDatas && line ? profileDatas.profileReducerResponse.zipcode : null
              }
            >
              <Input
                minLength={6}
                maxLength={6}
                placeholder="Enter Zip Code"
                disabled={!edit} style={!edit ? { border: "none", padding: 0, color: "#000000" } : {}}
                onChange={(event) => {
                  setZipData(event.target.value);
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Col>
    </Row>
  </Col>
}

export default AddressForm