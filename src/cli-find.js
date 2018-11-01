#!/usr/bin/env node

const fs = require('fs')
const program = require('commander')
const xmldoc = require('xmldoc')
const find = require('lodash/find')
const filter = require('lodash/filter')
const last = require('lodash/last')
const sum = require('lodash/sum')
const bounds = require('binary-search-bounds')
require('colors')

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

const getDistanceBetweenOpenCloseTag = (el) => {
  if( el.constructor.name === 'XmlTextNode' ) {
    return el.text.split('\n').length - 1
  } else if( el.constructor.name == 'XmlCommentNode' ) {
    return el.comment.split('\n').length - 1
  } else if( el.constructor.name === 'XmlElement' ) {
    const childDistanceArr = el.children.map(getDistanceBetweenOpenCloseTag)
    return sum(childDistanceArr)
  }

  console.error('Unkown element type: ' + el.constructor.name )
  throw new Error('UNKOWN_ELEMENT_TYPE')
}


const getSelectedElArr = (elArr, line) => {
  const el = last(elArr)
  const isXmlElement = c => c.constructor.name === 'XmlElement'
  const childXmlElementArr = filter( el.children, isXmlElement )
  const idx = bounds.gt(childXmlElementArr, {line}, (a,b) => a.line - b.line)
  if( idx < 1 ) return elArr

  const next = childXmlElementArr[idx-1]
  if( line - next.line > getDistanceBetweenOpenCloseTag(next)) return elArr

  return getSelectedElArr([ ...elArr, next], line)
}

const findByLine = (xmlConfig, line) => {
  line = line - 1
  const xmlText = fs.readFileSync(xmlConfig, 'utf8')
  if( ! xmlText.match(/^<\?xml\s*/)) {
    console.error('parser error : XML declaration allowed only at the start of the document')
    throw new Error('WRONG_XML_FILE')
  }
  const rootDocument = new xmldoc.XmlDocument(xmlText)
  const elArr = getSelectedElArr([rootDocument], line)
  return elArr.slice(1).map( el => el.name ).join('.')
}

program
  .usage('[option] <xml-config-file-paths>')
  .option('-k, --key [key]', 'find text value by dot notation path')
  .option('-l, --line [line]', 'find key path by line number')

program.on('--help', function(){
  console.log('')
  console.log('Examples:')
  console.log('  $ cli-find --help')
  console.log('  $ cli-find --key db.host my-config.xml')
  console.log('  $ cli-find -k db.host my-config-*.xml')
  console.log('  $ cli-find --line 10 my-config.xml')
  console.log('  $ cli-find --line 11 my-config-prod.xml')
})

program.parse(process.argv)

const xmlConfigArr = program.args
const { key, line } = program

if( xmlConfigArr.length < 1 ) {
  console.log('error: xml config file path(s) is required'.red)
  program.outputHelp()
  process.exit(1)
}

if( ! key && ! line ) {
  console.log('error: key or line is required'.red)
  program.outputHelp()
  process.exit(1)
}

if( key ) {
  const value = findByKey(xmlConfigArr, key)
  value && console.log(`${key}: ${value}`)
  !value && console.log(`not found by key: ${key}`)
} else if( line ) {
  if( xmlConfigArr.length !== 1) {
    console.error('find-by-line need only single xml config file')
    process.exit(1)
  }
  const keyPath = findByLine(xmlConfigArr[0], line)
  console.log(`keyPath: ${keyPath}`)
}

