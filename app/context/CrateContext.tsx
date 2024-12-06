// context/HeaderContext.tsx
"use client";
import React, { createContext, useContext, useState } from 'react';

// 定义 cratesInfo 接口
export interface CratesInfo {
  crate_name: string;
  description: string;
  dependencies: {
    direct: number;
    indirect: number;
  };
  dependents: {
    direct: number;
    indirect: number;
  };
  cves: {
    cve_id: string;
    url: string;
    description: string;
  }[];
  versions: string[];
}

// 定义 HeaderContext 的类型
interface CrateData {
  crateName: string | undefined;
  crateVersion: string | string[] | undefined;
  results: CratesInfo | null; // 存储 cratesInfo 数据
}

interface HeaderContextType {
  crateData: CrateData;
  setCrateData: React.Dispatch<React.SetStateAction<CrateData>>;
}

// 创建上下文，并设置默认值为 undefined
const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

// 创建提供者组件
export const HeaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [crateData, setCrateData] = useState<CrateData>({
    crateName: undefined,
    crateVersion: undefined,
    results: null,
  });

  // 这里可以添加一些副作用，例如在 crateData 更新时执行某些操作

  return (
    <HeaderContext.Provider value={{ crateData, setCrateData }}>
      {children}
    </HeaderContext.Provider>
  );
};

// 创建一个自定义 Hook 用于使用上下文
export const useHeaderContext = (): HeaderContextType => {
  const context = useContext(HeaderContext);
  if (context === undefined) {
    throw new Error('useHeaderContext must be used within a HeaderProvider');
  }
  return context;
};