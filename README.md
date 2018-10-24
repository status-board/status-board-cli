status-board-cli
================

CLI utility for Status Board

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/status-board-cli.svg)](https://npmjs.org/package/status-board-cli)
[![CircleCI](https://circleci.com/gh/jameswlane/status-board-cli/tree/master.svg?style=shield)](https://circleci.com/gh/jameswlane/status-board-cli/tree/master)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/jameswlane/status-board-cli?branch=master&svg=true)](https://ci.appveyor.com/project/jameswlane/status-board-cli/branch/master)
[![Codecov](https://codecov.io/gh/jameswlane/status-board-cli/branch/master/graph/badge.svg)](https://codecov.io/gh/jameswlane/status-board-cli)
[![Downloads/week](https://img.shields.io/npm/dw/status-board-cli.svg)](https://npmjs.org/package/status-board-cli)
[![License](https://img.shields.io/npm/l/status-board-cli.svg)](https://github.com/jameswlane/status-board-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g status-board-cli
$ status-board COMMAND
running command...
$ status-board (-v|--version|version)
status-board-cli/0.0.0 darwin-x64 node-v8.11.1
$ status-board --help [COMMAND]
USAGE
  $ status-board COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`status-board hello [FILE]`](#status-board-hello-file)
* [`status-board help [COMMAND]`](#status-board-help-command)

## `status-board hello [FILE]`

describe the command here

```
USAGE
  $ status-board hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ status-board hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/jameswlane/status-board-cli/blob/v0.0.0/src/commands/hello.ts)_

## `status-board help [COMMAND]`

display help for status-board

```
USAGE
  $ status-board help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.3/src/commands/help.ts)_
<!-- commandsstop -->
