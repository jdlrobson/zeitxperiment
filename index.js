const express = require('express');
const app = express();
const fetch = require('node-fetch');

function proxyFetch( res, path, type, age=43200 ) {
    return fetch( `https://nomad.wmflabs.org${path}` ).then((resp) => {
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
    const title = req.params[0].replace( /\//g, '%2F' );
    const sight = req.params[1].replace( /\//g, '%2F' );
    proxyFetch( res, `/destination/${title}/sight/${sight}`, 'text/html' );
});
app.get('/destination/*', (req, res) => {
    const title = req.params[0].replace( /\//g, '%2F' );
    proxyFetch( res, `/destination/${title}`, 'text/html' );
});
app.get('*', (req, res) => {
  proxyFetch( res, req.params[0], 'text/html' );
});
app.listen(8100);
