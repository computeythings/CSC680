import React from 'react';

type props = {
  src: string;
  poster?: string;
  width?: number;
  height?: number;
  controls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
};

export default function TrainingVideo({
  src,
  poster,
  width = 940,
  height = 360,
  controls = true,
  autoPlay = false,
  loop = false,
  muted = false,
}: props) {
  return (
    <video
      width={width}
      height={height}
      poster={poster}
      controls={controls}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      className="mx-auto my-4"
    >
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}
