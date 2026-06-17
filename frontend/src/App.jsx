// import React, { useEffect } from "react";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { getMe } from "./store/slices/authSlice";
// import { useSocket } from "./hooks/useSocket";

// // Layout
// import MainLayout from "./components/layout/MainLayout";
// import AuthLayout from "./components/layout/AuthLayout";

// // Pages
// import HomePage from "./pages/HomePage";
// import LoginPage from "./pages/LoginPage";
// import RegisterPage from "./pages/RegisterPage";
// import VerifyOTPPage from "./pages/VerifyOTPPage";
// import DashboardPage from "./pages/DashboardPage";
// import ResourcesPage from "./pages/ResourcesPage";
// import ResourceDetailPage from "./pages/ResourceDetailPage";
// import BooksPage from "./pages/BooksPage";
// import ProjectsPage from "./pages/ProjectsPage";
// import ProjectDetailPage from "./pages/ProjectDetailPage";
// import MentorshipPage from "./pages/MentorshipPage";
// import OpportunitiesPage from "./pages/OpportunitiesPage";
// import ChatPage from "./pages/ChatPage";
// import ProfilePage from "./pages/ProfilePage";
// import AdminPage from "./pages/AdminPage";
// import AIPage from "./pages/AIPage";
// import NotFoundPage from "./pages/NotFoundPage";
// import MentorshipDetailPage from "./pages/MentorshipDetailPage";
// import OpportunityDetailPage from "./pages/OpportunityDetailPage";
// import BookDetailPage from "./pages/BookDetailPage";

// // Protected Route
// const ProtectedRoute = ({ children, roles }) => {
//   const { isAuthenticated, user, loading } = useSelector((s) => s.auth);
//   if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>;
//   if (!isAuthenticated) return <Navigate to="/login" replace />;
//   if (roles && !roles.includes(user?.role)) return <Navigate to="/dashboard" replace />;
//   return children;
// };

// const AppContent = () => {
//   const dispatch = useDispatch();
//   const { token, isAuthenticated } = useSelector((s) => s.auth);
//   const darkMode = useSelector((s) => s.ui.darkMode);

//   useSocket(isAuthenticated ? token : null);

//   useEffect(() => {
//     document.documentElement.classList.toggle("dark", darkMode);
//   }, [darkMode]);

//   useEffect(() => {
//     if (token) dispatch(getMe());
//   }, [token, dispatch]);

//   return (
//     <Routes>
//       {/* Public */}
//       <Route path="/" element={<HomePage />} />
//       <Route element={<AuthLayout />}>
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/register" element={<RegisterPage />} />
//         <Route path="/verify-otp" element={<VerifyOTPPage />} />
//       </Route>

//       {/* Protected */}
//       <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
//         <Route path="/dashboard" element={<DashboardPage />} />
//         <Route path="/resources" element={<ResourcesPage />} />
//         <Route path="/resources/:id" element={<ResourceDetailPage />} />
//         <Route path="/books" element={<BooksPage />} />
//         <Route path="/books/:id" element={<BookDetailPage />} />
//         <Route path="/projects" element={<ProjectsPage />} />
//         <Route path="/projects/:id" element={<ProjectDetailPage />} />
//         <Route path="/mentorship" element={<MentorshipPage />} />
//         <Route path="/mentorship/:id" element={<MentorshipDetailPage />} />
//         <Route path="/opportunities" element={<OpportunitiesPage />} />
//         <Route path="/opportunities/:id" element={<OpportunityDetailPage />} />
//         <Route path="/chat" element={<ChatPage />} />
//         <Route path="/chat/:userId" element={<ChatPage />} />
//         <Route path="/profile/:id" element={<ProfilePage />} />
//         <Route path="/profile" element={<ProfilePage />} />
//         <Route path="/ai" element={<AIPage />} />
//         <Route
//           path="/admin"
//           element={
//             <ProtectedRoute roles={["college_admin", "university_admin", "super_admin"]}>
//               <AdminPage />
//             </ProtectedRoute>
//           }
//         />
//       </Route>

//       <Route path="*" element={<NotFoundPage />} />
//     </Routes>
//   );
// };

// export default function App() {
//   return (
//     <BrowserRouter>
//       <AppContent />
//     </BrowserRouter>
//   );
// }



import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMe } from "./store/slices/authSlice";
import { useSocket } from "./hooks/useSocket";

// Layout
import MainLayout from "./components/layout/MainLayout";
import AuthLayout from "./components/layout/AuthLayout";

// Auth Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyOTPPage from "./pages/VerifyOTPPage";

// Main Pages
import DashboardPage from "./pages/DashboardPage";
import ResourcesPage from "./pages/ResourcesPage";
import ResourceDetailPage from "./pages/ResourceDetailPage";
import BooksPage from "./pages/BooksPage";
import BookDetailPage from "./pages/BookDetailPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import MentorshipPage from "./pages/MentorshipPage";
import MentorshipDetailPage from "./pages/MentorshipDetailPage";
import OpportunitiesPage from "./pages/OpportunitiesPage";
import OpportunityDetailPage from "./pages/OpportunityDetailPage";
import ChatPage from "./pages/ChatPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import AIPage from "./pages/AIPage";
import NotFoundPage from "./pages/NotFoundPage";

// Protected Route
const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user, loading } = useSelector((s) => s.auth);
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user?.role)) return <Navigate to="/dashboard" replace />;
  return children;
};

const AppContent = () => {
  const dispatch = useDispatch();
  const { token, isAuthenticated } = useSelector((s) => s.auth);
  const darkMode = useSelector((s) => s.ui.darkMode);

  useSocket(isAuthenticated ? token : null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (token) dispatch(getMe());
  }, [token, dispatch]);

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<VerifyOTPPage />} />
      </Route>

      {/* Protected */}
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Resources */}
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/resources/:id" element={<ResourceDetailPage />} />

        {/* Books */}
        <Route path="/books" element={<BooksPage />} />
        <Route path="/books/:id" element={<BookDetailPage />} />

        {/* Projects */}
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />

        {/* Mentorship */}
        <Route path="/mentorship" element={<MentorshipPage />} />
        <Route path="/mentorship/:id" element={<MentorshipDetailPage />} />

        {/* Opportunities */}
        <Route path="/opportunities" element={<OpportunitiesPage />} />
        <Route path="/opportunities/:id" element={<OpportunityDetailPage />} />

        {/* Chat */}
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/chat/:userId" element={<ChatPage />} />

        {/* Profile */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/:id" element={<ProfilePage />} />

        {/* AI */}
        <Route path="/ai" element={<AIPage />} />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["college_admin", "university_admin", "super_admin"]}>
              <AdminPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}