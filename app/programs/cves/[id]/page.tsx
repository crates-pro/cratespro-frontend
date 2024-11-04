'use client';
import React, { useEffect, useState } from 'react';
import CveInfoCard from '@/components/CveInfoCard';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

interface CVE {
  id: string;
  description: string;
  name: string;
  version: string;
  sourceUrl: string;
  startVersion: string;
  endVersion: string;
  versions: string[];
}

async function fetchCVE(id: string): Promise<CVE> {
  // Simulate fetching CVE data
  return {
    id,
    description: `Description for ${id}`,
    name: `crate-${Math.floor(Math.random() * 100)}`,
    version: `v${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
    sourceUrl: 'https://example.com',
    startVersion: 'v1.0.0',
    endVersion: 'v2.0.0',
    versions: ['v1.0.0', 'v1.2.0', 'v1.3.0', 'v2.0.0'], // Example versions
  };
}

type Params = Promise<{ id: string }>

export default function CVEDetail({ params }: { params: Params }) {
  const { id } = React.use(params);

  const [cve, setCve] = useState<CVE | null>(null);

  useEffect(() => {
    const getCVE = async () => {
      const data = await fetchCVE(id);
      setCve(data);
    };
    getCVE();
  }, [id]);

  if (!cve) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-full flex-col px-3 py-1 md:px-1">
      <Header title="CVE Details" onBack={() => window.history.back()} />
      <main className="flex-grow overflow-y-auto bg-gray-100">
        <div className="container mx-auto p-4 flex justify-center items-center">
          <div className="w-full max-w-8xl"> {/* Adjust width as needed */}
            <CveInfoCard cve={cve} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
