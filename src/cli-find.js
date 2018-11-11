#!/usr/bin/env node

const fs = require('fs')
const program = require('commander')
const { findByKey, findByLine, findLineByKey } = require('./core')
require('colors')

const run = (argv) => {
  program
    .usage('[option] <xml-config-file-paths>')
    .option('-k, --key [key]', 'find text value by dot notation path')
    .option('-l, --line [line]', 'find key path by line number')
    .option('--find-line', 'find line number by key')
    .on('--help', function() {
      console.log('')
      console.log('Examples:')
      console.log('  $ cli-find --help')
      console.log('  $ cli-find --key db.host my-config.xml')
      console.log('  $ cli-find -k db.host my-config-*.xml')
      console.log('  $ cli-find --line 10 my-config.xml')
      console.log('  $ cli-find --line 11 my-config-prod.xml')
    })
    .parse(argv)

  const xmlPathArr = program.args
  const xmlTextArr = xmlPathArr.map( p => fs.readFileSync(p, 'utf8'))
  if( xmlTextArr.length < 1 ) {
    console.log('error: xml config file path(s) is required'.red)
    program.outputHelp()
    process.exit(1)
  }

  const { key, findLine } = program
  const line = Number(program.line)
  if( ! key && ! line ) {
    console.log('error: key or line is required'.red)
    program.outputHelp()
    process.exit(1)
  }

  if( key && findLine) {
    if( xmlTextArr.length !== 1 ) {
      console.error('find-line option need only single xml file')
      program.outputHelp()
      process.exit(1)
    }
    const foundLine = findLineByKey(xmlTextArr[0], key)
    foundLine && console.log(`${key}: ${foundLine}`)
    ! foundLine && console.log(`not found by key: ${key}`)
    process.exit(0)
  } else if( key ) {
    const value = findByKey(xmlTextArr, key)
    value && console.log(`${key}: ${value}`)
    ! value && console.log(`not found by key: ${key}`)
    process.exit(0)
  } else if( line ) {
    if( xmlTextArr.length !== 1) {
      console.error('find-by-line need only single xml config file')
      process.exit(1)
    }
    const keyPath = findByLine(xmlTextArr[0], line)
    console.log(`keyPath: ${keyPath}`)
    process.exit(0)
  }
}

// https://nodejs.org/api/modules.html#modules_accessing_the_main_module
require.main === module && run(process.argv)

