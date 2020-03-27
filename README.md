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
  Manage dependency versions across repos (mono or otherwise).

  Usage
   $ alseta [command]

  Available Commands
   $ alseta update
   $ alseta verify
```

### update

```
  Usage
      $ alseta update

  Description
      Update dependencies in a package according to an alseta configuration.

  Options
      -i, --install           Run `yarn install` after all dependencies have been updated
      -w, --workspace         When set alseta will look for a yarn workspace setup and update dependencies on each package
      -s, --skip-overage      When alseta encounters a dependency that is on a higher version than the config calls for, skip
```

### verify

```
  Usage
      $ alseta verify

  Description
      Verify that all dependencies are in compliance with an alseta configuration.

  Options
      --programmatic       By default alseta will print out a human readable error message, this will print the errors as a JSON array
      -w, --workspace      When set alseta will look for a yarn workspace setup and verify dependencies on each package
      --warn               By default alseta will error if it encounters a mismatch, warn will log to stdout and complete with exit(0)
```

## Continuous Integration (CI)

Alseta was designed to be used in a CI environment, but there are several ways it can be used. The most "end to end" option is to check if `yarn.lock` is in the committed files, then run `alseta verify --warn`. If the verify step has a message then verification failed, at which point `alseta update` can be run to update. This leverages the fact that your yarn.lock is different, which is often the trigger for busting a CI cache. If however your cache works differently, the install step may be necessary.

If you're concerned about dependency updates causing downstream issues, ~~then you should probbly have unit and integration tests~~ you can just add `alseta verify` as a test script. If it fails, your build will fail which allows a reviewer and the developer to fix the problem manually.
