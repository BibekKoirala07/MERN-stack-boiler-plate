module.exports = (fn) => {
  return (req, res, next) => {
    console.log("here");
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
