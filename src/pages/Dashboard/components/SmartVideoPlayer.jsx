// components/SmartVideoPlayer.jsx
import React, { useState } from 'react';
import VlcPlayer from './VlcPlayer';

const SmartVideoPlayer = ({ videoUrl }) => {
  const [showFallback, setShowFallback] = useState(false);

  // 协议调用失败时的回退
  const handleFallback = () => {
    setShowFallback(true);
  };

  return (
    <div className="video-container">
      {!showFallback ? (
        <div>
          <VlcPlayer videoUrl={videoUrl} onError={handleFallback} />
          <p className="tip">点击按钮将在 VLC 中打开</p>
        </div>
      ) : (
        <div className="fallback-player">
          <video controls width="100%">
            <source src={videoUrl} type="video/mp4" />
            您的浏览器不支持视频播放
          </video>
          <p className="warning">未检测到 VLC，已切换网页播放器</p>
        </div>
      )}
    </div>
  );
};

export default SmartVideoPlayer;