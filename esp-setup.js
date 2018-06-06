#!/usr/bin/env node

const program = require('commander');

program
  .version('0.1.0')
  .command('init', 'Configure wifi as client', {isDefault: true})
  .parse(process.argv);
 
console.log('ESP8266 JS SetUp');