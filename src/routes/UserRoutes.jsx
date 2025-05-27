import { Route } from "react-router-dom";
import DashboardUser from "../pages/User/DashboardUser";
import SearchUser from "../pages/User/SearchUser";
import DetailKosUser from "../pages/User/DetailKosUser";
import BookingKosUser from "../pages/User/BookingKosUser";
import PaymentUser from "../pages/User/PaymentUser";
import Contact from "../pages/User/Contact";
import UserGuard from "./UserGuard"; // Make sure the path to UserGuard is correct

const UserRoutes = [
  <Route
    key="dashboard"
    path="/"
    element={
      <UserGuard>
        <DashboardUser />
      </UserGuard>
    }
  />,
  <Route
    key="search"
    path="/search"
    element={
      <UserGuard>
        <SearchUser />
      </UserGuard>
    }
  />,
  <Route
    key="detail"
    path="/kos/:id"
    element={
      <UserGuard>
        <DetailKosUser />
      </UserGuard>
    }
  />,
  <Route
    key="booking"
    path="/booking/:id"
    element={
      <UserGuard>
        <BookingKosUser />
      </UserGuard>
    }
  />,
  <Route
    key="payment"
    path="/payment"
    element={
      <UserGuard>
        <PaymentUser />
      </UserGuard>
    }
  />,
  <Route
    key="contact"
    path="/contact"
    element={
      <UserGuard>
        <Contact />
      </UserGuard>
    }
  />,
];

export default UserRoutes;
