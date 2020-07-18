import Metalsmith from 'metalsmith';
import markdown from 'metalsmith-markdown-remarkable';
import assets from 'metalsmith-assets';
import htm from './metalsmith-htm.js';
import watch from 'metalsmith-watch';
import serve from 'metalsmith-serve';
import collections from 'metalsmith-collections';
import extractTitles from 'metalsmith-title';
import path from 'path';

import clonedeep from 'lodash.clonedeep';

import { h } from 'preact';
import renderToString from 'preact-render-to-string';
import App from './components/App.js';
import routes from './components/routes.js';
import document from './document.js';

const site = Metalsmith(path.resolve())
  .source('./content')      // source directory
  .destination('./public')   // destination directory
  .clean(false)
;

if (process.argv[2] === 'dev') {
  site
    .use(watch({
      paths: {
        // updating content items requires full rebuild
        '${source}/**/*': '**/*',
        // JS can be rebuilt one-by-one
        'components/**/*': true,
        'assets/**/*': true,
      }
    }, true))
    .use(serve({
      port: 8888
    }));
}

// processing content files
site
  .use(collections({
    notes: {
      pattern: 'notes/*.md',
      refer: false,
    },
  }))
  .use(markdown('full', {
    typographer: true,
    quotes: '«»‘’'
  }))
  .use(extractTitles())
  .use(function(files, metalsmith, done) {
    const metadata = metalsmith.metadata();
    // freeze collections to not point at processed layouts
    metadata.notes = clonedeep(metadata.collections.notes);
    done();
  })
  // render component tree with file data
  .use(htm({
    document,
    routes,
  }))
  // stuff that is not processed but is simply copied over
  .use(assets({
    // relative to the working directory
    source: './assets',
    // relative to the build directory
    destination: './'
  }))
  .use(assets({
    // relative to the working directory
    source: './components',
    // relative to the build directory
    destination: './components'
  }))
  .use(assets({
    // relative to the working directory
    source: './web_modules',
    // relative to the build directory
    destination: './web_modules'
  }));

  site
    .build(function(err) {
      if (err) {
        console.log('Error building:' + err);
        throw new Error(err);
      }
      console.log('Built successfully.')
    });
