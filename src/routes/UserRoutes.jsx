import { Route } from "react-router-dom";
import DashboardUser from "../pages/User/DashboardUser";
import SearchUser from "../pages/User/SearchUser";
import DetailKosUser from "../pages/User/DetailKosUser";
import BookingKosUser from "../pages/User/BookingKosUser";
import PaymentUser from "../pages/User/PaymentUser";
import Contact from "../pages/User/Contact";

const UserRoutes = [
  <Route key="dashboard" path="/" element={<DashboardUser />} />,
  <Route key="search" path="/search" element={<SearchUser />} />,
  <Route key="detail" path="/kos/:id" element={<DetailKosUser />} />,
  <Route key="booking" path="/booking/:id" element={<BookingKosUser />} />,
  <Route key="payment" path="/payment" element={<PaymentUser />} />,
  <Route key="contact" path="/contact" element={<Contact />} />,
];

export default UserRoutes;
