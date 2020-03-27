import pkgUp from 'read-pkg-up';
import kleur from 'kleur';
import globby from 'globby';
import loadJsonFile from 'load-json-file';
import path from 'path';
import catchify from 'catchify';

import getConfigLocation from './getConfigLocation';
import fetchConfig from './fetchConfig';

const getPackages = async (cli) => {
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

  return { pkgs, config };
};

export default getPackages;
