import React from "react";
import Link from "@docusaurus/Link";
import Heading from "@theme/Heading";

interface Whitepaper {
  title: string;
  date: string;
  path: string;
  category: "white-papers" | "research" | "analytics";
}

const whitepaperData: Whitepaper[] = [
  // White Papers
  {
    title: "The Flare Data Connector",
    date: "14 January 2025",
    path: "/pdf/whitepapers/20240224-FlareDataConnector.pdf",
    category: "white-papers",
  },
  {
    title: "FTSOv2",
    date: "9 September 2024",
    path: "/pdf/whitepapers/20240223-FlareTimeSeriesOracleV2.pdf",
    category: "white-papers",
  },
  {
    title: "The Flare network and FLR token",
    date: "30 December 2022",
    path: "/pdf/whitepapers/20221231-Flare-White-Paper-v2.pdf",
    category: "white-papers",
  },

  // Flare Research
  {
    title:
      "Consensus learning: A novel decentralised ensemble learning paradigm",
    date: "25 February 2024",
    path: "/pdf/whitepapers/20240225-ConsensusLearning.pdf",
    category: "research",
  },
  {
    title: "A hybrid post-quantum digital signature scheme for the EVM",
    date: "5 July 2022",
    path: "/pdf/whitepapers/20220722-Post-Quantum-Digital-Signature-Scheme.pdf",
    category: "research",
  },
  {
    title: "Flare Consensus Protocol",
    date: "5 November 2019",
    path: "/pdf/whitepapers/20191105-FCP-White-Paper.pdf",
    category: "research",
  },

  // Analytics
  {
    title: "Kraken exchange - FTSO price comparison",
    date: "6 April 2023",
    path: "/pdf/whitepapers/20230406-FTSO_Kraken.pdf",
    category: "analytics",
  },
  {
    title: "STP.02 - Impact of secondary FTSO reward band",
    date: "29 May 2023",
    path: "/pdf/whitepapers/20230529-Flare-Analytics-Report-02-Impact-of-the-secondary-FTSO-reward-band.pdf",
    category: "analytics",
  },
];

const WhitepapersGrid: React.FC = () => {
  // Group whitepapers by category
  const whitePapers = whitepaperData.filter(
    (paper) => paper.category === "white-papers",
  );
  const research = whitepaperData.filter(
    (paper) => paper.category === "research",
  );
  const analytics = whitepaperData.filter(
    (paper) => paper.category === "analytics",
  );

  return (
    <div className="whitepapers-container">
      {/* White Papers Section */}
      <section className="whitepapers-section">
        <Heading as="h2" className="whitepapers-section-title">
          Whitepapers
        </Heading>
        <div className="whitepapers-grid">
          {whitePapers.map((paper, index) => (
            <Link
              key={`white-papers-${index}`}
              to={paper.path}
              className="whitepapers-card"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="whitepapers-card-content">
                <Heading as="h3" className="whitepapers-card-title">
                  {paper.title}
                </Heading>
                <p className="whitepapers-card-date">{paper.date}</p>
              </div>
              <div className="whitepapers-arrow-icon">→</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Flare Research Section */}
      <section className="whitepapers-section">
        <Heading as="h2" className="whitepapers-section-title">
          Flare Research
        </Heading>
        <div className="whitepapers-grid">
          {research.map((paper, index) => (
            <Link
              key={`research-${index}`}
              to={paper.path}
              className="whitepapers-card"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="whitepapers-card-content">
                <Heading as="h3" className="whitepapers-card-title">
                  {paper.title}
                </Heading>
                <p className="whitepapers-card-date">{paper.date}</p>
              </div>
              <div className="whitepapers-arrow-icon">→</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Analytics Section */}
      <section className="whitepapers-section">
        <Heading as="h2" className="whitepapers-section-title">
          Analytics
        </Heading>
        <div className="whitepapers-grid">
          {analytics.map((paper, index) => (
            <Link
              key={`analytics-${index}`}
              to={paper.path}
              className="whitepapers-card"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="whitepapers-card-content">
                <Heading as="h3" className="whitepapers-card-title">
                  {paper.title}
                </Heading>
                <p className="whitepapers-card-date">{paper.date}</p>
              </div>
              <div className="whitepapers-arrow-icon">→</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default WhitepapersGrid;
