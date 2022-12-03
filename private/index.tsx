import './design.css';

import Client from './Client';
import React from 'react';
import { createRoot } from 'react-dom/client';

if (typeof window !== 'undefined') {
  createRoot(document.getElementById('client')!).render(<Client />);
}

export default (
  <>
    <div id="client" />
  </>
);
