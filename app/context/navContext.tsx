// // MyContext.js
// import React, { createContext, useContext, useState } from 'react';

// // 创建上下文
// const MyContext = createContext();

// // 创建提供者组件
// export const MyProvider = ({ children }) => {
//     const [activeTable, setactiveTable] = useState("Initial Value");

//     return (
//         <MyContext.Provider value={{ activeTable, setactiveTable }}>
//             {children}
//         </MyContext.Provider>
//     );
// };

// // 创建自定义钩子以便于使用上下文
// export const useMyContext = () => useContext(MyContext);