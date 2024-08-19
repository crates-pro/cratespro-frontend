export interface Dependency {
    name: string;
    version: string;
}

const DependenciesList = ({ dependencies }: { dependencies: Dependency[] }) => (
    <section className="bg-white p-4 mb-2 shadow-lg rounded-lg">
        <h2 className="text-xl font-semibold mb-1 text-gray-800">Dependencies</h2>
        {dependencies.length > 0 ? (
            <ul className="list-disc pl-6 space-y-0">
                {dependencies.map(dep => (
                    <li key={dep.name} className="text-lg text-gray-700">
                        <span className="font-medium">{dep.name}</span> <span className="text-gray-500">v{dep.version}</span>
                    </li>
                ))}
            </ul>
        ) : (
            <p className="text-gray-500">No dependencies found.</p>
        )}
    </section>
);

export default DependenciesList;
