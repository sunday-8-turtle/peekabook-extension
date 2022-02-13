if (process.env.NODE_EV === "production") {
  module.exports = {
    plugins: {
      cssnano: {},
    },
  };
} else {
  module.exports = {
    plugins: {},
  };
}
