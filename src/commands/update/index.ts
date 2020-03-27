import pkgUp from 'read-pkg-up';
import globby from 'globby';
import loadJsonFile from 'load-json-file';
import path from 'path';
import { execSync } from 'child_process';
import kleur from 'kleur';
import catchify from 'catchify';

import getConfigLocation from './getConfigLocation';
import fetchConfig from './fetchConfig';
import updatePackage from './updatePackage';
import writeJsonFile from 'write-json-file';
import dequal from 'dequal';

const update = async (cli: Record<string, any>) => {
  const rootPkg = await pkgUp({ normalize: false });

  if (!rootPkg) {
    console.error(kleur.red('Could not find a root package. Are you sure this is a node module?'));
    process.exit(2);
  }

  const [configLocationErr, configLocation] = await catchify(
    getConfigLocation(<Record<string, string>>rootPkg.packageJson),
  );

  if (configLocationErr) {
    console.error(kleur.red(configLocationErr.message));
    process.exit(2);
  }

  if (!configLocationErr && !configLocation) {
    console.error(kleur.red('Could not find a configuration file for alesta.'));
    process.exit(2);
  }

  const [configErr, config] = await catchify(fetchConfig(configLocation));

  if (configErr) {
    console.error(kleur.red(configErr.message));
    process.exit(2);
  }

  let pkgs = [
    {
      pkg: <Record<string, string>>rootPkg.packageJson,
      path: rootPkg.path,
    },
  ];

  if (cli.flags.workspace && rootPkg.packageJson.workspaces) {
    const workspaces = <Array<string>>rootPkg.packageJson.workspaces;
    const paths = await globby(workspaces.map((w) => `${w}/package.json`));

    const workspacePkgs = await Promise.all(
      paths.map(async (p) => ({
        pkg: <Record<string, string>>await loadJsonFile(p),
        path: path.join(process.cwd(), p),
      })),
    );

    pkgs.push(...workspacePkgs);
  }

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
        console.log(kleur.yellow(`🏗 Updating dependencies in ${pkg.name}`));
        return writeJsonFile(path, pkg, { indent: 2 });
      }),
  );

  if (cli.flags.install) {
    execSync('yarn', { stdio: 'inherit' });
  }
};

export default update;
