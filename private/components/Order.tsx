/*
 * Copyright 2022 Marek Kobida
 */

import React from 'react';
import { Tstik } from '../Client';
import context from '../context';

let I = 0;

function Order() {
  const { readMessage } = React.useContext(context);

  const [products, updateProducts] = React.useState<[id: number, price: number, pcs: number][]>([]);

  function addProduct() {
    updateProducts(products => [...products, [I++, 0, 0]]);
  }

  function deleteProduct(id: number) {
    updateProducts(products => products.filter(product => product[0] !== id));
  }

  function updateProduct(id: number, $: [price: number, pcs: number]) {
    updateProducts(products => {
      return products.map(product => {
        if (product[0] === id) {
          return [id, ...$];
        }

        return product;
      });
    });
  }

  /* (1) */ const order_price: number = [...products].reduce(($, [, price]) => $ + price, 0);
  /* (2) */ const order_pcs: number = [...products].reduce(($, [, , pcs]) => $ + pcs, 0);

  React.useEffect(() => {
    function update() {
      const order = document.querySelector<HTMLDivElement>('.test');
      const orderLeft = document.querySelector<HTMLDivElement>('.test__left');

      if (order && orderLeft) {
        /* (1) */
        const orderProducts = order.querySelectorAll<HTMLDivElement>('.product');

        const heights = [...orderProducts].map(orderProduct => {
          const { height } = orderProduct.getBoundingClientRect();

          return height;
        });

        order.style.height = `${Math.max(...heights)}px`;

        /* (2) */
        orderLeft.scrollTop = orderLeft.scrollHeight;
      }
    }

    update();
  }, [products]);

  return (
    <div className="test" display="grid" gap="4" gridTemplateColumns={['1', { '###': '4' }]}>
      <div className="test__left" display="grid" gridTemplateColumns={['1', { '###': '2', '####': '3' }]} gap="4">
        {[...products].map(([id]) => (
          <div key={id}>
            <Tstik id={id} onDelete={() => deleteProduct(id)} onPrice={$ => updateProduct(id, $)} totalks={order_pcs} />
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
      {order_price > 0 && (
        <div className="test__right" display="flex" flexDirection="column" p="4">
          <div className="test__right__price" fontWeight="600" mT="auto" p="2" textAlign="center">
            {readMessage?.('PRICE_WITHOUT_VAT_FOR_PIECES', order_price, order_pcs)}
          </div>
        </div>
      )}
    </div>
  );
}

export default Order;
