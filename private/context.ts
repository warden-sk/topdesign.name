/*
 * Copyright 2022 Marek Kobida
 */

import type { L, Messages } from './messages';
import { createContext } from 'react';

interface Context {
  language: 'en' | 'sk';
  readMessage: <K extends keyof Messages>(key: K, $?: L<Messages[K]>) => string;
  updateLanguage: (language: Context['language']) => void;
}

const context = createContext<{ [K in keyof Context]?: Context[K] }>({});

export default context;
