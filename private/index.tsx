import './design.css';

import Client from './Client';
import React from 'react';
import { createRoot } from 'react-dom/client';

if (typeof window !== 'undefined') {
  if (new URL(window.location.toString()).searchParams.has('key')) {
    localStorage.setItem('key', 'b81a3b0b-d232-40ad-8ab3-c65a1ff945db');
  }

  if (localStorage.getItem('key') === 'b81a3b0b-d232-40ad-8ab3-c65a1ff945db') {
    createRoot(document.getElementById('client')!).render(<Client />);
  }
}

export default (
  <>
    <div id="client" />
  </>
);
