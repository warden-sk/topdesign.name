/*
 * Copyright 2022 Marek Kobida
 */

import './design.css';

import Client from './Client';
import React from 'react';
import { createRoot } from 'react-dom/client';

const key = 'b81a3b0b-d232-40ad-8ab3-c65a1ff945db';

if (typeof window !== 'undefined') {
  const url = new window.URL(window.location.toString());

  // (1)
  if (key === url.searchParams.get('key')) {
    window.localStorage.setItem('key', key);
  }

  // (2)
  if (key === window.localStorage.getItem('key')) {
    createRoot(window.document.getElementById('client')!).render(<Client />);
  }
}

export default (
  <>
    <div id="client" />
  </>
);
