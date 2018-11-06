const fs = require('fs')
const path = require('path')
const childProcess = require('child_process')
const sinon = require('sinon')

const originalProcessStdoutWrite = process.stdout.write
const originalProcessExit = process.exit
const originalSpawn = childProcess.spawn

describe("check cli-list.js", () => {
  const modulePath = path.resolve("src","cli-find.js")
  let rewired // ref babel-plugin-rewire

  beforeEach(() => {
    process.exit = sinon.fake.throws(new Error('EXIT_IS_CALLED'))
    childProcess.spawn = sinon.fake.throws(new Error('SUBCOMMAND_IS_CALLED'))
    process.stdout.write = () => {}
    rewired = require(modulePath)
    rewired.__set__("findByKey", sinon.fake())
    rewired.__set__("findByLine", sinon.fake())
  })
  afterEach(() => {
    process.exit = originalProcessExit
    childProcess.spawn = originalSpawn
    process.stdout.write = originalProcessStdoutWrite
    jest.resetModules()
    rewired.__reset__("findByKey")
    rewired.__reset__("findByLine")
  })
  it('should be exited with code 1', () => {
    expect(() => rewired.__get__('run')([
      process.argv[0], modulePath,
    ])).toThrow('EXIT_IS_CALLED')
    expect(process.exit.callCount).toBe(1)
    expect(process.exit.getCall(0).args[0]).toBe(1)
    expect(rewired.__get__('findByKey').callCount).toBe(0)
    expect(rewired.__get__('findByLine').callCount).toBe(0)
  })
  it('should be exited with error ENOENT', () => {
    expect(() => rewired.__get__('run')([
      process.argv[0], modulePath, 'the-file-that-has-no-entry.xml',
    ])).toThrow('ENOENT')
    expect(process.exit.callCount).toBe(0)
    expect(rewired.__get__('findByKey').callCount).toBe(0)
    expect(rewired.__get__('findByLine').callCount).toBe(0)
  })
  it('should be call findByKey (with single file)', () => {
    const xmlPathArr = ['exampleXml/example.xml']
    expect(() => rewired.__get__('run')([
      process.argv[0], modulePath, xmlPathArr[0], "-k", "db.host",
    ])).toThrow('EXIT_IS_CALLED')

    expect(process.exit.callCount).toBe(1)
    expect(process.exit.getCall(0).args[0]).toBe(0)

    const xmlTextArr = xmlPathArr.map( p => fs.readFileSync(p,'utf8'))
    expect(rewired.__get__('findByKey').callCount).toBe(1)
    expect(rewired.__get__('findByKey').getCall(0).args).toEqual([
      xmlTextArr, 'db.host',
    ])
    expect(rewired.__get__('findByLine').callCount).toBe(0)
  })
  it('should be call findByKey (with one more file)', () => {
    const xmlPathArr = ['exampleXml/example.xml','exampleXml/examplePrd.xml']
    expect( () => rewired.__get__('run')([
      process.argv[0], modulePath, ...xmlPathArr, '--key', 'db.host',
    ])).toThrow('EXIT_IS_CALLED')

    expect(process.exit.callCount).toBe(1)
    expect(process.exit.getCall(0).args[0]).toBe(0)

    const xmlTextArr = xmlPathArr.map( p => fs.readFileSync(p,'utf8'))
    expect(rewired.__get__('findByKey').callCount).toBe(1)
    expect(rewired.__get__('findByKey').getCall(0).args).toEqual([
      xmlTextArr, 'db.host',
    ])
    expect(rewired.__get__('findByLine').callCount).toBe(0)
  })
  it('should be call findByLine (with single file)', () => {
    const xmlPathArr = ['exampleXml/example.xml']
    expect( () => rewired.__get__('run')([
      process.argv[0], modulePath, ...xmlPathArr, '--line', '10',
    ])).toThrow('EXIT_IS_CALLED')

    expect(process.exit.callCount).toBe(1)
    expect(process.exit.getCall(0).args[0]).toBe(0)

    const xmlTextArr = xmlPathArr.map( p => fs.readFileSync(p,'utf8'))
    expect(rewired.__get__('findByKey').callCount).toBe(0)
    expect(rewired.__get__('findByLine').callCount).toBe(1)
    expect(rewired.__get__('findByLine').getCall(0).args).toEqual([
      xmlTextArr[0], 10,
    ])
  })
  it('should be throw ERROR code 1 (findByLine with one more file)', () => {
    const xmlPathArr = ['exampleXml/example.xml', 'exampleXml/examplePrd.xml']
    expect( () => rewired.__get__('run')([
      process.argv[0], modulePath, ...xmlPathArr, '-l', '13',
    ])).toThrow('EXIT_IS_CALLED')

    expect(process.exit.callCount).toBe(1)
    expect(process.exit.getCall(0).args[0]).toBe(1)

    expect(rewired.__get__('findByKey').callCount).toBe(0)
    expect(rewired.__get__('findByLine').callCount).toBe(0)
  })
})

