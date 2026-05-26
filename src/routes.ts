import { createBrowserRouter } from "react-router";
import { AnalystConsole } from "./pages/AnalystConsole";
import { Dashboard } from "./pages/Dashboard";
import { ForgotPassword } from "./pages/ForgotPassword";
import { Login } from "./pages/Login";
import { NewTicket } from "./pages/NewTicket";
import { Profile } from "./pages/Profile";
import { Register } from "./pages/Register";
import { ServiceDetail } from "./pages/ServiceDetail";
import { Services } from "./pages/Services";
import { TicketDetail } from "./pages/TicketDetail";
import { Tickets } from "./pages/Tickets";

export const router = createBrowserRouter([
  { path: "/", Component: Login },
  { path: "/dashboard", Component: Dashboard },
  { path: "/services", Component: Services },
  { path: "/services/:id", Component: ServiceDetail },
  { path: "/tickets", Component: Tickets },
  { path: "/tickets/:id", Component: TicketDetail },
  { path: "/tickets/new", Component: NewTicket },
  { path: "/profile", Component: Profile },
  { path: "/analyst", Component: AnalystConsole },
  { path: "/register", Component: Register },
  { path: "/forgot-password", Component: ForgotPassword },
]);
