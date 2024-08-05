import React from 'react';

interface CrateInfoHeaderProps {
    name: string;
    version: string;
}

const CrateInfoHeader: React.FC<CrateInfoHeaderProps> = ({ name, version }) => {
    return (
        <div className="bg-white p-4 mb-4 shadow-lg rounded-lg">
            <h3 className="text-2xl font-bold mb-2">{name}</h3>
            <p className="text-l">Version: {version}</p>
        </div>
    );
};

export default CrateInfoHeader;
