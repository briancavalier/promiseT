# promiseT Monad Transformer

Instead of creating a promise monad or merging the promise and monad interfaces into a larger, more confusing interface, I created a promiseT *monad transformer*, along the lines of the [Haskell stateT monad transformer](http://en.wikibooks.org/wiki/Haskell/Monad_transformers#The_State_transformer).  Haskell does not have *a* State monad, but rather uses stateT to add stateful behavior to any other monad.  For example, the monad returned by the `state` function is actually `stateT` applied to the identity monad.

The [examples](examples) apply promiseT to a Javascript Array (which is not a Monad, but Array.prototype.map is a Functor, so we can work with that) and a simple Identity monad, yielding new promise-aware types in each case.  These new types *are not* promises.  They don't have `then`, but they can operate on promise values and their functor, applicative, and chain accept functions that deal with promises.

Both the Identity monad and it's `promiseT`-ified version [obey the functor, applicative, chain, and monad laws](examples/laws.js), as they are stated in [fantasy-land](https://github.com/puffnfresh/fantasy-land).

`promiseT` is independent of any particular promise implementation.  It relies only on the [Promises/A+](http://promises-aplus.github.io/promises-spec/) `then` API.  The examples here use [when.js](https://github.com/cujojs/when), but [my original gist version](https://gist.github.com/briancavalier/3d3fc0c08d51aeaed5c0) used [avow](https://github.com/briancavalier/avow). Switching required no changes to `promiseT`

## Why?

There is currently a gap between the Promise and Monad communities, and I've been thinking about ways to bridge that.  The two concepts are powerful and elegant, and I think it would be awesome for them to work together, and for the communities to converge.

## Running examples

1. Fork/clone
2. `npm install`
3. `npm test` - runs functor, applicative, chain, and monad law tests against the Id and `promiseT(Id)` monads
3. `node examples/list.js` - lifts Javascript `Array` to be promise-aware and does some gymnastics with it.
4. `node examples/errors.js` - shows how error handling might work in a way that is similar to Haskell's `Either`/`catchError`/`throwError` error handling approach.

---
Copyright &copy; 2013 Brian Cavalier, MIT License
