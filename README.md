# Onchain Packs

Minimal Next.js site for on-chain welcome packs. The home page is the pack picker. Choosing a pack opens the buy panel and the possible hits. Marketplace and leaderboard are placeholders.

The smart wallet control follows the Hypergamble modal flow: connect, create, then balance with deposit and withdraw. Balances in this build stay in the browser.

## Stack

- Node.js 24.19.0
- Next.js 16.3.8
- React 19.3.0
- TypeScript 6.0.3 (newest release the Next.js ESLint config accepts; 7.0.2 is published, and that config still rejects it)
- Tailwind CSS 4.3

## Run

```bash
npm install
npm run dev
```
