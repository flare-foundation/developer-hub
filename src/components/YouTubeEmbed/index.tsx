import React, { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import Head from "@docusaurus/Head";
import styles from "./styles.module.css";

type LoadStrategy = "onVisible" | "eager";

interface YouTubeEmbedProps {
  /** The unique YouTube Video ID (e.g., "dQw4w9WgXcQ") */
  videoId: string;
  title?: string;
  privacyMode?: boolean;
  loadStrategy?: LoadStrategy;
  rootMargin?: string;
  startSeconds?: number;
  className?: string;
}

const clampInt = (v: number) => Math.max(0, Math.floor(v));

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({
  videoId,
  title = "YouTube video player",
  privacyMode = true,
  loadStrategy = "eager",
  rootMargin = "250px",
  startSeconds,
  className = "",
}) => {
  if (!videoId) {
    return <div className={className}>Error: Missing YouTube Video ID.</div>;
  }

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isActivated, setIsActivated] = useState(loadStrategy === "eager");

  const baseUrl = privacyMode
    ? "https://www.youtube-nocookie.com/embed/"
    : "https://www.youtube.com/embed/";

  const thumbnailUrl = useMemo(
    () => `https://i.ytimg.com/vi/${encodeURIComponent(videoId)}/hqdefault.jpg`,
    [videoId],
  );

  const embedUrl = useMemo(() => {
    const params = new URLSearchParams({
      rel: "0",
      modestbranding: "1",
      playsinline: "1",
    });

    if (typeof startSeconds === "number" && Number.isFinite(startSeconds)) {
      params.set("start", String(clampInt(startSeconds)));
    }

    return `${baseUrl}${encodeURIComponent(videoId)}?${params.toString()}`;
  }, [baseUrl, videoId, startSeconds]);

  useEffect(() => {
    if (isActivated) return;
    if (loadStrategy !== "onVisible") return;

    const el = containerRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setIsActivated(true);
          obs.disconnect();
        }
      },
      { root: null, rootMargin, threshold: 0.01 },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [isActivated, loadStrategy, rootMargin]);

  return (
    <div ref={containerRef} className={clsx(styles.container, className)}>
      <Head>
        <link rel="preconnect" href="https://i.ytimg.com" />
        <link
          rel="preconnect"
          href={
            privacyMode
              ? "https://www.youtube-nocookie.com"
              : "https://www.youtube.com"
          }
        />
        <link rel="preconnect" href="https://www.google.com" />
        <link rel="preconnect" href="https://www.gstatic.com" crossOrigin="" />
      </Head>

      {isActivated ? (
        <iframe
          className={styles.iframe}
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          loading={loadStrategy === "eager" ? "eager" : "lazy"}
        />
      ) : (
        <div className={styles.placeholder} aria-hidden="true">
          <img
            className={styles.thumbnail}
            src={thumbnailUrl}
            alt=""
            loading="lazy"
            decoding="async"
          />
          <span className={styles.playButton} aria-hidden="true" />
        </div>
      )}
    </div>
  );
};

export default YouTubeEmbed;
