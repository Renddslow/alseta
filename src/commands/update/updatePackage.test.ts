import test from 'ava';

import updatePackage from './updatePackage';

test('updatePackage - when package has no matching dependencies, return the original package', (t) => {
  const originalPackage = {
    dependencies: {
      got: '2.0.0',
    },
  };
  const config = { kleur: '1.0.0' };
  t.deepEqual(updatePackage(originalPackage, config), originalPackage);
});

test('updatePackage - when all dependencies match, return the original package', (t) => {
  const originalPackage = {
    dependencies: {
      kleur: '1.0.0',
    },
  };
  const config = { kleur: '1.0.0' };
  t.deepEqual(updatePackage(originalPackage, config), originalPackage);
});

test('updatePackage - when there is a dependency mismatch, return an update package', (t) => {
  const originalPackage = {
    devDependencies: {
      kleur: '1.0.0',
    },
    peerDependencies: {
      kleur: '1.0.0',
    },
  };
  const expected = {
    devDependencies: {
      kleur: '2.0.0',
    },
    peerDependencies: {
      kleur: '2.0.0',
    },
  };
  const config = { kleur: '2.0.0' };
  t.deepEqual(updatePackage(originalPackage, config), expected);
});

test('updatePackage - when there is a dependency mismatch in one set but not the other, return an update package', (t) => {
  const originalPackage = {
    devDependencies: {
      kleur: '2.0.0',
    },
    peerDependencies: {
      kleur: '1.0.0',
    },
  };
  const expected = {
    devDependencies: {
      kleur: '2.0.0',
    },
    peerDependencies: {
      kleur: '2.0.0',
    },
  };
  const config = { kleur: '2.0.0' };
  t.deepEqual(updatePackage(originalPackage, config), expected);
});

test('updatePackage - when there is a dependency mismatch with an overage and skipOverage is set, return original package', (t) => {
  const originalPackage = {
    devDependencies: {
      kleur: '3.0.0',
    },
    peerDependencies: {
      kleur: '3.0.0',
    },
  };
  const config = { kleur: '2.0.0' };
  t.deepEqual(updatePackage(originalPackage, config, true), originalPackage);
});
