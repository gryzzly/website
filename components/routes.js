
import htm from '../web_modules/htm.js';
import { h, Component } from '../web_modules/preact.js';

const html = htm.bind(h);

import List from './List.js';

function Page({contents}) {
  return html`<div
    dangerouslySetInnerHTML=${{ __html: contents}}
  ></div>`;
}

const routes = [{
  name: 'page',
  path: ':*?',
  component: Page,
  props: ['contents'],
  getData: function(file, files, metadata) {
    return {
      contents: file.contents.toString(),
    };
  },
}, {
  name: 'notes',
  path: 'notes/index.html',
  props: ['contents', 'notes'],
  /**
    arguments passed to getComponent:
      url -- matched url
      cb  -- in case you are not returning a promise
      props -- props that component will recive upon being loaded
  */
  // getComponent: function(/* url, cb, props */) {
  //   return import('./List.js').then(module => withLoader(module.default));
  // },
  component: List,
  getData: function(file, files, metadata) {
    return {
      contents: file.contents.toString(),
      notes: metadata.notes.map(({
        contents, path, title
      }) => ({
        contents: contents.toString(), path, title
      })),
    }
  },
}];

export default routes;
