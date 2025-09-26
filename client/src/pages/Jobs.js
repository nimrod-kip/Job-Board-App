import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import JobList from '../components/Jobs/JobList';
import JobForm from '../components/Jobs/JobForm';
import JobDetail from '../components/Jobs/JobDetail';

const Jobs = () => {
  const location = useLocation();

  if (location.pathname !== '/jobs') {
    return (
      <Routes>
        <Route path="new" element={<JobForm />} />
        <Route path=":id" element={<JobDetail />} />
        <Route path=":id/edit" element={<JobForm />} />
      </Routes>
    );
  }

  return (
    <div>
      <h1 className="mb-4">Jobs Management</h1>
      <JobList />
    </div>
  );
};

export default Jobs;