function ttl(cacheObject) {
  return {
    set: (key, value, options) => {
      cacheObject[key] = { value, expires: Math.floor(Date.now() / 1000) + options.ttl };
    },

    get: (key) => {
      if (cacheObject[key] && cacheObject[key].expires > Math.floor(Date.now() / 1000)) return cacheObject[key].value;
      else if (cacheObject[key] && cacheObject[key].expires < Math.floor(Date.now() / 1000)) delete cacheObject[key];
      return null;
    },

    getAll: () => {
      let result = {};

      for (let key in cacheObject) {
        if (cacheObject[key].expires > Math.floor(Date.now() / 1000)) result[key] = cacheObject[key].value;
        else if (cacheObject[key].expires < Math.floor(Date.now() / 1000)) delete cacheObject[key];
      }

      return result;
    }
  }
}

export default ttl;