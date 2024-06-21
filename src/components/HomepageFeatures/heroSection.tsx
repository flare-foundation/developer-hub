import classes from "./hero.module.css";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import Heading from "@theme/Heading";

export default function HeroSection() {
  return (
    <section className={classes.heroSection}>
      <div className={clsx(classes.content, "container")}>
        <div className={classes.callToAction}>
          <Heading as="h1" className={classes.heading}>
            Flare Developer Hub
          </Heading>
          <p className={classes.description}>
            The decentralization origin for Flare builders. Written by builders,
            for builders
          </p>
          <Link className={classes.button} to="docs/intro">
            <div>Get Started Building</div>
            <div>
              {" "}
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
