const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

// Create the default Metro config
const defaultConfig = getDefaultConfig(projectRoot);

// Add the additional configurations
const config = {
  ...defaultConfig,
  watchFolders: [
    projectRoot,
    workspaceRoot,
  ],
  resolver: {
    ...defaultConfig.resolver,
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(workspaceRoot, 'node_modules'),
    ],
    disableHierarchicalLookup: true,
    // Force Metro to resolve (sub)dependencies from the app's node_modules
    extraNodeModules: new Proxy(
      {},
      {
        get: (target, name) => {
          return path.join(projectRoot, `node_modules/${name}`);
        },
      },
    ),
  },
  transformer: {
    ...defaultConfig.transformer,
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

module.exports = config;