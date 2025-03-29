import React from "react";
import Link from "@docusaurus/Link";
import Heading from "@theme/Heading";

interface CardOption {
  title: string;
  icon: string;
  description: string;
  link: string;
  external?: boolean;
}

interface FlareCardsProps {
  cards: CardOption[];
  columns?: number;
}

const FlareCards: React.FC<FlareCardsProps> = ({ cards, columns = 3 }) => {
  const gridStyle = {
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
  };

  return (
    <div className="deploy-tools-cards-grid" style={gridStyle}>
      {cards.map((card, index) => (
        <Link
          key={index}
          to={card.link}
          className="deploy-tools-card"
          target={card.external ? "_blank" : "_self"}
          rel={card.external ? "noopener noreferrer" : ""}
        >
          <div className="deploy-tools-card-icon">
            <img src={card.icon} alt={card.title} />
          </div>
          <div className="deploy-tools-card-content">
            <Heading as="h3" className="deploy-tools-card-title">
              {card.title}
            </Heading>
            <p className="deploy-tools-card-description">{card.description}</p>
          </div>
          <div className="deploy-tools-card-arrow">→</div>
        </Link>
      ))}
    </div>
  );
};

export default FlareCards;
