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
    <Link className={classes.link} to={linkToProtocolDocs}>
      <div className={classes.card}>
        <div className={classes.heading}>
          <div className={classes.title}>
            <div className={classes.iconBox}>
              <Svg className={classes.featureSvg} role="img" />
            </div>
            <Heading as="h2" style={{ margin: 0 }}>
              {title}
            </Heading>
          </div>
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
        <p>{description}</p>
      </div>
    </Link>
  );
}
