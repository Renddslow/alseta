import test from 'ava';

import { getConfigLocation } from './getConfigLocation';

const noop = (s: string): Promise<Array<string>> => new Promise((resolve) => resolve([]));

test('getConfigLocation - when the alseta location is a url, location type is url', async (t) => {
  const location = 'https://github.com/';
  const configLocation = await getConfigLocation(noop)({ alseta: 'https://github.com/' });
  t.deepEqual(configLocation, { type: 'url', location });
});

test('getConfigLocation - when the alseta location is not a url, location type is pkg', async (t) => {
  const location = '@dmsi/alseta-config';
  const configLocation = await getConfigLocation(noop)({ alseta: location });
  t.deepEqual(configLocation, { type: 'pkg', location });
});

test('getConfigLocation - when no alseta location is present, get the location of a alest.config file', async (t) => {
  const location = 'alseta.config.json';
  const configLocation = await getConfigLocation(() => Promise.resolve([location]))({});
  t.deepEqual(configLocation, { type: 'config', location });
});

test('getConfigLocation - when no alseta location is present and no alseta.config file can be found, throw', async (t) => {
  t.plan(1);
  await getConfigLocation(() => Promise.resolve([]))({}).catch((e) =>
    t.is(
      e.message,
      'Alseta config could not be found.\nPlace one in your package.json under "alseta" or at the root of your project in "alseta.config.json"',
    ),
  );
});
