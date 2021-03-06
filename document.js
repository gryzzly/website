export default function(props, body) {
  return `<!DOCTYPE html>
<html>
  <head>
  <title></title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">

  <link rel="preload" href="/components/App.js" as="script" crossorigin>
  <link rel="preload" href="/web_modules/preact.js" as="script" crossorigin>

  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans&display=swap" rel="stylesheet" />
  <link href="/main.css" rel="stylesheet" />

  </head>
  <body>

  <div class="root">
  ${body}
  </div><!-- root -->
  <script>
    window.state = ${JSON.stringify(props, null, 2)};
  </script>
  <script type="module" src="/main.js"></script>
</body>
</html>
`
}
