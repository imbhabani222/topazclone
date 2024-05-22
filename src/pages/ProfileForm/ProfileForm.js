import React, { useState, useEffect, useRef } from "react";
import ImgCrop from 'antd-img-crop';
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Select,
  Divider,
  message,
  Modal,
  Upload,
  Avatar,
  Image,
} from "antd";
// import changePassword from "./changePassword";
import { PlusCircleOutlined, UserOutlined, CloseSquareOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import "./ProfileForm.css";
import axios from "axios";
import { APIs } from "../../worker";
import ImageCapturing from "../ImageCapturing/ImageCapturing";
import { useDispatch, useSelector } from "react-redux";
// import ProfileModal from "./ProfileModal.js";
import { profileData } from "../../action/useraction";
import { useTimer } from "react-timer-hook";
import { checkNumbervalue } from "../onboard_manufactures/index";
import OtpInput from 'react-otp-input';
import AddressForm from "./AddressForm";

function MyTimer1({ expiryTimestamp, TimerFuction1, childFunc }) {
  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp,
    onExpire: () => TimerFuction1(),
  });

  useEffect(() => {
    childFunc.current = callThis;
  }, []);

  const callThis = () => {
    resume();
  };

  return (
    <div>
      <div>
        <span>{minutes}</span>:<span>{seconds}</span>
      </div>
    </div>
  );
}

function MyTimer2({ expiryTimestamp, TimerFuction2, childFunc }) {
  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp,
    onExpire: () => TimerFuction2(),
  });

  useEffect(() => {
    childFunc.current = callThis;
  }, []);

  const callThis = () => {
    resume();
  };

  return (
    <div>
      <div>
        <span>{minutes}</span>:<span>{seconds}</span>
      </div>
    </div>
  );
}

function MyTimer1ForEmail({
  expiryTimestamp,
  timerFunction1ForEmail,
  childFunc,
}) {
  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp,
    onExpire: () => timerFunction1ForEmail(),
  });

  useEffect(() => {
    childFunc.current = callThis;
  }, []);

  const callThis = () => {
    resume();
  };

  return (
    <div>
      <div>
        <span>{minutes}</span>:<span>{seconds}</span>
      </div>
    </div>
  );
}

function MyTimer2ForEmail({
  expiryTimestamp,
  timerFunction2ForEmail,
  childFunc,
}) {
  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp,
    onExpire: () => timerFunction2ForEmail(),
  });

  useEffect(() => {
    childFunc.current = callThis;
  }, []);

  const callThis = () => {
    resume();
  };

  return (
    <div>
      <div>
        <span>{minutes}</span>:<span>{seconds}</span>
      </div>
    </div>
  );
}

const ProfileForm = () => {
  const childFunc = useRef(null);
  const delyTimer1 = new Date();
  const newTimer1 = delyTimer1.setSeconds(delyTimer1.getSeconds() + 120);
  const delyTimer2 = new Date();
  const newTimer2 = delyTimer2.setSeconds(delyTimer2.getSeconds() + 120);
  const delyTimer1ForEmail = new Date();
  const newTimer1Email = delyTimer1ForEmail.setSeconds(
    delyTimer1ForEmail.getSeconds() + 120
  );
  const delyTimer2ForEmail = new Date();

  const newTimer2Email = delyTimer2ForEmail.setSeconds(
    delyTimer2ForEmail.getSeconds() + 120
  );

  const time = new Date();
  time.setSeconds(time.getSeconds() + 120000);
  const [timeupdate, settimeupdate] = useState(time);
  // const [timeupdate, setNewtimeupdate] = useState(time)

  const { Option } = Select;
  const [resendBtn1, setResendBtn1] = useState(false);
  const [resendBtn2, setResendBtn2] = useState(false);
  const [resendBtn1forEmail, setResendBtn1forEmail] = useState(false);
  const [resendBtn2forEmail, setResendBtn2forEmail] = useState(false);
  console.log(resendBtn1);
  const [form] = Form.useForm();
  const [addDetails, setAddDetails] = useState([]);
  const [list, setList] = useState([]);
  const [visiable, setVisiable] = useState(false);
  const [emailOTP, setEmailOTP] = useState();
  const [minute, setMinutes] = useState();
  const [second, setSecond] = useState();
  const [showResendbtn, setShowResend] = useState(true);
  const [states, setStates] = useState([]);
  const [country, setCountry] = useState([]);
  let dispatch = useDispatch();

  const [numOtp, SetNumOtp] = useState('');
  const [emOtp, SetemOtp] = useState('');
  const [newEmOtp, SetNewEmOtp] = useState('');
  const [newNumOtp, SetNewNumOtp] = useState('');
  const [edit, setEdit] = useState(false)

  const [fileList, setFileList] = useState([]);
  const [previewOffer, setPreviewOffer] = useState({ image: "" });
  const [showPreview, setShowPreview] = useState(false)
  const profileDatas = useSelector((state) => state.profileInfo);
  const userloginn = useSelector((state) => state.userlogin);

  // setImage2(profileDatas.profileReducerResponse.profileImage.url)
  const img = profileDatas?.profileReducerResponse?.profileImage?.url
  // const [image2, setImage2] = useState();
  useEffect(() => {
    // if (img) setImage2(img)
    if (img) {
      setFileList(
        [{ url: img }]
      )
    }
  }, [img])
  // console.log("img----------------", img, "-------------", image2)

  if (profileDatas.profileReducerResponse !== undefined) {
    console.log("data");
  }
  const [image, setImage] = useState(
    // profileDatas.profileReducerResponse !== undefined
    //   ? profileDatas.profileReducerResponse.manufacturerimage.imagebyte
    //   : ""
  );

  const TimerFuction1 = () => {
    setResendBtn1(true);
  };

  const TimerFuction2 = () => {
    setResendBtn2(true);
  };
  const timerFunction1ForEmail = () => {
    setResendBtn1forEmail(true);
  };
  const timerFunction2ForEmail = () => {
    setResendBtn2forEmail(true);
  };

  const [active, setActive] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [popUpValue, setPopUpValue] = useState({ defaultValue: true, value: "" });
  const [saveChange, setSaveChange] = useState("");
  const [newChanges, setNewChanges] = useState("");
  const [stateChange, setStateChange] = useState(false);
  const [deleteProfile, setDeleteProfile] = useState(false)

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }

    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isLt2M) {
      setprofileImg(null);
      setImage(null);

      imageHandler();
      message.error("Image must smaller than 2MB!");
    }
    // else {
    //   imageHandler();
    // }

    return isJpgOrPng && isLt2M;
  };

  console.log("profile--------", profileDatas)
  // setImage2(profileDatas?.profileReducerResponse?.profileImage?.url)


  const userInfo = JSON.parse(localStorage.getItem("userinfo"));
  const onFinish = async (value) => {
    console.log("valuessss===----",value)
    setEdit(false)
    console.log(deleteProfile)
    if (deleteProfile) {
      deleteProfileHandler()
      setDeleteProfile(false)
    } else if (fileList[0].url!==img) {
      // console.log(fileList[0].url!==img)
      const imageOffer = new FormData();
      imageOffer.append("file", fileList[0]?.originFileObj);
      const profileImgResponse = await axios.put(
        `${APIs.baseURL}/manufacturer-service/v1/manufacturer/profile-image/${userInfo?.manufacturerCode}`,
        imageOffer,{
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userInfo.token}`,
          }
        }        
      )
    }
    // setFileList([])
    console.log(value, "val--------------")
    let data = {
      contactPerson: {
        userName: value.first_name,
        email: value.emailaddress,
        phoneNumber: value.phonenumber,
      },
      addressLine: value.addressline1,
      country: {
        countryName: value.country,
      },
      state: {
        stateName: value.state,
      },

      city: value.city,
      zipcode: value.zipcode,
    };
    let response = await axios.put(
      `${APIs.baseURL}/user-service/v1/user-profile/${profileDatas.profileReducerResponse.contactPerson.manufacturerCode}`,
      data,{
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userInfo.token}`,
        }
      }      
    );
    dispatch(profileData(profileDatas.profileReducerResponse.contactPerson.manufacturerCode));
    message.success("Profile data updated succesfully");
    initialize();
    // console.log(response)
  };

  const onFinishFailed = (errorInfo) => { };

  useEffect(
    () => {
      console.log("enterd");
      initialize();
      getState();
      getCountry();
      form.resetFields();
    },
    [isModalVisible, userloginn?.userinfo.token, stateChange],
    profileDatas.loading
  );

  const getState = async () => {
    let res = await axios.get(`${APIs.baseURL}/manufacturer-service/v1/manufacturer/states`,{
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userInfo.token}`,
      }
    }
    );
    let temp = [];
    res.data.map((e) => {
      temp.push({
        option: e.stateName,
        value: e.stateId,
      });
    });
    setStates(temp);
  };

  const getCountry = async () => {
    let res = await axios.get(`${APIs.baseURL}/manufacturer-service/v1/manufacturer/countries`,{
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userInfo.token}`,
      }
    }
    );
    let temp = [];
    res.data.map((e) => {
      temp.push({
        option: e.countryName,
        value: e.countryName,
      });
    });
    setCountry(temp);
  };

  const initialize = async () => {
    await dispatch(profileData(userloginn.userinfo.manufacturerCode));
    form.resetFields();
  };

  const initialValue =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
  const [profileImg, setprofileImg] = useState(initialValue);

  const imageHandler = (e) => {
    const file = e.target.files[0];
    const isLt2M = e.target.files[0].size / 1024 / 1024 < 2;
    if (e.target.files && e.target.files[0] && isLt2M) {
      setprofileImg(URL.createObjectURL(e.target.files[0]));
    } else {
      message.error("Image size is more than 800kb ");
    }

    // const base64 = convertBase64(file);
  };

  // const convertBase64 = (file) => {
  //   return new Promise((resolve, reject) => {
  //     const fileReader = new FileReader();
  //     fileReader.readAsDataURL(file);
  //     fileReader.onload = () => {
  //       resolve(fileReader.result);
  //     };

  //     fileReader.onerror = (error) => {
  //       reject(error);
  //     };
  //   });
  // };
  const profileImageShow = () => {
    setVisiable(true);
  };
  const addAddress = () => {
    let length = addDetails.length + 2;
    let temp = [
      ...addDetails,
      {
        labelKey: length,
        labelAddress: "Address Line " + length,
        labelCountry: "Country",
        labelState: "State",
        labelCity: "City",
        labelZipCode: "Zip Code",
      },
    ];
    setAddDetails(temp);
  };
  const remove = (e) => {
    let deleteItem = addDetails.filter(
      (detail) => detail.labelKey !== e.labelKey
    );
    setAddDetails(deleteItem);
  };

  const onClose = (e) => { };

  const resendOTP = () => {
    childFunc.current();
  };
  const resendOTP2 = () => {
    childFunc.current();
  };

  const ChangedOTPPhone = async () => {
    if (active == "ChangedOTPPhone") {
      setResendBtn1(false)
      resendOTP();
      const ChangeNumberData = new FormData();
      ChangeNumberData.append("phoneNumber", popUpValue.defaultValue ? profileDatas.profileReducerResponse.contactPerson.phoneNumber : popUpValue.value);
      let response = axios
        .post(
          `${APIs.baseURL}/user-service/v1/user/otp/phoneNumber/${profileDatas.profileReducerResponse.contactPerson.manufacturerCode}`,
          ChangeNumberData,{
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${userInfo.token}`,
            }
          }          
        )
        .then((res) => {
          // start();
          setShowResend(true);
          setTimeout(() => {
            // showResendd();
          }, 120000);
        })
        .catch((error) => {
          message.error(error.response.data.message);
        });
    } else {
      const ChangeNumberData = new FormData();
      resendOTP2();
      ChangeNumberData.append("phoneNumber", popUpValue.value);
      let response = axios
        .post(
          `${APIs.baseURL}/user-service/v1/otp/new-phoneNumber/${profileDatas.profileReducerResponse.contactPerson.manufacturerCode}`,
          ChangeNumberData,{
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${userInfo.token}`,
            }
          }
          
        )
        .then((res) => {
          setShowResend(true);
          setTimeout(() => {
            // showResendd();
          }, 120000);
        })
        .catch((error) => {
          message.success(error.response.data.message);
        });
    }
  };
  const handlereset = () => {
    const time2 = new Date();
    time2.setisSeconds(time2.getisSeconds() + 180);

    settimeupdate(time2);
    // setNewtimeupdate(time2)
  };

  const resendOtp1ForEmail = () => {
    childFunc.current();
  };
  const resendOtp2ForEmail = () => {
    childFunc.current();
  };

  const ChangedOTPEmail = async () => {
    if (active == "ChangeOTPemail") {
      resendOtp1ForEmail();
      setResendBtn1forEmail(false)
      let data = {
        email: popUpValue.defaultValue ? profileDatas.profileReducerResponse.contactPerson.email : popUpValue.value,
      };
      let response = axios
        .put(
          `${APIs.baseURL}/user-service/v1/user/otp/${profileDatas.profileReducerResponse.contactPerson.userid}`,
          data,{
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${userInfo.token}`,
            }
          }
          
        )
        .then((res) => {
          setShowResend(true);
          setTimeout(() => {
            // showResendd();
          }, 120000);
        })
        .catch((error) => {
          message.error(error.response.data.message);
        });
    } else {
      resendOtp2ForEmail()
      setResendBtn2forEmail(false)
      const ChangeEmailData = new FormData();
      ChangeEmailData.append("email", popUpValue.value);
      let response = axios
        .put(`${APIs.baseURL}/user-service/v1/user/email/${emailOTP}`, ChangeEmailData,{
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userInfo.token}`,
          }
        }
        )
        .then((res) => {
          setShowResend(true);
          setTimeout(() => {
            // showResendd();
          }, 120000);
        })
        .catch((error) => {
          message.success(error.response.data.message);
        });

    }
  };

  const handleOk = async (e) => {
    if (active == "ChangeEmail") {
      let data = {
        email: popUpValue.defaultValue ? profileDatas.profileReducerResponse.contactPerson.email : popUpValue.value,
      };
      let response = axios
        .put(
          `${APIs.baseURL}/send/user/otp/${profileDatas.profileReducerResponse.contactPerson.userid}`,
          data
        )
        .then((res) => {
          setActive("ChangeOTPemail");
          setTimeout(() => {
            // showResendd();
          }, 120000);
        })
        .catch((error) => {
          message.error(error.response.data.message);
        });
    } else if (active == "ChangeOTPemail") {
      // console.log("em-------",emOtp)
      const ChangeEmailData = new FormData();
      ChangeEmailData.append("emailOtp", emOtp);
      setEmailOTP(emOtp);
      // console.log(otp)
      let response = axios
        .put(`${APIs.baseURL}/user-service/v1/verify-user/otp`, ChangeEmailData,{
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userInfo.token}`,
          }
        }
        )
        .then((res) => {
          message.success(res.data);
          setActive("NewEmail");
          setShowResend(true);
          SetemOtp("")
        })
        .catch((error) => {
          message.error("Wrong OTP!!!");
          SetemOtp("")
        });
      console.log(response)
    } else if (active == "NewEmail") {
      const ChangeEmailData = new FormData();
      ChangeEmailData.append("email", popUpValue.value);
      let response = axios
        .put(`${APIs.baseURL}/user-service/v1/user/email/${emailOTP}`, ChangeEmailData,{
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userInfo.token}`,
          }
        }
        )
        .then((res) => {
          setActive("ChangedOTPemail");
          // handlereset();
          setTimeout(() => {
            // showResendd();
          }, 120000);
          message.success(res.data);
        })
        .catch((error) => { });
    } else if (active == "ChangedOTPemail") {
      // handlereset();
      const newEmailOTP = new FormData();
      newEmailOTP.append("emailOtp", newEmOtp);
      let response = axios
        .put(`${APIs.baseURL}/verify/user/update/otp`, newEmailOTP)
        .then((res) => {
          setIsModalVisible(false);
          setStateChange(!stateChange);
          setShowResend(true);
          message.success(res.data);
          SetNewEmOtp("")
        })
        .catch((error) => {
          message.error("Wrong OTP!!!");
          SetNewEmOtp("")
        });
    } else if (active == "ChangeNumber") {
      if (!popUpValue.defaultValue) {
        if (profileDatas.profileReducerResponse.contactPerson
          .phoneNumber !== parseInt(popUpValue.value)) {
          return message.error("Enter Registered Mobile Number")
        }
      }
      const ChangeNumberData = new FormData();
      ChangeNumberData.append("phoneNumber", popUpValue.defaultValue ? profileDatas.profileReducerResponse.contactPerson.phoneNumber : popUpValue.value);
      let response = axios
        .post(
          `${APIs.baseURL}/user-service/v1/user/otp/phoneNumber/${profileDatas.profileReducerResponse.contactPerson.manufacturerCode}`,
          ChangeNumberData,{
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${userInfo.token}`,
            }
          }
          
        )
        .then((res) => {
          // start();
          setActive("ChangedOTPPhone");
          setTimeout(() => {
            // showResendd();
          }, 120000);
        })
        .catch((error) => {
          message.error(error.response.data.message);
        });
    } else if (active == "ChangedOTPPhone") {
      // console.log("ressssss",numOtp)
      const ChangeNumberData = new FormData();
      ChangeNumberData.append("phoneotp", numOtp);
      let response = axios
        .post(
          `${APIs.baseURL}/user-service/v1/user/old-phoneNumber/${profileDatas.profileReducerResponse.contactPerson.manufacturerCode}`,
          ChangeNumberData,{
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${userInfo.token}`,
            }
          }          
        )
        .then((res) => {
          initialize();
          message.success(res.data);
          setShowResend(true);
          setActive("newNumber");
          SetNumOtp("")
        })
        .catch((error) => {
          message.error("Wrong OTP!!!");
          SetNumOtp("")
        });
    } else if (active == "newNumber") {
      const ChangeNumberData = new FormData();
      ChangeNumberData.append("phoneNumber", popUpValue.value);
      let response = axios
        .post(
          `${APIs.baseURL}/user-service/v1/otp/new-phoneNumber/${profileDatas.profileReducerResponse.contactPerson.manufacturerCode}`,
          ChangeNumberData,{
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${userInfo.token}`,
            }
          }
          
        )
        .then((res) => {
          initialize();
          message.success(res.data);
          setTimeout(() => {
            // showResendd();
          }, 120000);
          setActive("ChangedOTPPhonenew");
        })
        .catch((error) => { });
    } else if (active == "ChangedOTPPhonenew") {
      setResendBtn2(false)
      const ChangeNumberData = new FormData();
      ChangeNumberData.append("phoneotp", newNumOtp);

      let response = axios
        .post(
          `${APIs.baseURL}/user-service/v1/user-new-phoneNumber/${profileDatas.profileReducerResponse.contactPerson.manufacturerCode}`,
          ChangeNumberData,{
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${userInfo.token}`,
            }
          }
          
        )
        .then((res) => {
          message.success(res.data);
          setShowResend(true);
          setStateChange(!stateChange);
          setIsModalVisible(false);
          SetNewNumOtp("")
        })
        .catch((error) => {
          message.error("Wrong OTP!!!");
          SetNewNumOtp("")
        });
    }
    setPopUpValue({ defaultValue: true })
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleValue = (e) => {
    const updatedPopUpValue = { defaultValue: false, value: e.target.value }
    setPopUpValue(updatedPopUpValue);
  };

  // const onhandleOTP = (e) => {
  //   setOTP(e.target.value);
  // };

  const Change = (e) => {
    setActive("ChangeEmail");
    setIsModalVisible(true);
  };

  const ChangePhone = (e) => {
    setActive("ChangeNumber");
    setIsModalVisible(true);
  };
  const newPasswordhandler = (e) => {
    e.preventDefault();
    setNewChanges(e.target.value);
  };

  const onhandlePasswordChange = (e) => {
    e.preventDefault();
    setSaveChange(e.target.value);
  };

  const onChangePassword = () => {

    let data = {
      password: saveChange,
    };
    let response = axios
    .put(
      `${APIs.baseURL}/user-service/v1/password/${profileDatas.profileReducerResponse.contactPerson.userid}`,
      data
      )
      .then((res) => {
        form.resetFields()
        message.success("password changed successfully");
      })
      .catch((error) => {
        message.success(error.response.data.message);
      });
  };

  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  const handleChangeimg = async ({ fileList, file }) => {
    console.log("changed---------------------", file.size)
    setPreviewOffer({ ...previewOffer });
    if (file.size < 800000) {
      if (!file.url && !file.preview) {
        // const imageData = await getBase64(file.originFileObj);
        // setImage2(imageData);
        setFileList(fileList);
      }
    } else if (file.size > 800000) message.error("Image with a file size larger than 800KB")
  };
  // const handlePreviewimg = async (file) => {
  //   console.log("preview......")
  //   if (!file.url && !file.preview) {
  //     file.preview = await getBase64(file.originFileObj);
  //   }
  //   const obj = {
  //     previewOpen: true,
  //     previewImage: file.url || file.preview,
  //     previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
  //     fileList:fileList
  //   }
  //   setImage(obj)
  // };
  const onGalleryFileRemove = (file, index) => {
    const { confirm } = Modal;
    return new Promise((resolve, reject) => {
      confirm({
        title: "Are you sure you want to Delete ?",
        onOk: () => {
          resolve(true);
          // setImage2(null);
          setFileList([])
          setPreviewOffer("");
          setDeleteProfile(true)
        },
        onCancel: () => {
          reject(true);
        },
      });
    });
  };
  const handlePreviewImage = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewOffer(file.url || file.preview);
    setShowPreview(true);
  };
  const normFile = ({ fileList }) => {
    setFileList(fileList);
  };
  // const [showProfileDelete, setShowprofileDelete] = useState(false)

  const deleteProfileHandler = async () => {
    const profileImgResponse = await axios.delete(
      `${APIs.baseURL}/manufacturer-service/v1/manufacturer/profile-image/${userInfo?.manufacturerCode}`,{
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userInfo.token}`,
        }
      }).then(() => {
        // setImage2(null);
        setFileList([])
        setPreviewOffer("");
      })
  }
  const [addAddressForm, setAddAddressFrom] = useState(false)
  const addressRef = useRef(null)

  return (
    <React.Fragment>
      <ImageCapturing
        visiable={true}
        setImage={setImage}
        image={image}
        setVisiable={() => setVisiable(false)}
      />
      <div className="profile_ifo">
        <div className="profile_title">
          <div className="profile_title_container">
            <h3 id="para">Profile Information</h3>
            <span
              className={edit ? "profileEdit_active" : "profileEdit"}
              onClick={() => setEdit(!edit)}
            >
              Edit <EditOutlined style={edit ? { color: '#00adef' } : { color: "#859094" }} />
            </span>
          </div>
          <Divider className="profile-header-divider" />
        </div>
        <div className="profileForm">
          {profileDatas.profileReducerResponse !== undefined && (
            <Form
              form={form}
              name="basic"
              layout="vertical"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              wrapperCol={{
                span: 17,
              }}
            >
              <Row>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <Row>
                    <Col xs={24} sm={3} md={3} lg={6} xl={6}></Col>
                    <Col xs={24} sm={18} md={18} lg={12} xl={12}>
                      <Row>
                        {/* <Col
                          xs={24}
                          sm={24}
                          md={11}
                          lg={11}
                          xl={11}
                          className="profileCol"
                          style={{
                            display: "flex",
                            marginBottom: "24px",
                            top: "0%",
                          }}
                        >
                          <div style={{ display: "flex" }}>
                            <div className="img-holder">
                              <img
                                src={profileImg}
                                onClick={() => profileImageShow()}
                                alt=""
                                id="img"
                                className="img"
                              />
                            </div>
                            <div className="profile_div">
                              <p className="username_profile">
                                {
                                  profileDatas.profileReducerResponse
                                    .contactPerson.userName
                                }
                              </p>
                                <label className="image-upload" htmlFor="input">
                                  Change Profile Picture
                                </label>
                              <input
                                type="file"
                                accept=".jpg, .jpeg, .png"
                                name="image-upload"
                                id="input"
                                // beforeUpload={beforeUpload}
                                onChange={imageHandler}

                              />
                            </div>
                          </div>
                        </Col> */}
                        <Col
                          span={20}
                          className="profileCol"
                        >
                          <div className="upld">

                            {!fileList[0] && <Col
                              span={1}
                            ><Avatar shape="square" className="profile_image_data" size={64} icon={<UserOutlined />} /> </Col>}
                            {/* {image2 && <Col
                              span={1}
                              onMouseEnter={() => setShowprofileDelete(true)} onMouseLeave={() => setShowprofileDelete(false)}
                            >{showProfileDelete && <span onClick={deleteProfileHandler2} className="delete_profile_image"><DeleteOutlined /></span>}{!fileList[0] && <Image className="profile_image_data" src={img} />} </Col>} */}
                            <Form.Item
                              className="profile_img_form"
                              name="logo"
                              valuePropName="fileList"
                              getValueFromEvent={normFile}
                            >
                              <ImgCrop showGrid rotationSlider aspectSlider showReset>
                                <Upload
                                  listType="picture-card"
                                  onChange={handleChangeimg}
                                  fileList={fileList}
                                  maxCount={1}
                                  onRemove={onGalleryFileRemove}
                                  beforeUpload={beforeUpload}
                                  accept=".jpg, .jpeg, .png"
                                  onPreview={handlePreviewImage}
                                  disabled={!edit}
                                >
                                  <div className="profile_image_container" style={!fileList[0] && !edit ? { margin: "0 0 3.5rem 14.5rem", alignItems: 'center' } : edit ? {} : { alignItems: "center", marginLeft: "23.5rem" }} >
                                    <h3 style={edit ? {} : { margin: ".8rem 1rem 0 0" }}>
                                      {profileDatas.profileReducerResponse.contactPerson
                                        .userName}
                                    </h3>
                                    {edit && <Button type="link">{!fileList[0] ? "Add profile image" : "Change profile image"}</Button>}
                                  </div>
                                </Upload>
                              </ImgCrop>
                              {/* {showPreview && <div className="show_profile_image">
                                <div>
                                  <span class="close_profile_image" onClick={() => setShowPreview(false)}><CloseSquareOutlined /></span>
                                  </div>
                                </div>} */}
                              <Modal visible={showPreview} footer={false} onCancel={() => setShowPreview(false)}>
                                <img src={previewOffer ? previewOffer : img} style={{ width: '100%' }} />
                              </Modal>
                            </Form.Item>
                          </div>
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
                            label="Name"
                            name="first_name"
                            initialValue={
                              profileDatas.profileReducerResponse.contactPerson
                                .userName
                            }
                            rules={[
                              {
                                required: true,
                                message: "Please input your first name!",
                              },
                            ]}
                          >
                            <Input className="profile_user_name" disabled={!edit} style={!edit ? { border: "none", padding: 0, color: "#000000" } : {}}
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={11} lg={11} xl={11}>
                          <Form.Item
                            requiredMark={"optional"}
                            label="Phone Number"
                            name="phonenumber"
                            initialValue={
                              profileDatas.profileReducerResponse.contactPerson
                                .phoneNumber
                            }
                            rules={[
                              {
                                required: true,
                                message: "Please enter your phone number!",
                              },
                            ]}
                            onKeyPress={(event) => {
                              if (checkNumbervalue(event)) {
                                event.preventDefault();
                              }
                            }}
                          >
                            <Input
                              suffix={edit ?
                                <Button type="link" onClick={ChangePhone}>
                                  Change
                                </Button> : ""
                              }
                              disabled={!edit} style={!edit ? { border: "none", padding: 0, color: "#000000" } : {}}
                            />
                          </Form.Item>
                        </Col>

                        <Col
                          xs={24}
                          sm={24}
                          md={24}
                          lg={24}
                          xl={24}
                          className="profileCol"
                        >
                          <Form.Item
                            requiredMark={"optional"}
                            label="Email Address"
                            name="emailaddress"
                            // className=""
                            initialValue={
                              profileDatas.profileReducerResponse.contactPerson
                                .email
                            }
                            rules={[
                              {
                                type: "email",
                                required: true,
                                message: "The input is not valid",
                              },
                            ]}
                          >
                            <Input
                              suffix={edit ?
                                <Button type="link" onClick={Change}>
                                  Change
                                </Button> : ""
                              }
                              disabled={!edit} style={!edit ? { border: "none", padding: 0, color: "#000000" } : {}}
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
                        ></Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
                <Col
                  span={24}
                  className="profile-adress-title"
                >
                  <span>
                    <strong>Address</strong>
                  </span>
                  {edit && <Button
                    type="primary"
                    icon={<PlusCircleOutlined />}
                    // disabled={
                    //   saveChange == newChanges && saveChange !== ""
                    //     ? false
                    //     : true
                    // }
                    onClick={() => {
                      setAddAddressFrom(true)
                      addressRef.current.scrollIntoView()
                    }
                    }
                  >
                    Add Address
                  </Button>}
                </Col>{" "}
                <Divider
                  style={{
                    marginTop: "0",
                    border: "1px solid #d7d7d7",
                    borderTop: "0",
                  }}
                />


                <AddressForm profileDatas={profileDatas} edit={edit} form={form} addressline={"1"} />


                {addAddressForm && <AddressForm profileDatas={profileDatas} edit={edit} form={form} addressline={"2"} />}


                <p className="pass-title" ref={addressRef}>
                  <strong>Change Password</strong>
                </p>
                <Divider
                  style={{
                    marginTop: "0",
                    marginBottom: "45px",
                    border: "1px solid #d7d7d7",
                    borderTop: "0",
                  }}
                />
                <Col xs={0} sm={0} md={0} lg={6} xl={6}></Col>
                <Col
                  xs={24}
                  sm={24}
                  md={8}
                  lg={6}
                  xl={6}
                  className="profile-bottom-Col"
                >
                  <Form.Item
                    requiredMark={"optional"}
                    label="New Password"
                    name="newPassword"
                    onChange={newPasswordhandler}
                    rules={[
                      {
                        min: 6,
                        message: "Password must be atleast 6 characters",
                      },
                    ]}
                  
                  >
                    <Input.Password autoComplete="new-password"
                    />
                  </Form.Item>
                </Col>
                <Col
                  xs={24}
                  sm={24}
                  md={8}
                  lg={6}
                  xl={6}
                  className="profile-bottom-Col"
                >
                  <Form.Item
                    label="Confirm Password"
                    name="confirmPassword"
                    onChange={onhandlePasswordChange}
                    rules={[
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (
                            getFieldValue("newPassword") == value ||
                            getFieldValue("newPassword") == ""
                          ) {
                            return Promise.resolve();
                          } else {
                            return Promise.reject("Password does not match!");
                          }
                        },
                      }),
                    ]}
                  >
                    <Input.Password

                    />
                  </Form.Item>
                </Col>
                <Col
                  xs={24}
                  sm={24}
                  md={7}
                  lg={4}
                  xl={5}
                  className="profile-adress-btn profile-password-button"
                >
                  <Form.Item
                    rules={[
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (
                            getFieldValue("confirmPassword") ==
                            getFieldValue("newPassword")
                          ) {
                            return Promise.resolve();
                          } else {
                            return Promise.reject("Password does not match!");
                          }
                        },
                      }),
                    ]}
                  >
                    <Button
                      type="primary"
                      disabled={
                        saveChange == newChanges && saveChange !== ""
                          ? false
                          : true
                      }
                      onClick={onChangePassword}
                    >
                      Change Password
                    </Button>
                  </Form.Item>
                </Col>
                {/* changePassword */}
              </Row>
              <Divider id="profile-save-btn-divider" />

              <Col
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xl={24}
                className="profile-adress-btn profile-save-button profile-button-savve"
              >
                <Form.Item>
                  {edit && <Button type="primary" htmlType="submit">
                    SAVE
                  </Button>}
                </Form.Item>
              </Col>
            </Form>
          )}
        </div>
      </div>

      <Modal
        className="change_profile_phoneemail"
        // bodyStyle={{height: 300}}
        // style={{ height: "1500" }}
        title={
          active === "ChangeEmail"
            ? "Change Email Address"
            : active === "NewEmail"
              ? "Change Email Address"
              : active === "ChangeNumber"
                ? "Change Phone number"
                : active === "newNumber"
                  ? "New Phone Number"
                  : "OTP  Verifications"
        }
        visible={isModalVisible}
        onCancel={handleCancel}
        onClose={onClose}
        maskClosable={false}
        closeIcon={
          <svg
            style={{ marginRight: "15px", marginTop: "15px" }}
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
        }
        footer={null}
        width="45%"
      // height="50%"
      >
        <Form
          className="Modal-form"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
          form={form}
          maskClosable={false}
        >
          {active === "ChangeEmail" ? (
            <>
              <Row>
                <Col xs={0} sm={0} md={3} lg={6} xl={6}></Col>
                <Col
                  xs={24}
                  sm={24}
                  md={18}
                  lg={12}
                  xl={12}
                  className="changeEmail_modal"
                >
                  <Form.Item
                    label="Email"
                    name="registeredEmail"
                    required={true}
                    rules={[
                      {
                        type: "email",
                        message: "The input is not valid E-mail!",
                      },
                      {
                        message: "Please input your E-mail!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter your registered Email address"
                      onChange={handleValue}
                      defaultValue={profileDatas?.profileReducerResponse?.contactPerson
                        ?.email}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </>
          ) : active === "ChangeOTPemail" ? (
            <>
              <p className="otp-top">Enter OTP for Verifications</p>
              <p className="otp-subtitle"> OTP sent to the email</p>
              <Form.Item
                name="emailOTP"
                className="formClass"
                onKeyPress={(event) => {
                  if (checkNumbervalue(event)) {
                    event.preventDefault();
                  }
                }}
                rules={[
                  {
                    required: true,
                    message: "Enter OTP code",
                  },
                  {
                    message: "OTP must me 6 number!",
                    max: 6,
                    min: 6,
                  },
                ]}
              // onChange={onhandleOTP}
              >
                <Row>
                  <Col xs={0} sm={0} md={3} lg={3} xl={3}></Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={18}
                    lg={18}
                    xl={18}
                    style={{ textAlign: "center" }}
                  >
                    {/* <Input
                      placeholder="Enter  OTP  for  Email Verification"
                      style={{ textAlign: "center", marginTop: "20px" }}
                      maxLength={6}
                    /> */}
                    <div className="otp_verification">
                      <OtpInput
                        value={emOtp}
                        onChange={SetemOtp}
                        numInputs={6}
                        renderSeparator={<span>&nbsp;</span>}
                        renderInput={(props) => <input {...props} style={{ width: "10%" }} className="otp_verification_input" />}
                      />
                    </div>
                  </Col>
                </Row>
                <div></div>
                <Row>
                  <Col xs={0} sm={0} md={3} lg={3} xl={3}></Col>
                  <Col
                    xs={0}
                    sm={0}
                    md={3}
                    lg={1}
                    xl={1}
                    style={{ marginLeft: "2px" }}
                  ></Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={12}
                    lg={12}
                    xl={12}
                    style={{ marginTop: "1em" }}
                  >
                    <Col
                      xs={24}
                      sm={24}
                      md={12}
                      lg={5}
                      xl={5}
                    // style={{ paddingLeft: "5px" }}
                    >
                      {/* <p className="time"> */}
                      {/* {showResendbtn == true && (
                        <MyTimer expiryTimestamp={timeupdate} />
                      )} */}
                      {/* <div style={{fontSize: '100px'}}> */}
                      {/* <span>{days}</span>:<span>{hours}</span>:
                      <span>{minutes}</span>:<span>{seconds}</span> */}
                      {/* </div> */}
                      <MyTimer1ForEmail
                        expiryTimestamp={newTimer1Email}
                        timerFunction1ForEmail={timerFunction1ForEmail}
                        childFunc={childFunc}
                      />
                      {/* </p> */}
                    </Col>
                  </Col>
                </Row>
                {/* <Row>
                  <Col xs={0} sm={0} md={3} lg={3} xl={3}></Col>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <p>Didn’t receive OTP</p>
                  </Col>
                  <Col xs={24} sm={24} md={9} lg={9} xl={9} className="resend">
                    <Button
                      disabled={resendBtn1forEmail ? false : true}
                      type="link"
                      onClick={ChangedOTPEmail}
                    >
                      Resend OTP
                    </Button>
                  </Col>
                </Row> */}
                <Row>
                  <div className="otp-wrapper">
                    <div style={{ marginLeft: "12px" }}>
                      {" "}
                      <p>Didn’t receive OTP</p>
                    </div>
                    <div>
                      {" "}
                      <Button
                        style={{ paddingTop: "0px" }}
                        disabled={resendBtn1forEmail ? false : true}
                        type="link"
                        onClick={ChangedOTPEmail}
                      >
                        Resend OTP
                      </Button>
                    </div>
                  </div>
                </Row>
              </Form.Item>
            </>
          ) : active === "NewEmail" ? (
            <Row>
              <Col xs={0} sm={0} md={3} lg={6} xl={6}></Col>
              <Col
                xs={24}
                sm={24}
                md={18}
                lg={12}
                xl={12}
                className="changeEmail_modal"
              >
                <Form.Item
                  // className="changeEmail_modal"
                  required={true}
                  onChange={handleValue}
                  name="newEmail"
                  label={<strong>Enter new email</strong>}
                  rules={[
                    {
                      type: "email",
                      message: "The input is not valid E-mail!",
                    },
                    {
                      message: "Please input your E-mail!",
                    },
                  ]}
                >
                  <Input placeholder="Enter your new Email" />
                </Form.Item>
              </Col>
            </Row>
          ) : active === "ChangedOTPemail" ? (
            <>
              <p className="otp-top">Enter OTP for Verifications</p>
              <Form.Item
                name="emailOTP"
                className="formClass"
                onKeyPress={(event) => {
                  if (checkNumbervalue(event)) {
                    event.preventDefault();
                  }
                }}
                rules={[
                  {
                    required: true,
                    message: "Enter OTP code",
                  },
                  {
                    message: "OTP must me 6 number!",
                    max: 6,
                    min: 6,
                  },
                ]}
              // onChange={onhandleOTP}
              >
                <p className="otp-subtitle"> OTP sent to the email</p>
                <Row>
                  <Col xs={0} sm={0} md={3} lg={3} xl={3}></Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={18}
                    lg={18}
                    xl={18}
                    style={{ textAlign: "center" }}
                  >
                    <OtpInput
                      value={newEmOtp}
                      onChange={SetNewEmOtp}
                      numInputs={6}
                      renderSeparator={<span>&nbsp;</span>}
                      renderInput={(props) => <input {...props} style={{ width: "10%" }} className="otp_verification_input" />}
                    />

                  </Col>
                </Row>

                <Row>
                  <Col xs={0} sm={0} md={3} lg={3} xl={3}></Col>
                  <Col
                    xs={0}
                    sm={0}
                    md={3}
                    lg={1}
                    xl={1}
                    style={{ marginLeft: "5px" }}
                  ></Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={12}
                    lg={12}
                    xl={12}
                    style={{ marginTop: "2em" }}
                  >
                    <Col
                      xs={24}
                      sm={24}
                      md={12}
                      lg={5}
                      xl={5}
                    // style={{ paddingLeft: "5px" }}
                    >
                      {/* {showResendbtn == true && (
                        <MyTimer
                          expiryTimestamp={timeupdate}
                          showResendbtn={showResendbtn}
                        />
                      )} */}
                      <MyTimer2ForEmail
                        expiryTimestamp={newTimer2Email}
                        timerFunction2ForEmail={timerFunction2ForEmail}
                        childFunc={childFunc}
                      />
                    </Col>
                  </Col>
                </Row>
                {/* <Row>
                  <Col xs={0} sm={0} md={3} lg={3} xl={3}></Col>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <p>Didn’t receive OTP</p>
                  </Col>
                  <Col xs={24} sm={24} md={9} lg={9} xl={9} className="resend">
                    <Button
                      disabled={resendBtn2forEmail ? false : true}
                      type="link"
                      onClick={ChangedOTPEmail}
                    >
                      Resend OTP
                    </Button>
                  </Col>
                </Row> */}
                <Row>
                  <div className="otp-wrapper">
                    <div style={{ marginLeft: "20px" }}>
                      {" "}
                      <p>Didn’t receive OTP</p>
                    </div>
                    <div>
                      {" "}
                      <Button
                        disabled={resendBtn2forEmail ? false : true}
                        type="link"
                        onClick={ChangedOTPEmail}
                      >
                        Resend OTP
                      </Button>
                    </div>
                  </div>
                </Row>
              </Form.Item>
            </>
          ) : active === "ChangeNumber" ? (
            <Row>
              <Col xs={0} sm={0} md={3} lg={6} xl={6}></Col>
              <Col
                xs={24}
                sm={24}
                md={18}
                lg={12}
                xl={12}
                className="changeEmail_modal"
              >
                <Form.Item
                  name="registeredNumber"
                  required={true}
                  label={<strong>Phone number</strong>}
                  rules={[
                    {

                      max: 10,
                      message: "Please enter only 10 digits",

                    },
                    {

                      min: 10,
                      message: "Please enter min 10 digits",

                    },
                  ]}
                  onKeyPress={(event) => {
                    if (checkNumbervalue(event)) {
                      event.preventDefault();
                    }
                  }}
                >
                  <Input
                    placeholder="Enter your registered phone number"
                    onChange={handleValue}
                    defaultValue={profileDatas?.profileReducerResponse?.contactPerson
                      ?.phoneNumber}
                  />
                </Form.Item>
              </Col>
            </Row>
          ) : active === "ChangedOTPPhone" ? (
            <>
              <p className="otp-top">Enter OTP for Verifications</p>
              <Form.Item
                name="phoneOTP"
                // onChange={onhandleOTP}
                className="formClass"
              >
                <p className="otp-subtitle"> OTP sent to the Phone number</p>
                <Row>
                  <Col xs={0} sm={0} md={3} lg={3} xl={3}></Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={18}
                    lg={18}
                    xl={18}
                    style={{ textAlign: "center" }}
                  >
                    {/* <Input placeholder="Enter  OTP  for Phone  Verifications" /> */}
                    <div className="otp_verification">
                      <OtpInput
                        value={numOtp}
                        onChange={SetNumOtp}
                        numInputs={6}
                        renderSeparator={<span>&nbsp;</span>}
                        renderInput={(props) => <input {...props} style={{ width: "10%" }} className="otp_verification_input" />}
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col xs={0} sm={0} md={3} lg={3} xl={3}></Col>
                  <Col
                    xs={0}
                    sm={0}
                    md={3}
                    lg={1}
                    xl={1}
                    style={{ marginLeft: "3px" }}
                  ></Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={12}
                    lg={12}
                    xl={12}
                    style={{ marginTop: "1em" }}
                  >
                    <Col
                      xs={24}
                      sm={24}
                      md={12}
                      lg={5}
                      xl={5}
                    // style={{ paddingLeft: "5px" }}
                    >
                      {/* {showResendbtn == true && (
                      <MyTimer expiryTimestamp={timeupdate} />
                    )} */}
                      <MyTimer1
                        expiryTimestamp={newTimer1}
                        TimerFuction1={TimerFuction1}
                        childFunc={childFunc}
                      />
                    </Col>
                  </Col>
                </Row>
                <Row>
                  {/* <Col xs={0} sm={0} md={3} lg={3} xl={3}></Col>
                  <Col
                    xs={0}
                    sm={0}
                    md={3}
                    lg={1}
                    xl={1}
                    style={{ marginLeft: "5px" }}
                  ></Col>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <p>Didn’t receive OTP</p>
                  </Col>
                  <Col xs={24} sm={24} md={9} lg={7} xl={7} className="resend">
                    <Button
                      disabled={resendBtn1 ? false : true}
                      type="link"
                      onClick={ChangedOTPPhone}
                    >
                      Resend OTP
                    </Button>
                  </Col> */}
                  {/* <Col xs={0} sm={0} md={3} lg={3} xl={3}></Col> */}
                  <div className="otp-wrapper">
                    <div style={{ marginLeft: "12px" }}>
                      {" "}
                      <p>Didn’t receive OTP</p>
                    </div>
                    <div>
                      {" "}
                      {/* <Button
                        // disabled={resendBtn1 ? false : true}
                        type="link"
                        onClick={ChangedOTPPhone}
                      >
                        Resend OTP
                      </Button> */}
                      <Button disabled={resendBtn1 ? false : true} className="resendOtp_btn" onClick={ChangedOTPPhone} >Resend OTP</Button>
                    </div>
                  </div>
                </Row>
              </Form.Item>
            </>
          ) : active === "newNumber" ? (
            <Row>
              <Col xs={0} sm={0} md={3} lg={6} xl={6}></Col>
              <Col
                xs={24}
                sm={24}
                md={18}
                lg={12}
                xl={12}
                className="changeEmail_modal"
              >
                <Form.Item
                  required={true}
                  // className="changeEmail_modal"
                  onChange={handleValue}
                  name="newNumber"
                  label={<strong>new phone number</strong>}
                  rules={[
                    {
                      max: 10,
                      // min:10,
                      message: "Please enter only 10 digits",

                    },
                  ]}
                  onKeyPress={(event) => {
                    if (checkNumbervalue(event)) {
                      event.preventDefault();
                    }
                  }}
                >
                  <Input placeholder="Enter your new phone number" />
                </Form.Item>
              </Col>
            </Row>
          ) : active === "ChangedOTPPhonenew" ? (
            <>
              <p className="otp-top">Enter OTP for Verifications</p>
              <Form.Item
                name="phoneOTP"
                // onChange={onhandleOTP}
                className="formClass"
              >
                <p className="otp-subtitle"> OTP sent to the Phone number</p>
                <Row>
                  <Col xs={0} sm={0} md={3} lg={3} xl={3}></Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={18}
                    lg={18}
                    xl={18}
                    style={{ textAlign: "center" }}
                  >
                    <OtpInput
                      value={newNumOtp}
                      onChange={SetNewNumOtp}
                      numInputs={6}
                      renderSeparator={<span>&nbsp;</span>}
                      renderInput={(props) => <input {...props} style={{ width: "10%" }} className="otp_verification_input" />}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={0} sm={0} md={3} lg={3} xl={3}></Col>
                  <Col
                    xs={0}
                    sm={0}
                    md={3}
                    lg={1}
                    xl={1}
                    style={{ marginLeft: "5px" }}
                  ></Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={12}
                    lg={12}
                    xl={12}
                    style={{ marginTop: "2em" }}
                  >
                    <Col
                      xs={24}
                      sm={24}
                      md={12}
                      lg={5}
                      xl={5}
                      style={{ paddingLeft: "5px" }}
                    >
                      {/* {showResendbtn == true && (
                      <MyTimer expiryTimestamp={timeupdate} />
                    )} */}
                      <MyTimer2
                        expiryTimestamp={newTimer2}
                        TimerFuction2={TimerFuction2}
                        childFunc={childFunc}
                      />
                    </Col>
                  </Col>
                </Row>
                {/* <Row>
                  <Col xs={0} sm={0} md={2} lg={2} xl={3}></Col>
                  <Col xs={24} sm={24} md={12} lg={12} xl={10}>
                    <p>Didn’t receive OTP</p>
                  </Col>
                  <Col xs={24} sm={24} md={9} lg={9} xl={9} className="resend">
                    <Button
                      disabled={resendBtn2 ? false : true}
                      type="link"
                      onClick={ChangedOTPPhone}
                    >
                      Resend OTP
                    </Button>
                  </Col>
                </Row> */}
                <div className="otp-wrapper">
                  <div style={{ marginLeft: "20px" }}>
                    {" "}
                    <p>Didn’t receive OTP</p>
                  </div>
                  <div>
                    {" "}
                    <Button
                      disabled={resendBtn2 ? false : true}
                      type="link"
                      onClick={ChangedOTPPhone}
                    >
                      Resend OTP
                    </Button>
                  </div>
                </div>
              </Form.Item>
            </>
          ) : (
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item
                className="changeEmail_modal"
                onChange={handleValue}
                label={<strong>Change Email Address</strong>}
                name="registeredEmail"
              >
                <Input placeholder="Enter your registered Email address" />
              </Form.Item>
            </Col>
          )}
        </Form>

        <Divider className="modal-divider" />

        {active === "ChangeEmail" ||
          active === "NewEmail" ||
          active === "ChangeNumber" ||
          active === "newNumber" ? (
          <div className="Profile-buttons">
            <Button className="Cancel-btn" key="skyblue" onClick={handleCancel}>
              CANCEL
            </Button>

            <Button
              type="primary"
              htmlType="submit"
              className="Send-button"
              onClick={handleOk}
            >
              SEND
            </Button>
          </div>
        ) : (
          <Row>
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={24}
              className="submitt-button"
            >
              <Button
                // type="primary"
                htmlType="submit"
                className="Submitbutton"
                onClick={handleOk}
              >
                SUBMIT
              </Button>
            </Col>
          </Row>
        )}
      </Modal>
    </React.Fragment>
  );
};

export default ProfileForm;
