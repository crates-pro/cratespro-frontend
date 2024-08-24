import { CrateInfo } from "@/app/lib/crate_info";

const CrateInfoCard = ({ crateInfo }: { crateInfo: CrateInfo }) => (
    <section className="bg-white p-4 mb-2 shadow-lg rounded-lg">
        <h3 className="text-xl font-bold mb-2">Crate Information</h3>
        <div className="space-y-2">
        <p className="border border-gray-300 hover:bg-gray-100 hover:border-gray-400 p-2 rounded mb-2"><strong>Name:</strong> {crateInfo.name}</p>
        <div className="border border-gray-300 hover:bg-gray-100 hover:border-gray-400 p-2 rounded text-left mb-2">
                <p><strong>Description:</strong></p>
                <p>{crateInfo.description}</p>
        </div>
        <p className="border border-gray-300 hover:bg-gray-100 hover:border-gray-400 p-2 rounded mb-2"><strong>Downloads:</strong> {crateInfo.downloads}</p>
        <p className="border border-gray-300 hover:bg-gray-100 hover:border-gray-400 p-2 rounded mb-2"><strong>Published:</strong> {crateInfo.publishedDate}</p>
        {crateInfo.repository && (
            <a href={crateInfo.repository} className="text-blue-500 underline mb-2 inline-block border border-gray-300 hover:bg-gray-100 hover:border-gray-400 p-2 rounded" target="_blank" rel="noopener noreferrer">
                Repository
            </a>
        )}
        {crateInfo.documentation && (
            <a href={crateInfo.documentation} className="text-blue-500 underline mb-2 inline-block ml-4 border border-gray-300 hover:bg-gray-100 hover:border-gray-400 p-2 rounded" target="_blank" rel="noopener noreferrer">
                Documentation
            </a>
        )}
        </div>
    </section>
);


export default CrateInfoCard;
