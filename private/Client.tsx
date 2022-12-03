/*
 * Copyright 2022 Marek Kobida
 */

import './Client.css';

import type { Product, ProductOption } from './productStorage';
import React from 'react';
import Table from './Table';
import modifiers from './modifiers';
import plural from './plural';
import productStorage from './productStorage';

function findRight(price: number, sumAc: number, totalks: number, ks: number): number {
  const i = modifiers.findIndex(($$, j) => {
    const l = $$[0];

    const r = modifiers?.[j + 1]?.[0] ?? Number.MAX_SAFE_INTEGER;

    return totalks >= l && totalks < r;
  });

  if (i !== -1) {
    const percentage = modifiers[i][1];

    const cenaZaKus = (percentage / 100) * price + sumAc;

    return +(cenaZaKus * ks).toFixed(2);
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

    onPrice([findRight(currentProduct.price, sumAc, totalks, ks), ks]);
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
        <div>Produkt</div>
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
              <div display="flex" justifyContent="space-between">
                <div>{product.name}</div>
                <div className="opacity-50">
                  {plural(product.options.length, ['možnosť', 'možnosti', 'možností'])} na výber
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
            <div>Možnosti</div>
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
                  <div className="opacity-50">{option.price} € bez DPH</div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <div mY="4" spaceY="4">
        <label className="line-after" cursor="pointer" fontWeight="600" htmlFor={`ks-${id}`}>
          <div>Počet kusov</div>
        </label>
        <input id={`ks-${id}`} onChange={e => on(+e.currentTarget.value)} p="2" type="text" value={ks} width="100" />
      </div>
      <div alignItems="center" display="flex" justifyContent="space-between">
        <div
          className="deleteProductButton opacity-50"
          cursor="pointer"
          onClick={() => onDelete()}
          whiteSpace="pre-line"
        >{`Odstrániť produkt\nz objednávky`}</div>
        <div textAlign="right">
          <div fontWeight="600">{findRight(currentProduct.price, sumAc, totalks, ks)} € bez DPH</div>
          <div className="opacity-50" fontSize="2" whiteSpace="pre-line">{`cena od ${plural(totalks, [
            'kusu',
            'kusov',
            'kusov',
          ])}\nz celkovej objednávky`}</div>
        </div>
      </div>
    </div>
  );
}

function Client() {
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
      <div fontSize="8" mY="4">
        Objednávka
      </div>

      <div display="grid" gridTemplateColumns={['1', { '##': '2', '###': '3', '####': '4' }]} gap="4">
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
          whiteSpace="pre-line"
        >
          {`Pridať produkt\ndo objednávky`}
        </div>
      </div>

      <div className="order__price" fontSize="4" fontWeight="600" mY="4" p="2" textAlign="center">
        {sumPrice.toFixed(2)} € bez DPH za {plural(sumKs, ['kus', 'kusy', 'kusov'])}
      </div>

      <div fontSize="8" mY="4">
        Tabuľka
      </div>

      <div style={{ overflowX: 'auto' }} whiteSpace="pre">
        <Table />
      </div>
    </div>
  );
}

export default Client;
