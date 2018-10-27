#!/usr/bin/env node

const fs = require('fs')
const program = require('commander')
const xmldoc = require('xmldoc')
const find = require('lodash/find')

const findByKey = (xmlConfigArr, key) => {
  const xmlDocArr = xmlConfigArr.map( filename => {
    const xmlText = fs.readFileSync(filename, 'utf8')
    return new xmldoc.XmlDocument(xmlText)
  })
  const doc = find( xmlDocArr, xd => !! xd.descendantWithPath(key))
  if( ! doc ) return

  const foundNode = doc.descendantWithPath(key)
  const { children } = foundNode
  if(children.length === 1 && "XmlTextNode" === children[0].constructor.name) {
    return foundNode.val
  }
}

program
  .option('-k, --key [key]', 'Dot notation path')
  .parse(process.argv)

console.log(`xml files: ${program.args}`)
console.log(`key: ${program.key}`)
console.log(`---------------------------`)

const xmlConfigArr = program.args
const { key } = program
if( key ) {
  const value = findByKey(xmlConfigArr, program.key)
  value && console.log(`${key}: ${value}`)
  !value && console.log(`not found by key: ${key}`)
}

