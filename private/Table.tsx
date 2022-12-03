/*
 * Copyright 2022 Marek Kobida
 */

import React from 'react';
import modifiers from './modifiers';
import productStorage from './productStorage';

function Table() {
  return (
    <table textAlign="right" width="100">
      {productStorage.map(product => {
        return (
          <tr>
            <td fontWeight="600" p="2">
              {product.name}
            </td>
            {modifiers.map(([l, r]) => {
              return (
                <td>
                  <table width="100">
                    <tr>
                      <td p="2">{l} ks</td>
                    </tr>
                    <tr>
                      <td p="2">{r - 100} %</td>
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
