#!/usr/bin/env node

const fs = require('fs')
const program = require('commander')
const xmldoc = require('xmldoc')
const find = require('lodash/find')
const includes = require('lodash/includes')
require('colors')

program
  .version('0.1.0')
  .command('find', 'find text value or key')
  .command('list', 'list dot notation paths')
  .parse(process.argv)

const command = program.args[0]
const commandArr = program.commands.map( c => c._name )
if( ! includes( commandArr, command)) {
  console.log(`Available sub command is ${commandArr}`.red)
  program.outputHelp()
  process.exit(1)
}

// excution


