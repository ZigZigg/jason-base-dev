'use client';

import { PlayCircleFilled } from '@ant-design/icons';
import { Spin } from 'antd';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface VideoPlayerProps {
  file_uri: string;
  thumbnail_file_uri: string;
}

const VideoPlayer = ({ file_uri, thumbnail_file_uri }: VideoPlayerProps) => {

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showThumbnail, setShowThumbnail] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Reset states when video changes
  useEffect(() => {
    setShowThumbnail(true);
    setIsLoading(true);
    setIsPlaying(false);

    // If video was already loaded, force a reload
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, []);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
        setShowThumbnail(false);
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement) {
      const handleLoadStart = () => {
        setIsLoading(true);
      };

      const handleCanPlay = () => {
        setIsLoading(false);
      };

      const handlePlay = () => {
        setShowThumbnail(false);
      };

      videoElement.addEventListener('loadstart', handleLoadStart);
      videoElement.addEventListener('canplay', handleCanPlay);
      videoElement.addEventListener('play', handlePlay);

      return () => {
        videoElement.removeEventListener('loadstart', handleLoadStart);
        videoElement.removeEventListener('canplay', handleCanPlay);
        videoElement.removeEventListener('play', handlePlay);
      };
    }
  }, []);

  return (
    <div id="video-player" className="flex-1 flex flex-col order-2 md:order-1 z-0">
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
        {showThumbnail && thumbnail_file_uri && (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center bg-black"
            onClick={!isLoading ? handlePlayPause : undefined}
            style={!isLoading ? { cursor: 'pointer' } : undefined}
          >
            <Image
              src={thumbnail_file_uri}
              alt="Video thumbnail"
              layout="fill"
              objectFit="contain"
              priority
            />
            <div className="absolute inset-0 flex items-center justify-center">
              {isLoading ? (
                <Spin size="large" />
              ) : (
                <PlayCircleFilled className="text-white text-6xl opacity-80 hover:opacity-100 transition-opacity pointer-events-none" />
              )}
            </div>
          </div>
        )}
        <video
          ref={videoRef}
          src={file_uri}
          className="w-full h-full"
          onClick={handlePlayPause}
          controls
          preload="auto"
          muted={true}
          playsInline={true}
          autoPlay={true}
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
