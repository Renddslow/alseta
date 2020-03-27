#!/usr/bin/env node
'use strict';
import sade from 'sade';

import verify from './commands/verify';
import update from './commands/update';

const prog = sade('alseta');

prog
  .version('0.1.0')
  .option('-w, --workspace', 'When set alseta will look for a yarn workspace setup', false);

prog
  .command('update')
  .describe('Update dependencies in a package according to an alseta configuration.')
  .option('-i, --install', 'Run `yarn install` after all dependencies have been updated', false)
  .option(
    '-s, --skip-overage',
    'When alseta encounters a dependency that is on a higher version than the config calls for, skip',
    false,
  )
  .action(update);

prog
  .command('verify')
  .describe('Verify that all dependencies are in compliance with an alseta configuration.')
  .option(
    '--programmatic',
    'By default alseta will print out a human readable error message, this will print the errors as a JSON array',
    false,
  )
  .option(
    '--warn',
    'By default alseta will error if it encounters a mismatch, warn will log to stdout and complete with exit(0)',
    false,
  )
  .action(verify);

prog.parse(process.argv);
