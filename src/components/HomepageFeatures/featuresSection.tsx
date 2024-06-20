import classes from "./featuresSection.module.css";

import DataConnector from "@site/static/img/DATACONNECTOR.svg";
import FAssets from "@site/static/img/FASSETS.svg";
import FTSO from "@site/static/img/FTSO.svg";
import FeatureCard from "./featureCard";

export type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<"svg">>;
  description: JSX.Element;
  linkToProtocolDocs: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: "FTSO",
    Svg: FTSO,
    description: (
      <>
        High-integrity, block-latency data feeds for decentralized finance on
        Flare
      </>
    ),
    linkToProtocolDocs: "/ftso/overview",
  },
  {
    title: "FDC",
    Svg: DataConnector,
    description: (
      <>
        Interoperable, tamper-proof Web2 & Web3 data for real-world applications
      </>
    ),
    linkToProtocolDocs: "/fdc/overview",
  },
  {
    title: "FAssets",
    Svg: FAssets,
    description: (
      <>
        Verifiable economic security for bridging BTC, XRP, and non
        smart-contract tokens
      </>
    ),
    linkToProtocolDocs: "/fassets/overview",
  },
];

// function FeatureCard({
//   title,
//   Svg,
//   description,
//   linkToProtocolDocs,
// }: FeatureItem) {
//   return (
//     <div className={clsx("col col--4")}>
//       <div className="card margin-left--sm margin-right--sm margin-bottom--lg">
//         <div className="card__header text--center">
//           <Svg className={styles.featureSvg} role="img" />
//         </div>
//         <div className="card__body text--center">
//           <Heading as="h2">{title}</Heading>
//           <p>{description}</p>
//         </div>
//         <div className="card__footer text--center">
//           <Link
//             className="button button--outline button--primary button--md"
//             to={linkToProtocolDocs}
//           >
//             Protocol Docs
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

export default function FeaturesSection(): JSX.Element {
  return (
    <section className={classes.features}>
      <div className="container">
        {/* <div className="row"> */}
        <div className={classes.cards}>
          {FeatureList.map((props, idx) => (
            <FeatureCard key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
