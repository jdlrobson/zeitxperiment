const express = require('express');
const app = express();
const fetch = require('node-fetch');

function proxyFetch( res, path, type, age=43200 ) {
    const url = `https://nomad.wmflabs.org${path}` ;
    return fetch(url).then((resp) => {
        res.status(resp.status);
        return resp.text();
    }).then((text) => {
      res.setHeader( 'Content-Type', type );
      res.setHeader( 'Cache-Control', `s-maxage=${age}` );
      res.send(text);
    });
}

app.use( '/', express.static( __dirname + '/public' ) );
app.get('/*.css', (req, res) => {
    proxyFetch( res, req.url, 'text/css' );
});
app.get('/sw-bundle.js', (req, res) => {
    proxyFetch( res, req.url, 'application/javascript' );
});
app.get('/main-bundle.js', (req, res) => {
    proxyFetch( res, req.url, 'application/javascript' );
});
app.get('/api/*', (req, res) => {
    proxyFetch( res, req.url, 'application/json' );
});
app.get('/destination/*/sight/*', (req, res) => {
    const title = encodeURIComponent( req.params[0] );
    const sight = encodeURIComponent( req.params[1] );
    proxyFetch( res, `/destination/${title}/sight/${sight}`, 'text/html' );
});
app.get('/destination/*', (req, res) => {
    proxyFetch( res, `/destination/${encodeURIComponent(req.params[0])}`, 'text/html' );
});
app.get('/*.json', (req, res) => {
    proxyFetch( res, req.url, 'application/json' );
});
app.get('*', (req, res) => {
  proxyFetch( res, req.params[0], 'text/html' );
});
app.listen(8100);
