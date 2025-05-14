import { Route } from "react-router-dom";
import DashboardUser from "../pages/User/DashboardUser";
import SearchUser from "../pages/User/SearchUser";
import DetailKosUser from "../pages/User/DetailKosUser";
import BookingKosUser from "../pages/User/BookingKosUser";
import Contact from "../pages/User/Contact";
import UserGuard from "./UserGuard";
import PaymentHistory from "../pages/User/PesananHistory";

const UserRoutes = [
  {
    path: "/",
    element: (
      <UserGuard>
        <DashboardUser />
      </UserGuard>
    ),
  },
  {
    path: "/search",
    element: (
      <UserGuard>
        <SearchUser />
      </UserGuard>
    ),
  },
  {
    path: "/kos/:id",
    element: (
      <UserGuard>
        <DetailKosUser />
      </UserGuard>
    ),
  },
  {
    path: "/booking/:id",
    element: (
      <UserGuard>
        <BookingKosUser />
      </UserGuard>
    ),
  },
  {
    path: "/contact",
    element: (
      <UserGuard>
        <Contact />
      </UserGuard>
    ),
  },
  {
    path: "/payments/history",
    element: (
      <UserGuard>
        <PaymentHistory />
      </UserGuard>
    ),
  },
].map((route) => <Route key={route.path} {...route} />);

export default UserRoutes;
