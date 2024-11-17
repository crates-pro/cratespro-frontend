import React from 'react';
import '@/app/ui/global.css';


const HomePage = () => {
    return (
        //紫色渐变
        // <div className="min-h-screen bg-gray-900 text-white">
        //     {/* 头部和搜索部分 */}
        //     <div className="bg-gradient-to-b from-[#4D004D] to-white">
        //         <header className="p-4 flex justify-between items-center">
        //             <div className="text-2xl font-bold">open/source/insights</div>
        //             <nav>
        //                 <ul className="flex space-x-5">
        //                     <li><a href="#" className="hover:underline">About</a></li>
        //                     <li><a href="#" className="hover:underline">Documentation</a></li>
        //                     <li><a href="#" className="hover:underline">Blog</a></li>
        //                 </ul>
        //             </nav>
        //         </header>
        //         <div className="flex flex-col items-center justify-center h-80">
        //             <h1 className="text-4xl font-bold mb-4">Understand your dependencies</h1>
        //             <p className="text-center mb-4">Your software and your users rely not only on the code you write, but also on the code your code depends on, the code that code depends on, and so on.</p>
        //             <div className="flex items-center mb-4">
        //                 <input
        //                     type="text"
        //                     placeholder="Search for open source packages, advisories and projects"
        //                     className="p-2 border-none rounded-md text-gray-800 w-2/3 max-w-xl"
        //                 />
        //                 <button className="bg-teal-600 text-white rounded-md p-2 ml-2 hover:bg-teal-700">Search</button>
        //             </div>
        //         </div>
        //     </div>


        //绿色渐变
        < div className="min-h-screen bg-gray-900 text-white" >
            <header className="bg-teal-500 p-4 flex justify-between items-center">
                <div className="text-2xl font-bold">open/source/insights</div>
                <nav>
                    <ul className="flex space-x-5">
                        <li><a href="#" className="hover:underline">About</a></li>
                        <li><a href="#" className="hover:underline">Documentation</a></li>
                        <li><a href="#" className="hover:underline">Blog</a></li>
                    </ul>
                </nav>
            </header>
            {/* 搜索部分 */}
            <div className="flex flex-col items-center justify-center h-80 bg-gradient-to-b from-teal-500 to-gray-800">
                <h1 className="text-4xl font-bold mb-4 ">Understand your dependencies</h1>
                <p className="text-center mb-4">Your software and your users rely not only on the code you write, but also on the code your code depends on, the code that code depends on, and so on.</p>
                <div className="flex items-center mb-4">
                    <input
                        type="text"
                        placeholder="Search for open source crates"
                        className="p-2 border-none rounded-md text-gray-800 w-80 max-w-2xl"
                    />
                    <button className="bg-teal-600 text-white rounded-md p-2 ml-2 hover:bg-teal-700">Search</button>
                </div>
            </div>


            {/* 分割线部分 */}
            <div className="border-t-4 border-green-500 h-1/4"></div>

            {/* 一些介绍 */}
            <div className="container mx-auto p-10">
                <div className="bg-gray-800 p-5 mb-6 rounded shadow-md">
                    <h2 className="text-2xl font-semibold">New features in the deps.dev API</h2>
                    <p className="mt-2">The deps.dev API, which provides free access to the data that powers this website, now has experimental batch and pull support, as well as a new version that comes with a stability guarantee and deprecation policy.</p>
                    <p className="mt-2">Learn more about the new features on our blog, or get started with the API documentation, and code examples.</p>
                </div>

                <div className="bg-gray-800 p-5 mb-6 rounded shadow-md">
                    <h2 className="text-2xl font-semibold">Seeing the big picture can be difficult—but it shouldn't be</h2>
                    <p className="mt-2">The Open Source Insights page for each package shows the full dependency graph and updates it every day. The information provided can help you make informed decisions about using, building, and maintaining your software.</p>
                    <p className="mt-2">With Open Source Insights, you can actually see the dependency graph for a package, then isolate the paths to a particular dependency. Or see whether a vulnerability in a dependency might affect your code. Or compare two versions of a package to see how the dependencies have changed in a new release.</p>
                </div>

                <div className="bg-gray-800 p-5 mb-6 rounded shadow-md">
                    <h2 className="text-2xl font-semibold">How it works</h2>
                    <p className="mt-2">The service repeatedly examines sites such as github.com, npmjs.com, and pkg.go.dev to find up-to-date information about open source software packages. Using that information, it builds for each package the full dependency graph from scratch—not just from package lock files—connecting it to the packages it depends on and to those that depend on it. This transitive dependency graph allows problems in any package to be made visible to the owners and users of any software they affect.</p>
                </div>
            </div>
        </div >
    );
}

export default HomePage;
