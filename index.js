const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const WC = require('woocommerce-api');
 // https://admin.phoneparts.co.nz/wp-json/wc/v3
 'use strict';
const WooCommerce = new WC({
  url: 'https://phoneparts.co.nz',
  ssl: true,
  consumerKey: 'ck_be839358a340c95e9dca7d763628da94dbf1c06b',
  consumerSecret: 'cs_0b4037787bfede5b04d1b09180133bc506859bd0',
  wpAPI: true,
  version: 'wc/v3'
});

//changed 

app.use('/static', express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.setHeader('type', 'text/html');
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/inventory/json', function(req, res) {
    var _ssku = req.query;
    var _products = [];
    res.setHeader('content-type', 'application/json');
    WooCommerce.getAsync('products').then(function(result) {
      var _data =  JSON.parse(result.data.toJSON().body);
      _products = [_data[_i].id, _data[_i].name, _data[_i].sku, _data[_i].stock_quantity];
      res.send(result.data);
    }).catch(err => {
      res.json(err);
    });
})

app.get('/pos', function(req, res) {
  var _id = req.query;
  console.log(req.query);
  WooCommerce.getAsync('atum/purchase-orders/'+_id.id).then(function(result) {
    var _data =  JSON.parse(result.toJSON().body);
    console.log("retrieved get url");
    var _items = _data.line_items;
    var _products = [];
    for(var _i = 0; _i < _items.length; ++_i) {
      _products[_i] = [_items[_i].id, _items[_i].name, _items[_i].sku, _items[_i].quantity];
    }
    console.log(_products);
    res.send(_products);
  }).catch(err => {
    res.json(err);
  }); 
})

app.get('/back-orders', function(req, res) {
  var _id = req.query;
  console.log(req.query);
  WooCommerce.getAsync('products/?backordered=true').then(function(result) {
    var _data =  JSON.parse(result.toJSON().body);
    console.log("retrieved get url");
    res.send(_data);
  }).catch(err => {
    res.json(err);
  }); 
})

app.listen(process.env.PORT || 3000, () => {
  console.log(`server is running...`)
})