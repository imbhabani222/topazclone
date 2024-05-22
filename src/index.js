import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter } from "react-router-dom"
import "./index.css"
import App from "./App.js"
// import { store } from './app/store';
import { Provider } from "react-redux"
import * as serviceWorker from "./serviceWorker"
import "antd/dist/antd.css"
import { createStore, combineReducers, applyMiddleware } from "redux"
import thunk from "redux-thunk"

import { composeWithDevTools } from "redux-devtools-extension"

import {
  formDataReducer,
  userloginreducer,
  userregisterreducer,
  manufecturelistreducer,
  getSingleManufactureReducer,
  generateLinkReducer,
  addUserReducer,
  listUserReducer,
  createPasswordReducer,
  settingReducer,
  addProductReducer,
  viewProductReducer,
  updateProductReducer,
  profileReducer,
  singeProductDetailsReducer,
  editPriceReducer,
  stockAndThresholdReducer,
  //addUserUpdateReducer,
  viewCategory,
  editCategoryReducer,
  addCategoryReducer,
  updatePaymentReducer,
  //addUserUpdateReducer,
  viewCutomerReducer,
  customerOnboardReducer,
  ViewSpecificCustomerReducer,
  EditSpecificCustomerReducer,
  discountDataReducer,
  AdevertisementDataReducer,
  formTabKeyReducer,
  ordSumReducer,
  useronbordmanufectures,
  emailReducer,
  emailidReducer,
  bredCurmReducer,
  getOrderListReducer,
  priorityStatusUpdateReducer,
  orderStatusUpdateReducer,
  paymentStatusUpdateReducer,
  getPriorityStatusReducer,
  getPaymentStatusReducer,
  getOrderStatusReducer,
  deleteOrderItemsReducer,
  manufacturerConversationreducer,
  getManufacturerConversationReducer,
  accountDetailsReducer,
  dashboardSalesReducer,
  onSendNotificationTokenReducer,
  onGetNotificationsReducer,
  getAllNotificationsReducer,
  getRewardSetPointReducer,
  getRewardInfoReducer
} from "../src/reducer/userreducer"
import { editprice } from "./action/useraction"

// import { editCategory } from "./action/useraction";
let reducer = combineReducers({
  userlogin: userloginreducer,
  userregister: userregisterreducer,
  formData: formDataReducer,
  manufecture: manufecturelistreducer,
  singleManufacture: getSingleManufactureReducer,
  generatedLink: generateLinkReducer,
  addUser: addUserReducer,
  listUser: listUserReducer,
  createPasswordInfo: createPasswordReducer,
  settingInfo: settingReducer,
  addProduct: addProductReducer,
  viewProduct: viewProductReducer,
  updateProduct: updateProductReducer,
  // profileInfo: profileReducer,
  singleProduct: singeProductDetailsReducer,
  editPrice: editPriceReducer,
  stockAndThreshold: stockAndThresholdReducer,
  category: viewCategory,
  editCategory: editCategoryReducer,
  addCategory: addCategoryReducer,
  viewPorduct: viewProductReducer,
  profileInfo: profileReducer,
  updatePaymentInfo: updatePaymentReducer,
  //profileUpdate: addUserUpdateReducer,
  customerOnboard: customerOnboardReducer,
  viewCustomer: viewCutomerReducer,
  viewCutomer: viewCutomerReducer,
  viewSpecificCustomer: ViewSpecificCustomerReducer,
  updateCustomer: EditSpecificCustomerReducer,
  discountData: discountDataReducer,
  // viewCustomer: viewCutomerReducer,
  viewCutomer: viewCutomerReducer,
  viewSpecificCustomer: ViewSpecificCustomerReducer,
  updateCustomer: EditSpecificCustomerReducer,
  updateAdvertisemet: AdevertisementDataReducer,
  vieandOnboard: formTabKeyReducer,
  summary: ordSumReducer,
  onBordman: useronbordmanufectures,
  emaildata: emailReducer,
  emailid: emailidReducer,
  bredCurm: bredCurmReducer,
  getOrderList: getOrderListReducer,
  getOrderStatus: getOrderStatusReducer,
  getPaymentStatus: getPaymentStatusReducer,
  getPriorityStatus: getPriorityStatusReducer,
  OrderStatusUpdate: orderStatusUpdateReducer,
  paymentStatusUpdate: paymentStatusUpdateReducer,
  priorityStatusUpdate: priorityStatusUpdateReducer,
  deleteOrderItems: deleteOrderItemsReducer,
  sentConversation: manufacturerConversationreducer,
  getConversation: getManufacturerConversationReducer,
  accountDetails: accountDetailsReducer,
  getNotifications: onGetNotificationsReducer,
  sendNotificationToken: onSendNotificationTokenReducer,
  getAllNotificationsReducer:getAllNotificationsReducer,
  getRewardSetPointReducer:getRewardSetPointReducer,
  getRewardInfoReducer:getRewardInfoReducer,
  // dashboardSalesReducer:dashboardSalesReducer,
    //profileUpdate: addUserUpdateReducer
})
let userinfofromstorage = localStorage.getItem("userinfo")
  ? JSON.parse(localStorage.getItem("userinfo"))
  : null
let intialstate = {
  userlogin: { userinfo: userinfofromstorage },
}
let middleware = [thunk]
let store = createStore(
  reducer,
  intialstate,
  composeWithDevTools(applyMiddleware(...middleware))
)

ReactDOM.render(
  // <BrowserRouter>
  //   <App />
  // </BrowserRouter>,
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter basename="/">
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
