import React from 'react';
import ProfileForm from './task1/ProfileForm';
import CacheDemo from './task2/CacheDemo';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 space-y-8">
      <ProfileForm />
      <CacheDemo />
    </div>
  );
}