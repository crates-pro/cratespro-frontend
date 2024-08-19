import React from 'react';

interface BenchmarkResultsProps {
    benchmarks: { name: string; value: string }[];
}

const BenchmarkResults: React.FC<BenchmarkResultsProps> = ({ benchmarks }) => {
    return (
        <div className="bg-white p-4 mb-2 shadow-lg rounded-lg">
            <h2 className="text-xl font-bold mb-2">Benchmark Results</h2>
            <ul>
                {benchmarks.map((benchmark, index) => (
                    <li key={index} className="mb-1">
                        <span className="font-medium">{benchmark.name}:</span> {benchmark.value}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BenchmarkResults;
