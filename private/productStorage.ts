export interface ProductOption {
  name: string;
  price: number;
}

export interface Product {
  name: string;
  options: ProductOption[];
  price: number;
}

const productStorage: Product[] = [
  {
    name: 'FAN Classic',
    options: [],
    price: 2.8,
  },
  {
    name: 'FAN Smart',
    options: [],
    price: 2.95,
  },
  {
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
