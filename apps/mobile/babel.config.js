module.exports = function (api) {
    api.cache(true);
    return {
      presets: [
        ["babel-preset-expo", { jsxImportSource: "nativewind" }],
        "nativewind/babel",
      ],
      plugins: [
        [
          "module-resolver",
          {
            root: ["./"],
            alias: {
              "@": "./src",
            },
          },
        ],
      ],
      env: {
        production: {
          plugins: ['react-native-paper/babel'],
        },
      },
    };
  };