#!/usr/bin/env node

const fs = require('fs')
const program = require('commander')
const dot = require('dot-object').dot
const parseString = require('xml2js').parseString
const union = require('lodash/union')

program
  .parse(process.argv)

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

list(program.args).then( result => {
  console.log( JSON.stringify(result, null, 2 ))
})
