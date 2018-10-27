#!/usr/bin/env node

const fs = require('fs')
const program = require('commander')
const xmldoc = require('xmldoc')
const find = require('lodash/find')

program
  .version('0.1.0')
  .command('find', 'find text value by dot notation key')
  .parse(process.argv)

// excution


