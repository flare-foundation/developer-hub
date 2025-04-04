import React, { useState } from "react";
import Link from "@docusaurus/Link";
import Heading from "@theme/Heading";

interface CardOption {
  title: string;
  icon: string;
  description?: string;
  link: string;
  external?: boolean;
  wide?: boolean;
}

interface LogoCardsProps {
  cards: CardOption[];
  columns?: number;
  wide?: boolean;
  minimalMode?: boolean;
}

const LogoCards: React.FC<LogoCardsProps> = ({
  cards,
  columns = 3,
  wide = false,
  minimalMode = false,
}) => {
  // Track which card is being hovered
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const gridStyle = {
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
  };

  return (
    <div className="deploy-tools-cards-grid" style={gridStyle}>
      {cards.map((card, index) => (
        <Link
          key={index}
          to={card.link}
          className={`deploy-tools-card ${hoveredIndex === index ? "deploy-tools-card-active" : ""} 
                      ${minimalMode ? "deploy-tools-card-minimal" : ""} 
                      ${wide || card.wide ? "deploy-tools-card-wide" : ""}`}
          target={card.external ? "_blank" : "_self"}
          rel={card.external ? "noopener noreferrer" : ""}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          onFocus={() => setHoveredIndex(index)}
          onBlur={() => setHoveredIndex(null)}
        >
          <div className="deploy-tools-card-icon">
            <img
              src={card.icon}
              alt={card.title}
              className={
                hoveredIndex === index ? "deploy-tools-icon-active" : ""
              }
            />
          </div>
          <div className="deploy-tools-card-content">
            <Heading as="h3" className="deploy-tools-card-title">
              {card.title}
            </Heading>

            {/* Only show description if not in minimalMode and description exists */}
            {!minimalMode && card.description && (
              <p className="deploy-tools-card-description">
                {card.description}
              </p>
            )}
          </div>
          <div className="deploy-tools-card-arrow">
            {hoveredIndex === index ? "→" : ""}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default LogoCards;
