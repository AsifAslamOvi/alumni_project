import React, { useEffect } from 'react';
    import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
    import MainLayout from '@/components/layout/MainLayout';
    import HomePage from '@/pages/HomePage';
    import LoginPage from '@/pages/auth/LoginPage';
    import RegisterPage from '@/pages/auth/RegisterPage';
    import AlumniDirectoryPage from '@/pages/alumni/AlumniDirectoryPage';
    import ProfilePage from '@/pages/alumni/ProfilePage';
    import JobBoardPage from '@/pages/jobs/JobBoardPage';
    import EventsPage from '@/pages/events/EventsPage';
    import MessagesPage from '@/pages/messages/MessagesPage';
    import NewMessagePage from '@/pages/messages/NewMessagePage';
    import AdminLoginPage from '@/pages/admin/AdminLoginPage';
    import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
    import VerifyAlumniPage from '@/pages/admin/VerifyAlumniPage';
    import AdminVerifyJobsPage from '@/pages/admin/AdminVerifyJobsPage'; // New import
    import AdminVerifyEventsPage from '@/pages/admin/AdminVerifyEventsPage'; // New import
    import AboutPage from '@/pages/AboutPage';
    import ContactPage from '@/pages/ContactPage';
    import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
    import TermsOfServicePage from '@/pages/TermsOfServicePage';
    import SeriesGroupsPage from '@/pages/alumni/SeriesGroupsPage';
    import NotFoundPage from '@/pages/NotFoundPage';
    import { Toaster } from '@/components/ui/toaster';
    import { AuthProvider } from '@/contexts/AuthContext';
    import ProtectedRoute from '@/components/auth/ProtectedRoute';
    import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute';

    // Component to handle scroll to top on route change
    function ScrollToTop() {
      const { pathname } = useLocation();

      useEffect(() => {
        window.scrollTo(0, 0);
      }, [pathname]);

      return null;
    }

    function App() {
      return (
        <AuthProvider>
          <Router>
            <ScrollToTop /> 
            <div className="flex flex-col min-h-screen main-bg">
              <Routes>
                <Route element={<MainLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/privacy" element={<PrivacyPolicyPage />} />
                  <Route path="/terms" element={<TermsOfServicePage />} />
                  <Route path="/series-groups" element={<ProtectedRoute><SeriesGroupsPage /></ProtectedRoute>} />

                  <Route path="/alumni" element={<ProtectedRoute><AlumniDirectoryPage /></ProtectedRoute>} />
                  <Route path="/profile/:id" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                  <Route path="/profile/me" element={<ProtectedRoute><ProfilePage self={true} /></ProtectedRoute>} />
                  <Route path="/jobs" element={<JobBoardPage />} />
                  <Route path="/events" element={<EventsPage />} />
                  <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
                  <Route path="/messages/new/:recipientId" element={<ProtectedRoute><NewMessagePage /></ProtectedRoute>} />
                  
                  <Route path="/admin/login" element={<AdminLoginPage />} />
                  <Route path="/admin" element={<AdminProtectedRoute><AdminDashboardPage /></AdminProtectedRoute>} />
                  <Route path="/admin/verify-alumni" element={<AdminProtectedRoute><VerifyAlumniPage /></AdminProtectedRoute>} />
                  <Route path="/admin/verify-jobs" element={<AdminProtectedRoute><AdminVerifyJobsPage /></AdminProtectedRoute>} /> 
                  <Route path="/admin/verify-events" element={<AdminProtectedRoute><AdminVerifyEventsPage /></AdminProtectedRoute>} />
                  
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
              <Toaster />
            </div>
          </Router>
        </AuthProvider>
      );
    }

    export default App;