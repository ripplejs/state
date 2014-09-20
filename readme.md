
# state

Batch all changes to an object until the next frame.

```js
var State = require('ripplejs/state');

var data = {
  names: {
    first: 'Scott',
    short: 'Pilgrim'
  }
};

var state = new State(data);

// Stage a change to merge with the original object
state.set({
  names: {
    first: 'William'
  }
});

// Values aren't immediately commited
assert(data.names.first === 'Scott');

// Changes are committed on the next requestAnimationFrame
state.on('flush', function(changed){
  assert(changed[0] === 'names');
  assert(data.names.first === 'William');
});
```

## Notes

* Objects are merged together
* It won't optimize if the values haven't actually changed
