import { get, set } from 'dot-prop';
import klona from 'klona';
import semver from 'semver';

import dependencyKeys from '../../utils/dependencyKeys';

const updatePackage = (
  pkg: Record<string, any>,
  config: Record<string, string>,
  skipOverage: boolean = false,
) => {
  const pkgStr = JSON.stringify(pkg);
  const matchingDependencies = Object.keys(config).filter((d) => pkgStr.includes(d));

  if (!matchingDependencies.length) {
    return pkg;
  }

  const newPkg = klona(pkg);

  dependencyKeys.forEach((k) => {
    matchingDependencies.forEach((dep) => {
      const version = get(newPkg, `${k}.${dep}`);
      if (!version) {
        return;
      }

      if (skipOverage && semver.gt(version, config[dep])) {
        return;
      }

      if (version !== config[dep]) {
        set(newPkg, `${k}.${dep}`, config[dep]);
      }
    });
  });

  return newPkg;
};

export default updatePackage;
