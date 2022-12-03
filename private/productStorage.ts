/*
 * Copyright 2022 Marek Kobida
 */

import modifiers from './modifiers';

export interface ProductOption {
  name: string;
  price: number;
}

export interface Product {
  modifiers: [number, number][];
  name: string;
  options: ProductOption[];
  price: number;
}

const productStorage: Product[] = [
  {
    modifiers,
    name: 'FAN Classic',
    options: [],
    price: 2.8,
  },
  {
    modifiers,
    name: 'FAN Smart',
    options: [],
    price: 2.95,
  },
  {
    modifiers,
    name: 'FAN Premium',
    options: [
      {
        name: 'karabína',
        price: 0.3,
      },
    ],
    price: 2.98,
  },
];

export default productStorage;
