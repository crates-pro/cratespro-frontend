
'use client';
import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import React from 'react';
import { message } from 'antd';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/programs', icon: HomeIcon },
  // {
  //   name: 'Invoices',
  //   href: '/dashboard/invoices',
  //   icon: DocumentDuplicateIcon,
  // },
  // { name: 'Customers', href: '/dashboard/customers', icon: UserGroupIcon },
];

export default function NavLinks() {
  const pathname = usePathname();
  const [isModalOpen, setModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const [file, setFile] = useState<File | null>(null);
  const [isGithubLink, setIsGithubLink] = useState(true); // 控制输入类型

  //暂定上传数据类型为react表单类型
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    if (isGithubLink) {
      formData.append('githubLink', inputValue);
    } else if (file) {
      formData.append('file', file);
    }

    try {
      //用fetch向服务器发声POST请求，提交用户输入的内容
      const response = await fetch('/api/submi', {  // 待替换为服务器API
        method: 'POST',
        //请求体
        body: formData,
      });
      //响应处理，根据响应结果显示提示信息，并重置输入框或关闭弹窗
      if (response.ok) {
        message.success('提交成功');//提交成功后重置输入框的值，并关闭弹窗
        console.log('提交成功');
        setInputValue('');
        setFile(null);
        setModalOpen(false);
      } else {
        message.warning('提交失败');
        console.log('提交失败');
      }
    } catch (error) {
      message.error('提交失败，请检查网络设置');
      console.log('提交失败，请检查网络连接。');
    }
  };

  //渲染部分
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}

      {/* 提交按钮 */}
      {/* <button
        onClick={() => setModalOpen(true)}
        className="mt-4 flex h-[48px] w-full items-center justify-center rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600"
      >
        Submit
      </button> */}



      {/* submit按钮 */}
      <button
        onClick={() => setModalOpen(true)} //点击打开弹窗
        className={clsx(
          'mt-4 flex h-[48px] items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium text-gray-800 hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3'
        )}
      >
        <PaperAirplaneIcon className="w-6" /> {/* 使用的图标 */}
        Submit
      </button>

      {/* 弹窗 条件渲染，isModalOpen为true才渲染*/}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md w-96 ">
            <h2 className="text-lg font-bold mb-4">Submit Crates</h2>
            {/* 表单元素，包裹输入控件和提交按钮 */}
            <form onSubmit={handleSubmit}> {/* 将表单的提交事件绑定到handleSubmit函数，处理用户提交逻辑 */}
              <div className="mb-4">
                <label>
                  <input
                    type="radio"
                    value="github"
                    checked={isGithubLink}
                    onChange={() => setIsGithubLink(true)}
                  />
                  GitHub Link
                </label>
                <label className="ml-4">
                  <input
                    type="radio"
                    value="zip"
                    checked={!isGithubLink}
                    onChange={() => setIsGithubLink(false)}
                  />
                  Upload ZIP File
                </label>
              </div>

              {isGithubLink ? (
                <input
                  type="url"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter GitHub URL..."
                  required
                />
              ) : (
                <div>
                  {/*<label className="block mb-2">Select a ZIP file:</label>*/}
                  <input
                    type="file"
                    accept=".zip"
                    onChange={(e) => {
                      const selectedFile = e.target.files?.[0]; // 使用可选链操作符检查 files 是否为 null
                      if (selectedFile) {
                        setFile(selectedFile);
                      } else {
                        setFile(null); // 如果没有文件选择，清空文件状态
                      }
                    }}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
              )}

              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="mr-2 rounded-md bg-gray-300 p-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-blue-600 text-white p-2"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}