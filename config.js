'use strict';

var path = require('path');
var _ = require('lodash');


process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var all = {
  env: process.env.NODE_ENV,

  port: process.env.OPENSHIFT_NODEJS_PORT || 3000,

  // Server IP
  ip: process.env.IP || '0.0.0.0',

};

module.exports = _.merge(
  all,
  require('./config/' + process.env.NODE_ENV + '.js') || {});
