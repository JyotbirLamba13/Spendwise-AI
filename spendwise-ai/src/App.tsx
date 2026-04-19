import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Pricing from './pages/Pricing';
import Security from './pages/Security';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Careers from './pages/Careers';
import Press from './pages/Press';
import Terms from './pages/Terms';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-paper">
        <Navbar />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/security" element={<Security />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/press" element={<Press />} />
            <Route path="/terms" element={<Terms />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
