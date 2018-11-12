const path = require('path')
const fs = require('fs')

const {
  getUnionedKeyArr,
  findByLine,
  findByKey,
  findLineByKey,
} = require('../src/core')

const certi = `
    weofijweiofjweofjwofsfk
    w+efoijwfjweoifjwoeifjw
    eijfoiwejfiowejfowefijw
    fwej1ioj21o3123oijio1of
    ewjweiofjoiwejfioqjwqof
    ifjweofjweofijweofijwoi
    ieoiwejfoewjfowfjoewijf
    w/efjwweofijweoifjweoif
    efjwfwefewofijewofjewxc
    jwfoiejwiofwjefo.weofij
  `

let xmlConfigTextArr

beforeAll(() => {
  const xmlConfigPathArr = [
    path.resolve('exampleXml/example.xml'),
    path.resolve('exampleXml/examplePrd.xml'),
  ]
  xmlConfigTextArr = xmlConfigPathArr.map( p => fs.readFileSync(p, 'utf8'))
})

describe("check findByKey", () => {
  it('can find text value by key in db', () => {
    expect(findByKey(xmlConfigTextArr, 'db')).toBe(void 0)
    expect(findByKey(xmlConfigTextArr, 'db.host')).toBe('my.db.com')
    expect(findByKey(xmlConfigTextArr, 'db.port')).toBe('3306')
    expect(findByKey(xmlConfigTextArr, 'db.username')).toBe('admin')
    expect(findByKey(xmlConfigTextArr, 'db.password')).toBe('1111')
  })

  it('can find text value by key in info', () => {
    expect(findByKey(xmlConfigTextArr, 'info')).toBe(void 0)
    expect(findByKey(xmlConfigTextArr, 'info.version')).toBe('10.0.0')
    expect(findByKey(xmlConfigTextArr, 'info.countries')).toBe('KOR|JPN|USA')
    expect(findByKey(xmlConfigTextArr, 'info.supportClientVersion')).toBe('^1.0.0')
  })

  it('can find text value by key in redis', () => {
    expect(findByKey(xmlConfigTextArr, 'redis')).toBe(void 0)
    expect(findByKey(xmlConfigTextArr, 'redis.host').trim()).toBe('redis')
    expect(findByKey(xmlConfigTextArr, 'redis.port')).toBe('1111')
  })

  it('can find text value by key in s3', () => {
    expect(findByKey(xmlConfigTextArr, 's3')).toBe(void 0)
    expect(findByKey(xmlConfigTextArr, 's3.log')).toBe('my-s3-bucket-name')
  })

  it('can find text value by key in backend', () => {
    expect(findByKey(xmlConfigTextArr, 'backend')).toBe(void 0)
    expect(findByKey(xmlConfigTextArr, 'backend.ip(0)')).toBe('1.2.3.1')
    expect(findByKey(xmlConfigTextArr, 'backend.ip(1)')).toBe('1.2.3.2')
    expect(findByKey(xmlConfigTextArr, 'backend.ip(2)')).toBe('1.2.3.3')
    expect(findByKey(xmlConfigTextArr, 'backend.ip(3)')).toBe('1.2.3.4')
  })

  it('can find text value by key in infra', () => {
    expect(findByKey(xmlConfigTextArr, 'infra')).toBe(void 0)
    expect(findByKey(xmlConfigTextArr, 'infra.s3')).toBe(void 0)
    expect(findByKey(xmlConfigTextArr, 'infra.s3.bucket')).toBe('a.b.c')
    expect(findByKey(xmlConfigTextArr, 'infra.s3.private')).toBe('true')
    expect(findByKey(xmlConfigTextArr, 'infra.s3(0).bucket')).toBe('a.b.c')
    expect(findByKey(xmlConfigTextArr, 'infra.s3(0).private')).toBe('true')
    expect(findByKey(xmlConfigTextArr, 'infra.s3(1).bucket')).toBe('a.b.d')
    expect(findByKey(xmlConfigTextArr, 'infra.s3(1).private')).toBe('true')
    expect(findByKey(xmlConfigTextArr, 'infra.s3(2).bucket')).toBe('a.b.e')
    expect(findByKey(xmlConfigTextArr, 'infra.s3(2).private')).toBe('false')
    expect(findByKey(xmlConfigTextArr, 'infra.s3(3).bucket')).toBe('s3.b1')
    expect(findByKey(xmlConfigTextArr, 'infra.s3(3).private')).toBe('false')
    expect(findByKey(xmlConfigTextArr, 'infra.s3(3).bucket(0)')).toBe('s3.b1')
    expect(findByKey(xmlConfigTextArr, 'infra.s3(3).bucket(1)')).toBe('s3.b2')
    expect(findByKey(xmlConfigTextArr, 'infra.s3(3).bucket(2)')).toBe('s3.b3')
    expect(findByKey(xmlConfigTextArr, 'infra.s3(3).bucket(3)')).toBe(void 0)
  })

  it('can find text value by key in notice', () => {
    expect(findByKey(xmlConfigTextArr, 'space')).toBe(void 0)
    expect(findByKey(xmlConfigTextArr, 'space.notice').trim()).toBe('')
  })

  it('can find text value by key in very', () => {
    expect(findByKey(xmlConfigTextArr, 'very')).toBe(void 0)
    expect(findByKey(xmlConfigTextArr, 'very.ugly')).toBe(void 0)
    expect(findByKey(xmlConfigTextArr, 'very.ugly.xml')).toBe(void 0)
    expect(findByKey(xmlConfigTextArr, 'very.ugly.xml.tag')).toBe(void 0)
    expect(findByKey(xmlConfigTextArr, 'very.ugly.xml.tag.test')).toBe('value!!')
  })

  it('can find text value by key in certi', () => {
    expect(findByKey(xmlConfigTextArr, 'certi')).toBe(certi)
  })

  it('can find text value by key in only xx', () => {
    expect(findByKey(xmlConfigTextArr, 'only')).toBe(void 0)
    expect(findByKey(xmlConfigTextArr, 'only.dev')).toBe(void 0)
    expect(findByKey(xmlConfigTextArr, 'only.dev.config')).toBe('notice msg')
    expect(findByKey(xmlConfigTextArr, 'only.prd')).toBe(void 0)
    expect(findByKey(xmlConfigTextArr, 'only.prd.config')).toBe('prd notice msg')
  })

  it('can find text value with comments by key', () => {
    expect(findByKey(xmlConfigTextArr, 'redis')).toBe(void 0)
    expect(findByKey(xmlConfigTextArr, 'redis.some1').trim()).toBe('text1')
    expect(findByKey(xmlConfigTextArr, 'redis.some2').trim()).toBe('text2')
    expect(findByKey(xmlConfigTextArr, 'redis.some3').trim()).toBe('text3')
  })
})

describe("findByLine", () => {
  it('can find key path by line for example.xml', () => {
    expect(findByLine(xmlConfigTextArr[0], 0)).toBe('')
    expect(findByLine(xmlConfigTextArr[0], 1)).toBe('')
    expect(findByLine(xmlConfigTextArr[0], 2)).toBe('')
    expect(findByLine(xmlConfigTextArr[0], 3)).toBe('')
    expect(findByLine(xmlConfigTextArr[0], 4)).toBe('')
    expect(findByLine(xmlConfigTextArr[0], 5)).toBe('db')
    expect(findByLine(xmlConfigTextArr[0], 6)).toBe('db')
    expect(findByLine(xmlConfigTextArr[0], 7)).toBe('db.host')
    expect(findByLine(xmlConfigTextArr[0], 8)).toBe('db.port')
    expect(findByLine(xmlConfigTextArr[0], 9)).toBe('db.username')
    expect(findByLine(xmlConfigTextArr[0], 10)).toBe('db.password')
    expect(findByLine(xmlConfigTextArr[0], 11)).toBe('db')
    expect(findByLine(xmlConfigTextArr[0], 12)).toBe('')
    expect(findByLine(xmlConfigTextArr[0], 13)).toBe('')
    expect(findByLine(xmlConfigTextArr[0], 14)).toBe('info')
    expect(findByLine(xmlConfigTextArr[0], 15)).toBe('info.version')
    expect(findByLine(xmlConfigTextArr[0], 16)).toBe('info.countries')
    expect(findByLine(xmlConfigTextArr[0], 17)).toBe('info')
    expect(findByLine(xmlConfigTextArr[0], 18)).toBe('info')
    expect(findByLine(xmlConfigTextArr[0], 19)).toBe('info')
    expect(findByLine(xmlConfigTextArr[0], 20)).toBe('info')
    expect(findByLine(xmlConfigTextArr[0], 21)).toBe('info.supportClientVersion')
  })

  it('can find key path by line for examplePrd.xml', () => {
    expect(findByLine(xmlConfigTextArr[1], 0)).toBe('')
    expect(findByLine(xmlConfigTextArr[1], 1)).toBe('')
    expect(findByLine(xmlConfigTextArr[1], 2)).toBe('')
    expect(findByLine(xmlConfigTextArr[1], 3)).toBe('')
    expect(findByLine(xmlConfigTextArr[1], 4)).toBe('')
    expect(findByLine(xmlConfigTextArr[1], 5)).toBe('db')
    expect(findByLine(xmlConfigTextArr[1], 6)).toBe('db')
    expect(findByLine(xmlConfigTextArr[1], 7)).toBe('db.host')
    expect(findByLine(xmlConfigTextArr[1], 8)).toBe('db.port')
    expect(findByLine(xmlConfigTextArr[1], 9)).toBe('db.username')
    expect(findByLine(xmlConfigTextArr[1], 10)).toBe('db.password')
    expect(findByLine(xmlConfigTextArr[1], 11)).toBe('db')
    expect(findByLine(xmlConfigTextArr[1], 12)).toBe('')
    expect(findByLine(xmlConfigTextArr[1], 13)).toBe('')
    expect(findByLine(xmlConfigTextArr[1], 14)).toBe('info')
    expect(findByLine(xmlConfigTextArr[1], 15)).toBe('info.version')
    expect(findByLine(xmlConfigTextArr[1], 16)).toBe('info.countries')
    // ...
    expect(findByLine(xmlConfigTextArr[1], 44)).toBe('space')
    expect(findByLine(xmlConfigTextArr[1], 45)).toBe('space.notice')
    expect(findByLine(xmlConfigTextArr[1], 46)).toBe('space.notice')
    expect(findByLine(xmlConfigTextArr[1], 47)).toBe('space')
    // ...
    expect(findByLine(xmlConfigTextArr[1], 55)).toBe('')
    expect(findByLine(xmlConfigTextArr[1], 56)).toBe('very')
    expect(findByLine(xmlConfigTextArr[1], 57)).toBe('very.ugly')
    expect(findByLine(xmlConfigTextArr[1], 58)).toBe('very.ugly.xml')
    expect(findByLine(xmlConfigTextArr[1], 59)).toBe('very.ugly.xml.tag')
    expect(findByLine(xmlConfigTextArr[1], 60)).toBe('very.ugly.xml.tag.test')
    expect(findByLine(xmlConfigTextArr[1], 61)).toBe('very.ugly.xml')
    expect(findByLine(xmlConfigTextArr[1], 62)).toBe('very.ugly')
    expect(findByLine(xmlConfigTextArr[1], 63)).toBe('very')
    expect(findByLine(xmlConfigTextArr[1], 64)).toBe('')
    expect(findByLine(xmlConfigTextArr[1], 65)).toBe('certi')
    expect(findByLine(xmlConfigTextArr[1], 66)).toBe('certi')
    expect(findByLine(xmlConfigTextArr[1], 67)).toBe('certi')
    expect(findByLine(xmlConfigTextArr[1], 68)).toBe('certi')
    expect(findByLine(xmlConfigTextArr[1], 69)).toBe('certi')
    expect(findByLine(xmlConfigTextArr[1], 70)).toBe('certi')
    expect(findByLine(xmlConfigTextArr[1], 71)).toBe('certi')
    expect(findByLine(xmlConfigTextArr[1], 72)).toBe('certi')
    expect(findByLine(xmlConfigTextArr[1], 73)).toBe('certi')
    expect(findByLine(xmlConfigTextArr[1], 74)).toBe('certi')
    expect(findByLine(xmlConfigTextArr[1], 75)).toBe('certi')
    expect(findByLine(xmlConfigTextArr[1], 76)).toBe('certi')
    expect(findByLine(xmlConfigTextArr[1], 77)).toBe('')
  })
})

describe("findLineByKey", () => {
  it('can find line by key path for example.xml', () => {
    expect(findLineByKey(xmlConfigTextArr[0], 'db')).toBe(5)
    expect(findLineByKey(xmlConfigTextArr[0], 'db.host')).toBe(7)
    expect(findLineByKey(xmlConfigTextArr[0], 'db.port')).toBe(8)
    expect(findLineByKey(xmlConfigTextArr[0], 'db.username')).toBe(9)
    expect(findLineByKey(xmlConfigTextArr[0], 'db.password')).toBe(10)
    expect(findLineByKey(xmlConfigTextArr[0], 'aaaa')).toBe(void 0)
  })
})

describe("getUnionedKeyArr", () => {
  const xmlText1 = `
<?xml version="1.0" encoding="UTF-8"?>
<config-root>
<a>
  <b></b>
</a>
<c>
  <d></d>
</c>
</config-root>
  `
  const xmlText2 = `
<?xml version="1.0" encoding="UTF-8"?>
<config-root>
  <a>
    <b></b>
  </a>
  <c>
    <e></e>
  </c>
</config-root>
  `
  const xmlText3 = `
<?xml version="1.0" encoding="UTF-8"?>
<config-root>
  <backend>
    <ip>1.2.3.1</ip>
    <ip>1.2.3.2</ip>
    <ip>1.2.3.3</ip>
    <ip>1.2.3.4</ip>
  </backend>
</config-root>
  `
  const xmlText4 = `
<?xml version="1.0" encoding="UTF-8"?>
<config-root>
  <infra>
    <s3>
      <bucket>a.b.c</bucket>
      <private>true</private>
    </s3>
    <s3>
      <bucket>a.b.d</bucket>
      <private>true</private>
    </s3>
    <s3>
      <bucket>a.b.e</bucket>
      <private>false</private>
    </s3>
    <s3>
      <bucket>s3.b1</bucket>
      <bucket>s3.b2</bucket>
      <bucket>s3.b3</bucket>
      <private>false</private>
    </s3>
  </infra>
</config-root>
  `
  it('can get unioned key path arr', () => {
    return Promise.all([
      expect(getUnionedKeyArr([xmlText1, xmlText2])).resolves.toEqual([
        'a.b',
        'c.d',
        'c.e',
      ]),
      expect(getUnionedKeyArr([xmlText3])).resolves.toEqual([
        'backend.ip(0)',
        'backend.ip(1)',
        'backend.ip(2)',
        'backend.ip(3)',
      ]),
      expect(getUnionedKeyArr([xmlText4])).resolves.toEqual([
        'infra.s3(0).bucket',
        'infra.s3(0).private',
        'infra.s3(1).bucket',
        'infra.s3(1).private',
        'infra.s3(2).bucket',
        'infra.s3(2).private',
        'infra.s3(3).bucket(0)',
        'infra.s3(3).bucket(1)',
        'infra.s3(3).bucket(2)',
        'infra.s3(3).private',
      ]),
    ])
  })
})

