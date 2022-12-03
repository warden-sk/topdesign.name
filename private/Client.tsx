/*
 * Copyright 2022 Marek Kobida
 */

import './Client.css';

import type { Product, ProductOption } from './productStorage';
import React from 'react';
import Table from './Table';
import gt from './messages';
import productStorage from './productStorage';

let messages = gt('sk');

function findRight(product: Product, sumAc: number, totalks: number, ks: number): number {
  const i = product.modifiers.findIndex(($$, j) => {
    const l = $$[0];

    const r = product.modifiers?.[j + 1]?.[0] ?? Number.MAX_SAFE_INTEGER;

    return totalks >= l && totalks < r;
  });

  if (i !== -1) {
    const percentage = product.modifiers[i][1];

    const cenaZaKus = (percentage / 100) * product.price + sumAc;

    return +(cenaZaKus * ks);
  }

  return 0;
}

function Tstik({
  id,
  totalks,
  onDelete,
  onPrice,
}: {
  id: string;
  totalks: number;
  onDelete: () => void;
  onPrice: (price: [number, number]) => void;
}) {
  const [currentProduct, updateCurrentProduct] = React.useState<Product>(productStorage[0]);
  const [ks, updateKs] = React.useState<number>(50);

  const [accessories, updateAccessories] = React.useState<Set<ProductOption>>(new Set());

  const sumAc = [...accessories].reduce((partialSum, a) => partialSum + a.price, 0);

  function on(ks: number) {
    updateKs(ks);

    onPrice([findRight(currentProduct, sumAc, totalks, ks), ks]);
  }

  React.useEffect(() => {
    on(ks);

    updateAccessories(() => new Set());
  }, [currentProduct.name]);

  React.useEffect(() => {
    on(ks);
  }, [accessories.size, totalks]);

  const productImg =
    currentProduct.name === 'FAN Classic'
      ? 'http://topdesign.name/public/2__0__0.png'
      : currentProduct.name === 'FAN Smart'
      ? 'http://topdesign.name/public/2__1__0.png'
      : 'http://topdesign.name/public/2__2__0.png';

  return (
    <div className="product" p="4">
      <div className="line-after" fontWeight="600">
        <div>{messages('PRODUCT')}</div>
      </div>

      <img display="block" mX="auto" mY="4" src={productImg} width="9/12" />

      <div mY="4">
        {productStorage.map(product => (
          <div
            className={['product__name', { product__name_active: product.name === currentProduct?.name }]}
            cursor="pointer"
            onClick={() => updateCurrentProduct(product)}
            p="2"
          >
            {product.options.length > 0 ? (
              <div alignItems="center" display="flex" justifyContent="space-between">
                <div>{product.name}</div>
                <div className="opacity-50" fontSize="2">
                  {messages('NUMBER_OF_OPTIONS_TO_SELECT', [product.options.length])}
                </div>
              </div>
            ) : (
              product.name
            )}
          </div>
        ))}
      </div>

      {currentProduct.options.length > 0 && (
        <>
          <div className="line-after" fontWeight="600">
            <div>{messages('OPTIONS')}</div>
          </div>
          <div mY="4">
            {currentProduct.options.map(option => {
              return (
                <div
                  className={['product__name', { product__name_active: accessories.has(option) }]}
                  cursor="pointer"
                  display="flex"
                  justifyContent="space-between"
                  onClick={() => {
                    updateAccessories(accessories => {
                      if (accessories.has(option)) {
                        accessories.delete(option);

                        return new Set(accessories);
                      }

                      return new Set(accessories.add(option));
                    });
                  }}
                  p="2"
                >
                  <div>{option.name}</div>
                  <div className="opacity-50">{messages('PRICE_WITHOUT_VAT', [option.price])}</div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <div mY="4" spaceY="4">
        <label className="line-after" cursor="pointer" fontWeight="600" htmlFor={`ks-${id}`}>
          <div>{messages('NUMBER_OF_PIECES')}</div>
        </label>
        <input id={`ks-${id}`} onChange={e => on(+e.currentTarget.value)} p="2" type="text" value={ks} width="100" />
      </div>
      <div alignItems="center" display="flex" justifyContent="space-between">
        <div
          className="deleteProductButton opacity-50"
          cursor="pointer"
          fontSize="2"
          onClick={() => onDelete()}
          width="6/12"
        >
          {messages('DELETE_PRODUCT_FROM_ORDER')}
        </div>
        <div textAlign="right" width="6/12">
          <div fontWeight="600">{messages('PRICE_WITHOUT_VAT', [findRight(currentProduct, sumAc, totalks, ks)])}</div>
          <div className="opacity-50" fontSize="2">
            {messages('PRICE_FROM_PIECES', [totalks])}
          </div>
        </div>
      </div>
    </div>
  );
}

function Client({ language }: { language: 'en' | 'sk' }) {
  messages = gt(language);

  const [products, updateProducts] = React.useState<[string, number, number][]>([]);

  const sumPrice: number = [...products].reduce((partialSum, a) => partialSum + a[1], 0);
  const sumKs: number = [...products].reduce((partialSum, a) => partialSum + a[2], 0);

  function addProduct() {
    updateProducts(products => {
      return [...products, [window.crypto.randomUUID(), 0, 0]];
    });
  }

  function deleteProduct(i: string) {
    updateProducts(products => {
      const f = [...products].filter(([j]) => j !== i);

      return f;
    });
  }

  return (
    <div className="container" mX="auto" p="4">
      <div mY="4">
        <a
          display="block"
          href="https://warden-sk.github.io/topdesign.name/public/index.html?key=b81a3b0b-d232-40ad-8ab3-c65a1ff945db&language=en"
        >
          English language
        </a>
        <a
          display="block"
          href="https://warden-sk.github.io/topdesign.name/public/index.html?key=b81a3b0b-d232-40ad-8ab3-c65a1ff945db&language=sk"
        >
          Slovenský jazyk
        </a>
      </div>

      <div fontSize="8" mY="4">
        {messages('ORDER')}
      </div>

      <div display="grid" gridTemplateColumns={['1', { '##': '2', '###': '3' }]} gap="4">
        {[...products].map(([i]) => (
          <Tstik
            id={i}
            onDelete={() => {
              deleteProduct(i);
            }}
            onPrice={price => {
              updateProducts(products => {
                return products.map(product => {
                  if (product[0] === i) {
                    return [i, ...price];
                  }

                  return product;
                });
              });
            }}
            totalks={sumKs}
          />
        ))}
        <div
          alignItems="center"
          className="addProductButton"
          cursor="pointer"
          display="flex"
          justifyContent="center"
          onClick={() => addProduct()}
          textAlign="center"
        >
          {messages('ADD_PRODUCT_TO_ORDER')}
        </div>
      </div>

      <div className="order__price" fontSize="4" fontWeight="600" mY="4" p="2" textAlign="center">
        {messages('PRICE_WITHOUT_VAT_FOR_PIECES', [sumPrice, sumKs])}
      </div>

      <div fontSize="8" mY="4">
        {messages('TABLE')}
      </div>

      <div style={{ overflowX: 'auto' }} whiteSpace="nowrap">
        <Table />
      </div>
    </div>
  );
}

export default Client;
