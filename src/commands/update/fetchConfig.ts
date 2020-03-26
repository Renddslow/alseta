import got from 'got';
import loadJson from 'load-json-file';

import { ConfigLocation } from './getConfigLocation';

const fetchConfig = async (configLocation: ConfigLocation): Promise<Record<string, string>> => {
  if (configLocation.type === 'url') {
    return got(configLocation.location)
      .then(({ body }) => JSON.parse(body.toString()))
      .catch((e) => {
        console.error(e);
        process.exit(2);
      });
  }

  if (configLocation.type === 'pkg') {
    return new Promise((resolve) => {
      try {
        resolve(require(configLocation.location));
      } catch (e) {
        console.error(e);
        process.exit(2);
      }
    });
  }

  if (configLocation.type === 'config') {
    return loadJson(configLocation.location);
  }
};

export default fetchConfig;
