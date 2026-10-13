import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { CartProvider } from './context/CartContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { FloatingLeavesAnimation } from './components/FloatingLeavesAnimation.tsx';

// Pages
import { HomePage } from './pages/HomePage.tsx';
import { MarketplacePage } from './pages/MarketplacePage.tsx';
import { ProductDetailPage } from './pages/ProductDetailPage.tsx';
import { FarmersDirectoryPage } from './pages/FarmersDirectoryPage.tsx';
import { FarmerDetailPage } from './pages/FarmerDetailPage.tsx';
import { CartPage } from './pages/CartPage.tsx';
import { CheckoutPage } from './pages/CheckoutPage.tsx';
import { OrderSuccessPage } from './pages/OrderSuccessPage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { RegisterPage } from './pages/RegisterPage.tsx';

// Dashboards
import { FarmerDashboard } from './pages/farmer/FarmerDashboard.tsx';
import { CustomerDashboard } from './pages/customer/CustomerDashboard.tsx';
import { AdminDashboard } from './pages/admin/AdminDashboard.tsx';

// Scroll to top helper
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Protected Route Guard
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles?: Array<'customer' | 'farmer' | 'admin'>;
}> = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If farmer visits customer page or vice versa, redirect gracefully to their home
    if (user.role === 'farmer') return <Navigate to="/farmer/dashboard" replace />;
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/customer/dashboard" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-emerald-100 selection:text-emerald-900 font-['Plus_Jakarta_Sans',sans-serif] relative">
            <FloatingLeavesAnimation />
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Browsing Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/marketplace" element={<MarketplacePage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/farmers" element={<FarmersDirectoryPage />} />
                <Route path="/farmers/:id" element={<FarmerDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-success/:orderNumber" element={<OrderSuccessPage />} />
                <Route path="/about" element={<AboutPage />} />

                {/* Authentication */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Farmer Dashboard Protected Route */}
                <Route
                  path="/farmer/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['farmer']}>
                      <FarmerDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Customer Dashboard Protected Route */}
                <Route
                  path="/customer/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <CustomerDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Dashboard Protected Route */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
