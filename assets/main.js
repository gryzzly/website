import { h, hydrate } from '../web_modules/preact.js';
import App from '../components/App.js';

function main() {
  hydrate(
    h(App, window.state),
    document.querySelector('.root')
  );
}

main();
