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
  Popover,
  Modal,
  Input,
  message,
  Image,
  Tooltip,
} from "antd";
import {
  PlusCircleOutlined,
  SearchOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import "./ViewManufacturer.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getmanufecturelist, sendLink } from "../../action/useraction";
import {
  getSingleManufacture,
  getRegistrationManufacture,
} from "../../action/useraction";

import TextArea from "antd/lib/input/TextArea";
import {
  checkNumbervalue,
  checkSpace,
  checkSpecialCharacter,
  checkAlphabets,
} from "../onboard_manufactures/index";
import downArrow from "../../assets/img/downArrow.svg";
import { APIs } from "../../worker";

function ViewManufacturer({callback}) {
  const [visible2, setVisible2] = useState(false);
  const [editpop, setEditPop] = useState();
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  // const [tableTotal, setTableTotal] = useState(0);
  const [industryType, setIndustryType] = useState([]);
  const [visible, setVisible] = useState(false);
  const [visible3, setVisible3] = useState(false);
  const [value, setValue] = useState("");
  const [filterTable, setFilterTable] = useState("");
  const [page, setPage] = useState(1);
  const [editadressr, setAdress] = useState();
  const [activationURL, setActivationLink] = useState();
  const [pagination, setPagination] = useState(10);
  // const [selectedVal, setSelectedVal] = useState(10);
  const userInfo = JSON.parse(localStorage.getItem("userinfo"))

  const bredKey = useSelector((state) => state.bredCurm);
  const singleManufacturee = useSelector((state) => state.singleManufacture);
  const manufecturee = useSelector((state) => state.manufecture);

  let dispatch = useDispatch();

  useEffect(() => {
    dispatch(getmanufecturelist());
  }, [bredKey, dispatch]);

  // useEffect(() => {
  //   form.resetFields();
  // }, [visible2, editpop, form]);
  // form.setFieldsValue({ email: "imbhabani222@gmail.com" });

  if (singleManufacturee.manufectureinfo !== undefined) {
  }

  const getIndustryType = async () => {
    let res = await axios.get(`${APIs.baseURL}/manufacturer-service/v1/manufacturer/industryType`,{
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userInfo.token}`,
      }
    }
    );
    let temp = [];
    res.data.map((e) =>
      temp.push({
        option: e.industryType,
        value: e.industryId,
      })
    );
    setIndustryType(temp);
  };

  const onHandleChangeAdress = (e) => {
    setAdress(e.target.value);
  };
  const onhandlePagination = (value) => {
    console.log(value);
    setPagination(value);
    // setSelectedVal(value);
  };

  const onFinishedit = async (values) => {
    if (values.phoneNumber.toString().length < 10) {
      return message.error("Please Enter Valid Phone Number")
    }
    console.log("val---------------", values)
    setVisible2(false);
    const data1 = {
      email: values.email,
      industryType: values.industryType,
      contactPerson: values.contactPerson,
      phoneNumber: values.phoneNumber,
    };
    let data = {
      manufacturerName: singleManufacturee.manufectureinfo.manufacturerName,
      industry: {
        industryType: data1.industryType,
      },
      city: singleManufacturee.manufectureinfo.city,
      state: {
        stateName: singleManufacturee.manufectureinfo.state.stateName,
      },
      addressLine: editadressr,
      country: {
        countryName: singleManufacturee.manufectureinfo.country.countryName,
      },
      zipcode: singleManufacturee.manufectureinfo.zipcode,
      contactPerson: {
        userName: data1.contactPerson,
        role: {
          roleid: singleManufacturee.manufectureinfo.contactPerson.role.roleid,
        },
        email: data1.email,
        phoneNumber: data1.phoneNumber,
      },
      adddetails: {
        bankdetails: [
          {
            accountNumber:
              singleManufacturee.manufectureinfo.adddetails.bankdetails[0]
                .accountNumber,
            ifscCode:
              singleManufacturee.manufectureinfo.adddetails.bankdetails[0]
                .ifscCode,
            branchName:
              singleManufacturee.manufectureinfo.adddetails.bankdetails[0]
                .branchName,
          },
        ],
        cinNumber: singleManufacturee.manufectureinfo.adddetails.cinNumber,
        gstNumber: singleManufacturee.manufectureinfo.adddetails.gstNumber,
      },
    };
    console.log(singleManufacturee.manufectureinfo.manufacturerCode, "res");
    let response = await axios.put(
      `${APIs.baseURL}/manufacturer-service/v1/manufacturer/${singleManufacturee.manufectureinfo.manufacturerCode}`,
      data,{
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userInfo.token}`,
        }
      }
      
    );
    message.success("Manufacture data updated Successfully");
    dispatch(getmanufecturelist());
  };

  useEffect(() => {
    if (singleManufacturee.manufectureinfo !== undefined) {
    }
  }, [visible2, form, editpop, singleManufacturee.manufectureinfo]);

  const tableLoading = {
    spinning: manufecturee.loading,
    indicator: <SyncOutlined spin />,
  };

  let { manufectureinfo, error } = manufecturee;

  // useEffect(() => {
  //   setFilterTable(filterTable);
  // }, [filterTable]);

  let singleManufacture = singleManufacturee;
  let newArr = [];
  // console.log(manufectureinfo, "manufectureinfo");

  if (manufectureinfo !== undefined) {
    let { manufectureinfo, error } = manufecturee;
    manufectureinfo.map((e) =>
      newArr.push({
        zipcode: e.zipcode,
        roleid: e.contactPerson.role.roleid,
        ifsccode: e.adddetails.bankdetails[0].ifscCode,
        brancName: e.adddetails.bankdetails[0].branchName,
        addressLine: e.addressLine,
        accountNumber: e.adddetails.bankdetails[0].accountNumber,
        cinNumber: e.adddetails.cinNumber,
        city: e.city,
        contactPerson: e.contactPerson.userName,
        country: e.country,
        email: e.contactPerson.email,
        gstNumber: e.adddetails.gstNumber,
        id: e.id,
        industryId: e.industry.industryId,
        industryType: e.industry.industryType,
        isActive: e.isActive,
        logo: e.manufacturerimage.url,
        manufacturerCode: e.manufacturerCode,
        manufacturerName: e.manufacturerName,
        password: e.password,
        phoneNumber: e.contactPerson.phoneNumber,
        state: e.state,
        manufacturerId: e.manufacturerId,
        updatedAt: e.updatedAt,
        userType: e.contactPerson.role.userType,
        userName:
          e.contactPerson.userName.charAt(0).toUpperCase() +
          e.contactPerson.userName.slice(1),
        enable: e.enabled,
      })
    );
  }
  // console.log(manufectureinfo);

  let newImg =
    singleManufacturee.manufectureinfo !== undefined
      ? singleManufacturee.manufectureinfo.manufacturerimage.url
      : "";

  const onFinishFailed = (errorInfo) => {
    console.log(errorInfo);
  };
  const cancelModalForEdit = (visible) => {
    setVisible2(false);
  };
  const { Option } = Select;
  const getSingleManufactureData = (record) => {
    setVisible(true);
    dispatch(getSingleManufacture(record));
  };
  const getSingleManufactureData2 = (record) => {
    let singleData = newArr.find(
      (e) => e.manufacturerCode === record.manufacturerCode
    );
    console.log(singleData);

    if (record.enable === true) {
      form.setFieldsValue({
        email: singleData.email,
        phoneNumber: singleData.phoneNumber,
        adress: singleData.addressLine,
        industryType: singleData.industryType,
        contactPerson: singleData.contactPerson,
      });

      dispatch(getSingleManufacture(record));
      var editPutDetails = {
        email: singleData.email,
        phoneNumber: singleData.phoneNumber,
        adress: singleData.addressLine,
        industryType: singleData.industryType,
        contactPerson: singleData.contactPerson,
      };
      setEditPop({ ...editPutDetails });
      getIndustryType();
      setVisible2(true);
    }
  };
  // console.log(editpop, "editpop");
  const disableRow = async (record) => {
    let res = await axios.put(
      `${APIs.baseURL}/manufacturer-service/v1/manufacturer/status/${record.manufacturerCode}`,{
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userInfo.token}`,
        }
      }
      
    );
    dispatch(getmanufecturelist());
    message.success(res.data);
  };

  const sendInviteLink = async (record) => {
    setVisible3(true);
    let data1 = {
      manufacturerName: record.manufacturerName,
      industry: {
        industryType: record.industryType,
      },
      city: record.city,
      state: {
        stateName: record.state.stateName,
      },
      addressLine: record.addressLine,
      country: {
        countryName: record.country.countryName,
      },
      zipcode: record.zipcode,
      contactPerson: {
        userName: record.contactPerson,
        role: {
          roleid: record.roleid,
        },
        email: record.email,
        phoneNumber: record.phoneNumber,
      },
      adddetails: {
        bankdetails: [
          {
            accountNumber: record.accountNumber,
            ifscCode: record.ifsccode,
            branchName: record.brancName,
          },
        ],
        cinNumber: record.cinNumber,
        gstNumber: record.gstNumber,
      },
    };
    let { data } = await axios.put(
      `${APIs.baseURL}/manufacturer-service/v1/manufacturer/shareActivationLink/${record.manufacturerCode}`,
      data1,{
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userInfo.token}`,
        }
      }
      
    );
    console.log({ data });
    setActivationLink(data);
  };

  const columns = [
    {
      title: "SI No",
      dataIndex: "Index",
      key: "index",
      // render: (text, record, index) => {
      //   setTableTotal((page - 1) * 10 + index + 1);
      //   return (page - 1) * 10 + index + 1;
      // },
      render: (t, r, ind) => {
        return (page - 1) * pagination + ind + 1
      },
      width: "3%",
      fixed: "left",
    },
    {
      title: "Logo",
      dataIndex: "logo",
      key: "logo",
      render: (data) => <img width={30} src={data} alt="Logo" />,
      width: "5%",
    },
    {
      title: "Status",
      width: "8%",
      render: (record) => (
        <>
          <div
            style={{
              background: record.enable ? "#58B510" : "#A39D9D",
              color: "#fff",
              borderRadius: "4px",
              height: "20px",
              textAlign: "center",
              fontSize: "12px",
              width: "86px",
              height: "20px",
            }}
          >
            {record.enable ? "Active" : "In-Active"}
          </div>
        </>
      ),
    },
    {
      title: "MNF Code",
      dataIndex: "manufacturerCode",
      width: "8%",
    },
    {
      title: "Manufacturer Name",
      dataIndex: "manufacturerName",
      render: (data) => <>{data.charAt(0).toUpperCase() + data.slice(1)}</>,
      width: "12%",
    },
    {
      title: "Contact Person",
      dataIndex: "contactPerson",
      width: "10%",
    },
    {
      title: "User Role",
      dataIndex: "userType",
      render: (data) => <>{data.charAt(0).toUpperCase() + data.slice(1)}</>,
      width: "8%",
    },
    {
      title: "Email ID",
      dataIndex: "email",
      width: "12%",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      width: "8%",
    },
    {
      title: "Action",
      fixed: "right",
      width: "6%",

      render: (record) => (
        <Space size="middle">
          <a>
            <Tooltip placement="topLeft" title="Edit" arrowPointAtCenter>
              <svg
                onClick={() => getSingleManufactureData2(record)}
                width="14"
                height="14"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.5903 6.05716C15.7856 6.25242 16.1022 6.25242 16.2974 6.05716L17.0997 5.25486C18.3001 4.05448 18.3001 2.1009 17.0997 0.900048C16.5185 0.31928 15.7459 0 14.9221 0C14.0983 0 13.3252 0.319754 12.7444 0.900522L11.9426 1.70235C11.7473 1.89761 11.7473 2.21419 11.9426 2.40945L15.5903 6.05716ZM10.9379 3.41415C10.7426 3.21891 10.426 3.21892 10.2308 3.41417L2.02485 11.6201C1.84248 11.8025 1.70368 12.0275 1.62315 12.2714L0.0362214 17.0659C-0.0485726 17.3207 0.0182204 17.6016 0.208178 17.7916C0.344133 17.9271 0.52509 17.9995 0.710784 17.9995C0.78563 17.9995 0.86095 17.9877 0.934375 17.9635L5.72737 16.3761C5.97228 16.2956 6.19776 16.1568 6.38014 15.974L14.5856 7.76855C14.7808 7.57328 14.7808 7.25668 14.5855 7.06142L10.9379 3.41415Z"
                  fill="#0A7CA7"
                />
              </svg>
            </Tooltip>
          </a>
          <a onClick={() => disableRow(record)}>
            <Tooltip
              placement="topLeft"
              title={record.enable === true ? "Disable" : "Enable"}
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

          <Popover
            placement="bottomRight"
            content={
              <>
                {" "}
                <div className="table-popUp">
                  <div
                    className="view-row-details"
                    style={{ cursor: "pointer" }}
                    onClick={() => getSingleManufactureData(record)}
                  >
                    <svg
                      width="15"
                      height="14"
                      viewBox="0 0 18 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.2535 6.04309C16.026 6.51125 15.7692 6.96012 15.4853 7.38485C15.5333 7.31245 15.5834 7.23764 15.6314 7.16524C15.1388 7.89887 14.5689 8.5577 13.9322 9.12721C13.9948 9.07171 14.0595 9.01379 14.1221 8.95829C13.4917 9.51818 12.8007 9.98391 12.068 10.3435C12.1432 10.3073 12.2183 10.2711 12.2914 10.2349C11.5524 10.5921 10.7759 10.8382 9.98051 10.9637C10.064 10.9517 10.1475 10.9372 10.231 10.9251C9.41268 11.0506 8.58187 11.0506 7.76148 10.9251C7.84498 10.9372 7.92848 10.9517 8.01198 10.9637C7.21663 10.8382 6.44006 10.5921 5.70109 10.2349C5.77624 10.2711 5.85139 10.3073 5.92445 10.3435C5.19174 9.98634 4.50076 9.52061 3.87035 8.95829C3.93297 9.01379 3.99768 9.07171 4.06031 9.12721C3.4236 8.56008 2.85373 7.89887 2.36105 7.16524C2.40906 7.23764 2.45916 7.31245 2.50717 7.38485C2.22327 6.96012 1.96651 6.51125 1.73896 6.04309V7.1387C1.9665 6.67055 2.22329 6.22168 2.50717 5.79695C2.45916 5.86935 2.40906 5.94416 2.36105 6.01656C2.8537 5.28293 3.4236 4.6241 4.06031 4.05459C3.99769 4.11009 3.93297 4.16801 3.87035 4.22351C4.50079 3.66362 5.19174 3.19789 5.92445 2.83829C5.8493 2.87449 5.77415 2.91069 5.70109 2.94689C6.44006 2.58972 7.21663 2.34357 8.01198 2.21807C7.92848 2.23014 7.84498 2.24462 7.76148 2.25668C8.57981 2.13119 9.41062 2.13119 10.231 2.25668C10.1475 2.24462 10.064 2.23014 9.98051 2.21807C10.7759 2.34356 11.5524 2.58971 12.2914 2.94689C12.2162 2.91069 12.1411 2.87449 12.068 2.83829C12.8007 3.19546 13.4917 3.66119 14.1221 4.22351C14.0595 4.16801 13.9948 4.11009 13.9322 4.05459C14.5668 4.62172 15.1388 5.28293 15.6314 6.01656C15.5834 5.94416 15.5333 5.86935 15.4853 5.79695C15.7692 6.22168 16.026 6.67055 16.2535 7.1387C16.3683 7.3752 16.5917 7.56585 16.8151 7.63823C17.0405 7.71063 17.3391 7.67684 17.5395 7.52964C17.9737 7.20626 18.1344 6.574 17.8756 6.04306C17.5248 5.3239 17.1032 4.64822 16.6356 4.02319C16.168 3.39816 15.6377 2.85279 15.072 2.35083C13.9969 1.39758 12.7319 0.702565 11.4147 0.330964C9.96384 -0.0768751 8.45666 -0.103422 6.99132 0.227193C6.27529 0.388882 5.59266 0.661579 4.92259 0.992194C4.32974 1.28661 3.76609 1.65102 3.23794 2.08056C2.07103 3.03139 1.07943 4.22836 0.327941 5.63286C0.288276 5.70767 0.248615 5.78248 0.211039 5.85729C0.190164 5.89831 0.169287 5.93934 0.150502 5.97795C0.0336005 6.21445 -0.0227641 6.4582 0.00854838 6.73086C0.0440365 7.03976 0.202687 7.31247 0.344641 7.57309C0.534608 7.92542 0.743347 8.25844 0.962569 8.58666C1.3738 9.20203 1.82682 9.77639 2.33825 10.2832C3.42794 11.3691 4.6867 12.192 6.06448 12.6795C7.45058 13.1718 8.9244 13.2901 10.3584 13.0656C11.755 12.8485 13.1077 12.3006 14.3058 11.4391C15.5228 10.5703 16.5541 9.41441 17.3745 8.05819C17.554 7.76136 17.721 7.45487 17.8734 7.13874C17.9945 6.89017 18.0341 6.57884 17.9673 6.30132C17.9068 6.05035 17.7398 5.77523 17.5352 5.65216C17.0948 5.38187 16.5102 5.5146 16.2535 6.0431L16.2535 6.04309Z"
                        fill="#0A7CA7"
                      />
                      <path
                        d="M10.2919 6.59053C10.2919 6.70154 10.2857 6.81254 10.2731 6.92356C10.2836 6.82703 10.2961 6.7305 10.3065 6.63397C10.2794 6.86081 10.2293 7.08041 10.1542 7.29037C10.1855 7.20349 10.2168 7.11662 10.2481 7.03215C10.1729 7.23728 10.0769 7.43033 9.9621 7.60652C10.0101 7.53412 10.0602 7.45931 10.1082 7.38691C9.98506 7.57032 9.8452 7.73442 9.68654 7.87439C9.74917 7.81889 9.81388 7.76097 9.87651 7.70547C9.72203 7.84061 9.55712 7.95162 9.37966 8.03608C9.45482 7.99988 9.52997 7.96369 9.60303 7.92749C9.41933 8.01437 9.23145 8.07228 9.03522 8.10366C9.11872 8.09159 9.20223 8.07711 9.28573 8.06504C9.09368 8.09159 8.89954 8.09159 8.7075 8.06504C8.791 8.07711 8.8745 8.09159 8.958 8.10366C8.76177 8.07228 8.57182 8.01437 8.39019 7.92749C8.46535 7.96369 8.5405 7.99988 8.61356 8.03608C8.43612 7.9492 8.26912 7.8382 8.11671 7.70547C8.17934 7.76097 8.24405 7.81889 8.30668 7.87439C8.14803 7.73201 8.00608 7.57033 7.88499 7.38691C7.93301 7.45931 7.98311 7.53412 8.03112 7.60652C7.91422 7.42794 7.81819 7.23729 7.74513 7.03215C7.77644 7.11903 7.80775 7.2059 7.83907 7.29037C7.76391 7.078 7.71382 6.86081 7.68668 6.63397C7.69711 6.7305 7.70964 6.82703 7.72008 6.92356C7.69711 6.70154 7.69711 6.47712 7.72008 6.25511C7.70964 6.35164 7.69711 6.44817 7.68668 6.5447C7.71381 6.31785 7.76391 6.09826 7.83907 5.88829C7.80775 5.97517 7.77644 6.06205 7.74513 6.14651C7.82028 5.94139 7.91631 5.74833 8.03112 5.57215C7.98311 5.64454 7.93301 5.71935 7.88499 5.79175C8.00816 5.60835 8.14802 5.44424 8.30668 5.30427C8.24406 5.35978 8.17934 5.41769 8.11671 5.4732C8.27119 5.33806 8.43611 5.22705 8.61356 5.14258C8.53841 5.17878 8.46326 5.21498 8.39019 5.25118C8.5739 5.1643 8.76177 5.10638 8.958 5.07501C8.8745 5.08708 8.791 5.10156 8.7075 5.11362C8.89955 5.08708 9.09368 5.08708 9.28573 5.11362C9.20223 5.10156 9.11872 5.08708 9.03522 5.07501C9.23145 5.10638 9.42141 5.1643 9.60303 5.25118C9.52788 5.21498 9.45273 5.17878 9.37966 5.14258C9.5571 5.22946 9.72411 5.34047 9.87651 5.4732C9.81389 5.41769 9.74917 5.35978 9.68654 5.30427C9.84519 5.44665 9.98715 5.60834 10.1082 5.79175C10.0602 5.71936 10.0101 5.64455 9.9621 5.57215C10.079 5.75073 10.175 5.94137 10.2481 6.14651C10.2168 6.05963 10.1855 5.97276 10.1542 5.88829C10.2293 6.10066 10.2794 6.31785 10.3065 6.5447C10.2961 6.44817 10.2836 6.35164 10.2731 6.25511C10.2857 6.36853 10.2919 6.47954 10.2919 6.59055C10.294 6.87049 10.3963 7.16007 10.5675 7.35798C10.7303 7.54621 10.9975 7.68859 11.2313 7.67653C11.4735 7.66446 11.7261 7.57276 11.8952 7.35798C12.0643 7.14561 12.1728 6.88259 12.1707 6.59055C12.1666 5.87621 11.9891 5.12573 11.6259 4.53931C11.4193 4.20387 11.2001 3.93357 10.9203 3.68261C10.6427 3.43405 10.3567 3.26271 10.0269 3.12033C9.73047 2.99243 9.40064 2.93693 9.08542 2.92245C8.7702 2.90796 8.44245 2.95623 8.13978 3.05518C7.84544 3.15171 7.54694 3.29891 7.29015 3.49681C7.03965 3.68745 6.7975 3.91188 6.60542 4.18216C6.48643 4.35108 6.36744 4.52484 6.26933 4.71068C6.17122 4.90132 6.09815 5.10645 6.02509 5.30914C5.9061 5.64699 5.856 6.00658 5.82886 6.37094C5.80173 6.74017 5.84139 7.12628 5.91654 7.48588C5.98752 7.82856 6.11068 8.16642 6.26725 8.46808C6.42381 8.76732 6.62213 9.0593 6.84758 9.29097C7.07302 9.52264 7.32354 9.73741 7.59911 9.87981C7.77446 9.97152 7.9519 10.0608 8.13561 10.1211C8.32558 10.1839 8.5218 10.2104 8.71804 10.237C9.03535 10.2804 9.35891 10.2394 9.67203 10.1694C9.97681 10.1018 10.2774 9.95946 10.5467 9.7857C10.8097 9.61678 11.0561 9.39717 11.2648 9.1462C11.4756 8.89281 11.6677 8.5984 11.8034 8.28469C11.9411 7.96614 12.058 7.62829 12.104 7.27355C12.1353 7.04429 12.1624 6.81744 12.1645 6.58577C12.1666 6.30825 12.058 6.01383 11.889 5.81834C11.7261 5.63011 11.4589 5.48773 11.2251 5.49979C10.7199 5.53117 10.2962 5.98246 10.292 6.59059L10.2919 6.59053Z"
                        fill="#0A7CA7"
                      />
                    </svg>
                    <p>View Details</p>
                  </div>
                  <div
                    className="share-details"
                    style={
                      record.enable !== true
                        ? { cursor: "pointer" }
                        : {
                          pointerEvents: "none",
                          cursor: "not-allowed",
                          opacity: "0.4",
                        }
                    }
                    onClick={
                      record.enabled !== true
                        ? () => sendInviteLink(record)
                        : () => false
                    }
                  >
                    <svg
                      width="17"
                      height="18"
                      viewBox="0 0 17 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="3" cy="8.38379" r="3" fill="#0A7CA7" />
                      <circle cx="13.9189" cy="3" r="3" fill="#0A7CA7" />
                      <circle cx="13.9189" cy="14.2227" r="3" fill="#0A7CA7" />
                      <path
                        d="M4.77734 7.05192L11.6778 3.41211"
                        stroke="#0A7CA7"
                        stroke-width="2"
                      />
                      <path
                        d="M4.32227 8.94775L12.3602 12.9667"
                        stroke="#0A7CA7"
                        stroke-width="2"
                      />
                    </svg>
                    <p>Share Activation link</p>
                  </div>
                </div>
              </>
            }
            trigger="hover"
          >
            <a>
              <svg
                width="16"
                height="4"
                viewBox="0 0 16 4"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginBottom: "5px" }}
              >
                <circle cx="1.84617" cy="1.84617" r="1.84617" fill="#0A7CA7" />
                <circle cx="8.00047" cy="1.84617" r="1.84617" fill="#0A7CA7" />
                <circle cx="14.1538" cy="1.84617" r="1.84617" fill="#0A7CA7" />
              </svg>
            </a>
          </Popover>
        </Space>
      ),
    },
    Table.SELECTION_COLUMN,
  ];

  return (
    <div>
      <Modal
        className="activelink"
        title="Registration Link "
        centered
        visible={visible3}
        footer={null}
        maskClosable={false}
        closeIcon={
          <svg
            style={{ marginRight: "15px", marginTop: "15px" }}
            className="svgCss"
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
        }
        onCancel={() => setVisible3(false)}
        width={800}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              background: "#F2F9FC",
              border: "1px solid #CDE5EF",
              borderRadius: "10px",
              padding: "10px",
              color: "#0185FE",
            }}
          >
            {activationURL !== undefined
              ? activationURL
              : "URL Not Activated, Wait for 24 hours"}
          </div>
          <Button
            onClick={() => {
              setVisible3(false);
              message.success("Mail sent successfully");
            }}
            style={{
              marginTop: "20px",
              background: "#00ADEF",
              color: "#fff",
              borderRadius: "5px",
              fontSize: "16px",
              fontWeight: "600",
              height: "40px",
              width: "100px",
            }}
          >
            SEND
          </Button>
        </div>
      </Modal>
      <Modal
        destroyOnClose
        title="Manufacturers Details "
        centered
        visible={visible}
        className="edit-manufactur-modal"
        onCancel={() => setVisible(false)}
        maskClosable={false}
        width={"70%"}
        okButtonProps={{
          style: {
            display: "none",
          },
        }}
        cancelButtonProps={{
          style: {
            display: "none",
          },
        }}
        footer={null}
        closeIcon={
          <svg
            style={{ marginRight: "15px", marginTop: "15px" }}
            className="svgCss"
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
        }
      >
        <main className="scorll-hidden">
          <div className="table">
            <Row gutter={[32, 32]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12} className="details">
                <div className="manufecture_name">
                  <h3>
                    {singleManufacturee.manufectureinfo !== undefined
                      ? singleManufacturee.manufectureinfo.manufacturerName
                      : ""}
                  </h3>
                </div>
                <div className="manufecture_deail">
                  <Row>
                    <Col xs={24} sm={24} md={24} lg={12} xl={10}>
                      <h4>Manufacturer name :</h4>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={10} xl={14}>
                      <p>
                        {singleManufacturee.manufectureinfo !== undefined
                          ? singleManufacturee.manufectureinfo.manufacturerName
                          : ""}
                      </p>
                    </Col>
                  </Row>
                </div>

                <div className="manufecture_deail">
                  <Row>
                    <Col xs={24} sm={24} md={24} lg={12} xl={10}>
                      <h4>Email ID :</h4>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                      <p>
                        {singleManufacturee.manufectureinfo !== undefined
                          ? singleManufacturee.manufectureinfo.contactPerson
                            .email
                          : ""}
                      </p>
                    </Col>
                  </Row>
                </div>
                <div className="manufecture_deail">
                  <Row>
                    <Col xs={24} sm={24} md={24} lg={12} xl={10}>
                      <h4>Code :</h4>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                      <p>
                        {singleManufacturee.manufectureinfo !== undefined
                          ? singleManufacturee.manufectureinfo.manufacturerCode
                          : ""}
                      </p>
                    </Col>
                  </Row>
                </div>
                <div className="manufecture_deail">
                  <Row>
                    <Col xs={24} sm={24} md={24} lg={12} xl={10}>
                      <h4>Industry :</h4>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                      <p>
                        {singleManufacturee.manufectureinfo !== undefined
                          ? singleManufacturee.manufectureinfo.industry
                            .industryType
                          : ""}
                      </p>
                    </Col>
                  </Row>
                </div>
                <div className="manufecture_deail">
                  <Row>
                    <Col xs={24} sm={24} md={24} lg={12} xl={10}>
                      <h4>GST Number :</h4>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                      <p>
                        {singleManufacturee.manufectureinfo !== undefined
                          ? singleManufacturee.manufectureinfo.adddetails
                            .gstNumber
                          : ""}
                      </p>
                    </Col>
                  </Row>
                </div>
                <div className="manufecture_deail">
                  <Row>
                    <Col xs={24} sm={24} md={24} lg={12} xl={10}>
                      <h4>CIN Number :</h4>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                      <p>
                        {singleManufacturee.manufectureinfo !== undefined
                          ? singleManufacturee.manufectureinfo.adddetails
                            .cinNumber
                          : ""}
                      </p>
                    </Col>
                  </Row>
                </div>
                <div className="manufecture_deail">
                  <Row>
                    <Col xs={24} sm={24} md={24} lg={12} xl={10}>
                      <h4>Bank Account Number:</h4>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                      <p>
                        {singleManufacturee.manufectureinfo !== undefined
                          ? singleManufacturee.manufectureinfo.adddetails
                            .gstNumber
                          : ""}
                      </p>
                    </Col>
                  </Row>
                </div>
              </Col>

              <Col xs={10} sm={18} md={10} lg={12} xl={12} className="details">
                <div className="manufecture_name">
                  <h3>Address</h3>
                </div>
                <div className="manufecture_deail">
                  <Col xs={24} sm={24} md={11} lg={11} xl={12}>
                    <p>
                      {singleManufacturee.manufectureinfo !== undefined
                        ? singleManufacturee.manufectureinfo.addressLine
                        : ""}
                    </p>
                  </Col>
                </div>

                <div className="manufecture_deail">
                  <h5>Contact Person</h5>
                </div>
                <div className="details-field">
                  <div className="manufecture_deail">
                    <Row>
                      <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                        <h4>Person name :</h4>
                      </Col>
                      <Col xs={24} sm={18} md={15} lg={10} xl={10}>
                        <p>
                          {singleManufacturee.manufectureinfo !== undefined
                            ? singleManufacturee.manufectureinfo.contactPerson
                              .userName
                            : ""}
                        </p>
                      </Col>
                    </Row>
                  </div>
                  <div className="manufecture_deail">
                    <Row>
                      <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                        <h4>Phone number :</h4>
                      </Col>
                      <Col xs={10} sm={18} md={15} lg={10} xl={10}>
                        <p>
                          {singleManufacturee.manufectureinfo !== undefined
                            ? singleManufacturee.manufectureinfo.contactPerson
                              .phoneNumber
                            : ""}
                        </p>
                      </Col>
                    </Row>
                  </div>
                  <div className="manufecture_deail">
                    <Row>
                      <Col xs={24} sm={24} md={24} lg={12} xl={10}>
                        <h4 id="man_logo">Manufacture logo:</h4>
                      </Col>
                      <Col
                        xs={10}
                        sm={18}
                        md={15}
                        lg={15}
                        xl={10}
                        className="onboardCol"
                      >
                        <Image
                          id="man_logo"
                          src={newImg}
                          style={{ height: "50px", width: "100%" }}
                        />
                      </Col>
                    </Row>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          <Divider />
          <div className="cancle-button">
            <Button
              className="cancelbtn"
              key="back"
              onClick={() => setVisible(false)}
            >
              CANCEL
            </Button>
          </div>
        </main>
      </Modal>
      <Modal
        title="Edit Manufacturers Details"
        centered
        className="edit-manufactur-modal"
        visible={visible2}
        maskClosable={false}
        closeIcon={
          <svg
            style={{ marginRight: "15px", marginTop: "15px" }}
            className="svgCss"
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
        }
        onCancel={() => setVisible2(false)}
        footer={null}
        width={"80%"}
      >
        <main className="scorll-hidden">
          <div className="formdata">
            <Form
              form={editForm}
              name="basic"
              initialValues={{ remember: true }}
              onFinish={onFinishedit}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Row gutter={[32, 32]}>
                <Col
                  xs={24}
                  sm={24}
                  md={12}
                  lg={12}
                  xl={12}
                  className="details"
                >
                  <div className="manufecture_name">
                    <h3>
                      {singleManufacturee.manufectureinfo !== undefined
                        ? singleManufacturee.manufectureinfo.manufacturerName
                        : ""}
                    </h3>
                  </div>
                  <div className="manufecture_deail">
                    <Row>
                      <Col xs={24} sm={24} md={24} lg={12} xl={10}>
                        <h4>Manufacturer name :</h4>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={10} xl={14}>
                        <p>
                          {singleManufacturee.manufectureinfo !== undefined
                            ? singleManufacturee.manufectureinfo
                              .manufacturerName
                            : ""}
                        </p>
                      </Col>
                    </Row>
                  </div>
                  <div className="manufecture_deail">
                    <Row>
                      <Col xs={24} sm={24} md={24} lg={12} xl={10}>
                        <h4>Email ID :</h4>
                      </Col>
                      <Col
                        xs={24}
                        sm={24}
                        md={12}
                        lg={10}
                        xl={10}
                      // className="onboardCol"
                      >
                        <Form.Item
                          name="email"
                          initialValue={visible2 && editpop.email}
                          rules={[
                            {
                              type: "email",
                              message: "The input is not valid",
                            },
                            {
                              required: "true",
                              message: "Enter e-mail",
                            },
                          ]}
                        >
                          <Input
                            type="email"
                            className="inptu-border"
                            name="email"
                            title={
                              singleManufacturee.manufectureinfo !== undefined
                                ? singleManufacturee.manufectureinfo
                                  .contactPerson.email
                                : ""
                            }
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                  <div className="manufecture_deail">
                    <Row>
                      <Col xs={24} sm={24} md={24} lg={12} xl={10}>
                        <h4>Code :</h4>
                      </Col>

                      <Col
                        xs={10}
                        sm={18}
                        md={15}
                        lg={10}
                        xl={10}
                      // className="onboardCol"
                      >
                        <p>
                          {singleManufacturee.manufectureinfo !== undefined
                            ? singleManufacturee.manufectureinfo
                              .manufacturerCode
                            : ""}
                        </p>
                      </Col>
                    </Row>
                  </div>
                  <div className="manufecture_deail">
                    <Row>
                      <Col xs={24} sm={24} md={24} lg={12} xl={10}>
                        <h4>Industry : </h4>
                      </Col>
                      <Col xs={10} sm={18} md={15} lg={10} xl={10}>
                        <Form.Item
                          className="inptu-border"
                          name="industryType"
                          hasFeedback
                          initialValue={visible2 && editpop.industryType}
                          rules={[
                            {
                              message: "Please select Industry type!",
                            },
                          ]}
                        >
                          <Select
                            className="select-border"
                            suffixIcon={<img src={downArrow} alt="downArrow" />}
                            placeholder={
                              singleManufacturee.manufectureinfo !== undefined
                                ? singleManufacturee.manufectureinfo.industry
                                  .industryType
                                : ""
                            }
                          >
                            {industryType.map((e) => {
                              return (
                                <Option value={e.option}>{e.option}</Option>
                              );
                            })}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                  <div className="manufecture_deail">
                    <Row>
                      <Col xs={24} sm={24} md={24} lg={12} xl={10}>
                        <h4>GST Number :</h4>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                        <p>
                          {singleManufacturee.manufectureinfo !== undefined
                            ? singleManufacturee.manufectureinfo.adddetails
                              .gstNumber
                            : ""}
                        </p>
                      </Col>
                    </Row>
                  </div>
                  <div className="manufecture_deail">
                    <Row>
                      <Col xs={24} sm={24} md={24} lg={12} xl={10}>
                        <h4>CIN Number :</h4>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                        <p>
                          {singleManufacturee.manufectureinfo !== undefined
                            ? singleManufacturee.manufectureinfo.adddetails
                              .cinNumber
                            : ""}
                        </p>
                      </Col>
                    </Row>
                  </div>
                  <div className="manufecture_deail">
                    <Row>
                      <Col xs={24} sm={24} md={24} lg={12} xl={10}>
                        <h4>Bank account number :</h4>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                        <p>
                          {singleManufacturee.manufectureinfo !== undefined
                            ? singleManufacturee.manufectureinfo.adddetails
                              .bankdetails[0].accountNumber
                            : ""}
                        </p>
                      </Col>
                    </Row>
                  </div>
                </Col>

                <Col
                  xs={10}
                  sm={18}
                  md={10}
                  lg={12}
                  xl={12}
                  className="details"
                >
                  <div className="manufecture_name">
                    <h3>Address</h3>
                  </div>
                  <Row>
                    <Col xs={24} sm={24} md={24} lg={23} xl={23}>
                      <Form.Item
                        name="adress"
                        initialValue={visible2 && editpop.adress}
                        rules={[
                          { whitespace: true },
                          {
                            min: 2,
                            message: "Address must be atleast 2 characters",
                          },
                          {
                            max: 50,
                            message:
                              "Address cannot be longer than 50 characters",
                          },
                        ]}
                      >
                        <TextArea
                          className="textarea-border"
                          type="address"
                          name="adress"
                          onChange={onHandleChangeAdress}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <div className="manufecture_deails">
                    <Row>
                      <Col xs={24} sm={24} md={24} lg={12} xl={10}>
                        <h5>Contact Person</h5>
                      </Col>
                    </Row>
                  </div>

                  <div className="manufecture_deail">
                    <Row>
                      <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                        <h4>Person name :</h4>
                      </Col>

                      <Col
                        xs={24}
                        sm={18}
                        md={15}
                        lg={10}
                        xl={10}
                      // className="onboardCol"
                      >
                        <Form.Item
                          name="contactPerson"
                          initialValue={visible2 && editpop.contactPerson}
                          onKeyPress={(event) => {
                            if (checkAlphabets(event)) {
                              event.preventDefault();
                            }
                          }}
                          rules={[
                            {
                              min: 2,
                              message:
                                "Person name must be atleast 2 characters",
                            },
                            {
                              max: 30,
                              message:
                                "Person name cannot be longer than 30 characters",
                            },
                            {
                              required: "true",
                              message: "Enter your name",
                            },
                          ]}
                        >
                          <Input
                            className="inptu-border"
                            // type="person"
                            name="person"
                            placeholder={
                              singleManufacturee.manufectureinfo !== undefined
                                ? singleManufacturee.manufectureinfo
                                  .contactPerson.userName
                                : ""
                            }
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                  <div className="manufecture_deail">
                    <Row>
                      <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                        <h4>Phone number :</h4>
                      </Col>
                      <Col
                        xs={10}
                        sm={18}
                        md={15}
                        lg={10}
                        xl={10}
                      // className="onboardCol"
                      >
                        <Form.Item
                          name="phoneNumber"
                          initialValue={visible2 && editpop?.phoneNumber}
                          onKeyPress={(event) => {
                            if (checkNumbervalue(event)) {
                              event.preventDefault();
                            }
                          }}
                          rules={[
                            {
                              required: true,
                              message: "Enter your phone number!",
                            },
                            {
                              min: 10,
                              max: 10,
                              message: "Please enter 10 digits",
                            },
                          ]}
                        >
                          <Input
                            max={10}
                            className="inptu-border"
                            placeholder={visible2 && editpop?.phoneNumber}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                  <div className="manufecture_deail">
                    <Row>
                      <Col xs={24} sm={24} md={24} lg={12} xl={10}>
                        <h4 id="man_logo">Manufacture logo</h4>
                      </Col>
                      <Col
                        xs={10}
                        sm={18}
                        md={15}
                        lg={15}
                        xl={10}
                        className="onboardCol"
                      >
                        <Image
                          id="man_logo"
                          src={newImg}
                          style={{ height: "50px", width: "100%" }}
                        />
                      </Col>
                    </Row>
                  </div>
                  <div className="avatar-style"></div>
                </Col>
              </Row>
              <Divider />
              <div className="save-edit">
                {/* <Form.Item className="cancle-button"> */}
                <Button
                  className="cancelbtn"
                  key="back"
                  onClick={cancelModalForEdit}
                >
                  CANCEL
                </Button>

                <Button htmlType="submit" className="save-btn">
                  SAVE
                </Button>
                {/* </Form.Item> */}
              </div>
            </Form>
          </div>
        </main>
      </Modal>

      <div className="view-manufacturer-top">
        <Row>
          <Col xs={24} sm={12} md={4} lg={4} xl={4}>
            <h4 id="manufacturer-text">View Manufacturers</h4>
          </Col>
          <Col
            xs={24}
            sm={12}
            md={4}
            lg={4}
            xl={4}
            className="search-view-manufacturer"
          >
            <div className="pagination-category">
              <Form form={form}>
                <Form.Item label="Show " onChange={onhandlePagination}>
                  <div className="pagination-input">
                    <Select
                      placeholder={pagination}
                      onChange={onhandlePagination}
                    >
                      <Option value={5}>5</Option>
                      <Option value={10}>10</Option>
                      <Option value={15}>15</Option>
                      <Option value={20}>20</Option>
                    </Select>
                  </div>
                </Form.Item>
              </Form>
            </div>
          </Col>
          <Col
            xs={24}
            sm={12}
            md={10}
            lg={10}
            xl={10}
            className="search-view-manufacturer"
          >
            <Input
              placeholder="Search"
              bordered
              value={value}
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
              prefix={
                <SearchOutlined
                  style={{ color: "#CCCCCC", height: "13.12", width: "20px" }}
                />
              }
              style={{
                margin: "0 2%",
                borderRadius: "5px",
                color: "#B9BFD7",
                height: "35px",
                FontSize: "14px",
              }}
            />
          </Col>

          <Col xs={24} sm={12} md={6} lg={6} xl={6}>
            <div className="add-man-btn">
              <Button
                type="primary"
                onClick={()=>callback("1")}
                icon={<PlusCircleOutlined style={{ marginTop: "5px" }} />}
              >
                Add Manufacture
              </Button>
            </div>
          </Col>
        </Row>
      </div>
      <Divider className="view-table-divider" />
      <div className="table-view-cat">
        <Table
          scroll={{ x: 1500, xs: 500 }}
          columns={columns}
          className="verticalScroll"
          dataSource={
            value.length === 0 ? newArr : filterTable
          }
          pageLength
          rowClassName={(record) =>
            record.enable === false ? "disabled-row" : ""
          }
          rowKey="manufacturerCode"
          loading={tableLoading}
          pagination={{
            onChange(current) {
              setPage(current);
            },
            pageSize: pagination
          }}
        />
        <div className="below-table-paginatio">
          Showing {" "}{page * pagination - pagination + 1} to{" "}
          {/* {page * 10 < newArr.length
            ? page * 10
            : newArr.length}{" "} */}
          {page * pagination} {" "}
          of {newArr.length} entries
        </div>
      </div>
    </div>
  );
}

export default ViewManufacturer;
