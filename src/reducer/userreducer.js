// import { RedditSquareFilled, SwapRightOutlined } from "@ant-design/icons";
// import { act } from "react-dom/test-utils";
import { RedditSquareFilled } from "@ant-design/icons";
import { act } from "react-dom/test-utils";
import { ReactReduxContext } from "react-redux";
// import { act } from "react-dom/test-utils";



export let userloginreducer = (state = {}, action) => {
  switch (action.type) {
    case "USER_LOGIN_REQUEST":
      return { loading: true };
    case "USER_LOGIN_SUCCESS":
      return { loading: false, userinfo: action.payload };
    case "USER_LOGIN_FAIL":
      return { loading: false, error: action.payload };

    case "USER_LOGOUT":
      return {};
    default:
      return state;
  }
};

export let emailReducer = (state = {}, action) => {
  switch (action.type) {
    case "EMAIL_REQUEST":
      return { loading: true };
    case "EMAIL_SUCCESS":
      return { loading: false, emailinfo: action.payload };
    case "EMAIL_FAIL":
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export let userregisterreducer = (state = {}, action) => {
  switch (action.type) {
    case "USER_REGISTER_REQUEST":
      return { loading: true };
    case "USER_REGISTER_SUCCESS":
      return { loading: false, userinfo: action.payload };
    case "USER_REGISTER_FAIL":
      return { loading: false, error: action.payload };

    case "USER_LOGOUT":
      return {};
    default:
      return state;
  }
};
export let useronbordmanufectures = (state = {loading:false}, action) => {
  switch (action.type) {
    case "USER_ONBORDMANUFECTURES_REQUEST":
      return { loading: true };
    case "USER_ONBORDMANUFECTURES_SUCCESS":
      return { loading: false, passwordToken: action.payload };
    case "USER_ONBORDMANUFECTURES_FAIL":
      return { loading: false, error: action.payload };

    case "USER_LOGOUT":
      return {};
    default:
      return state;
  }
};

export const formDataReducer = (state = {}, action) => {
  switch (action.type) {
    case "SET_FORM_DATA":
      return { data: action.payload };
    default:
      return state;
  }
};

export const bredCurmReducer = (state = {}, action) => {
  switch (action.type) {
    case "BREDCRUM_KEY":
      return { data: action.payload };
    default:
      return state;
  }
};

export const formTabKeyReducer = (state = {}, action) => {
  switch (action.type) {
    case "SET_TAB_KEY":
      return { data: action.payload };
    default:
      return state;
  }
};

export const emailidReducer = (state = {}, action) => {
  switch (action.type) {
    case "EMAILID":
      return { data: action.payload };
    default:
      return state;
  }
};

export const ordSumReducer = (state = {}, action) => {
  switch (action.type) {
    case "SET_ORDER_DATA":
      return { data: action.payload };
    default:
      return state;
  }
};
export let manufecturelistreducer = (state = {}, action) => {
  switch (action.type) {
    case "MANUFECTURE_LIST_REQUEST":
      return { loading: true };
    case "MANUFECTURE_LIST_SUCCESS":
      return { loading: false, manufectureinfo: action.payload };
    case "MANUFECTURE_LIST_FAIL":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
export let getSingleManufactureReducer = (state = {}, action) => {
  switch (action.type) {
    case "SINGLE_MANUFACTURE_DETAILS":
      return { loading: true };
    case "SINGLE_MANUFACTURE_SUCCESS":
      return { loading: false, manufectureinfo: action.payload };
    case "SINGLE_MANUFACTURE_FAIL":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
export let generateLinkReducer = (state = {}, action) => {
  switch (action.type) {
    case "GENERATE_LINK":
      return { loading: true };
    case "GENERATE_LINK_SUCCESS":
      return { loading: false, generatedLink: action.payload };
    case "GENERATE_LINK_FAIL":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
export let sendLinkReducer = (state = {}, action) => {
  switch (action.type) {
    case "SEND_LINK":
      return { loading: true };
    case "SEND_LINK_SUCCESS":
      return { loading: false, generatedLink: action.payload };
    case "SEND_LINK_FAIL":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
export let addUserReducer = (state = {}, action) => {
  switch (action.type) {
    case "ADD_USER":
      return { loading: true };
    case "ADD_USER_SUCCESS":
      return { loading: false, addUserResponse: action.payload };
    case "ADD_USER_FAIL":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export let addCategoryReducer = (state = {}, action) => {
  switch (action.type) {
    case "ADD_CATEGORY":
      return { loading: true };
    case "ADD_CATEGORY_SUCCESS":
      return { loading: false, addCategoryResponse: action.payload };
    case "ADD_CATEGORY_FAIL":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export let listUserReducer = (state = {}, action) => {
  switch (action.type) {
    case "LIST_USER":
      return { loading: true };
    case "LIST_USER_SUCCESS":
      return { loading: false, listUserResponse: action.payload };
    case "LIST_USER_FAIL":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
export let createPasswordReducer = (state = {}, action) => {
  switch (action.type) {
    case "CREATE_PASSWORD":
      return { loading: true };
    case "CREATE_PASSWORD_SUCCESS":
      return { loading: false, createPasswordResponse: action.payload };
    case "CREATE_PASSWORD_FAIL":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
export let profileReducer = (state = {}, action) => {
  switch (action.type) {
    case "PROFILE_REDUCER":
      return { loading: true };
    case "PROFILE_REDUCER_SUCCESS":
      return { loading: false, profileReducerResponse: action.payload };
    case "PROFILE_REDUCER_FAIL":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export let updateUserReducer = (state = {}, action) => {
  switch (action.type) {
    case "UPDATE_USER":
      return { loading: true };
    case "UPDATE_USER_SUCCESS":
      return { loading: false, updateUserResponse: action.payload };
    case "UPDATE_USER_FAIL":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export let settingReducer = (state = {}, action) => {
  switch (action.type) {
    case "SETTING":
      return { loading: true };
    case "SETTING_SUCCESS":
      return { loading: false, settingResponse: action.payload };
    case "SETTING_FAIL":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

/**********************************Product ************************** */

export let addProductReducer = (state = {}, action) => {
  switch (action.type) {
    case "ADD_PRODUCT":
      return { loading: true };
    case "ADD_PRODUCT_SUCCESS":
      return { loading: false, addProductResponse: action.payload };
    case "ADD_PRODUCT_FAIL":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
/******************* Product Owner Reducerss  ***********************/

// export let productownerloginreducer=(state={},{type,payload}) => {
//   switch (type){
//     case "PRODUCT_OWNER_LOGIN_REQUEST":
//       return { loading:true};
//     case "PRODUCT_OWNER_LOGIN_SUCCESS":
//       return {loading:false,userinfo:payload};
//     case "PRODUCT_OWNER_LOGIN_FAIL":
//       return {loading:false,error:payload};
//     case "PRODUCT_OWNER_LOGOUT":
//       return {};
//     default:
//       return state;
//   }
// };

export let viewCategory = (state = {}, action) => {
  switch (action.type) {
    case "VIEW_CATEGORY":
      return { loading: true };
    case "VIEW_CATEGORY_SUCCESS":
      return { loading: false, viewCategoryResponse: action.payload };
    case "VIEW_CATEGORY_FAIL":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
export let editCategoryReducer = (state = {}, action) => {
  switch (action.type) {
    case "EDIT_CATEGORY":
      return { loading: true };
    case "EDIT_CATEGORY_SUCCESS":
      return { loading: false, editCategoryResponse: action.payload };
    case "EDIT_CATEGORY_FAIL":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export let viewProductReducer = (state = {}, action) => {
  switch (action.type) {
    case "VIEW_PRODUCT":
      return { loading: true };
    case "VIEW_PRODUCT_SUCCESS":
      return { loading: false, viewProductResponse: action.payload };
    case "VIEW_PRODUCT_FAIL":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export let updateProductReducer = (state = {}, action) => {
  switch (action.type) {
    case "UPDATE_USER":
      return { loading: true };
    case "UPDATE_USER_SUCCESS":
      return { loading: false, updateProductResponse: action.payload };
    case "UPDATE_USER_FAIL":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export let singeProductDetailsReducer = (state = {}, action) => {
  switch (action.type) {
    case "SINGLE_PRODUCT_DETAILS":
      return { loading: true };
    case "SINGLE_PRODUCT_DETAILS_SUCCESS":
      return { loading: false, singleProductResponse: action.payload };
    case "SINGLE_PRODUCT_DETAILS_FAIL":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export let editPriceReducer = (state = {}, action) => {
  switch (action.type) {
    case "EDIT_PRICE":
      return { loading: true };
    case "EDIT_PRICE_SUCCESS":
      return { loading: false, editPriceResponse: action.payload };
    case "EDIT_PRICE_FAIL":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export let stockAndThresholdReducer = (state = {}, action) => {
  switch (action.type) {
    case "STOCK_THRESHOLD":
      return { loading: true };
    case "STOCK_THRESHOLD_SUCCESS":
      return { loading: false, editPriceResponse: action.payload };
    case "STOCK_THRESHOLD_FAIL":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// export let addUserUpdateReducer = (state = {}, action) => {
//   switch(action.type) {
//     case "ADDUSERUPDATE_REDUCER" :
//       return { loading: true};
//       case "ADDUSERUPDATE_REDUCER_SUCCESS" :
//         return { loading: false, addUserUpdateResponse: action.payload};
//       case "ADDUSERUPDATE_REDUCER_FAIL" :
//         return { loading: false, error: action.payload}
//       default:
//       return state;
//   }
// }

export let updatePaymentReducer = (state = {}, action) => {
  switch (action.type) {
    case "UPDATE_PAYMENT":
      return { loading: true };
    case "UPDATE_PAYMENT_SUCCESS":
      return { loading: false, updatePaymentResponse: action.payload };
    case "UPDATE_PAYMENT_FAIL":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export let customerOnboardReducer = (state = {}, action) => {
  switch (action.type) {
    case "CUSTOMER_ONBOARD_REDUCER":
      return { loading: true };
    case "CUSTOMER_ONBOARD_REDUCER_SUCCESS":
      return { loading: false, customerOnboardResponse: action.payload };
    case "CUSTOMER_ONBOARD_REDUCER_FAIL":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
/***************************************Customer************************************************ */

export let viewCutomerReducer = (state = {}, action) => {
  switch (action.type) {
    case "VIWE_CUSTOMER":
      return { loading: true };
    case "VIWE_CUSTOMER_SUCCESS":
      return { loading: false, viewCutomerResponse: action.payload };
    case "VIWE_CUSTOMER_FAIL":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};


export let ViewSpecificCustomerReducer = (state = {}, action) => {
  switch (action.type) {
    case "VIEW_SPECIFIC_CUSTOMER":
      return { loading: true };
    case "VIEW_SPECIFIC_CUSTOMER_SUCCESS":
      return { loading: false, viewSpecificCutomerResponse: action.payload };
    case "VIEW_SPECIFIC_CUSTOMER_FAIL":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export let EditSpecificCustomerReducer = (state = {}, action) => {
  switch (action.type) {
    case "EDIT_CUSTOMER":
      return { loading: true };
    case "EDIT_CUSTOMER_SUCCESS":
      return { loading: false, viewSpecificCutomerResponse: action.payload };
    case "EDIT_CUSTOMER_FAIL":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const discountDataReducer = (state = {}, action) => {
  switch (action.type) {
    case "SET_DISCOUNT_DATA":
      return { data: action.payload };
    default:
      return state;
  }
};
export const AdevertisementDataReducer = (state = {}, action) => {
  switch (action.type) {
    case "SET_Adevertisement_DATA":
      return { data: action.payload };
    default:
      return state;
  }
};

export const getOrderListReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_ORDER_LIST":
      return { loading: true };
    case "GET_ORDER_LIST_SUCCESS":
      return { loading: false, resultData: action.payload };
    case "GET_ORDER_LIST_FAIL":
      return { loading: false, error: action.payload };
    case "GET_ORDER_LIST_CLEAR":
      return { loading: false, resultData: [] };
    default:
      return state;
  }
}
export const getOrderStatusReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_ORDER_STATUS":
      return { loading: true };
    case "GET_ORDER_STATUS_SUCCESS":
      return { loading: false, resultData: action.payload };
    case "GET_ORDER_STATUS_FAIL":
      return { loading: false, error: action.payload };
    case "GET_ORDER_STATUS_CLEAR":
      return { loading: false, resultData: [] };
    default:
      return state;
  }
}

export const getPaymentStatusReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_PAYMENT_STATUS":
      return { loading: true };
    case "GET_PAYMENT_STATUS_SUCCESS":
      return { loading: false, resultData: action.payload };
    case "GET_PAYMENT_STATUS_FAIL":
      return { loading: false, error: action.payload };
    case "GET_PAYMENT_STATUS_CLEAR":
      return { loading: false, resultData: [] };
    default:
      return state;
  }
}

export const getPriorityStatusReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_PRIORITY_STATUS":
      return { loading: true };
    case "GET_PRIORITY_STATUS_SUCCESS":
      return { loading: false, resultData: action.payload };
    case "GET_PRIORITY_STATUS_FAIL":
      return { loading: false, error: action.payload };
    case "GET_PRIORITY_STATUS_CLEAR":
      return { loading: false, resultData: [] };
    default:
      return state;
  }
}

export const orderStatusUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case "ORDER_STATUS_UPDATE_SUCCESS":
      return { loading: false, resultData: action.payload };
    case "ORDER_STATUS_UPDATE_FAIL":
      return { loading: false, error: action.payload };
    case "ORDER_STATUS_UPDATE_CLEAR":
      return { loading: false, resultData: null };
    default:
      return state;
  }
}

export const paymentStatusUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case "PAYMENT_STATUS_UPDATE_SUCCESS":
      return { loading: false, resultData: action.payload };
    case "PAYMENT_STATUS_UPDATE_FAIL":
      return { loading: false, error: action.payload };
    case "PAYMENT_STATUS_UPDATE_CLEAR":
      return { loading: false, resultData: null };
    default:
      return state;
  }
}

export const priorityStatusUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case "PRIORITY_STATUS_UPDATE_SUCCESS":
      return { loading: false, resultData: action.payload };
    case "PRIORITY_STATUS_UPDATE_FAIL":
      return { loading: false, error: action.payload };
    case "PRIORITY_STATUS_UPDATE_CLEAR":
      return { loading: false, resultData: null };
    default:
      return state;
  }
}

export const deleteOrderItemsReducer = (state = {}, action) => {
  switch (action.type) {
    case "DELETE_ORDER_ITEM":
      return { loading: true };
    case "DELETE_ORDER_ITEM_SUCCESS":
      return { loading: false, resultData: action.payload };
    case "DELETE_ORDER_ITEM_FAIL":
      return { loading: false, error: action.payload };
    case "DELETE_ORDER_ITEM_CLEAR":
      return { loading: false, resultData: null };
    default:
      return state;
  }
}

export const manufacturerConversationreducer = (state = {}, action) => {
  switch (action.type) {
    case "SENT_MANUFACTURER_CONVERSATION":
      return { loading: true };
    case "SENT_MANUFACTURER_CONVERSATION_SUCCESS":
      return { loading: false, resultData: action.payload };
    case "SENT_MANUFACTURER_CONVERSATION_FAIL":
      return { loading: false, error: action.payload };
    case "SENT_MANUFACTURER_CONVERSATION_CLEAR":
      return { loading: false, resultData: null };
    default:
      return state;
  }
}

export const getManufacturerConversationReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_MANUFACTURER_CONVERSATION":
      return { loading: true };
    case "GET_MANUFACTURER_CONVERSATION_SUCCESS":
      return { loading: false, resultData: action.payload };
    case "GET_MANUFACTURER_CONVERSATION_FAIL":
      return { loading: false, error: action.payload };
    case "GET_MANUFACTURER_CONVERSATION_CLEAR":
      return { loading: false, resultData: null };
    case "DELETE_MESSAGE_MANUFACTURER_SUCCESS":
      return { loading: false, resultData: action.payload };
    case "DELETE_MESSAGE_MANUFACTURER_FAIL":
      return { loading: false, error: action.payload };
    case "EDIT_MESSAGE_MANUFACTURER_SUCCESS":
      return { loading: false, resultData: action.payload };
    case "EDIT_MESSAGE_MANUFACTURER_FAIL":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

export const accountDetailsReducer = (state = {}, action) => {
  switch (action.type) {
    case "BANKDETAIL_ACTION":
      return { loading: true };
    case "GET_BANKDETAIL_SUCCESS":
      return { loading: false, data: action.payload.data }
    case "GET_BANKDETAIL_FAIL":
      return { loading: false, error: action.payload };
    case "UPDATE_BANKDETAIL_SUCCESS":
      return { loading: false, data: action.payload };
    case "UPDATE_BANKDETAIL_FAIL":
      return { loading: false, error: action.payload };
    case "BANKDETAIL_DELETE_SUCCESS":
      return { loading: false, data: action.payload };
    case "BANKDETAIL_DELETE_Fail":
      return { loading: false, error: action.payload };
    case "BANKDETAIL_ADD_SUCCESS":
      return { loading: false, data: action.payload };
    case "BANKDETAIL_ADD_Fail":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}
// export const dashboardSalesReducer = (state = {}, action) => {
//   switch (action.type) {
//     case "CHART_SALES_ACTION":
//       return { loading: true };
//     case "GET_CHART_SALES_SUCCESS":
//       console.log(action.payload)
//       return { loading: false, dashboardChart: action.payload}
//     case "GET_CHART_SALES_FAIL":
//       return { loading: false, error: action.payload };
//     default:
//       return state;
//   }
// }

export const onSendNotificationTokenReducer = (state = {}, action) => {
  switch (action.type) {
    case "SEND_NOTIFICATION_TOKEN":
      return { loading: true };
    case "SEND_NOTIFICATION_TOKEN_SUCCESS":
      return { loading: false, resultData: action.payload };
    case "SEND_NOTIFICATION_TOKEN_FAIL":
      return { loading: false, error: action.payload };
    case "SEND_NOTIFICATION_TOKEN_FAIL_CLEAR":
      return { loading: false, resultData: null };
    default:
      return state;
  }
}

export const onGetNotificationsReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_NOTIFICATION":
      return { loading: true };
    case "GET_NOTIFICATION_SUCCESS":
      return { loading: false, resultData: action.payload };
    case "GET_NOTIFICATION_FAIL":
      return { loading: false, error: action.payload };
    case "GET_NOTIFICATION_FAIL_CLEAR":
      return { loading: false, resultData: null };
    default:
      return state;
  }
}
export const getAllNotificationsReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_ALL_NOTIFICATION":
      return { loading: true };
    case "GET_ALL_NOTIFICATION_SUCCESS":
      return { loading: false, resultData: action.payload };
    case "GET_ALL_NOTIFICATION_FAIL":
      return { loading: false, error: action.payload };
    // case "NOTIFICATION_READ":
    //   return { loading: true };
    // case "NOTIFICATION_READ_SUCCESS":
    //   return { loading: false, resultData: action.payload };
    // case "NOTIFICATION_READ_FAIL":
    //   return { loading: false, error: action.payload };
    // case "GET_ALL_NOTIFICATION_FAIL_CLEAR":
    //   return { loading: false, resultData: null };

    default:
      return state;
  }
}

export const getRewardSetPointReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_REWARDSETUPPOINTS":
      return { loading: true };
    case "GET_REWARDSETUPPOINTS_SUCCESS":
      return { loading: false, data: action.payload };
    case "GET_REWARDSETUPPOINTS_FAIL":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}


export const getRewardInfoReducer = (state = {}, action) => {
  switch (action.type) {
    case "REWARD_INFO":
      return { loadingreward: true };
    case "REWARD_INFO_SUCCESS":
      return { loadingreward: false, rewardInfo: action.payload };
    case "REWARD_INFO_FAIL":
      return { loadingreward: false, error: action.payload };
    default:
      return state
  }
}