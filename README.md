# alseta

> Manage dependency versions across repos (mono or otherwise).

## Install

```
$ yarn add alseta
```

Or run it with npx

```
$ npx alseta [command]
```

## Usage

```
  Usage
    $ alseta <command> [options]

  Available Commands
    update    Update dependencies in a package according to an alseta configuration.
    verify    Verify that all dependencies are in compliance with an alseta configuration.

  For more info, run any command with the `--help` flag
    $ alseta update --help
    $ alseta verify --help

  Options
    -w, --workspace    When set alseta will look for a yarn workspace setup  (default false)
    -v, --version      Displays current version
    -h, --help         Displays this message
```

### update

```
  Description
    Update dependencies in a package according to an alseta configuration.

  Usage
    $ alseta update [options]

  Options
    -i, --install         Run `yarn install` after all dependencies have been updated  (default false)
    -s, --skip-overage    When alseta encounters a dependency that is on a higher version than the config calls for, skip  (default false)
    -w, --workspace       When set alseta will look for a yarn workspace setup  (default false)
    -h, --help            Displays this message
```

### verify

```
  Description
    Verify that all dependencies are in compliance with an alseta configuration.

  Usage
    $ alseta verify [options]

  Options
    --programmatic     By default alseta will print out a human readable error message, this will print the errors as a JSON array  (default false)
    --warn             By default alseta will error if it encounters a mismatch, warn will log to stdout and complete with exit(0)  (default false)
    -w, --workspace    When set alseta will look for a yarn workspace setup  (default false)
    -h, --help         Displays this message
```

### Config

Alseta relies on a config file to determine which version of a package to enforce. The config file may be defined as a json file at the root of your file: `alseta.config.json`, in the package.json under the key `alseta`, or as a URL which will resolve a remote Alseta config in JSON format.

The config must have a top-level object where each key is a `pkg.name` and each value is the corresponding `pkg.version`.

Example:

```json
{
  "dot-prop": "5.1.1",
  "klona": "1.1.1"
}
```

## Continuous Integration (CI)

Alseta was designed to be used in a CI environment, but there are several ways it can be used. The most "end to end" option is to check if `yarn.lock` is in the committed files, then run `alseta verify --warn`. If the verify step has a message then verification failed, at which point `alseta update` can be run to update. This leverages the fact that your yarn.lock is different, which is often the trigger for busting a CI cache. If however your cache works differently, the install step may be necessary.

If you're concerned about dependency updates causing downstream issues, ~~then you should probbly have unit and integration tests~~ you can just add `alseta verify` as a test script. If it fails, your build will fail which allows a reviewer and the developer to fix the problem manually.
