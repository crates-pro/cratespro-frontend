//import { useParams } from 'react-router-dom';
// import { useState, useEffect } from 'react';
// import './CratePage.css';

// interface CrateData {
//     crate_name: string;
//     version: string;
//     date: string;
// }

// const CratePage: React.FC = () => {
//     const { name, version } = useParams<{ name: string; version: string }>();
//     const [crateData, setCrateData] = useState<CrateData | null>(null);

//     useEffect(() => {
//         const fetchCrateData = async () => {
//             try {
//                 const response = await fetch(`/api/crates/${name}/${version}`);
//                 const data = await response.json();
//                 setCrateData(data);
//             } catch (error) {
//                 console.error('Error fetching crate data:', error);
//             }
//         };

//         fetchCrateData();
//     }, [name, version]);

//     if (!crateData) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <div className="crate-page">
//             <div className="bg-white shadow p-4">
//                 <h1>{crateData.crate_name}</h1>
//                 <p>Version: {crateData.version}</p>
//                 <p>Published: {crateData.date}</p>
//                 {/* Additional crate details */}
//             </div>
//         </div>
//     );
// };

// export default CratePage;