/*
 * Copyright 2022 Marek Kobida
 */

import './design.css';

import Client from './Client';
import React from 'react';
import { createRoot } from 'react-dom/client';

const key = 'b81a3b0b-d232-40ad-8ab3-c65a1ff945db';

if (typeof window !== 'undefined') {
  // (1)
  if (key === new URL(window.location.toString()).searchParams.get('key')) {
    localStorage.setItem('key', key);
  }

  // (2)
  if (key === localStorage.getItem('key')) {
    createRoot(document.getElementById('client')!).render(<Client />);
  }
}

export default (
  <>
    <div id="client" />
  </>
);
