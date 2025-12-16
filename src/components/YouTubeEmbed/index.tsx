import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

interface YoutubeEmbedProps {
  /** The unique YouTube Video ID (e.g., "dQw4w9WgXcQ") */
  videoId: string;
  title?: string;
  privacyMode?: boolean;
  className?: string;
}

const YoutubeEmbed: React.FC<YoutubeEmbedProps> = ({
  videoId,
  title = "YouTube video player",
  privacyMode = true,
  className = "",
}) => {
  if (!videoId) {
    console.error("YoutubeEmbed: videoId prop is required.");
    return <div className={className}>Error: Missing YouTube Video ID.</div>;
  }

  // Determine the base URL based on privacy mode
  const baseUrl = privacyMode
    ? "https://www.youtube-nocookie.com/embed/"
    : "https://www.youtube.com/embed/";

  const embedUrl = `${baseUrl}${videoId}`;

  return (
    <div className={clsx(styles.container, className)}>
      <iframe
        className={styles.iframe}
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        loading="lazy"
      ></iframe>
    </div>
  );
};

export default YoutubeEmbed;
