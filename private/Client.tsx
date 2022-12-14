/*
 * Copyright 2022 Marek Kobida
 */

import './Client.css';

import type { Product, ProductOption } from './productStorage';
import React from 'react';
import context from './context';
import getMessage from './messages';
import productStorage from './productStorage';
import Order from './components/Order';
import Table from './Table';

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

export function Tstik({
  id,
  totalks,
  onDelete,
  onPrice,
}: {
  id: number;
  totalks: number;
  onDelete: () => void;
  onPrice: (price: [number, number]) => void;
}) {
  const { readMessage } = React.useContext(context);

  const [currentProduct, updateCurrentProduct] = React.useState<Product>(productStorage[0]);
  const [ks, updateKs] = React.useState<number>(50);

  const [accessories, updateAccessories] = React.useState<Set<ProductOption>>(new Set());

  const sumAc = [...accessories].reduce((partialSum, a) => partialSum + a.price, 0);

  function on(ks: number) {
    ks = ks <= 5000 ? ks : 5000;

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
    currentProduct.name === 'FAN Classic' ? '1.png' : currentProduct.name === 'FAN Smart' ? '2.png' : '3.png';

  const productPhotoElement = React.useRef<HTMLImageElement>(null);

  function handleFile(file: File) {
    if (/^image\//.test(file.type)) {
      const urlFromFile = URL.createObjectURL(file);

      const photo = new Image();

      photo.addEventListener('load', e => {
        const { height, width } = e.currentTarget;

        if (height === 9150 && width === 11700) {
          productPhotoElement.current && (productPhotoElement.current.style.backgroundImage = `url(${urlFromFile})`);
        } else {
          alert('Fotografia nemá výšku 305 mm a šírku 390 mm.');
        }
      });

      photo.src = urlFromFile;
    }
  }

  return (
    <div className="product" p="4">
      <div className="line-after" fontWeight="600">
        <div>{readMessage?.('PRODUCT')}</div>
      </div>
      <label cursor="pointer" display="block" fontSize="2" htmlFor={`file-${id}`} mY="4" textAlign="center">
        <img
          className="product__photo"
          onDragLeave={e => {
            e.preventDefault();
          }}
          onDragOver={e => {
            e.preventDefault();
          }}
          onDrop={event => {
            event.preventDefault();

            for (const item of event.dataTransfer.items) {
              if (item.kind === 'file') {
                handleFile(item.getAsFile()!);
              }
            }
          }}
          ref={productPhotoElement}
          src={productImg}
          width="100"
        />
      </label>
      <input
        display="none"
        id={`file-${id}`}
        onChange={event => handleFile(event.currentTarget.files?.[0]!)}
        type="file"
      />
      <div mY="4">
        {productStorage.map(product => (
          <div
            className={['product__name', { product__name_active: product.name === currentProduct?.name }]}
            cursor="pointer"
            key={product.name}
            onClick={() => updateCurrentProduct(product)}
            p="2"
          >
            {product.options.length > 0 ? (
              <div alignItems="center" display="flex" justifyContent="space-between">
                <div>{product.name}</div>
                <div className="opacity-50" fontSize="2">
                  {readMessage?.('NUMBER_OF_OPTIONS', product.options.length)}
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
            <div>{readMessage?.('OPTIONS')}</div>
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
                  <div className="opacity-50" fontSize="2">
                    {readMessage?.('PRICE_WITHOUT_VAT', option.price)}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
      <div mY="4" spaceY="4">
        <label className="line-after" cursor="pointer" fontWeight="600" htmlFor={`ks-${id}`}>
          <div>{readMessage?.('NUMBER_OF_PIECES')}</div>
        </label>
        <input id={`ks-${id}`} onChange={e => on(+e.currentTarget.value)} p="2" type="text" value={ks} width="100" />
      </div>

      <div spaceY="4">
        <div textAlign="right">
          <div fontSize="4" fontWeight="600">
            {readMessage?.('PRICE_WITHOUT_VAT', findRight(currentProduct, sumAc, totalks, ks))}
          </div>
          <div className="opacity-50" fontSize="2">
            {readMessage?.('PRICE_FROM_PIECES', totalks)}
          </div>
        </div>
        <div
          className="deleteProductButton opacity-50"
          cursor="pointer"
          fontSize="2"
          onClick={() => onDelete()}
          textAlign="center"
        >
          {readMessage?.('DELETE_PRODUCT_FROM_ORDER')}
        </div>
      </div>
    </div>
  );
}

function Client() {
  const [language, updateLanguage] = React.useState<'en' | 'sk'>('sk');

  const readMessage = getMessage(language);

  return (
    <context.Provider value={{ language, readMessage, updateLanguage }}>
      <div className="container" display="flex" flexDirection="column" mX="auto" p="4">
        <div>
          <a display="block" href="#" onClick={() => updateLanguage('en')}>
            English language
          </a>
          <a display="block" href="#" onClick={() => updateLanguage('sk')}>
            Slovenský jazyk
          </a>
        </div>

        <div className="line-after" fontSize="8" mY="8">
          <div>{readMessage?.('TABLE')}</div>
        </div>

        <Table />

        <div className="line-after" fontSize="8" mY="8">
          <div>{readMessage?.('ORDER')}</div>
        </div>

        <Order />
      </div>
    </context.Provider>
  );
}

export default Client;
