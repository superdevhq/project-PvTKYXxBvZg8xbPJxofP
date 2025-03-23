
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import JobDetail from './pages/JobDetail.tsx'
import CompanyProfile from './pages/CompanyProfile.tsx'
import Companies from './pages/Companies.tsx'
import NotFound from './pages/NotFound.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/job/:id" element={<JobDetail />} />
        <Route path="/company/:id" element={<CompanyProfile />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
