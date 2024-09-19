import React from "react";

export default function YoutubeEmbed({ embedLink }): JSX.Element {
  const src = "https://www.youtube.com/embed/" + embedLink;
  return (
    <div style={{ display: "flex", justifyContent: "center", margin: "30px" }}>
      <iframe
        width="784"
        height="441"
        src={src}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
    </div>
  );
}
