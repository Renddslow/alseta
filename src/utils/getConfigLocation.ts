import Globby from 'globby';
import isAbsoluteUrl from 'is-absolute-url';

export interface ConfigLocation {
  type: 'config' | 'url' | 'pkg';
  location: string;
}

export const getConfigLocation = (globby: (string) => Promise<Array<string>>) => async ({
  alesta,
}: Record<string, string>): Promise<ConfigLocation> => {
  if (alesta) {
    if (isAbsoluteUrl(alesta)) {
      return new Promise((r) =>
        r({
          type: 'url',
          location: alesta,
        }),
      );
    } else {
      return new Promise((r) =>
        r({
          type: 'pkg',
          location: alesta,
        }),
      );
    }
  }

  const paths = await globby('alesta.config.json');
  if (!paths.length) {
    throw new Error(
      'Alesta config could not be found.\nPlace one in your package.json under "alesta" or at the root of your project in "alesta.config.json"',
    );
  }

  return {
    type: 'config',
    location: paths[0],
  };
};

export default getConfigLocation(Globby);
