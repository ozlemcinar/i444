'use strict';

const assert = require('assert');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const querystring = require('querystring');

const Mustache = require('./mustache');
const widgetView = require('./widget-view');

const STATIC_DIR = 'statics';
const TEMPLATES_DIR = 'templates';

function serve(port, model, base='') {
  //@TODO
	const app = express();
	  app.locals.port = port;
	  app.locals.base = base;
	  app.locals.model = model;
	  process.chdir(__dirname);
	  app.use(base, express.static(STATIC_DIR));
	  setupTemplates(app);
	  setupRoutes(app);
	  app.listen(port, function() {
	  	console.log(`listening on port ${port}`);
	  });
}


module.exports = serve;

//@TODO


function setupRoutes(app) {
  const base = app.locals.base;
  
}



function setupTemplates(app) {
  app.templates = {};
  
}


