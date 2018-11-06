const sinon = require('sinon')
const path = require('path')
const childProcess = require('child_process')

const originalProcessStdoutWrite = process.stdout.write
const originalProcessExit = process.exit
const originalSpawn = childProcess.spawn

describe("check cli.js", () => {
  const modulePath = path.resolve("src","cli.js")
  let rewired // ref babel-plugin-rewire

  beforeEach(() => {
    process.exit = sinon.fake.throws(new Error('EXIT_IS_CALLED'))
    childProcess.spawn = sinon.fake.throws(new Error('SUBCOMMAND_IS_CALLED'))
    process.stdout.write = () => {}
    rewired = require(modulePath)
  })
  afterEach(() => {
    process.exit = originalProcessExit
    childProcess.spawn = originalSpawn
    process.stdout.write = originalProcessStdoutWrite
    jest.resetModules()
  })
  it('should be exited with code 0, when without args', () => {
    expect(() => rewired.__get__('run')([
      process.argv[0], modulePath,
    ])).toThrow('EXIT_IS_CALLED')
    expect(process.exit.callCount).toBe(1)
    expect(process.exit.getCall(0).args[0]).toBe(0)
    expect(childProcess.spawn.callCount).toBe(0)
  })
  it('should call sub command', () => {
    expect(() => rewired.__get__('run')([
      process.argv[0], modulePath, "list",
    ])).toThrow('SUBCOMMAND_IS_CALLED')
    expect(process.exit.callCount).toBe(0)
    expect(childProcess.spawn.callCount).toBe(1)
    expect(childProcess.spawn.getCall(0).args).toEqual([
      "/Users/ssohjiro/.nvm/versions/node/v8.12.0/bin/node",
      ["/Users/ssohjiro/project/xml-config-reader/src/cli-list.js"],
      {stdio: 'inherit', customFds: [0, 1, 2]},
    ])
  })
  it('should call sub command with args', () => {
    expect(() => rewired.__get__('run')([
      process.argv[0], modulePath, "list", "example.xml",
    ])).toThrow('SUBCOMMAND_IS_CALLED')
    expect(process.exit.callCount).toBe(0)
    expect(childProcess.spawn.callCount).toBe(1)
    expect(childProcess.spawn.getCall(0).args).toEqual([
      "/Users/ssohjiro/.nvm/versions/node/v8.12.0/bin/node",
      [
        "/Users/ssohjiro/project/xml-config-reader/src/cli-list.js",
        "example.xml",
      ],
      {stdio: 'inherit', customFds: [0, 1, 2]},
    ])
  })
  it('should call sub command with args and option', () => {
    expect(() => rewired.__get__('run')([
      process.argv[0], modulePath, "find", "-k", "db.host", "a.xml",
    ])).toThrow('SUBCOMMAND_IS_CALLED')
    expect(process.exit.callCount).toBe(0)
    expect(childProcess.spawn.callCount).toBe(1)
    expect(childProcess.spawn.getCall(0).args).toEqual([
      "/Users/ssohjiro/.nvm/versions/node/v8.12.0/bin/node",
      [
        "/Users/ssohjiro/project/xml-config-reader/src/cli-find.js",
        "a.xml", "-k", "db.host",
      ],
      {stdio: 'inherit', customFds: [0, 1, 2]},
    ])
  })
})

