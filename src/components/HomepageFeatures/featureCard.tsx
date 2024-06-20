import { FeatureItem } from "./featuresSection";
import classes from "./featureCard.module.css";
import Link from "@docusaurus/Link";
import Heading from "@theme/Heading";

export default function FeatureCard({
  title,
  Svg,
  description,
  linkToProtocolDocs,
}: FeatureItem) {
  return (
    <Link className={classes.card} to={linkToProtocolDocs}>
      <div className={classes.heading}>
        <div>
          {/* <Svg /> */}
          <Heading as="h2">{title}</Heading>
        </div>
        <div>puiscica</div>
      </div>
      <p>{description}</p>
    </Link>
  );
}
