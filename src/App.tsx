
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import JobDetail from './pages/JobDetail';
import Companies from './pages/Companies';
import CompanyProfile from './pages/CompanyProfile';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PostJob from './pages/PostJob';
import MyApplications from './pages/MyApplications';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/job/:id" element={<JobDetail />} />
      <Route path="/companies" element={<Companies />} />
      <Route path="/company/:id" element={<CompanyProfile />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/post-job" element={<PostJob />} />
      <Route path="/my-applications" element={<MyApplications />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
