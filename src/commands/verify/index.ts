import getPackages from '../../utils/getPackages';

const verify = async (cli) => {
  const { pkgs, config } = await getPackages(cli);
};

export default verify;
