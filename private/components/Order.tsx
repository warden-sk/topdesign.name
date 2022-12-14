/*
 * Copyright 2022 Marek Kobida
 */

import React from 'react';
import { Tstik } from '../Client';
import context from '../context';

let I = 0;

function Order() {
  const { readMessage } = React.useContext(context);

  const [products, updateProducts] = React.useState<[number, number, number][]>([]);

  const sumPrice: number = [...products].reduce((partialSum, a) => partialSum + a[1], 0);
  const sumKs: number = [...products].reduce((partialSum, a) => partialSum + a[2], 0);

  function addProduct() {
    updateProducts(products => [...products, [I++, 0, 0]]);
  }

  function deleteProduct(i: number) {
    console.log('deleteProduct', i);
    updateProducts(products => products.filter(([j]) => j !== i));
  }

  return (
    <div className="test" display="grid" gap="4" gridTemplateColumns={['1', { '###': '4' }]}>
      <div className="test__left" display="grid" gridTemplateColumns={['1', { '###': '2', '####': '3' }]} gap="4">
        {[...products].map(([i]) => (
          <div key={i}>
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
          </div>
        ))}
        <div
          alignItems="center"
          className="addProductButton"
          cursor="pointer"
          display="flex"
          justifyContent="center"
          onClick={() => addProduct()}
          p="4"
        >
          {readMessage?.('ADD_PRODUCT_TO_ORDER')}
        </div>
      </div>
      {sumPrice > 0 && (
        <div className="test__right" display="flex" flexDirection="column" p="4">
          <div className="test__right__price" fontWeight="600" mT="auto" p="2" textAlign="center">
            {readMessage?.('PRICE_WITHOUT_VAT_FOR_PIECES', sumPrice, sumKs)}
          </div>
        </div>
      )}
    </div>
  );
}

export default Order;
