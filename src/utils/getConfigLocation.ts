import Globby from 'globby';
import isAbsoluteUrl from 'is-absolute-url';

export interface ConfigLocation {
  type: 'config' | 'url' | 'pkg';
  location: string;
}

export const getConfigLocation = (globby: (string) => Promise<Array<string>>) => async ({
  alseta,
}: Record<string, string>): Promise<ConfigLocation> => {
  if (alseta) {
    if (isAbsoluteUrl(alseta)) {
      return new Promise((r) =>
        r({
          type: 'url',
          location: alseta,
        }),
      );
    } else {
      return new Promise((r) =>
        r({
          type: 'pkg',
          location: alseta,
        }),
      );
    }
  }

  const paths = await globby('alseta.config.json');
  if (!paths.length) {
    throw new Error(
      'alseta config could not be found.\nPlace one in your package.json under "alseta" or at the root of your project in "alseta.config.json"',
    );
  }

  return {
    type: 'config',
    location: paths[0],
  };
};

export default getConfigLocation(Globby);
