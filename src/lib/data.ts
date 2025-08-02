import type { Item } from './types';

export const mockItems: Item[] = [
  {
    id: '1',
    type: 'found',
    name: 'Brown Leather Wallet',
    category: 'Wallets',
    description: 'A standard brown leather bifold wallet. Contains various cards but no ID.',
    distinguishingMarks: 'Slight scratch on the front bottom right corner.',
    location: 'Central Park, near the fountain',
    date: new Date('2024-07-20'),
    imageUrl: 'https://placehold.co/600x400',
    contact: 'user1@example.com',
    lat: 40.7812,
    lng: -73.9665
  },
  {
    id: '2',
    type: 'lost',
    name: 'iPhone 14 Pro',
    category: 'Electronics',
    description: 'A deep purple iPhone 14 Pro in a clear case.',
    distinguishingMarks: 'Has a small crack on the back camera glass. Wallpaper is a picture of a golden retriever.',
    location: 'Subway, Line 2',
    date: new Date('2024-07-22'),
    imageUrl: 'https://placehold.co/600x400',
    contact: 'user2@example.com',
    lat: 40.7527,
    lng: -73.9772
  },
  {
    id: '3',
    type: 'found',
    name: 'Set of Keys',
    category: 'Keys',
    description: 'A set of three keys on a silver keyring.',
    distinguishingMarks: 'One key is for a car (Toyota) and there is a small green rabbit foot keychain attached.',
    location: 'Times Square, near the TKTS booth',
    date: new Date('2024-07-21'),
    imageUrl: 'https://placehold.co/600x400',
    contact: 'user3@example.com',
    lat: 40.7580,
    lng: -73.9855
  },
  {
    id: '4',
    type: 'found',
    name: 'Black Ray-Ban Sunglasses',
    category: 'Accessories',
    description: 'Classic Ray-Ban Wayfarer sunglasses, black frame.',
    distinguishingMarks: 'Small white paint speck on the left lens.',
    location: 'Museum of Modern Art (MoMA)',
    date: new Date('2024-07-19'),
    imageUrl: 'https://placehold.co/600x400',
    contact: 'user4@example.com',
    lat: 40.7614,
    lng: -73.9776
  },
    {
    id: '5',
    type: 'lost',
    name: 'Blue Hydro Flask Water Bottle',
    category: 'Bottles',
    description: 'A 32oz Hydro Flask in cobalt blue.',
    distinguishingMarks: 'Has several stickers: one of a mountain range, one that says "Yosemite", and a small cartoon cactus.',
    location: 'Grand Central Terminal',
    date: new Date('2024-07-23'),
    imageUrl: 'https://placehold.co/600x400',
    contact: 'user5@example.com',
    lat: 40.7527,
    lng: -73.9772
  },
  {
    id: '6',
    type: 'found',
    name: 'Child\'s Teddy Bear',
    category: 'Toys',
    description: 'A small, well-loved brown teddy bear.',
    distinguishingMarks: 'Missing its left eye and has a red ribbon tied around its neck.',
    location: 'Brooklyn Bridge Park',
    date: new Date('2024-07-22'),
    imageUrl: 'https://placehold.co/600x400',
    contact: 'user6@example.com',
    lat: 40.7029,
    lng: -73.9961
  }
];

export const itemCategories = [
  "electronics",
  "wallets",
  "keys",
  "accessories",
  "bags",
  "clothing",
  "bottles",
  "toys",
  "documents",
  "other"
];
