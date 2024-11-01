'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

//接口定义-Rust程序的结构
interface ObjectData {
  name: string;
  description: string;
  category: string;
}

//接口定义-描述CVE数据的结构
interface CVE {
  id: string;
  description: string;

  name: string;
  version: string;
}

const ProgramsPage = () => {



  const [objects, setObjects] = useState<ObjectData[]>([]); //从接口获取Rust程序数据
  const [cveData, setCveData] = useState<CVE[]>([]); //从接口获取CVE数据

  //获取数据
  useEffect(() => {
    fetch('/api/crates') //这里应调用nextjs路由
      .then(response => response.json())
      .then(data => {
        console.log('Fetched crates data:', data); //调试输出
        if (Array.isArray(data)) {
          setObjects(data);
        } else {
          console.error('Crates data is not an array:', data);
          setObjects([]);//如果不是数组，设置为空数组
        }
      });

    fetch('/api/cves') //这里应调用nextjs路由
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();  // 暂时使用 text() 来调试
      })
      .then(text => {
        //console.log('Response text:', text);
        return JSON.parse(text); // 手动解析 JSON
      })
      .then(data => setCveData(data))
      .catch(error => console.error('Fetch error:', error));
  }, []);

  const categories = [...new Set(objects.map(obj => obj.category))];

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-4">
          <h1 className="text-3xl font-bold mb-4">All Rust Programs</h1>
          {categories.map((category) => (
            <div key={category} className="mb-8">
              <h2 className="text-2xl font-semibold my-4">{category}</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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

        <div className="md:col-span-1">
          <h1 className="text-3xl font-bold mb-4">CVE List</h1>
          <ul className="grid grid-cols-1 gap-4">
            {cveData.map((cve) => (
              <li key={cve.id} className="bg-white shadow-md rounded-lg p-4 transition-transform transform hover:scale-105">{/* 这里transform hover:scale-105和submit弹窗有冲突 */}
                <Link href={`programs/cves/${cve.id}`} className="text-xl font-bold text-blue-500 hover:text-blue-600">
                  {cve.id}
                </Link>
                <p className="mt-2 text-gray-600">{cve.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProgramsPage;
