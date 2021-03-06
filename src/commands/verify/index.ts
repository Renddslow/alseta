import getPackages from '../../utils/getPackages';
import verifyPackage from './verifyPackage';
import kleur from 'kleur';

const verify = async (flags: Record<string, boolean>) => {
  const { pkgs, config } = await getPackages(flags);

  const pkgErrors = pkgs.reduce((acc, { pkg, path }) => {
    const errs = verifyPackage(pkg, config);

    if (!errs.length) return acc;

    acc.push({
      path: path,
      name: pkg.name,
      errors: verifyPackage(pkg, config),
    });

    return acc;
  }, []);

  if (!pkgErrors.length) {
    process.exit(0);
  }

  const logger = flags.warn ? console.warn : console.error;

  if (flags.programmatic) {
    logger(JSON.stringify(pkgErrors, null, 2));
  } else {
    pkgErrors.forEach(({ name, errors, path }) => {
      logger(`\n${errors.length} error(s) in ${name} (${path}):`);
      errors.forEach((err) => {
        logger(
          `  ${kleur.red('[MISMATCH]')} ${err.name} expected ${kleur.blue(
            err.expectedVersion,
          )} but got ${kleur.blue(err.version)} (${err.location})`,
        );
      });
    });
  }

  const exitCode = flags.warn ? 0 : 2;
  process.exit(exitCode);
};

export default verify;
