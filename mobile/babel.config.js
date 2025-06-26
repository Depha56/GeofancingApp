module.exports = function (api) {
    api.cache(true);
    const plugins = [
      ['module-resolver', {
        root: ['./'],
        alias: { '@': './' }, // adjust as needed
        extensions: ['.js','.jsx','.ts','.tsx','.json'],
      }],
    ];
  
    return {
      presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
      plugins
    };
  };
  