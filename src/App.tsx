/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import SearchResults from "@/pages/SearchResults";
import ProductDetail from "@/pages/ProductDetail";
import Wishlist from "@/pages/Wishlist";
import AdminDashboard from "@/pages/AdminDashboard";
import About from "@/pages/About";
import Profile from "@/pages/Profile";
import Login from "@/pages/Login";
import { Toaster } from "sonner";

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" storageKey="cheapalta-theme">
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="search" element={<SearchResults />} />
                <Route path="product/:id" element={<ProductDetail />} />
                <Route path="wishlist" element={<Wishlist />} />
                <Route path="admin" element={<AdminDashboard />} />
                <Route path="profile" element={<Profile />} />
                <Route path="login" element={<Login />} />
                <Route path="about" element={<About />} />
              </Route>
            </Routes>
            <Toaster position="top-center" />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
