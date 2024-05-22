import axios from "axios";
import { message } from "antd";
import { APIs } from "../worker";

let userInfo = JSON.parse(localStorage.getItem("userinfo")) || {}
let headers = {
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${userInfo.token}`,
  }
}

export let userlogin = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: "USER_LOGIN_REQUEST" });
    let config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    let { data } = await axios.post(
      `${APIs.baseURL}/user-service/v1/adminlogin`,
      { email, password },
      config
    );
    userInfo = data
    headers.headers["Authorization"] =  `Bearer ${data.token}`
    dispatch({ type: "USER_LOGIN_SUCCESS", payload: data });
    localStorage.setItem("userinfo", JSON.stringify(data));
  } catch (err) {
    dispatch({
      type: "USER_LOGIN_FAIL",
      payload:
      err.response && err.response.data.message
          ? err.response.data.message
          : err.message,
        });
      }
};

export let emailVerify = (email) => async (dispatch) => {
  try {
    dispatch({ type: "EMAIL_REQUEST" });

    let { data } = await axios.post(`${APIs.baseURL}/user-service/v1/user/forgot-password`, email,headers);
    dispatch({ type: "EMAIL_SUCCESS", payload: data });
  } catch (err) {
    dispatch({
      type: "EMAIL_FAIL",
      payload:
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message,
    });
  }
};

export let userlogout = () => async (dispatch) => {
  localStorage.removeItem("userinfo");
  dispatch({ type: "USER_LOGOUT" });
};

export let userregister =
  (name, email, password, phone) => async (dispatch) => {
    try {
      dispatch({ type: "USER_REGISTER_REQUEST" });

      let config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      let { data } = await axios.post(
        "https://topaz-api.hutech.solutions/api/user",
        { name, email, password, phone },
        config
      );
      dispatch({ type: "USER_REGISTER_SUCCESS", payload: data });
      dispatch({ type: "USER_LOGIN_SUCCESS", payload: data });

      localStorage.setItem("userinfo", JSON.stringify(data));
    } catch (err) {
      dispatch({
        type: "USER_REGISTER_FAIL",
        payload:
          err.responce && err.responce.data.message
            ? err.responce.data.message
            : err.message,
      });
    }
  };

export const userOnbordManufectures = (payload, image) => async (dispatch) => {
  try {
    dispatch({ type: "USER_ONBORDMANUFECTURES_REQUEST" });
    let { data } = await axios.post(
      `${APIs.baseURL}/manufacturer-service/v1/manufacturer`,
      payload,
      headers
    );
    await axios.put(
      `${APIs.baseURL}/manufacturer-service/v1/manufacturer-file/${data.manufacturerCode}`,
      image,headers
    );
    dispatch({ type: "USER_ONBORDMANUFECTURES_SUCCESS", payload: data });
    localStorage.setItem("passwordToken", JSON.stringify(data));
  } catch (err) {
    dispatch({
      type: "USER_ONBORDMANUFECTURES_FAIL",
      payload:
      err?.response?.data.message
      ? err.response.data.message
      : err.message ? err.message : "SomeThing went wrong...",
    });
  }
};

export const setFormData = (payload, image) => async (dispatch) => {
  dispatch({ type: "SET_FORM_DATA", payload: payload, image: image });
};

export const setTabKey = (data) => async (dispatch) => {
  dispatch({ type: "SET_TAB_KEY", payload: data });
};

export const emailid = (data) => (dispatch) => {
  dispatch({ type: "EMAILID", payload: data });
};

export const orderSumm = (data) => async (dispatch) => {
  dispatch({ type: "SET_ORDER_DATA", payload: data });
};
export let getmanufecturelist = () => async (dispatch, getState) => {
  try {
    dispatch({ type: "MANUFECTURE_LIST_REQUEST" });

    let { data } = await axios.get(
      `${APIs.baseURL}/manufacturer-service/v1/manufacturers`,headers
    );
    dispatch({ type: "MANUFECTURE_LIST_SUCCESS", payload: data });
  } catch (err) {
    dispatch({
      type: "MANUFECTURE_LIST__FAIL",
      payload:
        err.responce && err.responce.data.message
          ? err.responce.data.message
          : err.message,
    });
  }
};
export let getSingleManufacture = (getState) => async (dispatch) => {
  console.log("userinfo------------",getState)
  try {
    dispatch({ type: "SINGLE_MANUFACTURE_DETAILS" });
    let { data } = await axios.get(
      `${APIs.baseURL}/manufacturer-service/v1/manufacturer/` + getState.manufacturerCode,headers
    );
    console.log("caling------d")
    dispatch({ type: "SINGLE_MANUFACTURE_SUCCESS", payload: data });
  } catch (err) {
    dispatch({
      type: "SINGLE_MANUFACTURE_FAIL",
      payload:
        err.responce && err.responce.data.message
          ? err.responce.data.message
          : err.message,
    });
  }
};

export let getRegistrationManufacture =
  () => async (dispatch, getState) => {
    try {
      dispatch({ type: "MANUFACTURE_LINK" });
      let { data } = await axios.get(
        `${APIs.baseURL}/manufacturer/manufacturer/activateupdate/${userInfo.manufacturerCode}`
      );
      dispatch({ type: "MANUFACTURE_LINK_SUCCESS", payload: data });
    } catch (err) {
      dispatch({
        type: "MANUFACTURE_LINK_FAIL",
        payload:
          err.responce && err.responce.data.message
            ? err.responce.data.message
            : err.message,
      });
    }
  };

export const generateLink = (id) => async (dispatch) => {
  try {
    dispatch({ type: "GENERATE_LINK" });
    let config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    let { data } = await axios.post(
      `https://topaz-api.hutech.solutions/api/manufecture/generatelink/` + id,
      {},
      config
    );
    dispatch({ type: "GENERATE_LINK_SUCCESS", payload: data });
  } catch (err) {
    dispatch({
      type: "GENERATE_LINK_FAIL",
      payload:
        err.responce && err.responce.data.message
          ? err.responce.data.message
          : err.message,
    });
  }
};
export const sendLink = (id, payload) => async (dispatch) => {
  try {
    dispatch({ type: "SEND_LINK" });
    let config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    let { data } = await axios.post(
      `https://topaz-api.hutech.solutions/api/manufecture/generatelink/` + id,
      payload,
      config
    );
    debugger;
    dispatch({ type: "SEND_LINK_SUCCESS", payload: data });
  } catch (err) {
    dispatch({
      type: "SEND_LINK_FAIL",
      payload:
        err.responce && err.responce.data.message
          ? err.responce.data.message
          : err.message,
    });
  }
};

export const addCategory = (payload, image) => async (dispatch) => {
  try {
    dispatch({ type: "ADD_CATEGORY" });
    let { data } = await axios.post(
      `${APIs.baseURL}/category-service/v1/category/${userInfo.manufacturerCode}`,
      payload,
      headers
    );

    if (image !== "") {
      await axios.put(
        `${APIs.baseURL}/category-service/v1/category-file/${data.categoryid}`,
        image,
        headers
      );
    }
    dispatch({ type: "ADD_CATEGORY_SUCCESS", payload: data });
  } catch (err) {
    dispatch({
      type: "ADD_CATEGORY_FAIL",
      payload:
        err.responce && err.responce.data.message
          ? err.responce.data.message
          : err.message,
    });
  }
};

export const addUser = (payload) => async (dispatch) => {
  try {
    dispatch({ type: "ADD_USER" });
    let { data } = await axios.post(
      `${APIs.baseURL}/user-service/v1/user`,
      payload,headers
    );

    dispatch({ type: "ADD_USER_SUCCESS", payload: data });
  } catch (err) {
    dispatch({
      type: "ADD_USER_FAIL",
      payload:
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message,
    });
  }
};

export let listUsers = () => async (dispatch) => {
  try {
    dispatch({ type: "LIST_USER" });
    let { data } = await axios.get(
      `${APIs.baseURL}/user-service/v1/users`,headers
    );
    dispatch({ type: "LIST_USER_SUCCESS", payload: data });
  } catch (err) {
    dispatch({
      type: "LIST_USER__FAIL",
      payload:
        err.responce && err.responce.data.message
          ? err.responce.data.message
          : err.message,
    });
  }
};
export let createPassword = (payload) => async (dispatch) => {
  try {
    dispatch({ type: " CREATE_PASSWORD" });
    let { data } = await axios.put(
      `${APIs.baseURL}/manufacturer-service/v1/manufacturer/password`,
      payload,headers
    );
    dispatch({ type: "CREATE_PASSWORD_SUCCESS", payload: data });
  } catch (err) {
    dispatch({
      type: "CREATE_PASSWORD_FAIL",
      payload:
        err.responce && err.responce.data.message
          ? err.responce.data.message
          : err.message,
    });
  }
};

export let profileData = (id) => async (dispatch) => {
  try {
    dispatch({ type: "PROFILE_REDUCER" });
    let { data } = await axios.get(`${APIs.baseURL}/manufacturer-service/v1/manufacturer-image/${id}`,headers);
    dispatch({ type: "PROFILE_REDUCER_SUCCESS", payload: data });
  } catch (error) {
    dispatch({
      type: "PROFILE_REDUCER_FAIL",
      payload:
        error.responce && error.responce.data.message
          ? error.responce.data.message
          : error.message,
    });
  }
};

export let addUserUpdate = (data) => async (dispatch) => {
  try {
    dispatch({ type: "ADDUSERUPDATE_REDUCER" });
    let { data } = await axios.put(
      `${APIs.baseURL}/manufacturer-service/v1/manufacturer/${data.manufacturerId}`,headers
    );
    dispatch({ type: "ADDUSERUPDATE_REDUCER_SUCCESS", payload: data });
  } catch (error) {
    dispatch({
      type: "ADDUSERUPDATE_REDUCER_FAIL",
      payload:
        error.responce && error.responce.data.message
          ? error.responce.data.message
          : error.message,
    });
  }
};
export let paymentUpdate = (payload) => async (dispatch) => {
  try {
    dispatch({ type: "UPDATE_PAYMENT" });
    let { data } = await axios.put(`${APIs.baseURL}/additionaldetails-service/v1/additionaldetail/1`, payload,headers);
    dispatch({ type: "UPDATE_PAYMENT_SUCCESS", payload: data });
  } catch (error) {
    dispatch({
      type: "UPDATE_PAYMENT_FAIL",
      payload:
        error.responce && error.responce.data.message
          ? error.responce.data.message
          : error.message,
    });
  }
};

/*********************** Product Owner  *************/

export let viewCategory = () => async (dispatch, getState) => {
  try {
    dispatch({ type: "VIEW_CATEGORY" });    
    let response = await axios.get(
      `${APIs.baseURL}/category-service/v1/categories/${userInfo.manufacturerCode}`
    );

    dispatch({ type: "VIEW_CATEGORY_SUCCESS", payload: response.data });
  } catch (err) {
    dispatch({
      type: "VIEW_CATEGORY_FAIL",
      payload:
        err.responce && err.responce.data.message
          ? err.responce.data.message
          : err.message,
    });
  }
};

export const editCategory = (id, payload) => async (dispatch) => {
  try {
    dispatch({ type: "EDIT_CATEGORY" });
    let { data } = await axios.put(
      `${APIs.baseURL}/category-service/v1/category/${id}`,
      payload,
      headers
    );
    dispatch({ type: "EDIT_CATEGORY_SUCCESS", payload: data });
  } catch (err) {
    dispatch({
      type: "EDIT_CATEGORY_FAIL",
      payload:
        err.responce && err.responce.data.message
          ? err.responce.data.message
          : err.message,
    });
  }
};

export let setting = (payload, image) => async (dispatch) => {
  try {
    dispatch({
      type: "SETTING",
    });
    let { data } = await axios.post(
      `${APIs.baseURL}/account-service/v1/accountsetting`,
      payload,
      headers
    );
    await axios.put(
      `${APIs.baseURL}/account-service/v1/accountsetting-file/${data.settingId}`,
      image,
      headers
    );
    message.success("data added successfully!!!");
    dispatch({ type: "SETTING_SUCCESS", payload: data });
  } catch (err) {
    dispatch({
      type: "SETTING_FAIL",
      payload:
        err.responce && err.responce.data.message
          ? err.responce.data.message
          : err.message,
    });
  }
};
/*************************************Product*********************** */

export const addProduct = (payload, image) => async (dispatch) => {
  try {
    dispatch({ type: "ADD_PRODUCT" });
    let { data } = await axios.post(`${APIs.baseURL}/product-service/v1/product`, payload,headers);
    console.log(data);
    if (image != "") {
      await axios.put(
        `${APIs.baseURL}/product-service/v1/productfile/${data.productid}`,
        image,headers
      );
    }

    dispatch({ type: "ADD_PRODUCT_SUCCESS", payload: data });
  } catch (err) {
    dispatch({
      type: "ADD_PRODUCT_FAIL",
      payload:
        err.responce && err.responce.data.message
          ? err.responce.data.message
          : err.message,
    });
  }
};

export const updateProduct = (payload, id) => async (dispatch) => {
  try {
    dispatch({ type: "UPDATE_USER" });

    let { data } = await axios.put(
      `${APIs.baseURL}/product-service/v1/product/` + id,
      payload,headers
    );

    dispatch({ type: "UPDATE_USER_SUCCESS", payload: data });
  } catch (err) {
    dispatch({
      type: "UPDATE_USER_FAIL",
      payload:
        err.responce && err.responce.data.message
          ? err.responce.data.message
          : err.message,
    });
  }
};

export let singleProductDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: "SINGLE_PRODUCT_DETAILS" });
    let { data } = await axios.get(
      `${APIs.baseURL}/product-service/v1/product-details/${id}`,headers
    );
    dispatch({ type: "SINGLE_PRODUCT_DETAILS_SUCCESS", payload: data });
  } catch (err) {
    dispatch({
      type: "SINGLE_PRODUCT_DETAILS_FAIL",
      payload:
        err.responce && err.responce.data.message
          ? err.responce.data.message
          : err.message,
    });
  }
};

export const editprice = (payload, id) => async (dispatch) => {
  try {
    dispatch({ type: "EDIT_PRICE" });
    let { data } = await axios.put(
      `${APIs.baseURL}/product-service/v1/product-price/` + id,
      payload,headers
    );
    dispatch({ type: "EDIT_PRICE_SUCCESS", payload: data });
  } catch (err) {
    dispatch({
      type: "EDIT_PRICE_FAIL",
      payload:
        err.responce && err.responce.data.message
          ? err.responce.data.message
          : err.message,
    });
  }
};

export const stockAndThreshold = (payload, id) => async (dispatch) => {
  try {
    dispatch({ type: "STOCK_THRESHOLD" });
    let { data } = await axios.put(
      `${APIs.baseURL}/product-service/v1/product-stock-threshold/` + id,
      payload,headers
    );

    dispatch({ type: "STOCK_THRESHOLD_SUCCESS", payload: data });
  } catch (err) {
    dispatch({
      type: "STOCK_THRESHOLD_FAIL",
      payload:
        err.responce && err.responce.data.message
          ? err.responce.data.message
          : err.message,
    });
  }
};

export const viewProduct = () => async (dispatch, getState) => {
  try {
    dispatch({ type: "VIEW_PRODUCT" });
    let { data } = await axios.get(
      `${APIs.baseURL}/product-service/v1/product-detail/${userInfo.manufacturerCode}`,headers
    );
    dispatch({ type: "VIEW_PRODUCT_SUCCESS", payload: data });
  } catch (err) {
    dispatch({
      type: "VIEW_PRODUCT_FAIL",
      payload:
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message,
    });
  }
};

export let customerOnboarding = () => async (dispatch) => {
  try {
    dispatch({ type: "CUSTOMER_ONBOARD_REDUCER" });
    let { data } = await axios.post(`${APIs.baseURL}/customer-service/v1/customer`);
    dispatch({ type: "CUSTOMER_ONBOARD_REDUCER_SUCCESS", payload: data });
  } catch (error) {
    dispatch({
      type: "CUSTOMER_ONBOARD_REDUCER_FAIL",
      payload:
        error.responce && error.responce.data.message
          ? error.responce.data.message
          : error.message,
    });
  }
};
/***************************customer********************************** */

export const viewCutomer = () => async (dispatch, getState) => {
  try {
    dispatch({ type: "VIWE_CUSTOMER" });
    let config = {
      headers: {
        "Content-Type": "application/json",
        "MNF-CODE": `${userInfo.manufacturerCode}`,
        "Authorization": `Bearer ${userInfo.token}`,
      },
    };
    
    let { data } = await axios.get(`${APIs.baseURL}/customer-service/v1/customers`, config);
    dispatch({ type: "VIWE_CUSTOMER_SUCCESS", payload: data });
  } catch (err) {
    dispatch({
      type: "VIWE_CUSTOMER_FAIL",
      payload:
        err.responce && err.responce.data.message
          ? err.responce.data.message
          : err.message,
    });
  }
};

export const EditSpecificCutomer = (payload, id) => async (dispatch) => {
  try {
    dispatch({ type: "EDIT_CUSTOMER" });
    let { data } = await axios.put(
      `${APIs.baseURL}/customer-service/v1/customer/` + id,
      payload,
      headers
    );

    dispatch({ type: "EDIT_CUSTOMER_SUCCESS", payload: data });
  } catch (err) {
    dispatch({
      type: "EDIT_CUSTOMER_FAIL",
      payload:
        err.responce && err.responce.data.message
          ? err.responce.data.message
          : err.message,
    });
  }
};

export const productImage = () => async (dispatch) => {
  try {
    dispatch({ type: "PRODUCT_IMAGE" });
    let { data } = await axios.get(`${APIs.baseURL}/product-service/v1/productfile/1`,headers);
    dispatch({ type: "PRODUCT_IMAGE_SUCCESS", payload: data });
  } catch (err) {
    dispatch({
      type: "PRODUCT_IMAGE_FAIL",
      payload:
        err.responce && err.responce.data.message
          ? err.responce.data.message
          : err.message,
    });
  }
};

export const setDiscountData = (payload) => async (dispatch) => {
  dispatch({ type: "SET_DISCOUNT_DATA", payload });
};
export let viewSpecificCustomer = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: "VIEW_SPECIFIC_CUSTOMER" });
    let { data } = await axios.get(
      `${APIs.baseURL}/customer-service/v1/customer/` + id
      ,headers
    );
    dispatch({ type: "VIEW_SPECIFIC_CUSTOMER_SUCCESS", payload: data });
  } catch (err) {
    dispatch({
      type: "VIEW_SPECIFIC_CUSTOMERS_FAIL",
      payload:
        err.responce && err.responce.data.message
          ? err.responce.data.message
          : err.message,
    });
  }
};

export const bredCurm = (payload) => (dispatch) => {
  dispatch({ type: "BREDCRUM_KEY", payload: payload });
};

export const setAdvertisement = (payload) => (dispatch) => {
  dispatch({ type: "SET_Adevertisement_DATA", payload });
};

export const getOrderList = () => async (dispatch, getState) => {
  try {
    dispatch({ type: "GET_ORDER_LIST" });
    const { data } = await axios.get(
      `${APIs.baseURL}/order-service/v1/orders`,
        {
          headers: {
            "Content-Type": "application/json",
            "MNF-CODE": `${userInfo.manufacturerCode}`,
            "Authorization": `Bearer ${userInfo.token}`,
          }
        }
    );
    dispatch({ type: "GET_ORDER_LIST_SUCCESS", payload: data });
  } catch (err) {
    dispatch({
      type: "GET_ORDER_LIST_FAIL",
      payload:
        err.responce && err.responce.data.message
          ? err.responce.data.message
          : err.message,
    });
  }
};


export const getOrderStatus = () => async (dispatch, getState) => {
  try {
    dispatch({ type: "GET_ORDER_STATUS" });
    const { data } = await axios.get(
      `${APIs.baseURL}/order-service/v1/order/status`,headers
      );
    dispatch({ type: "GET_ORDER_STATUS_SUCCESS", payload: data });
  } catch (err) {
    dispatch({
      type: "GET_ORDER_STATUS_FAIL",
      payload:
        err.responce && err.responce.data.message
          ? err.responce.data.message
          : err.message,
    });
  }
};

export const getpaymentstatus = () => async (dispatch, getState) => {
  try {
    dispatch({ type: "GET_PAYMENT_STATUS" });
    const { data } = await axios.get(
      `${APIs.baseURL}/order-service/v1/order/paymentstatus`,headers
      );
    dispatch({ type: "GET_PAYMENT_STATUS_SUCCESS", payload: data });
  } catch (err) {
    dispatch({
      type: "GET_PAYMENT_STATUS_FAIL",
      payload:
        err.responce && err.responce.data.message
          ? err.responce.data.message
          : err.message,
    });
  }
};


export const getPrioritystatus = () => async (dispatch, getState) => {
  try {
    dispatch({ type: "GET_PRIORITY_STATUS" });
    const { data } = await axios.get(
      `${APIs.baseURL}/order-service/v1/orders/priority-status`,headers);
    dispatch({ type: "GET_PRIORITY_STATUS_SUCCESS", payload: data });
  } catch (err) {
    dispatch({
      type: "GET_PRIORITY_STATUS_FAIL",
      payload:
        err.responce && err.responce.data.message
          ? err.responce.data.message
          : err.message,
    });
  }
};

export const orderStatusUpdate = (payloadData) => async (dispatch, getState) => {
  try {
    dispatch({ type: "GET_ORDER_LIST" });
    const { data } = await axios.put(
      `${APIs.baseURL}/order-service/v1/order/status/${payloadData?.params}`, payloadData?.body,headers
      );
    dispatch({ type: "ORDER_STATUS_UPDATE_SUCCESS", payload: data });
  } catch (err) {
    dispatch({
      type: "ORDER_STATUS_UPDATE_FAIL",
      payload:
        err.responce && err.responce.data.message
          ? err.responce.data.message
          : err.message,
    });
  }
};

export const paymentStatusUpdate = (payloadData) => async (dispatch, getState) => {
  try {
    dispatch({ type: "GET_ORDER_LIST" });
    const { data } = await axios.put(
      `${APIs.baseURL}/order-service/v1/order/payment-status/${payloadData?.params}`, payloadData?.body,headers
      );
    dispatch({ type: "PAYMENT_STATUS_UPDATE_SUCCESS", payload: data });
  } catch (err) {
    dispatch({
      type: "PAYMENT_STATUS_UPDATE_FAIL",
      payload:
        err.responce && err.responce.data.message
          ? err.responce.data.message
          : err.message,
    });
  }
};

export const priorityStatusUpdate = (payloadData) => async (dispatch, getState) => {
  try {
    dispatch({ type: "GET_ORDER_LIST" });
    const { data } = await axios.put(
      `${APIs.baseURL}/order-service/v1/priority-status/${payloadData?.params}`, payloadData?.body,headers);
    dispatch({ type: "PRIORITY_STATUS_UPDATE_SUCCESS", payload: data });
  } catch (err) {
    dispatch({
      type: "PRIORITY_STATUS_UPDATE_FAIL",
      payload:
        err.responce && err.responce.data.message
          ? err.responce.data.message
          : err.message,
    });
  }
};

export const deleteOrderItems = (payloadData) => async (dispatch, getState) => {
  try {
    dispatch({ type: "DELETE_ORDER_ITEM" });
    const { data } = await axios.delete(
      `${APIs.baseURL}/order-service/v1/order/${payloadData?.params}`,headers
      );
    dispatch({ type: "DELETE_ORDER_ITEM_SUCCESS", payload: data });
    message.success(`Product is deleted successfully`)
  } catch (err) {
    dispatch({
      type: "DELETE_ORDER_ITEM_FAIL",
      payload:
        err.responce && err.responce.data.message
          ? err.responce.data.message
          : err.message,
    });
  }
};

export const manufacturerConversation = (payloadData) => async (dispatch, getState) => {
  try {
    dispatch({ type: "SENT_MANUFACTURER_CONVERSATION" });
    const { data } = await axios.post(
      `${APIs.baseURL}/message-service/v1/message/${payloadData?.params?.orderItemId}/${payloadData?.params?.orderId}`, payloadData?.body,headers);
    dispatch({ type: "SENT_MANUFACTURER_CONVERSATION_SUCCESS", payload: data });
  } catch (err) {
    dispatch({
      type: "SENT_MANUFACTURER_CONVERSATION_FAIL",
      payload:
        err.responce && err.responce.data.message
          ? err.responce.data.message
          : err.message,
    });
  }
};

export const getManufacturerConversation = (payloadData) => async (dispatch, getState) => {
  try {
    dispatch({ type: "GET_MANUFACTURER_CONVERSATION" });
    const { data } = await axios.get(
      `${APIs.baseURL}/message-service/v1/messages/${payloadData?.params}`,headers);
    dispatch({ type: "GET_MANUFACTURER_CONVERSATION_SUCCESS", payload: data });
  } catch (err) {
    dispatch({
      type: "GET_MANUFACTURER_CONVERSATION_FAIL",
      payload:
        err.responce && err.responce.data.message
          ? err.responce.data.message
          : err.message,
    });
  }
}
export const deleteManufatureMessage = (payloadData) => async (dispatch, getState) => {
  try {
    dispatch({ type: "GET_MANUFACTURER_CONVERSATION" });
    await axios.delete(
      `${APIs.baseURL}/message-service/v1/message/${payloadData.messageId}`,headers);
    dispatch({ type: "DELETE_MESSAGE_MANUFACTURER_SUCCESS", payload: payloadData.newChatData });
  } catch (err) {
    dispatch({
      type: "DELETE_MESSAGE_MANUFACTURER_FAIL",
      payload:
        err.responce && err.responce.data.message
          ? err.responce.data.message
          : err.message,
    });
  }
}
export const editManufatureMessage = (payloadData) => async (dispatch, getState) => {
  try {
    dispatch({ type: "GET_MANUFACTURER_CONVERSATION" });
    await axios.put(
      `${APIs.baseURL}/message-service/v1/message/${payloadData.messageId}`, {
      manufactureConversation: payloadData.changeConversation
    },headers);
    dispatch({ type: "EDIT_MESSAGE_MANUFACTURER_SUCCESS", payload: payloadData.newChatData });
  } catch (err) {
    dispatch({
      type: "EDIT_MESSAGE_MANUFACTURER_FAIL",
      payload:
        err.responce && err.responce.data.message
          ? err.responce.data.message
          : err.message,
    });
  }
}

export const updateBankDetailsAction = (payloadData) => async (dispatch, getstate) => {
  try {
    dispatch({ type: "BANKDETAIL_ACTION" })
    await axios.put(`${APIs.baseURL}/additionaldetails-service/v1/additionaldetail/${payloadData.bankid}`, payloadData.updatedObj,headers)
    dispatch({ type: "UPDATE_BANKDETAIL_SUCCESS", payload: payloadData.updatedmainData });
  } catch (err) {
    dispatch({
      type: "UPDATE_BANKDETAI_FAIL",
      payload:
        err.responce && err.responce.data.message
          ? err.responce.data.message
          : err.message,
    });
  }
}

export const deleteBankAccountDetailsAction = (payloadData) => async (dispatch) => {
  try {
    dispatch({ type: "BANKDETAIL_ACTION" })
    await axios.delete(`${APIs.baseURL}/additionaldetails-service/v1/additionaldetail/${userInfo.manufacturerCode}/${payloadData.Acno}`,headers)
    dispatch({ type: "BANKDETAIL_DELETE_SUCCESS", payload: payloadData.updatedBankData });
  } catch (err) {
    dispatch({
      type: "BANKDETAIL_DELETE_FAIL",
      payload: err.responce && err.responce.data.message ? err.responce.data.message : err.message
    })
  }
}
export const getBankAccountDetailsAction = (payloadData) => async (dispatch) => {
  try {
    dispatch({ type: "BANKDETAIL_ACTION" })
    const res = await axios
      .get(
        `${APIs.baseURL}/additionaldetails-service/v1/additionaldetail/${userInfo.manufacturerCode}`, headers)

    dispatch({ type: "GET_BANKDETAIL_SUCCESS", payload: res });
  } catch (err) {
    dispatch({
      type: "GET_BANKDETAI_FAIL",
      payload: err.responce && err.responce.data.message ? err.responce.data.message : err.message
    })
  }
}

export const addBankAccountAction = (payloadData) => async (dispatch) => {
  try {
    dispatch({ type: "BANKDETAIL_ACTION" })
    const res = await axios.post(`${APIs.baseURL}/additionaldetails-service/v1/additionaldetail/${userInfo.manufacturerCode}`, payloadData.values, headers)
    dispatch({ type: "BANKDETAIL_ADD_SUCCESS", payload: res.data });
  } catch (err) {
    dispatch({
      type: "BANKDETAIL_ADD_FAIL",
      payload: err.responce && err.responce.data.message ? err.responce.data.message : err.message
    })
  }
}


export const dashboardSales = ({ start, setChartData, setTotalAmount }) => {
  axios.get(`${APIs.baseURL}/order-service/v1/order/daily-sales/${userInfo.manufacturerCode}/${start}`,headers
  ).then((res) => {
    const chartArray = []
    let amount = 0
    res.data.forEach(product => {
      const chartObj = {}
      chartObj[product.orderid] = product.amountwithtax
      chartObj["label"] = product.orderid
      chartObj["id"] = product.orderid
      chartArray.push(chartObj)
      amount += parseInt(product.amountwithtax)
    })
    setChartData(chartArray)
    setTotalAmount(amount)
  }).catch(err => message.err)
}

export const monthAndWeeklySales = ({ value, setChartData, setTotalAmount }) => {
  axios.get(`${APIs.baseURL}/order-service/v1/order/range-sale/${userInfo.manufacturerCode}/${value}`,headers
  ).then((res) => {
    const chartArray = []
    let amount = 0
    if (value === "Weekly") {
      res.data.forEach(product => {
        let day = new Date(product.date).getDay()
        if (day === 0) {
          day = "Sunday"
        } else if (day === 1) {
          day = "Monday"
        } else if (day === 2) {
          day = "Tuesday"
        } else if (day === 3) {
          day = "Wednesday"
        } else if (day === 4) {
          day = "Thursday"
        } else if (day === 5) {
          day = "Friday"
        } else if (day === 6) {
          day = "Saturday"
        }
        const lab = `${day} Orders : ${product.orderCount}    Sales on `
        const chartObj = {}
        chartObj[lab] = product.amount
        chartObj["label"] = lab
        chartObj["id"] = day
        chartArray.push(chartObj)
        amount += product.amount
      })
      setChartData(chartArray)
    } else
      if (value === "Monthly") {
        let weeknum = 1
        res.data.forEach(product => {
          const chartObj = {}
          const lab = `${product.date} to ${product.endDate} Orders : ${product.orderCount}     Sales on`
          chartObj[lab] = product.amount
          chartObj["label"] = lab
          chartObj["id"] = `week ${weeknum}`
          chartArray.push(chartObj)
          weeknum++
          amount += product.amount
        })
        setChartData(chartArray.reverse())
      } else if (value === "Months") {
        let weeknum = 1
        let tempMonth = new Date(res.data[0].date).getMonth()
        let iddate;
        let chartObj = {}
        res.data.forEach((product) => {
          const orderMonth = new Date(product.date).getMonth()
          if (tempMonth !== orderMonth) {
            const id = new Date(iddate).toString()
            chartObj["id"] = id.slice(4, 7)
            chartObj["label"] = id.slice(4, 7)
            chartArray.push(chartObj)
            chartObj = {}
            tempMonth = orderMonth
            const lab = `${product.date} to ${product.endDate} Orders : ${product.orderCount}     Sales on`
            chartObj[lab] = product.amount
            chartObj[`week ${weeknum}`] = product.amount
            iddate = product.date
            weeknum = 1
          } else {
            const lab = `${product.date} to ${product.endDate} Orders : ${product.orderCount}     Sales on`
            chartObj[lab] = product.amount
            chartObj["label"] = lab
            chartObj[`week ${weeknum}`] = product.amount
            weeknum++
            iddate = product.date
          }
          amount += product.amount
        })
        const id = new Date(iddate).toString()
        chartObj["id"] = id.slice(4, 7)
        chartObj["label"] = id.slice(4, 7)
        chartArray.push(chartObj)
      }
    setChartData(chartArray.reverse())
    setTotalAmount(amount)
  }).catch(err => message.err)
}


export const getAllNotifications = () => async (dispatch) => {
  try {
    dispatch({ type: "GET_ALL_NOTIFICATION" })
    const res = await axios
      .get(
        `${APIs.baseURL}/notification-service/v1/notifications/${userInfo.manufacturerCode}`,headers)
        console.log("notification res",res)
    dispatch({ type: "GET_ALL_NOTIFICATION_SUCCESS", payload: res.data });
  } catch (err) {
    dispatch({
      type: "GET_ALL_NOTIFICATION_FAIL",
      payload: err.responce && err.responce.data.message ? err.responce.data.message : err.message
    })
  }
}

export const notificationReadAction = (payloadData) => async (dispatch) => {
  try {
    dispatch({ type: "GET_ALL_NOTIFICATION" })
    const res = await axios
      .put(
        `${APIs.baseURL}/notification-service/v1/status/${payloadData.notificationId}`,headers)
    dispatch({ type: "GET_ALL_NOTIFICATION_SUCCESS", payload: payloadData.updatedData });
  } catch (err) {
    dispatch({
      type: "GET_ALL_NOTIFICATION_FAIL",
      payload: err.responce && err.responce.data.message ? err.responce.data.message : err.message
    })
  }
}


export const rewardsSetupPointsAction = () => async (dispatch) => {
  try {
    dispatch({ type: "GET_REWARDSETUPPOINTS" })
    const res = await axios
      .get(`${APIs.baseURL}/reward-service/v1/reward/${userInfo.manufacturerCode}`,headers)
    dispatch({
      type: "GET_REWARDSETUPPOINTS_SUCCESS",
      payload: res.data
    })
  } catch (err) {
    dispatch({
      type: "GET_REWARDSETUPPOINTS_FAIL",
      payload: err.responce && err.responce.data.message ? err.responce.data.message : err.message
    })
  }
}

export const newRewardSetupAction = (payloadData) => async (dispatch) => {
  try {
    dispatch({ type: "GET_REWARDSETUPPOINTS" })
    const res = await axios
      .post(`${APIs.baseURL}/reward-service/v1/set-reward/${userInfo.manufacturerCode}`,
        payloadData.valToInt,headers
      )
    dispatch({
      type: "GET_REWARDSETUPPOINTS_SUCCESS",
      payload: res.data
    })
  } catch (err) {
    dispatch({
      type: "GET_REWARDSETUPPOINTS_FAIL",
      payload: err.responce && err.responce.data.message ? err.responce.data.message : err.message
    })
  }
}

export const createRewardAction = async (payloadData) => {
  try {
    await axios.post(`${APIs.baseURL}/reward-service/v1/manufacturer-reward`, payloadData.data,{
      ...headers,
      "MNF-CODE":`${userInfo.manufacturerCode}`
    })
  } catch (err) {
    message.error(err.responce && err.responce.data.message ? err.responce.data.message : err.message)
  }
}


export const allocateOrRedeemPointsAction = (payloadData) => async (dispatch) => {
  try {
    dispatch({ type: "VIWE_CUSTOMER" })
    const updateCustomerListHandler = (data) => {
      const updatelist = payloadData.viewCustomerList.map((customer) => {
        if (data.customerCodes.includes(customer.customercode)) {
          if (payloadData.redeem) {
            const setCustomerPoints = { ...customer, point: customer.point - data.point }
            return setCustomerPoints
          } else {
            const setCustomerPoints = { ...customer, point: customer.point + data.point }
            return setCustomerPoints
          }
        } else {
          return customer
        }
      })
      message.success(payloadData.redeem ? "Allocated Points Successfully" : "Redemption Points Successfully")
      dispatch({ type: "VIWE_CUSTOMER_SUCCESS", payload: updatelist })
    }
    if (payloadData.redeem) {
      const res = await axios.post(`${APIs.baseURL}/reward-service/v1/redeempoint/${userInfo.manufacturerCode}`, payloadData.values,headers)
      updateCustomerListHandler(res.data)
    } else {
      const res = await axios.post(`${APIs.baseURL}/reward-service/v1/customer-reward/${userInfo.manufacturerCode}`, payloadData.values,headers)
      updateCustomerListHandler(res.data)
    }
  } catch (err) {
    dispatch({ type: "VIWE_CUSTOMER_FAIL", payload: err.responce && err.responce.data.message ? err.responce.data.message : err.message })
  }
}

export const recentTransaction = async (payloadData) => {
  const res = await axios.get(`${APIs.baseURL}/reward-service/v1/transctions/customer/${payloadData.key}`,headers)
  return res.data
}

export const getRewardInfo = () => async (dispatch) => {
  try {
    dispatch({ type: "REWARD_INFO"});
    const { data } = await axios.get(`${APIs.baseURL}/reward-service/v1/rewardInfo/${userInfo.manufacturerCode}`,headers);
    dispatch({ type: "REWARD_INFO_SUCCESS", payload: data });
  } catch (err) {
    dispatch({
      type: "REWARD_INFO_FAIL",
      payload:
        err.responce && err.responce.data.message
          ? err.responce.data.message
          : err.message,
    });
  }
};
