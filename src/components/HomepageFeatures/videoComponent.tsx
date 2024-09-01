import { useEffect, useState } from "react";

interface VideoComponentProps {
  posterSrc: string;
  videoSrc: Array<{
    src: string;
    type: string;
    media: string;
  }>;
}

export default function VideoComponent({
  posterSrc,
  videoSrc,
}: VideoComponentProps) {
  const [isDesktop, setIsDesktop] = useState(
    window.matchMedia("(min-width: 996px)").matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 996px)");
    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);

    // Cleanup listener on component unmount
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <video
      id="background-video"
      autoPlay
      loop
      muted
      playsInline
      height="100%"
      width="100%"
      preload="auto"
      poster={isDesktop ? posterSrc : undefined}
    >
      {videoSrc.map((video) => (
        <source key={video.src} {...video} />
      ))}
    </video>
  );
}
