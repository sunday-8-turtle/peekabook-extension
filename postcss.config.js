if (process.env.MODE === "production") {
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
