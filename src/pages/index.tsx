import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";

import FeaturesSection from "../components/HomepageFeatures/featuresSection";
import HeroSection from "../components/HomepageFeatures/heroSection";

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={`${siteConfig.title}`} description={`${siteConfig.tagline}`}>
      <main>
        <HeroSection />
        <FeaturesSection />
      </main>
    </Layout>
  );
}
