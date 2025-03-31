import React from "react";
import ThemedImage from "@theme/ThemedImage";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Link from "@docusaurus/Link";
import CopyButton from "./CopyButton";
import Heading from "@theme/Heading";

// Import SVG components
import DataConnector from "@site/static/img/DATACONNECTOR_new.svg";
import FAssets from "@site/static/img/FASSETS_new.svg";
import FTSO from "@site/static/img/FTSO_new.svg";

export default function FlareLandingPage() {
  const developmentResources = [
    {
      text: "JavaScript",
      link: "/network/guides/flare-for-javascript-developers",
    },
    { text: "Python", link: "/network/guides/flare-for-python-developers" },
    { text: "Rust", link: "/network/guides/flare-for-rust-developers" },
    { text: "Go", link: "/network/guides/flare-for-go-developers" },
  ];

  const productGuides = [
    { text: "FTSOv2 Guides", link: "/category/ftso/guides" },
    { text: "FDC Guides", link: "/category/fdc-guides" },
    { text: "FAssets Guides", link: "/category/fassets-guides" },
    { text: "Network Guides", link: "/category/network/guides" },
  ];

  const references = [
    { text: "FTSOv2 Reference", link: "/ftso/solidity-reference" },
    { text: "FDC Reference", link: "/fdc/reference" },
    { text: "FAssets Reference", link: "/fassets/reference" },
    { text: "Network Reference", link: "/network/solidity-reference" },
  ];

  const contributeResources = [
    {
      text: "Contribute to Flare Developer Hub",
      link: "https://github.com/flare-foundation/developer-hub",
    },
    {
      text: "Become an FTSO data provider",
      link: "/run-node/ftso-data-provider",
    },
    {
      text: "Run a Flare validator",
      link: "/run-node/validator-node",
    },
  ];

  function ResourceColumn({ title, items }) {
    return (
      <div className="flare-resource-column">
        <Heading as="h3" className="flare-resource-column-title">
          {title}
        </Heading>
        <ul className="flare-resource-column-list">
          {items.map((item, index) => (
            <li key={index} className="flare-resource-column-item">
              <Link to={item.link} className="flare-resource-column-link">
                {item.text}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="flare-landing-container">
      <div className="flare-hero-section">
        <Heading as="h1" className="flare-hero-title">
          <span className="flare-highlight">Flare</span> is the blockchain for
          data <span className="flare-sun-emoji">☀️</span>
        </Heading>
        <p className="flare-hero-subtitle">
          The decentralized origin for Flare builders.
        </p>
        <div className="flare-hero-buttons">
          <Link
            to="/network/getting-started"
            className="flare-hero-button primary"
          >
            Get Started
          </Link>
          <Link
            to="/network/developer-tools"
            className="flare-hero-button secondary"
          >
            Developer Tools
          </Link>
        </div>
      </div>

      <div className="flare-products-section">
        <Heading as="h2" className="flare-section-title">
          Products
        </Heading>
        <div className="flare-products-grid">
          <Link to="/ftso/overview" className="flare-product-link">
            <div className="flare-product-card">
              <div className="flare-product-header">
                <div className="flare-product-title-container">
                  <FTSO className="flare-product-svg" role="img" />
                  <span className="flare-product-title">FTSOv2</span>
                </div>
                <div className="flare-product-arrow">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 18L15 12L9 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <p className="flare-product-description">
                Flare Time Series Oracle: Secure, decentralized price and data
                feeds updating every ≈1.8 seconds.
              </p>
            </div>
          </Link>

          <Link to="/fdc/overview" className="flare-product-link">
            <div className="flare-product-card">
              <div className="flare-product-header">
                <div className="flare-product-title-container">
                  <DataConnector className="flare-product-svg" role="img" />
                  <span className="flare-product-title">FDC</span>
                </div>
                <div className="flare-product-arrow">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 18L15 12L9 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <p className="flare-product-description">
                Flare Data Connector: Access high-integrity data from other
                chains and Web2 APIs securely.
              </p>
            </div>
          </Link>

          <Link to="/fassets/overview" className="flare-product-link">
            <div className="flare-product-card">
              <div className="flare-product-header">
                <div className="flare-product-title-container">
                  <FAssets className="flare-product-svg" role="img" />
                  <span className="flare-product-title">FAssets</span>
                </div>
                <div className="flare-product-arrow">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 18L15 12L9 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <p className="flare-product-description">
                Utilize assets from other chains on Flare through secure,
                decentralized protocols.
              </p>
            </div>
          </Link>
        </div>
      </div>

      <div className="flare-networks-section">
        <Heading as="h2" className="flare-section-title">
          Set Up, Build & Deploy with Flare
        </Heading>
        <div className="flare-networks-table-container">
          <table className="flare-networks-table">
            <thead>
              <tr>
                <th className="network-col">Network</th>
                <th className="mainnet-col">Flare Mainnet</th>
                <th className="testnet-col">Flare Testnet (Coston2)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>RPC Endpoint</td>
                <td>
                  <div className="flare-network-item">
                    <span className="network-value">
                      https://flare.rpc.thirdweb.com
                    </span>
                    <CopyButton textToCopy="https://flare.rpc.thirdweb.com" />
                  </div>
                </td>
                <td>
                  <div className="flare-network-item">
                    <span className="network-value">
                      https://flare-testnet-coston2.rpc.thirdweb.com
                    </span>
                    <CopyButton textToCopy="https://flare-testnet-coston2.rpc.thirdweb.com" />
                  </div>
                </td>
              </tr>
              <tr>
                <td>Chain ID</td>
                <td>
                  <div className="flare-network-item">
                    <span className="network-value">14</span>
                    <CopyButton textToCopy="14" />
                  </div>
                </td>
                <td>
                  <div className="flare-network-item">
                    <span className="network-value">114</span>
                    <CopyButton textToCopy="114" />
                  </div>
                </td>
              </tr>
              <tr>
                <td>Currency</td>
                <td>FLR</td>
                <td>C2FLR</td>
              </tr>
              <tr>
                <td>Block Explorer</td>
                <td>
                  <div className="flare-network-item">
                    <span className="network-value">
                      mainnet.flarescan.com/
                    </span>
                    <CopyButton textToCopy="https://mainnet.flarescan.com/" />
                  </div>
                </td>
                <td>
                  <div className="flare-network-item">
                    <span className="network-value">
                      coston2-explorer.flare.network/
                    </span>
                    <CopyButton textToCopy="https://coston2-explorer.flare.network/" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="flare-resources-section">
        <Heading as="h2" className="flare-section-title">
          Developer Resources
        </Heading>
        <div className="flare-resources-grid">
          <ResourceColumn
            title="Build with your language"
            items={developmentResources}
          />
          <ResourceColumn title="Product Guides" items={productGuides} />
          <ResourceColumn title="API References" items={references} />
        </div>
      </div>

      <div className="flare-architecture-section">
        <Heading as="h2" className="flare-section-title">
          Understand the Architecture
        </Heading>
        <p className="flare-architecture-description">
          Build a strong understanding of the core concepts that set Flare apart
          from other blockchains. Flare's data protocols are enshrined into the
          core protocol of Flare, inheriting the economic security of the entire
          network.
        </p>
        <div className="flare-architecture-image">
          <ThemedImage
            alt="Flare Architecture"
            sources={{
              light: useBaseUrl("img/flare_architecture_light.svg"),
              dark: useBaseUrl("img/flare_architecture_dark.svg"),
            }}
          />
        </div>
      </div>

      <div className="flare-contribute-section">
        <Heading as="h2" className="flare-section-title">
          Contribute to Flare
        </Heading>
        <div className="flare-contribute-grid">
          {contributeResources.map((resource, index) => (
            <Link
              key={index}
              to={resource.link}
              className="flare-contribute-card"
            >
              <Heading as="h3" className="flare-contribute-card-title">
                {resource.text}
              </Heading>
              <span className="flare-contribute-card-arrow">→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
