import Metalsmith from 'metalsmith';
import markdown from 'metalsmith-markdown-remarkable';
import assets from 'metalsmith-assets';
import htm from './metalsmith-htm';
import watch from 'metalsmith-watch';
import serve from 'metalsmith-serve';

import { h } from 'preact';
import renderToString from 'preact-render-to-string';
import App from './components/App';
import document from './document';

const site = Metalsmith(__dirname)
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
  .use(markdown('full', {
    typographer: true,
    quotes: '«»‘’'
  }))
  // render component tree with file data
  .use(htm({
    document
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
