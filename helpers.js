module.exports = {
  convertMapToObject: function toObject(map = new Map()) {
    return Object.fromEntries(
      Array.from(map.entries(), ([k, v]) =>
        v instanceof Map ? [k, toObject(v)] : [k, v]
      )
    );
  },
};
