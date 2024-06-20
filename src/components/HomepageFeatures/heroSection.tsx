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
            Get Started Building →
          </Link>
        </div>
      </div>
    </section>
  );
}
