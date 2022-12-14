/*
 * Copyright 2022 Marek Kobida
 */

import React from 'react';
import context from './context';
import productStorage from './productStorage';

function Table() {
  const { readMessage } = React.useContext(context);

  return (
    <table textAlign="right" width="100">
      {productStorage.map(product => {
        return (
          <tr>
            <td fontWeight="600" p="2">
              {product.name}
            </td>
            {product.modifiers.map(([l, r]) => {
              return (
                <td p="1">
                  <table width="100">
                    <tr>
                      <td p="2">{r - 100} %</td>
                    </tr>
                    <tr>
                      <td p="2">{readMessage?.('NUMBER_OF_PIECES', l)}</td>
                    </tr>
                    <tr>
                      <td fontWeight="600" p="2">
                        {((r / 100) * product.price).toFixed(2)} €
                      </td>
                    </tr>
                  </table>
                </td>
              );
            })}
          </tr>
        );
      })}
    </table>
  );
}

export default Table;
