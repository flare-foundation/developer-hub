import classes from "./featuresSection.module.css";

import DataConnector from "@site/static/img/DATACONNECTOR_new.svg";
import FAssets from "@site/static/img/FASSETS_new.svg";
import FTSO from "@site/static/img/FTSO_new.svg";
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
        Tamper-proof consensus on Web2 & Web3 data for real-world applications
        on Flare
      </>
    ),
    linkToProtocolDocs: "/fdc/overview",
  },
  {
    title: "FAssets",
    Svg: FAssets,
    description: (
      <>
        Verifiable economic security enabling decentralized finance for BTC,
        DOGE and XRP on Flare
      </>
    ),
    linkToProtocolDocs: "/fassets/overview",
  },
];

export default function FeaturesSection(): JSX.Element {
  return (
    <section className={classes.features}>
      <div className="container">
        <div className={classes.cards}>
          {FeatureList.map((props, idx) => (
            <FeatureCard key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
