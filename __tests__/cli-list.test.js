const fs = require('fs')
const path = require('path')
const sinon = require('sinon')

const originalProcessStdoutWrite = process.stdout.write
const originalProcessExit = process.exit

describe("check cli-list.js", () => {
  const modulePath = path.resolve("src","cli-list.js")
  let rewired // ref babel-plugin-rewire

  beforeEach(() => {
    process.exit = sinon.fake.throws(new Error('EXIT_IS_CALLED'))
    process.stdout.write = () => {}
    rewired = require(modulePath)
    rewired.__set__(
      "getUnionedKeyArr", sinon.fake.returns({ then: () => {} })
    )
  })
  afterEach(() => {
    process.exit = originalProcessExit
    process.stdout.write = originalProcessStdoutWrite
    jest.resetModules()
    rewired.__reset__("getUnionedKeyArr")
  })
  it('should be exited with code 1', () => {
    expect(() => rewired.__get__('run')([
      process.argv[0], modulePath,
    ])).toThrow('EXIT_IS_CALLED')
    expect(process.exit.callCount).toBe(1)
    expect(process.exit.getCall(0).args[0]).toBe(1)
  })
  it('should be exited with error ENOENT', () => {
    expect(() => rewired.__get__('run')([
      process.argv[0], modulePath, 'the-file-that-has-no-entry.xml',
    ])).toThrow('ENOENT')
    expect(process.exit.callCount).toBe(0)
  })
  it('should be call getUnionedKeyArr (valid single file)', () => {
    const xmlPathArr = ['exampleXml/example.xml']
    rewired.__get__('run')([
      process.argv[0], modulePath, xmlPathArr[0],
    ])
    const xmlTextArr = xmlPathArr.map( p => fs.readFileSync(p,'utf8'))
    expect(rewired.__get__('getUnionedKeyArr').callCount).toBe(1)
    expect(rewired.__get__('getUnionedKeyArr').getCall(0).args)
      .toEqual([xmlTextArr])
  })
  it('should be call getUnionedKeyArr (files)', () => {
    const xmlPathArr = [
      'exampleXml/example.xml',
      'exampleXml/examplePrd.xml',
    ]
    rewired.__get__('run')([
      process.argv[0], modulePath, ...xmlPathArr,
    ])
    const xmlTextArr = xmlPathArr.map( p => fs.readFileSync(p,'utf8'))
    expect(rewired.__get__('getUnionedKeyArr').callCount).toBe(1)
    expect(rewired.__get__('getUnionedKeyArr').getCall(0).args).toEqual([xmlTextArr])
  })
})

