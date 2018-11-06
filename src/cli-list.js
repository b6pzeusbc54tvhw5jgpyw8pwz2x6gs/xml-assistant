#!/usr/bin/env node

const fs = require('fs')
const program = require('commander')
const { getUnionedKeyArr } = require('./core')
require('colors')

const run = (argv) => {
  program
    .usage('<xml-config-file-paths>')
    .on('--help', function() {
      console.log('')
      console.log('Examples:')
      console.log('  $ cli-list my-config.xml')
      console.log('  $ cli-list my-config-dev.xml my-config-stg.xml')
      console.log('  $ cli-list my-config-*.xml')
    })
    .parse(argv)

  const xmlPathArr = program.args
  if( xmlPathArr.length < 1 ) {
    console.log('error: xml config file path(s) is required'.red)
    program.outputHelp()
    process.exit(1)
  }
  const xmlTextArr = xmlPathArr.map( p => fs.readFileSync(p, 'utf8'))
  getUnionedKeyArr(xmlTextArr).then( result => {
    console.log( JSON.stringify(result, null, 2 ))
  })
}

// https://nodejs.org/api/modules.html#modules_accessing_the_main_module
require.main === module && run(process.argv)

