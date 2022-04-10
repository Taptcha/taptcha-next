import fs from "fs";

function ttl(filePath) {
  let cacheObject = JSON.parse(fs.readFileSync(filePath, "utf8"));

  function save() {
    let toSave = {};

    for (let key in cacheObject) {
      if (cacheObject[key].expires > Math.floor(Date.now() / 1000)) toSave[key] = cacheObject[key];
      else if (cacheObject[key].expires < Math.floor(Date.now() / 1000)) delete cacheObject[key];
    }

    fs.writeFileSync(filePath, JSON.stringify(toSave));
  }

  return {
    set: (key, value, options) => {
      cacheObject[key] = { value, expires: Math.floor(Date.now() / 1000) + options.ttl };
      save();
    },

    get: (key) => {
      if (cacheObject[key] && cacheObject[key].expires > Math.floor(Date.now() / 1000)) return cacheObject[key].value;
      else if (cacheObject[key] && cacheObject[key].expires < Math.floor(Date.now() / 1000)) delete cacheObject[key];
      save();
      return null;
    },

    getAll: () => {
      let result = {};

      for (let key in cacheObject) {
        if (cacheObject[key].expires > Math.floor(Date.now() / 1000)) result[key] = cacheObject[key].value;
        else if (cacheObject[key].expires < Math.floor(Date.now() / 1000)) delete cacheObject[key];
      }

      save();

      return result;
    },

    delete: (key) => {
      delete cacheObject[key];
      save();
    }
  }
}

export default ttl;