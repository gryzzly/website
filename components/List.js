
import htm from '../web_modules/htm.js';
import { h, Component } from '../web_modules/preact.js';
const html = htm.bind(h);

export default class List extends Component {
  render({contents, notes}) {
    return contents && html`<div>
        <div dangerouslySetInnerHTML=${{ __html: contents}}></div>
        ${notes && notes.map(note => html`<li>
        <a href="${'/' + `${note.path.replace(/\.md$/, '.html')}`}">${note.title}</a>
      </li>`)}
      </div>`;
  }
}
