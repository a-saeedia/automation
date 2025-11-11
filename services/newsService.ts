import type { NewsArticle } from '../types';

const mockNews: Omit<NewsArticle, 'id' | 'publishedAt'>[] = [
  {
    title: "Bitcoin Surges Past $70,000 as Institutional Interest Grows",
    content: "Bitcoin (BTC) has once again broken the significant $70,000 price barrier, fueled by renewed interest from institutional investors and positive market sentiment. Analysts point to large inflows into Bitcoin ETFs as a primary driver for the recent rally. The move has reignited discussions about a potential new all-time high in the near future.",
    sourceName: "CryptoDaily",
    sourceUrl: "https://example.com/news/btc-70k"
  },
  {
    title: "Ethereum's Dencun Upgrade Reduces Layer 2 Fees by Over 90%",
    content: "The highly anticipated Dencun upgrade on the Ethereum network has successfully been implemented, leading to a dramatic reduction in transaction fees for Layer 2 scaling solutions. Protocols like Arbitrum, Optimism, and Base are reporting fee reductions of over 90%, making the Ethereum ecosystem more affordable and scalable for users.",
    sourceName: "ETH Times",
    sourceUrl: "https://example.com/news/eth-dencun"
  },
  {
    title: "Solana DeFi Protocol Announces Major Airdrop",
    content: "A leading decentralized finance (DeFi) protocol on the Solana blockchain has announced a massive airdrop for its early users and community members. The move is expected to further boost activity on the high-performance blockchain, which has seen a surge in popularity due to its low fees and fast transaction speeds.",
    sourceName: "Solana Sun",
    sourceUrl: "https://example.com/news/solana-airdrop"
  },
  {
    title: "Regulatory Uncertainty Looms Over Stablecoin Issuers",
    content: "Global regulators are increasing their scrutiny of stablecoin issuers, with new frameworks being proposed in both the US and Europe. While the industry generally welcomes clear guidelines, there are concerns that overly strict regulations could stifle innovation and impact the usability of stablecoins in the DeFi ecosystem.",
    sourceName: "Blockchain Ledger",
    sourceUrl: "https://example.com/news/stablecoin-regs"
  },
  {
    title: "Exchange Reserves Hit 3-Year Low, Signaling Strong Holder Sentiment",
    content: "On-chain data from CryptoQuant shows that Bitcoin reserves on major exchanges have dropped to their lowest level in three years. This trend suggests that investors are moving their assets into cold storage, indicating a long-term holding strategy and reducing available sell-side pressure. Analysts interpret this as a bullish signal for the market.",
    sourceName: "CryptoQuant",
    sourceUrl: "https://cryptoquant.com/insights/quicktake"
  },
  {
    title: "BREAKING: US Senator Proposes New Bill for Crypto Regulation Clarity",
    content: "A bipartisan group of US senators has introduced a new bill aimed at providing a clear regulatory framework for digital assets. The proposed legislation seeks to define which cryptocurrencies are commodities versus securities and assign regulatory oversight between the CFTC and SEC. The crypto community is cautiously optimistic about the development.",
    sourceName: "Watcher.Guru",
    sourceUrl: "https://x.com/WatcherGuru"
  },
  {
    title: "Messari Report: The Rise of Decentralized AI and its Investment Thesis",
    content: "Messari's latest Q2 report dives deep into the burgeoning sector of decentralized artificial intelligence (AI). The report highlights how blockchain technology can address key issues in AI, such as data privacy, censorship, and ownership. It outlines key projects in the space and presents a long-term investment thesis for the convergence of AI and crypto.",
    sourceName: "Messari",
    sourceUrl: "https://x.com/MessariCrypto"
  },
  {
    title: "Arkham Intel Reveals Grayscale Transferred 5,000 BTC to New Wallets",
    content: "On-chain analysis by Arkham Intelligence has identified significant movements from wallets associated with Grayscale Bitcoin Trust. Approximately 5,000 BTC was transferred to several new, unidentified wallet addresses. The market is speculating whether this is a routine rebalancing of funds or preparation for OTC deals.",
    sourceName: "Arkham",
    sourceUrl: "https://x.com/arkham"
  }
];

// This function simulates fetching a new, unique article each time it's called by picking one randomly.
export const getLatestNews = (): NewsArticle => {
  const randomIndex = Math.floor(Math.random() * mockNews.length);
  const articleData = mockNews[randomIndex];
  const article: NewsArticle = {
    ...articleData,
    id: `news-${Date.now()}-${randomIndex}`,
    publishedAt: new Date().toISOString(),
  };

  return article;
};