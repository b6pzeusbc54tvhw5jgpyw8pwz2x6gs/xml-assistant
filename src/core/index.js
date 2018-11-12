const dot = require('dot-object').dot
const parseString = require('xml2js').parseString
const union = require('lodash/union')
const xmldoc = require('xmldoc')
const find = require('lodash/find')
const filter = require('lodash/filter')
const reject = require('lodash/reject')
const last = require('lodash/last')
const first = require('lodash/first')
const sum = require('lodash/sum')
const some = require('lodash/some')
const compact = require('lodash/compact')
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
  return Promise.all(promisedArr).then( rArr => {
    const unionedKeyArr = union.apply(null,rArr)
    return unionedKeyArr.map( k => k.replace(/\.(\d)(\.|$)/g, '($1)$2'))
  })
}

const findNodeInNodeByKey = (node, key) => {
  // support nodeName, nodeName(withIdx)
  const keyArr = key.split('.')
  if( ! node ) return
  if( compact(keyArr).length < 1 ) return node

  const currentKey = first(keyArr)
  const matched = currentKey.match(/^([\w\W][\w\W\d]*)\((\d)\)$/)
  let nextNode
  if( matched ) {
    const currentKeyWithoutIdx = matched[1]
    const idx = matched[2]
    const children = node.childrenNamed(currentKeyWithoutIdx)
    nextNode = children[idx]
  } else {
    nextNode = node.descendantWithPath(currentKey)
  }
  return findNodeInNodeByKey( nextNode, keyArr.slice(1).join('.'))
}

const findNodeByKey = (xmlConfigTextArr, key) => {
  const xmlDocArr = xmlConfigTextArr.map( t => new xmldoc.XmlDocument(t))
  const xmlDoc = find(xmlDocArr, xd => !! findNodeInNodeByKey(xd, key))
  return findNodeInNodeByKey(xmlDoc, key)
}

const getText = (xmlElement) => {
  if( ! xmlElement) return

  const childArr = reject(xmlElement.children, c => {
    return c.constructor.name === 'XmlCommentNode'
  })
  if( some(childArr, c => c.constructor.name !== 'XmlTextNode')) return

  return childArr.map( c => c.text ).join('')
}

const findByKey = (xmlConfigTextArr, key) => {
  const foundNode = findNodeByKey( xmlConfigTextArr, key )
  return getText(foundNode)
}

const findLineByKey = (xmlConfigText, key) => {
  const foundNode = findNodeByKey([xmlConfigText], key )
  if( ! foundNode ) return

  return foundNode.line + 1
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
  findLineByKey,
}
