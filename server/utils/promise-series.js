// modified from
// https://github.com/CacheControl/promise-series

module.exports = function(array) {
  return new Promise(function(resolve, reject) {
    var i = 0,
      len = array.length,
      results = [];

    function processPromise(result) {
      results[i] = result;
      i++;
      next();
    }

    function next() {
      if(i >= len) return resolve(results);

      var method = array[i];
      if(typeof method === 'object' && typeof method.then === 'function' && typeof method.catch === 'function') {
        method.then(processPromise).catch(reject);
      } else {
        processPromise(method);
      }
    }

    next();
  });
};