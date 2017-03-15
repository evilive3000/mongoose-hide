const _ = require('lodash');

module.exports = function mongohide(schema, autohide = {}) {
  _.defaultsDeep(autohide, {
    _id: true,
    __v: true,
    createdAt: true,
    updatedAt: true
  });

  const paths = _.union(
    _.map(_.filter(schema.paths, 'options.hidden', true), 'path'),
    _.keys(_.pickBy(autohide))
  );

  schema.set('toJSON', {
    transform: (doc, ret) => _.omit(ret, paths),
    virtuals: true,
    getters: true
  });
};
