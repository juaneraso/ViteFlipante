import React from "react";
import { Routes, Route } from "react-router-dom";
import Detail from "./views/Detail/Detail.jsx";
import Home from "./views/home/home.component.jsx";
import CartView from "./views/cart/cartView.jsx";
import Registro from "./Components/RegisterUser/registerUser.component.jsx";
import LoginForm from "./Components/Login/LoginForm.component.jsx";
import UserProfile from "./Components/userProfile/userProfile.jsx";
import Orders from "./Components/Orders/Orders.jsx";
import Favorites from "./Components/Favorites/Favorites.jsx";
import ChangePassword from "./Components/ChangePassword/ChangePassword.jsx";
import ProductList from "./Components/ProductList/ProductList.component.jsx";
import DashboardAdmin from "./views/dashboardAdmin/dashboardAdmin.jsx";
import CreateForm from "./Components/CreateForm/CreateForm.jsx";
import Banned from "./Components/BannedList/Banned.jsx";
import UserList from "./Components/UserList/UserList.jsx";
import DetailOrder from "./views/DetailOrder/DetailOrder.jsx";
import UserReviews from "./Components/Reviews/UserReviews.jsx";
import Review from "./views/Review/Review.jsx";
import About from "./Components/About/About.jsx";
import CreateProduct from "./views/create/create.view.jsx";
import Checkout from "./views/Checkout/Checkout.jsx";
import Vista from "./Components/firebase/Autentication.jsx";
import PasswordReset from "./Components/resetPAssword/ResetPAssword.jsx";
import ModifyPassword from "./Components/resetPAssword/ModifyPassword.jsx";
import DeletedProductList from "./Components/DeletedProductList/DeletedProductList.jsx";
import ReviewsList from "./Components/Reviews/ReviewsList.jsx";
import OrdersList from "./Components/Orders/OrdersList.jsx";
import "./App.css";

import BadURL from "./views/badURL/BadURL.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/detail/:id" element={<Detail />} />
      <Route path="/create" element={<CreateProduct />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<Registro />} />
      <Route path="/userProfile" element={<UserProfile />} />
      <Route path="/cart" element={<CartView />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/view" element={<Vista />} />
      <Route path="/review/:userId/:productId" element={<Review />} />
      <Route path="/about" element={<About />} />
      <Route path="/detail-order/:id" element={<DetailOrder />} />
      <Route path="/user-reviews/:userId" element={<UserReviews />} />
      <Route path="/reset-password" element={<PasswordReset />} />
      <Route path="/modify-password" element={<ModifyPassword />} />
      <Route path="/admin/*" element={<DashboardAdmin />}>
        <Route path="orderslist" element={<OrdersList />} />
        <Route path="list" element={<ProductList />} />
        <Route path="inactive" element={<DeletedProductList />} />
        <Route path="create" element={<CreateForm />} />
        <Route path="users" element={<UserList />} />
        <Route path="banned" element={<Banned />} />
        <Route path="reviews" element={<ReviewsList />} />
      </Route>

      <Route path="*" element={<BadURL />} />
    </Routes>
  );
}

export default App;
