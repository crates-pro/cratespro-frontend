'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface ObjectData {
  name: string;
  description: string;
  category: string;
}

const ProgramsPage = () => {
  const [objects, setObjects] = useState<ObjectData[]>([]);

  useEffect(() => {
    fetch('/api/crates')
      .then(response => response.json())
      .then(data => setObjects(data));
  }, []);

  const categories = [...new Set(objects.map(obj => obj.category))];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">All Rust Programs</h1>
      {categories.map((category) => (
        <div key={category} className="mb-8">
          <h2 className="text-2xl font-semibold my-4">{category}</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {objects
              .filter(obj => obj.category === category)
              .map((obj) => (
                <li key={obj.name} className="bg-white shadow-md rounded-lg p-4 transition-transform transform hover:scale-105">
                  <Link href={`/programs/${obj.name}`} className="text-xl font-bold text-blue-500 hover:text-blue-600">
                    {obj.name}
                  </Link>
                  <p className="mt-2 text-gray-600">{obj.description}</p>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ProgramsPage;
