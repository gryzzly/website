import renderToString from "preact-render-to-string";
import {h} from "preact";
import App from "./components/App.js";
import {exec} from './web_modules/preact-router.js';

export default function htm({document, routes}) {
  if (!document) {
    throw new Error('Please provide document template function.');
  }

  return function htmProcessor(files, metalsmith, done) {
    const metadata = metalsmith.metadata();

    Object.keys(files)
    .filter(fileName => fileName.endsWith('.html'))
    .forEach(fileName => {
      const file = files[fileName];

      const matchingRoutes = routes.filter(route => {
        const match = exec(`/${fileName}`, route.path, {});
        return match !== false
      });

      const routesRequiredProps = Object.keys(
        matchingRoutes.reduce((result, {props}) => {
          props.forEach(prop => result[prop] = true);
          return result;
        }, {})
      );

      let props = {
        url: fileName,
        contents: file.contents.toString()
      };

      // generic props that root-level App requires
      App.requiredProps && App.requiredProps.forEach(prop => {
        props[prop] = file[prop];
      });

      // props that this route handler requires
      routesRequiredProps.forEach(prop => props[prop] = file[prop]);

      const routesPropsData = matchingRoutes.reduce((result, route) => {
        return {...result, ...route.getData(file, files, metadata)};
      }, {});

      props = { ...props,  ...routesPropsData };

      props = {
        [fileName]: props
      };

      const body = renderToString(
        h(App, props)
      );
      files[fileName].contents = document(props, body);
      files[`${fileName}.json`] = {
        path: `${fileName}.json`,
        contents: Buffer.from(JSON.stringify(props, null, 2)),
      };
    });

    done();
  }
}
