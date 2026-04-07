"use client";

import React from 'react';
import { UnionIdCard } from '../../components/UnionIdCard';

export default function IdCardPreviewPage() {
  const testUser = {
    name: "राम कुमार शर्मा",
    phone: "+91 98765 43210",
    address: "पीपल्स ग्रीन पार्टी कार्यालय, नई दिल्ली, दिल्ली - 110001",
    unionName: "पीपल्स ग्रीन ई-रिक्शा चालक यूनियन",
    photoUrl: null,
    memberId: "PGP-ER-2024-001"
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ID Card Preview</h1>
          <p className="text-gray-600">Preview of the Union ID Card with green theme</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Test User Details:</h2>
            <ul className="text-sm text-gray-600 space-y-1">
              <li><strong>Name:</strong> {testUser.name}</li>
              <li><strong>Phone:</strong> {testUser.phone}</li>
              <li><strong>Union:</strong> {testUser.unionName}</li>
              <li><strong>Member ID:</strong> {testUser.memberId}</li>
              <li><strong>Address:</strong> {testUser.address}</li>
            </ul>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">ID Card:</h3>
            <UnionIdCard user={testUser} />
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <a 
            href="/" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
