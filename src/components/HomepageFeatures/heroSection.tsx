import Link from "@docusaurus/Link";
import Heading from "@theme/Heading";
import clsx from "clsx";
import classes from "./hero.module.css";

export default function HeroSection() {
  return (
    <section className={classes.heroSection}>
      <div className={clsx(classes.videoContainer, classes.videoDark)}>
        <video
          id="background-video"
          autoPlay
          loop
          muted
          height={"100%"}
          width={"100%"}
          poster={"/img/landing/dev_hub_ani_noblur.png"}
          // style={{ height: "100%", width: "100%" }}
        >
          <source
            src={"/img/landing/dev_hub_ani_dark.webm"}
            type="video/webm"
          ></source>
          <source
            src={"/img/landing/dev_hub_ani_dark.mp4"}
            type="video/mp4"
          ></source>
        </video>
      </div>
      <div className={clsx(classes.videoContainer, classes.videoLight)}>
        <video
          id="background-video"
          autoPlay
          loop
          muted
          height={"100%"}
          width={"100%"}
          poster={"/img/landing/dev_hub_ani_noblur.png"}
          // style={{ height: "100%", width: "100%" }}
        >
          <source
            src={"/img/landing/dev_hub_ani_light.webm"}
            type="video/webm"
          ></source>
          <source
            src={"/img/landing/dev_hub_ani_light.mp4"}
            type="video/mp4"
          ></source>
        </video>
      </div>
      <div className={clsx(classes.content, "container")}>
        <div className={classes.callToAction}>
          <Heading as="h1" className={classes.heading}>
            Flare Developer Hub
          </Heading>
          <p className={classes.description}>
            The decentralization origin for Flare builders. Written by builders,
            for builders
          </p>
          <Link className={classes.button} to="intro">
            <div>Get Started Building</div>
            <div>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.627 8.75H0.5V7.25H12.627L6.93075 1.55375L8 0.5L15.5 8L8 15.5L6.93075 14.4462L12.627 8.75Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
