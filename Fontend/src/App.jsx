import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./Components/Header/Header";
import Content from "./Components/Content/Content";
import Footer from "./Components/Footer/Footer";
import SearchByCate from "./Components/Features/ProductSearch/Cate";
import UserSearch from "./Components/Features/ProductSearch/UserSearch";
import NotFound from "./Components/Features/NotFound/NotFound";
import Section_1 from "./Components/Content/Section_1";
import ShowAllSection_3 from "./Components/PageOther/ShowAllSection3";
import ItemDetail from "./Components/PageOther/ItemDetail/ItemDetail";
import CompareIngredients from "./Components/PageOther/CompareIngredients";
import Login from "./Components/PageOther/Auth/Login";
import Register from "./Components/PageOther/Auth/Register";
import Verify from "./Components/PageOther/Auth/Email/Verify";
import User from "./Components/PageOther/Users/User";
import InformationOrders from "./Components/PageOther/informationOrders";
import ZaloPay from "./Components/PageOther/ResultPayment/ZaloPay";
import VNPayResult from "./Components/PageOther/ResultPayment/VNPayResult";
import MomoResult from "./Components/PageOther/ResultPayment/MomoResult";
import Above from "./Components/Footer/AboveFooter";
import HeartPage from "./Components/PageOther/HeartPage";
import CouponUser from "./Components/PageOther/CouponUser";
import OrderCart from "./Components/PageOther/OrderCart";
import UserNeedCare from "./Components/Features/CustomerCare/UserNeedCare";
import CustomerCare from "./Components/Features/CustomerCare/CustomerCare";
import CheckoutOrders from "./Components/PageOther/CheckoutOrders";
import ZaloPayCart from "./Components/PageOther/ResultPayment/ZaloPayCart";
import VNPayResultCart from "./Components/PageOther/ResultPayment/VNPayResultCart";
import MomoResultCart from "./Components/PageOther/ResultPayment/MomoResultCart";
function App() {
  return (
    <Router>
      <div style={{ background: "#f4f1ea" }}>
        <Routes>
          <Route
            path="/fast-foods"
            element={
              <>
                <Header />
                <Content />
                <Above />
                <Footer />
              </>
            }
          />
          <Route
            path="/productByCate"
            element={
              <>
                <Header />
                <SearchByCate />
                <Footer />
              </>
            }
          />

          <Route
            path="/userSearch"
            element={
              <>
                <Header />
                <UserSearch />
                <Footer />
              </>
            }
          />
          <Route path="/notFile" element={<NotFound />} />

          <Route
            path="/section3/showAll"
            element={
              <>
                <Header />
                <span className="hidden md:block">
                  <Section_1 />
                </span>
                <ShowAllSection_3 />
                <Footer />
              </>
            }
          />

          <Route
            path="/item/detail/:slug"
            element={
              <>
                <Header />
                <ItemDetail />
                <Footer />
              </>
            }
          />

          <Route
            path="/compare/ingredients"
            element={
              <>
                <Header />
                <CompareIngredients />
                <Footer />
              </>
            }
          />

          <Route
            path="auth/login"
            element={
              <>
                <Header />
                <Login />
                <Footer />
              </>
            }
          />
          <Route
            path="auth/register"
            element={
              <>
                <Header />
                <Register />
                <Footer />
              </>
            }
          />
          <Route
            path="auth/otp"
            element={
              <>
                <Header />
                <Verify />
                <Footer />
              </>
            }
          />
          <Route
            path="/user"
            element={
              <>
                <Header />
                <User />
                <Footer />
              </>
            }
          />
          <Route
            path="/user-heart"
            element={
              <>
                <Header />
                <HeartPage />
                <Footer />
              </>
            }
          />
          <Route
            path="/user-coupon"
            element={
              <>
                <Header />
                <CouponUser />
                <Footer />
              </>
            }
          />

          <Route
            path="/user-cart"
            element={
              <>
                <Header />
                <OrderCart />
                <Footer />
              </>
            }
          />
          {/**buy now */}
          <Route path="/information-orders" element={<InformationOrders />} />
          <Route path="/result-zaloPay" element={<ZaloPay />} />
          <Route path="/result-vnPay" element={<VNPayResult />} />
          <Route path="/result-momo" element={<MomoResult />} />

          {/**buy cart */}
          <Route path="/cart-orders" element={<CheckoutOrders />} />
          <Route path="/result-zaloPay-cart" element={<ZaloPayCart />} />
          <Route path="/result-vnPay-cart" element={<VNPayResultCart />} />
          <Route path="/result-momo-cart" element={<MomoResultCart />} />

          <Route path="/cskh" element={<CustomerCare />} />
          <Route
            path="user-cskh"
            element={
              <>
                <Header />
                <UserNeedCare />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
