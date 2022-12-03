import './Client.css';

import React from 'react';
import Table from './Table';
import modifiers from './modifiers';
import plural from './plural';
import type { Product, ProductOption } from './productStorage';
import productStorage from './productStorage';

function findRight(price: number, sumAc: number, ks: number): number {
  const i = modifiers.findIndex(($$, j) => {
    const l = $$[0];

    const r = modifiers?.[j + 1]?.[0] ?? Number.MAX_SAFE_INTEGER;

    return ks >= l && ks < r;
  });

  if (i !== -1) {
    const percentage = modifiers[i][1];

    const cenaZaKus = (percentage / 100) * price + sumAc;

    return +(cenaZaKus * ks).toFixed(2);
  }

  return 0;
}

function Kktko({
  id,
  onDelete,
  onPrice,
}: {
  id: number;
  onDelete: () => void;
  onPrice: (price: [number, number]) => void;
}) {
  const [currentProduct, updateCurrentProduct] = React.useState<Product>(productStorage[0]);
  const [ks, updateKs] = React.useState<number>(50);

  const [accessories, updateAccessories] = React.useState<Set<ProductOption>>(new Set());

  const sumAc = [...accessories].reduce((partialSum, a) => partialSum + a.price, 0);

  function on(ks: number) {
    updateKs(ks);

    onPrice([findRight(currentProduct.price, sumAc, ks), ks]);
  }

  React.useEffect(() => {
    on(ks);

    updateAccessories(() => new Set());
  }, [currentProduct.name]);

  React.useEffect(() => {
    on(ks);
  }, [accessories.size]);

  return (
    <div className="product" p="4">
      <div className="line-after" fontWeight="600">
        <div>Produkt č. {id + 1}</div>
      </div>
      <div mX="!2" mY="4">
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
                <div>{plural(product.options.length, ['možnosť', 'možnosti', 'možností'])} na výber</div>
              </div>
            ) : (
              product.name
            )}
          </div>
        ))}
      </div>
      <div alignItems="center" display="flex" mY="4" spaceX="4">
        <label className="line-after" cursor="pointer" fontWeight="600" htmlFor={`ks-${id}`} width="4/12">
          <div>Počet kusov</div>
        </label>
        <input id={`ks-${id}`} onChange={e => on(+e.currentTarget.value)} p="2" type="text" value={ks} width="8/12" />
      </div>
      {currentProduct.options.length > 0 && (
        <>
          <div className="line-after" fontWeight="600">
            <div>Možnosti</div>
          </div>
          <div mX="!2" mY="4">
            {currentProduct.options.map(option => {
              return (
                <div
                  className={['product__name', { product__name_active: accessories.has(option) }]}
                  cursor="pointer"
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
                  {option.name} {'\u2014'} {option.price} € bez DPH
                </div>
              );
            })}
          </div>
        </>
      )}
      <div alignItems="center" display="flex" justifyContent="space-between">
        <div
          className="deleteProductButton"
          cursor="pointer"
          onClick={() => onDelete()}
          whiteSpace="pre-line"
        >{`Odstrániť produkt\nz objednávky`}</div>
        <div fontWeight="600">{findRight(currentProduct.price, sumAc, ks)} € bez DPH</div>
      </div>
    </div>
  );
}

function Client() {
  const [priceS, updatePriceS] = React.useState<[number, number, number][]>([]);
  const [products, updateProducts] = React.useState<Set<number>>(new Set([0]));

  const sumPrice = priceS.reduce((partialSum, a) => partialSum + a[1], 0);
  const sumKs = priceS.reduce((partialSum, a) => partialSum + a[2], 0);

  function addProduct() {
    updateProducts(products => {
      const lastProduct = [...products][products.size - 1];

      return new Set([...products, lastProduct + 1]);
    });
  }

  function deleteProduct(i: number) {
    updatePriceS(priceS => {
      return [...priceS.filter(produkt => produkt[0] !== i)];
    });

    updateProducts(products => {
      const f = [...products].filter(j => j !== i);

      return new Set(f);
    });
  }

  return (
    <div className="container" mX="auto" p="4">
      <div fontSize="8" mY="4">
        Objednávka



      <div display="grid" gridTemplateColumns="3" gap="4">
        {[...products].map(i => (
          <Kktko
            id={i}
            onDelete={() => {
              deleteProduct(i);
            }}
            onPrice={price => {
              updatePriceS(priceS => {
                priceS[i] = [i, ...price];

                return [...priceS];
              });
            }}
          />
        ))}
        <div
          alignItems="center"
          className="addProductButton"
          cursor="pointer"
          display="flex"
          justifyContent="center"
          onClick={() => addProduct()}
          whiteSpace="pre-line"
        >
          {`Pridať produkt\ndo objednávky`}
        </div>
      </div>

      <div fontWeight="600" mT="4" textAlign="center">
        {sumPrice.toFixed(2)} € bez DPH za {plural(sumKs, ['kus', 'kusy', 'kusov'])}
      </div>

      <div fontSize="8" mY="4">
        Tabuľka
      </div>

      <Table />
    </div>
  );
}

export default Client;
