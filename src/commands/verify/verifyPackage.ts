import { get } from 'dot-prop';

import dependencyKeys from '../../utils/dependencyKeys';

const verifyPackage = (pkg: Record<string, any>, config: Record<string, string>) => {
  const pkgStr = JSON.stringify(pkg);
  const matchingDependencies = Object.keys(config).filter((d) => pkgStr.includes(d));

  if (!matchingDependencies.length) {
    return [];
  }

  const errors = [];

  dependencyKeys.forEach((k) => {
    matchingDependencies.forEach((dep) => {
      const version = get(pkg, `${k}.${dep}`);
      if (!version) return;
      if (version !== config[dep]) {
        errors.push({
          name: dep,
          version,
          expectedVersion: config[dep],
          location: `${k}.${dep}`,
        });
      }
    });
  });

  return errors;
};

export default verifyPackage;
