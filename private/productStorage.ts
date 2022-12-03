/*
 * Copyright 2022 Marek Kobida
 */

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

//----------------------------------------------------------------------------------------------------------------------

const firstCategoryModifiers: [number, number][] = [
  [50, 140],
  [100, 125],
  [200, 118],
  [300, 115],
  [400, 112],
  [500, 110],
  [600, 108],
  [700, 106],
  [800, 104],
  [900, 102],
  [1000, 100],
];

const productStorage: Product[] = [
  {
    modifiers: firstCategoryModifiers,
    name: 'FAN Classic',
    options: [],
    price: 2.8,
  },
  {
    modifiers: firstCategoryModifiers,
    name: 'FAN Smart',
    options: [],
    price: 2.95,
  },
  {
    modifiers: firstCategoryModifiers,
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
