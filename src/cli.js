#!/usr/bin/env node

const includes = require('lodash/includes')
require('colors')

const run = (argv) => {
  const program = require('commander')
  program
    .version('0.1.0')
    .command('find', 'find text value or key')
    .command('list', 'list dot notation paths')
    .parse(argv)

  const command = program.args[0]
  const commandArr = program.commands.map( c => c._name )
  if( ! includes( commandArr, command)) {
    console.log(`Available sub command is ${commandArr}`.red)
    // program.outputHelp()
    process.exit(1)
  }
}

// https://nodejs.org/api/modules.html#modules_accessing_the_main_module
require.main === module && run(process.argv)

