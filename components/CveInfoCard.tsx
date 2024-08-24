import React from 'react';

export interface CVE {
  id: string;
  description: string;
  name: string; // Crate name
  version: string;
  sourceUrl: string;
  versions: string[]; // A list of affected versions
}

const CveInfoCard = ({ cve }: { cve: CVE }) => (
  <section className="bg-white p-4 mb-2 shadow-lg rounded-lg">
    <h3 className="text-xl font-bold mb-2">CVE Detail for {cve.id}</h3>
    <p><strong>Description:</strong> {cve.description}</p>
    <p>
      <strong>Source URL:</strong> 
      <a href={cve.sourceUrl} className="text-blue-500 underline ml-2" target="_blank" rel="noopener noreferrer">
        {cve.sourceUrl}
      </a>
    </p>
    <p><strong>Crate Name:</strong> {cve.name}</p>
    <VersionTimeline crateName={cve.name} versions={cve.versions} />
  </section>
);

const VersionTimeline = ({ crateName, versions }: { crateName: string, versions: string[] }) => {
  const handleClick = (version: string) => {
    window.location.href = `/programs/${crateName}/${version}`;
  };

  return (
    <div className="mt-4">
      <h4 className="font-bold mb-2">Affected Versions</h4>
      <div className="relative">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-300"></div>
        <div className="flex justify-between items-center">
          {versions.map((version, index) => (
            <div key={index} className="relative z-10 cursor-pointer" onClick={() => handleClick(version)}>
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <div className="mt-2 text-xs text-center">{version}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CveInfoCard;
