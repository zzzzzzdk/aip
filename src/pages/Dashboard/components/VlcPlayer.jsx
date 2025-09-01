// components/VlcPlayer.jsx
import React from "react";

const VlcPlayer = ({ videoUrl }) => {
  const launchVLC = () => {
    // 规范化 URL 格式
    const normalizedUrl = videoUrl
      .replace(/(https?):\/\//, '$1://') // 修复缺失的冒号
      .replace(/\/$/, ''); // 删除结尾斜杠
  
    // // 编码特殊字符（如空格、中文等）
    // const encodedUrl = encodeURIComponent(normalizedUrl);
    
    // // 构造符合 VLC 要求的 MRL
    // const vlcMRL = `vlc://${encodedUrl}`;

    const vlcMRL = `${normalizedUrl}`;
    console.log(vlcMRL)
    // 通过 iframe 触发协议（兼容现代浏览器安全策略）
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = vlcMRL;
    document.body.appendChild(iframe);
    setTimeout(() => document.body.removeChild(iframe), 100);
  };

  return (
    <button onClick={launchVLC} className="vlc-button">
      用 VLC 播放
    </button>
  );
};

export default VlcPlayer;
