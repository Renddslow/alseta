#!/usr/bin/env node
'use strict';
import meow from 'meow';

import verify from './commands/verify';
import update from './commands/update';

const prop = (k) => (o) => o[k];
const pipe = (...fns) => (x) => [...fns].reduce((acc, f) => f(acc), x);

const alseta = () => ({
  cli: meow(`
      Usage
       $ alseta [command]
      
      Available Commands
       $ alseta update
       $ alseta verify
  `),
  action: (cli) => cli.showHelp(0),
});

alseta.update = () => ({
  cli: meow(
    `
    Usage
        $ alseta update
        
    Description
        Update dependencies in a package according to an alseta configuration.
    
    Options
        -i, --install          Run \`yarn install\` after all dependencies have been updated
        -w, --workspace        When set alseta will look for a yarn workspace setup and update dependencies on each package
        -s, --skip-overage     When alseta encounters a dependency that is on a higher version than the config calls for, skip
   `,
    {
      flags: {
        install: {
          type: 'boolean',
          alias: 'i',
        },
        workspace: {
          type: 'boolean',
          alias: 'w',
        },
        'skip-overage': {
          type: 'boolean',
          alias: 's',
        },
      },
    },
  ),
  action: update,
});

alseta.verify = () => ({
  cli: meow(`
    Usage
        $ alseta verify
    
    Description
        Words
    
    Options
        --warn              By default alseta will error if it encounters a mismatch, warn will log to stdout and complete with exit(0)
        -w, --workspace     When set alseta will look for a yarn workspace setup and update dependencies on each package
  `),
  action: verify,
});

const getSubcommand = (cliObj, level) =>
  pipe(prop('input'), prop(level), (name) => prop(name)(cliObj))(prop('cli')(cliObj()));

const cli = (cliObj, level = 0) => {
  const { cli: nextCli, action } = cliObj();
  const subCommand = getSubcommand(cliObj, level);
  const runNextCli = (n) => (n.flags.help ? n.showHelp(0) : action(n));
  return subCommand ? cli(subCommand, level + 1) : runNextCli(nextCli);
};

cli(alseta);
