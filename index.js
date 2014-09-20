var raf = require('component/raf@1.2.x');
var merge = require('pluma/assimilate@0.4.x').withStrategy('deep');
var emitter = require('component/emitter@1.1.x');

module.exports = State;

/**
 * Batch
 * @param {Object} state
 */

function State(state) {
  this.state = state;
  this.changes = {};
}

/**
 * Mixin emitter
 */

emitter(State.prototype);

/**
 * Schedule a render for every bindings that
 * is bound to props.
 *
 * @param {Array} props
 * @param {Function} fn
 */

State.prototype.set = function(state, callback) {
  this.stage(state);
  if (callback) this.once('flush', callback);
  this.schedule();
  return this;
};

/**
 * Update immediately
 *
 * @param {Object} state
 */

State.prototype.setSync = function(state) {
  this.stage(state);
  this.flush();
  return this;
};

/**
 * Schedule a flush. If the view hasn't yet
 * rendered, it will schedule it to flush as
 * soon as it has rendered.
 */

State.prototype.schedule = function() {
  var self = this;
  this.job = raf(function(){
    self.flush();
  });
};

/**
 * Stage some changes. This will be committed on
 * the next flush of the view
 *
 * @param {Object} state
 */

State.prototype.stage = function(state) {
  merge(this.changes, state);
};

/**
 * Flush all changes and update the object
 */

State.prototype.flush = function(callback) {
  var changes = this.changes;
  var props = Object.keys(changes);
  merge(this.state, changes);
  this.reset();
  this.emit('flush', props);
  if (callback) callback();
};

/**
 * Reset the changes
 */

State.prototype.reset = function(){
  this.cancel();
  this.changes = {};
};

/**
 * Cancel any scheduled updates
 */

State.prototype.cancel = function(){
  if (this.job) raf.cancel(this.job);
  this.job = null;
};

/**
 * Destroy all bindings
 */

State.prototype.clear = function() {
  this.reset();
  this.off();
  this.emit('destroy');
};
