
import React, { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import MasterLayout from "./components/masterLayout/masterLayout.js"
import MasterLayoutProduct from "./components/masterLayout/masterLayoutProduct.js"
import CreatePassword from "./pages/createpassword/createpassword.js"
import Login from "./pages/login/login"
import ManufacturerTabs from "./pages/ManufacturerTabs/ManufacturerTabs"
import UserManagement from "./pages/UserManagement/UserManagement"
import Setting from "./pages/setting/setting"
import ProductPreviewQR from "./pages/ProductPreviewQR/ProductPreviewQR.js"
//import PODashboard from "./pages/Product_owner_pages/Product_Dashboard/PODashboard.js";
//import DonutPo from "./pages/Product_owner_pages/Product_Dashboard/DonutPo.js";
import MainContainer from "./pages/Product_owner_pages/Product_Dashboard/MainContainer.js"
import PastOrderSummary from "./pages/OrderSection/PastOrderSummaryPage"
import "./App.css"
// import Chathere from "./pages/ChatBot/Chathere.js";
import "antd/dist/antd.css"
import CategoryTab from "./components/CategoryTab/CategoryTab"
// import ViewManufacturer from "./pages/ViewManufacturer/ViewManufacturer.js";
import DiscountsAndOffersTab from "./components/DiscountsAndOffersTab/DiscountsAndOffers.js"
import OrdersTab from "./components/OrdersTab/OrdersTab.js"
import CustomerOnboarding from "./pages/customer_onboarding/customer_onboarding"
import Profile from "./pages/profile/profile"
// import EditPrice from "./pages/product_popup/edit_price.js";
import ForgotPwd from "./pages/ForgotPassword/forgotPwd"
import AddProduct from "./pages/product/AddProduct"
import UpdateProduct from "./pages/product/UpdateProduct"
import Advertisement from "./components/AdvertisementTab/AdvertisementTab"
import ViewCustomers from "./pages/ViewCustomers/ViewCustomers"
// import ProfileModal from "./pages/ProfileForm/ProfileModal.js";
//import AdvDetails from "./pages/AdvDetails/AdvDetails"
import ViewAdvertisement from "./components/AdvertisementTab/ViewAdvertisement"
import SetPassword from "./pages/SetPassword/SetPassword.js"
import CheckEmail from "./pages/CheckoutYourEmail/CheckEmail.js"
import PasswordRest from "./pages/PasswrodReset/PasswrodReset.js"
import AccountSuccess from "./pages/SuccessAccoutnCreation/AccountSuccess.js"
import ECatelogueTab from "./pages/ecatelogue/eCatelogueTab.js"
import { useDispatch } from "react-redux"
import Notifications from "./pages/Notifications/Notifications.js"
import { requestForToken } from "./utill/firebase.js"
import RewardsTab from "./pages/reawards/RewardsTabs.js"


function App() {
  let navigate = useNavigate()
  const location = useLocation()
  const { pathname } = location
  const subDirectoryUrl = pathname.split("/")[1]
  const userInfo = JSON.parse(localStorage.getItem("userinfo"))
  function callback(key) {
    console.log(key)
  }
  useEffect(() => {
    console.log("userinfo-----",userInfo)
    console.log(subDirectoryUrl)
    if (!userInfo || subDirectoryUrl !== "product-preview-qr" && subDirectoryUrl === "set-password") {
      console.log(subDirectoryUrl)
      navigate("/login")
    }
    console.log(subDirectoryUrl)
    const getToken = requestForToken()
    console.log(getToken, "getToken")
  }, [])
  

  return (
    <div className="App">
      <Routes>
        <Route
          path="/onboard-manufactures"
          element={
            <MasterLayout>
              <ManufacturerTabs />
            </MasterLayout>
          }
        />
        <Route
          path="/user-management"
          element={
            <MasterLayout>
              <UserManagement />
            </MasterLayout>
          }
        />
        <Route
          path="/view-manufacturers"
          element={
            <MasterLayout>
              <ManufacturerTabs />
            </MasterLayout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <MasterLayoutProduct>
              <MainContainer />
            </MasterLayoutProduct>
          }
        />
        <Route
          path="/customer-onboarding"
          element={
            <MasterLayoutProduct>
              <CustomerOnboarding />
            </MasterLayoutProduct>
          }
        />
        <Route
          path="/viewcustomers"
          element={
            <MasterLayoutProduct>
              <ViewCustomers />
            </MasterLayoutProduct>
          }
        />
        <Route
          path="/PastOrderSummary"
          element={
            <MasterLayoutProduct>
              <PastOrderSummary />
            </MasterLayoutProduct>
          }
        />
        {/* <Route
            path="/profilemodal"
            element={
              <MasterLayoutProduct>
                <ProfileModal />
              </MasterLayoutProduct>
            }
          /> */}

        <Route
          path="/view-advertisement"
          element={
            <MasterLayoutProduct>
              <ViewAdvertisement />
            </MasterLayoutProduct>
          }
        />

        <Route
          path="/category"
          element={
            <MasterLayoutProduct>
              <CategoryTab />
            </MasterLayoutProduct>
          }
        />

        <Route
          path="/discountsandoffers"
          element={
            <MasterLayoutProduct>
              <DiscountsAndOffersTab />
            </MasterLayoutProduct>
          }
        />
        <Route
          path="/advertisement"
          element={
            <MasterLayoutProduct>
              <Advertisement />
            </MasterLayoutProduct>
          }
        />

        <Route
          path="/orders"
          element={
            <MasterLayoutProduct>
              <OrdersTab />
            </MasterLayoutProduct>
          }
        />

        <Route
          path="/profile"
          element={
            <MasterLayoutProduct>
              <Profile />
            </MasterLayoutProduct>
          }
        />
        <Route
          path="/ecatalogue"
          element={
            <MasterLayoutProduct>
              <ECatelogueTab />
            </MasterLayoutProduct>
          }
        />
        <Route
          path="/rewards"
          element={
            <MasterLayoutProduct>
              <RewardsTab />
            </MasterLayoutProduct>
          }
        />

        <Route
          path="/notifications"
          element={
            <MasterLayoutProduct>
              <Notifications />
            </MasterLayoutProduct>
          }
        />

        <Route path="*" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/forgot-pwd" element={<ForgotPwd />} />
        <Route path="/create-password" element={<CreatePassword />} />
        <Route path="/setting" element={<Setting />}></Route>
        {/* <Route path="/add-product" element={<AddProduct />} /> */}
        {/* <Route path="/edit-product" element={<UpdateProduct />} /> */}
        <Route path="/set-passwrod" element={<SetPassword />} />
        <Route path="/check-email" element={<CheckEmail />} />
        <Route path="/password-rest" element={<PasswordRest />} />
        <Route path="/account-success" element={<AccountSuccess />} />
        <Route
          path={`/product-preview-qr/:id`}
          element={<ProductPreviewQR />}
        />
      </Routes>
    </div>
  )
}

export default App
