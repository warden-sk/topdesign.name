/*
 * Copyright 2023 Marek Kobida
 */

import type { L, Messages, availableLanguages } from './messages';
import { createContext } from 'react';

interface Context {
  language: keyof typeof availableLanguages;
  readMessage: <K extends keyof Messages>(key: K, ...$: L<Messages[K]>) => string;
  updateLanguage: (language: Context['language']) => void;
}

const context = createContext<{ [K in keyof Context]?: Context[K] }>({});

export default context;
