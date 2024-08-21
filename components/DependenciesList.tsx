// components/DependenciesList.tsx
import React from 'react';

export interface Dependency {
    name: string;
    version: string;
}

interface DependenciesListProps {
    dependencies: Dependency[];
    onDependencyClick?: (dependencyName: string, dependencyVersion: string) => void;
}

const DependenciesList: React.FC<DependenciesListProps> = ({ dependencies, onDependencyClick }) => {
    return (
        <div className="bg-white p-4 mb-2 shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Dependencies</h2>
            <ul>
                {dependencies.map((dependency) => (
                    <li key={dependency.name} className="mb-1">
                        <button
                            onClick={() => onDependencyClick?.(dependency.name, dependency.version)}
                            className="text-blue-500 hover:underline"
                        >
                            {dependency.name} ({dependency.version})
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DependenciesList;
