interface Maintainer {
    name: string;
    email: string;
}

const MaintainersList = ({ maintainers }: { maintainers: Maintainer[] }) => (
    <section className="bg-white p-3 mb-2 shadow-lg rounded-lg">
        <h3 className="text-2xl font-semibold mb-0 text-gray-800">Maintainers</h3>
        {maintainers.length > 0 ? (
            <ul className="list-disc pl-6 space-y-1">
                {maintainers.map(maintainer => (
                    <li key={maintainer.email} className="text-1xl text-gray-700">
                        <span className="font-medium">{maintainer.name}</span> <span className="text-gray-500">({maintainer.email})</span>
                    </li>
                ))}
            </ul>
        ) : (
            <p className="text-gray-500 text-lg">No maintainers found.</p>
        )}
    </section>
);

export default MaintainersList;
