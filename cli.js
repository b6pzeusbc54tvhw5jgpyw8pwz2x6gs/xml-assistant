#!/usr/bin/env node

/**
 * Module dependencies.
 */

var program = require('commander');

program
  .version('0.1.0')
  .option('-k, --key [key]', 'Dot notation path')
  .parse(process.argv)

console.log(`args: ${program.args}`)
console.log(`key: ${program.key}`)

