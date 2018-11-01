#!/usr/bin/env node

const fs = require('fs')
const program = require('commander')
const dot = require('dot-object').dot
const parseString = require('xml2js').parseString
const union = require('lodash/union')
require('colors')

program
  .usage('<xml-config-file-paths>')

program.on('--help', function(){
  console.log('')
  console.log('Examples:')
  console.log('  $ cli-list my-config.xml')
  console.log('  $ cli-list my-config-dev.xml my-config-stg.xml')
  console.log('  $ cli-list my-config-*.xml')
})

program.parse(process.argv)

const getDotKeyArr = xmlText => new Promise((resolve,reject) => {
  const options = { explicitRoot: false, explicitArray: false }
  parseString(xmlText, options, (err, result) => {
    if(err) return reject(err)
    const dotKeyValueJson = dot(result)
    resolve( Object.keys(dotKeyValueJson))
  })
})

const list = xmlConfigArr => {
  const promisedArr = xmlConfigArr.map( filename => {
    const xmlText = fs.readFileSync(filename, 'utf8')
    return getDotKeyArr(xmlText)
  })
  return Promise.all(promisedArr).then( rArr => union.apply(null,rArr))
}

const xmlConfigArr = program.args

if( xmlConfigArr.length < 1 ) {
  console.log('error: xml config file path(s) is required'.red)
  program.outputHelp()
  process.exit(1)
}

list(xmlConfigArr).then( result => {
  console.log( JSON.stringify(result, null, 2 ))
})
