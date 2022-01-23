import CracoLessPlugin from 'craco-less';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            javascriptEnabled: true,
            modifyVars: {},
          },
        },
      },
    },
  ],
};
