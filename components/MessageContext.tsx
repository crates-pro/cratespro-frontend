// MessageContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { message } from 'antd';

// 定义消息上下文的类型
interface MessageContextType {
  success: () => void;
  error: () => void;
  warning: () => void;
}

// 创建上下文，默认值为 null
const MessageContext = createContext<MessageContextType | null>(null);

// 定义 MessageProvider 的属性类型
interface MessageProviderProps {
  children: ReactNode; // 允许任意子元素
}

// 创建 MessageProvider 组件
export const MessageProvider: React.FC<MessageProviderProps> = ({ children }) => {
  const success = () => {
    message.success('这是一个成功消息！');
  };

  const error = () => {
    message.error('这是一个错误消息！');
  };

  const warning = () => {
    message.warning('这是一个警告消息！');
  };

  return (
    <MessageContext.Provider value={{ success, error, warning }}>
      {children}
    </MessageContext.Provider>
  );
};

// 自定义 hook 使用上下文
export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
};