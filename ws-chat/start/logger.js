module.exports = function(module) {
  return function(...args) {
      console.log(module.filename, ...args);
  };
};
