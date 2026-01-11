import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import EventsPage from "./pages/Events/EventsPage";
import EventDetailsPage from "./pages/Events/EventDetailsPage";
import LandingPage from "./pages/LandingPage";
import Gallery from "./pages/Gallery";
import ContactUs from "./pages/contactUs";
import Services from "./pages/services";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import About from "./pages/About";
import Terms from "./pages/Term";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./Components/ScrollToTop";
import WhatsappCTA from "./Components/WhatsappCTA";

import RetreatsPackages from "./pages/Retreat-Package-Pages/RetreatsPackages";
import RetreatsPackageDetails1 from "./pages/Retreat-Package-Pages/RetreatsPackageDetails1";
import RetreatsPackageDetails from "./pages/Retreat-Package-Pages/RetreatsPackageDetails2";
import RetreatsPackageDetails3 from "./pages/Retreat-Package-Pages/RetreatsPackageDetails3";
import RetreatsPackageDetails4 from "./pages/Retreat-Package-Pages/RetreatsPackageDetails4";

import CommunityTour from "./pages/Community-tour-pages/CommunityTour";
import CommunityTourMagicalMuscat from "./pages/Community-tour-pages/CommunityTourMusicalMuscat";
import CommunityTourSeychelles from "./pages/Community-tour-pages/CommunityTourSeychelles";

import Mice from "./pages/Mice";
import Coursera from "./pages/Coursera";
import GoogleOffet from "./pages/GoogleOffset";
import Ibiea from "./pages/ibiea";

import OmanTourPackageDetails from "./pages/OmanPackeForm.jsx";
import AdminLogin from "./pages/Admin/AdminLogin.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";

import OmanPage from "./pages/Oman_tour/OmanPage";
import BookingDetailsPage from "./pages/Admin/BookingDetailsPage";
import ProtectedRoute from "./Components/ProtectedRoute";

/* ---------------- LAYOUT CONTROLLER ---------------- */
function Layout({ children }) {
  const location = useLocation();

  const hideLayoutRoutes = [
    "/admin",
    "/admin-dashboard",
    "/oman-form",
    "/oman-tour",
  ];

  // Also hide layout for booking details: starts with /admin/booking/
  const isDetailsPage = location.pathname.startsWith("/admin/booking/");
  const hideLayout =
    hideLayoutRoutes.includes(location.pathname) || isDetailsPage;

  return (
    <>
      {!hideLayout && <Navbar />}
      {!hideLayout && <WhatsappCTA />}

      {children}

      {!hideLayout && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Toaster position="top-right" />

      <Layout>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailsPage />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Terms />} />

          <Route path="/packages/wellness" element={<RetreatsPackages />} />
          <Route
            path="/packages/wellness/nirvana_anantam"
            element={<RetreatsPackageDetails1 />}
          />
          <Route
            path="/packages/wellness/nirvana_inner_journey"
            element={<RetreatsPackageDetails />}
          />
          <Route
            path="/packages/wellness/corporate_sound_healing"
            element={<RetreatsPackageDetails3 />}
          />
          <Route
            path="/packages/wellness/nirvana_rishikesh"
            element={<RetreatsPackageDetails4 />}
          />

          <Route path="/packages/community-tour" element={<CommunityTour />} />
          <Route
            path="/community/magical-muscat"
            element={<CommunityTourMagicalMuscat />}
          />
          <Route
            path="/community/seychelles"
            element={<CommunityTourSeychelles />}
          />

          <Route path="/mice" element={<Mice />} />
          <Route path="/coursera" element={<Coursera />} />
          <Route path="/google-offset" element={<GoogleOffet />} />
          <Route path="/ibiea" element={<Ibiea />} />

          {/* NO HEADER / FOOTER ROUTES */}
          <Route path="/oman-form" element={<OmanTourPackageDetails />} />
          <Route path="/oman-tour" element={<OmanPage />} />
          <Route path="/admin" element={<AdminLogin />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route
              path="/admin/booking/:type/:id"
              element={<BookingDetailsPage />}
            />
          </Route>
        </Routes>
      </Layout>
    </Router>
  );
}
