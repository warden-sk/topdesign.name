/*
 * Copyright 2023 Marek Kobida
 */

import common from '@warden-sk/helpers/webpack/common';
import compileReact from '@warden-sk/helpers/webpack/compileReact';
import webpack from 'webpack';

const compiler = webpack(
  common({
    htmlTemplate: compileReact,
    name: 'Výroba reklamných sedákov - TOPdesign Topoľčany s.r.o.',
    publicPath: process.env.NODE_ENV === 'production' && 'https://warden-sk.github.io/topdesign.name/public',
  })
);

compiler.watch({}, (_, __) => console.log(_, __?.toString({ colors: true })));
