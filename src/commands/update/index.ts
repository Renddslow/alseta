import pkgUp from 'read-pkg-up';
import globby from 'globby';
import loadJsonFile from 'load-json-file';
import path from 'path';

import getConfigLocation from './getConfigLocation';
import fetchConfig from './fetchConfig';
import updatePackage from './updatePackage';
import writeJsonFile from 'write-json-file';
import dequal from 'dequal';

const update = async (cli: Record<string, any>) => {
  const rootPkg = await pkgUp({ normalize: false });

  if (!rootPkg) {
    console.error(''); // TODO
    process.exit(2);
  }

  const configLocation = await getConfigLocation(<Record<string, string>>rootPkg.packageJson);

  if (!configLocation) {
    console.error(''); // TODO
    process.exit(2);
  }

  const config = await fetchConfig(configLocation);

  console.log(config);
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
        console.log(`Updating dependencies in ${pkg.name} at ${path}`);
        return writeJsonFile(path, pkg, { indent: 2 });
      }),
  );
};

export default update;
