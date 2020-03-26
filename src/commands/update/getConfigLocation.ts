import globby from 'globby';
import isAbsoluteUrl from 'is-absolute-url';

export interface ConfigLocation {
  type: 'config' | 'url' | 'pkg';
  location: string;
}

const getConfigLocation = async ({ alesta }: Record<string, string>): Promise<ConfigLocation> => {
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
  return {
    type: 'config',
    location: paths[0],
  };
};

export default getConfigLocation;
