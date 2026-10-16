import snapshot from './pricingSnapshot.json';

export interface MaterialPriceSnapshot {
  readonly avgPrice: number;
  readonly weeklyAveragePrice: number;
}

export interface AuctionPriceSnapshot {
  readonly minPrice: number;
  readonly maxPrice: number;
  readonly avgPrice: number;
  readonly count: number;
  readonly totalCount?: number;
  readonly hasBin?: boolean;
}

export const BAZAAR_SNAPSHOT: Record<string, MaterialPriceSnapshot> = snapshot.bazaar as Record<string, MaterialPriceSnapshot>;
export const AUCTION_SNAPSHOT: Record<string, AuctionPriceSnapshot> = snapshot.auctions as Record<string, AuctionPriceSnapshot>;
