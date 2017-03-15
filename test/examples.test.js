'use strict';


const plugin = require('../');
const mongoose = require('mongoose');
const expect = require('chai').expect;

const schemaObj = {
  visibleField: {
    type: String
  },
  hiddenField: {
    type: String,
    hidden: true
  }
};

const modelData = {
  //'_id': new mongoose.Types.ObjectId('98765432109876543210abcd'),
  'visibleField': 'visible',
  'hiddenField': 'hidden',
  'createdAt': new Date(),
  'updatedAt': new Date(),
  '__v': 0
};


describe('Plugin', () => {

  describe('by default', () => {
    const schema = new mongoose.Schema(schemaObj, {timestamps: true});
    schema.plugin(plugin);

    const Test = mongoose.model('Test1', schema);
    const test = new Test(modelData);

    it('hides `__v`, `_id`, `createdAt` and `updatedAt`', done => {
      expect(test.toObject()).contains.all.keys(
        ['__v', '_id', 'createdAt', 'updatedAt']
      );
      expect(test.toJSON()).not.contains.any.keys(
        ['__v', '_id', 'createdAt', 'updatedAt']
      );
      done();
    });

    it('hides fields with option `hidden: true`', done => {
      expect(test.toObject()).includes.a.key('hiddenField');
      expect(test.toJSON()).not.includes.a.key('hiddenField');
      done();
    });

    it('returns `id` instead `_id`', done => {
      const data = test.toJSON();
      expect(data).includes.a.key('id');
      expect(data).not.includes.a.key('_id');
      done();
    });
  });

  describe('with options', () => {
    it('disables hiding `createdAt` field', done => {
      const schema = new mongoose.Schema(schemaObj, {timestamps: true});
      schema.plugin(plugin, {createdAt: false});
      const Test = mongoose.model('Test2', schema);
      const test = new Test(modelData);

      expect(test.toJSON()).contains.a.key('createdAt');
      expect(test.toJSON()).not.contains.a.key('updatedAt');

      done();
    });

    it('sets fields visibility through plugin\'s options', done => {
      const schema = new mongoose.Schema({
        visibleField: String,
        hiddenField: String
      });
      schema.plugin(plugin, {hiddenField: true});
      const Test = mongoose.model('Test3', schema);
      const test = new Test(modelData);

      expect(test.toObject()).contains.a.key('hiddenField');
      expect(test.toJSON()).not.contains.a.key('hiddenField');

      expect(test.toObject()).contains.a.key('visibleField');
      expect(test.toJSON()).contains.a.key('visibleField');

      done();
    })
  })
});