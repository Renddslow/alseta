import { execSync } from 'child_process';
import kleur from 'kleur';
import writeJsonFile from 'write-json-file';
import dequal from 'dequal';

import updatePackage from './updatePackage';
import getPackages from '../../utils/getPackages';

const update = async (cli: Record<string, any>) => {
  const { pkgs, config } = await getPackages(cli);

  await Promise.all(
    pkgs
      .reduce((acc, { pkg, path }) => {
        const newPkg = updatePackage(pkg, config, cli.flags.skipOverage);
        if (!dequal(newPkg, pkg)) {
          acc.push({ pkg: newPkg, path });
        }
        return acc;
      }, [])
      .map(({ path, pkg }) => {
        console.log(kleur.yellow(`🏗\tUpdating dependencies in ${pkg.name}`));
        return writeJsonFile(path, pkg, { indent: 2 });
      }),
  );

  if (cli.flags.install) {
    execSync('yarn', { stdio: 'inherit' });
  }
};

export default update;
