import pkgUp from 'read-pkg-up';

import getConfigLocation from './getConfigLocation';
import fetchConfig from './fetchConfig';

const index = async (cli) => {
  const rootPkg = await pkgUp();

  if (!rootPkg) {
    console.error(''); // TODO
    process.exit(2);
  }

  const configLocation = await getConfigLocation(rootPkg.packageJson);

  if (!configLocation) {
    console.error(''); // TODO
    process.exit(2);
  }

  const config = await fetchConfig(configLocation);
  console.log(config);
};

export default index;
