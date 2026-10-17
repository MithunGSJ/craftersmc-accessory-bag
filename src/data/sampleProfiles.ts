import { PlayerAccessoryItem } from './accessoryTypes.ts';

export interface SampleProfile {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly gamertag: string;
  readonly profileName: string;
  readonly items: readonly PlayerAccessoryItem[];
}

export const SAMPLE_PROFILES: readonly SampleProfile[] = [
  {
    id: 'fresh',
    name: 'Fresh Profile',
    description: 'Brand new player account with an empty accessory bag (0 accessories owned).',
    gamertag: 'NewCrafter',
    profileName: 'Apple',
    items: []
  }
];

