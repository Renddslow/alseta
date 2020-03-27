import test from 'ava';

import verifyPackage from './verifyPackage';

test('verifyPackage - if the package does not depend on any modules from the alseta config, return an empty array', (t) => {
  const config = { kleur: '2.0.0' };
  const pkg = { dependencies: { got: '2.0.0' } };

  t.deepEqual(verifyPackage(pkg, config), []);
});

test('verifyPackage - if the package depends on a module from the alseta config, but the versions match, return an empty array', (t) => {
  const config = { kleur: '2.0.0' };
  const pkg = { dependencies: { kleur: '2.0.0' } };

  t.deepEqual(verifyPackage(pkg, config), []);
});

test('verifyPackage - if the package depends on a module from the alseta config and the versions mismatch, return an array with 1 error object', (t) => {
  const config = { kleur: '2.0.0' };
  const pkg = { dependencies: { kleur: '1.1.0' } };

  t.deepEqual(verifyPackage(pkg, config), [
    {
      name: 'kleur',
      version: '1.1.0',
      expectedVersion: '2.0.0',
      location: 'dependencies.kleur',
    },
  ]);
});

test('verifyPackage - if the package depends on a module across multiple dependency types from the alseta config and the versions mismatch, return an array with 1 error object', (t) => {
  const config = { kleur: '2.0.0' };
  const pkg = {
    dependencies: { kleur: '1.1.0' },
    devDependencies: { kleur: '1.3.0' },
  };

  t.deepEqual(verifyPackage(pkg, config), [
    {
      name: 'kleur',
      version: '1.1.0',
      expectedVersion: '2.0.0',
      location: 'dependencies.kleur',
    },
    {
      name: 'kleur',
      version: '1.3.0',
      expectedVersion: '2.0.0',
      location: 'devDependencies.kleur',
    },
  ]);
});
