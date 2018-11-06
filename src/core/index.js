const dot = require('dot-object').dot
const parseString = require('xml2js').parseString
const union = require('lodash/union')
const xmldoc = require('xmldoc')
const find = require('lodash/find')
const filter = require('lodash/filter')
const last = require('lodash/last')
const sum = require('lodash/sum')
const bounds = require('binary-search-bounds')

const getDotKeyArr = xmlText => new Promise((resolve,reject) => {
  const options = { explicitRoot: false, explicitArray: false }
  parseString(xmlText, options, (err, result) => {
    if(err) return reject(err)
    const dotKeyValueJson = dot(result)
    resolve( Object.keys(dotKeyValueJson))
  })
})

const getUnionedKeyArr = xmlConfigTextArr => {
  const promisedArr = xmlConfigTextArr.map( getDotKeyArr )
  return Promise.all(promisedArr).then( rArr => union.apply(null,rArr))
}

const findByKey = (xmlConfigTextArr, key) => {
  const xmlDocArr = xmlConfigTextArr.map( t => new xmldoc.XmlDocument(t))
  const doc = find( xmlDocArr, xd => !! xd.descendantWithPath(key))
  if( ! doc ) return

  const foundNode = doc.descendantWithPath(key)
  const { children } = foundNode
  if(children.length === 1 && children[0].constructor.name === 'XmlTextNode') {
    return foundNode.val
  }
}

const getDistanceBetweenOpenCloseTag = (el) => {
  if( el.constructor.name === 'XmlTextNode' ) {
    return el.text.split('\n').length - 1
  } else if( el.constructor.name === 'XmlCommentNode' ) {
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

  return getSelectedElArr([...elArr, next], line)
}

const findByLine = (xmlText, line) => {
  line = line - 1
  if( ! xmlText.match(/^<\?xml\s*/)) {
    console.error('parser error : XML declaration allowed only at the start of the document')
    throw new Error('WRONG_XML_FILE')
  }
  const rootDocument = new xmldoc.XmlDocument(xmlText)
  const elArr = getSelectedElArr([rootDocument], line)
  return elArr.slice(1).map( el => el.name ).join('.')
}

module.exports = {
  getUnionedKeyArr,
  findByLine,
  findByKey,
}
