# xml-assistant

## Prerequisite
- nodejs 8.12.x

## Install nodejs module

```sh
$ yarn
```

## Run CLI

```sh
$ node src/cli.js --help
$ node src/cli.js find --key <key> <xml-path> [xml-paths...]
$ node src/cli.js find --line <line> <xml-path>
$ node src/cli.js list <xml-path> [xml-paths...]
```

## Examples

```sh
$ node src/cli.js --help
$ node src/cli.js find --help
$ node src/cli.js list --help
$ node src/cli.js find --key db.host exampleXml/example.xml exampleXml/examplePrd.xml
$ node src/cli.js find --key db.host exampleXml/*
$ node src/cli.js find -k db.host exampleXml/*
$ node src/cli.js find --line 10 exampleXml/example.xml
$ node src/cli.js find -l 11 exampleXml/examplePrd.xml
$ node src/cli.js list exampleXml/example.xml exampleXml/examplePrd.xml
```
