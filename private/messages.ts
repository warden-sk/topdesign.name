/*
 * Copyright 2022 Marek Kobida
 */

import plural from './plural';

export interface Messages {
  [key: string]: string | ((...$: any) => any);
  ADD_PRODUCT_TO_ORDER: string;
  DELETE_PRODUCT_FROM_ORDER: string;
  NUMBER_OF_OPTIONS: (options: number) => string;
  NUMBER_OF_PIECES: (pieces?: number) => string;
  OPTIONS: string;
  ORDER: string;
  PRICE_FROM_PIECES: (pieces: number) => string;
  PRICE_WITHOUT_VAT: (price: number) => string;
  PRICE_WITHOUT_VAT_FOR_PIECES: (price: number, pieces: number) => string;
  PRODUCT: string;
  TABLE: string;
  WITHOUT_VAT: string;
}

const en: Messages = {
  ADD_PRODUCT_TO_ORDER: 'Add product to\u00A0order',
  DELETE_PRODUCT_FROM_ORDER: 'Delete product from\u00A0order',
  NUMBER_OF_OPTIONS: options => `${plural(options, ['option', 'options', 'options'])}`,
  NUMBER_OF_PIECES: pieces => (pieces ? `${plural(pieces, ['piece', 'pieces', 'pieces'])}` : 'Number of pieces'),
  OPTIONS: 'Options',
  ORDER: 'Order',
  PRICE_FROM_PIECES: pieces => `price from ${plural(pieces, ['piece', 'pieces', 'pieces'])}`,
  PRICE_WITHOUT_VAT: price => `${price.toFixed(2)} € ${en.WITHOUT_VAT}`,
  PRICE_WITHOUT_VAT_FOR_PIECES: (price, pieces) =>
    `${en.PRICE_WITHOUT_VAT(price)} for\u00A0${plural(pieces, ['piece', 'pieces', 'pieces'])}`,
  PRODUCT: 'Product',
  TABLE: 'Table',
  WITHOUT_VAT: 'without\u00A0VAT',
};

const sk: Messages = {
  ADD_PRODUCT_TO_ORDER: 'Pridať produkt do\u00A0objednávky',
  DELETE_PRODUCT_FROM_ORDER: 'Odstrániť produkt z\u00A0objednávky',
  NUMBER_OF_OPTIONS: options => `${plural(options, ['možnosť', 'možnosti', 'možností'])}`,
  NUMBER_OF_PIECES: pieces => (pieces ? `${plural(pieces, ['kus', 'kusy', 'kusov'])}` : 'Počet kusov'),
  OPTIONS: 'Možnosti',
  ORDER: 'Objednávka',
  PRICE_FROM_PIECES: pieces => `cena od ${plural(pieces, ['kusu', 'kusov', 'kusov'])}`,
  PRICE_WITHOUT_VAT: price => `${price.toFixed(2)} € ${sk.WITHOUT_VAT}`,
  PRICE_WITHOUT_VAT_FOR_PIECES: (price, pieces) =>
    `${sk.PRICE_WITHOUT_VAT(price)} za\u00A0${plural(pieces, ['kusu', 'kusov', 'kusov'])}`,
  PRODUCT: 'Produkt',
  TABLE: 'Tabuľka',
  WITHOUT_VAT: 'bez\u00A0DPH',
};

export type L<TT> = TT extends (...args: infer P) => any ? P : any[];

export const availableLanguages = { en, sk };

function getMessage(language: keyof typeof availableLanguages) {
  return <K extends keyof Messages>(key: K, ...$: L<Messages[K]>) => {
    const $$ = availableLanguages[language][key];

    if (typeof $$ === 'string') {
      return $$;
    }

    return $$(...$);
  };
}

export default getMessage;
