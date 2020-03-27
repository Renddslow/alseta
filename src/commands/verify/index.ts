import getPackages from '../../utils/getPackages';
import verifyPackage from './verifyPackage';

const verify = async (cli) => {
  const { pkgs, config } = await getPackages(cli);

  const errors = [];
  pkgs.forEach((p) => {
    verifyPackage(p, config);
  });
};

export default verify;
