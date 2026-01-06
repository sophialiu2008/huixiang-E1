import React from 'react';
// 注意：如果通过 importmap 引入，建议直接写 'react-dom/client'
import ReactDOM from 'react-dom/client';
// 引用本地组件建议加上后缀，确保浏览器能找到文件
import App from './App.tsx'; 

const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error("找不到 root 节点，请检查 index.html 中是否存在 <div id='root'></div>");
}

// 创建 React 根实例
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    {/* 建议外层包裹一个最小高度，彻底解决图表 width/height (-1) 的报错 */}
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <App />
    </div>
  </React.StrictMode>
);
