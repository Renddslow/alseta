import test from 'ava';

import getConfigLocation from './getConfigLocation';

test('getConfigLocation - when the alesta location is a url, location type is url', async (t) => {
  const location = 'https://github.com/';
  const configLocation = await getConfigLocation({ alesta: 'https://github.com/' });
  t.deepEqual(configLocation, { type: 'url', location });
});
