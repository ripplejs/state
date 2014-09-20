var assert = require('component/assert');
var Observer = require('/')

describe('observer', function(){

  var model = {
    firstname: 'Scott',
    lastname: 'Pilgrim',
    props: {
      nested: {
        another: 'thing',
        value: false
      }
    }
  };

  var observer = new Observer(model);

  afterEach(function(){
    observer.clear();
  });

  it('should batch changes', function(){
    observer.set({ firstname: 'Barry' });
    assert(model.firstname, 'Scott');
  });

  it('should commit the changes on the next frame', function(done){
    observer
      .set({ firstname: 'Larry' })
      .on('flush', function(props){
        assert(props[0] === 'firstname');
        done();
      });
  });

  it('should set changes syncronously', function(){
    observer.setSync({ firstname: 'Stuart' });
    assert(model.firstname === 'Stuart');
  });

  it('should manually flush', function(done){
    observer
      .set({ firstname: 'Bob' })
      .flush(done);
  });

  it('should only flush once per frame', function(done){
    var count = 0;
    observer.set({ firstname: 'Anthony' });
    observer.on('flush', function(){
      count += 1;
    });
    observer.flush(function(){
      count += 1;
      assert(count === 2);
      done();
    });
  });

  it('should cancel changes', function(){
    observer.set({ firstname: 'Adrian' });
    observer.cancel();
    assert(model.firstname === 'Anthony');
  });

  it('should merge changes with the original object', function(done){
    observer.set({
      props: {
        nested: {
          value: true
        }
      }
    });
    observer.flush(function(){
      assert(model.props.nested.another === 'thing');
      assert(model.props.nested.value === true);
      done();
    });
  });

});
