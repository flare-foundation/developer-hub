import React from 'react';
import ThemedImage from "@theme/ThemedImage";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Link from '@docusaurus/Link';


function ProductCard({ title, description, icon, link }) {
    return (
        <div className="flare-product-card">
            <div className="flare-product-card-header">
                <div className="flare-product-card-icon">{icon}</div>
                <h3 className="flare-product-card-title">{title}</h3>
            </div>
            <p className="flare-product-card-description">{description}</p>
            <Link to={link} className="flare-product-card-link">
                Learn more <span>→</span>
            </Link>
        </div>
    );
}

function ResourceColumn({ title, items }) {
    return (
        <div className="flare-resource-column">
            <h3 className="flare-resource-column-title">{title}</h3>
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

export default function FlareLandingPage() {
    const developmentResources = [
        { text: 'JavaScript', link: '/network/guides/flare-for-javascript-developers' },
        { text: 'Python', link: '/network/guides/flare-for-python-developers' },
        { text: 'Rust', link: '/network/guides/flare-for-rust-developers' },
        { text: 'Go', link: '/network/guides/flare-for-go-developers' },
    ];

    const productGuides = [
        { text: 'FTSOv2 Guides', link: '/category/ftso/guides' },
        { text: 'FDC Guides', link: '/category/fdc/guides' },
        { text: 'FAssets Guides', link: '/category/fassets/guides' },
        { text: 'Network Guides', link: '/category/network/guides' },
    ];

    const references = [
        { text: 'FTSOv2 Reference', link: '/ftso/solidity-reference' },
        { text: 'FDC Reference', link: '/fdc/reference' },
        { text: 'FAssets Reference', link: '/fassets/reference' },
        { text: 'Network Reference', link: '/network/solidity-reference' },
    ];

    const contributeResources = [
        { text: 'Contribute to Flare\'s open-source codebase', link: 'https://github.com/flare-foundation' },
        { text: 'Become an FTSO data provider', link: '/run-node/ftso-data-provider' },
        { text: 'Run a Flare validator', link: '/run-node/validator-node' },
    ];

    return (
        <div className="flare-landing-container">
            <div className="flare-hero-section">
                <div className="flare-hero-content">
                    <h1 className="flare-hero-title">
                        <span className="flare-highlight">Flare</span> is the blockchain for data <span className="flare-sun-emoji">☀️</span>
                    </h1>
                    <p className="flare-hero-subtitle">
                        The decentralized origin for Flare builders.
                    </p>
                    <div className="flare-hero-buttons">
                        <Link to="/network/getting-started" className="flare-hero-button primary">
                            Get Started
                        </Link>
                        <Link to="/ftso/overview" className="flare-hero-button secondary">
                            Learn about FTSOv2
                        </Link>
                    </div>
                </div>
            </div>

            <div className="flare-products-section">
                <h2 className="flare-section-title">Core Protocol Components</h2>
                <div className="flare-products-grid">
                    <ProductCard
                        title="FTSOv2"
                        description="Flare Time Series Oracle: Secure, decentralized price and data feeds updating every ≈1.8 seconds."
                        icon="⏱️"
                        link="/ftso/overview"
                    />
                    <ProductCard
                        title="FDC"
                        description="Flare Data Connector: Access high-integrity data from other chains and Web2 APIs securely."
                        icon="🔗"
                        link="/fdc/overview"
                    />
                    <ProductCard
                        title="FAssets"
                        description="Utilize assets from other chains on Flare through secure, decentralized protocols."
                        icon="💱"
                        link="/fassets/overview"
                    />
                </div>
            </div>

            <div className="flare-architecture-section">
                <h2 className="flare-section-title">Understand the Architecture</h2>
                <p className="flare-architecture-description">
                    Build a strong understanding of the core concepts that set Flare apart from other blockchains. Flare's data protocols are enshrined into the core protocol of Flare, inheriting the economic security of the entire network.
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

            <div className="flare-resources-section">
                <h2 className="flare-section-title">Developer Resources</h2>
                <div className="flare-resources-grid">
                    <ResourceColumn
                        title="Build with your language"
                        items={developmentResources}
                    />
                    <ResourceColumn
                        title="Product Guides"
                        items={productGuides}
                    />
                    <ResourceColumn
                        title="API References"
                        items={references}
                    />
                </div>
            </div>

            <div className="flare-contribute-section">
                <h2 className="flare-section-title">Contribute to Flare</h2>
                <div className="flare-contribute-grid">
                    {contributeResources.map((resource, index) => (
                        <Link key={index} to={resource.link} className="flare-contribute-card">
                            <h3 className="flare-contribute-card-title">{resource.text}</h3>
                            <span className="flare-contribute-card-arrow">→</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}