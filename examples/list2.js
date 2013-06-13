var promiseT, a, PA, pa, when;

when = require('when');
promiseT = require('../promiseT');

// Let's make Array monadic by adding flatten, chain, and of
// (aka, join, bind, and pure)
Array.prototype.flatten = function() {
	return this.reduce(function(flat, a) {
		return flat.concat(a);
	}, []);
}

Array.prototype.chain = function(f) {
	return this.map(f).flatten();
}

Array.of = function(x) {
	return [x];
}

// Start with a plain old Array
a = [1,2,3];

// Let PA be a promise-aware list type
PA = promiseT(Array);

// Lift a and make a promise-aware list monad
// pa = [promise(1), promise(2), promise(3)]
pa = PA.lift(a.map(when));

// Make sure our plain old Array monad works
// yep, logs 1,2,3 and NOT [1],[2],[3]
a.chain(function(x) {
	return Array.of(x);
}).map(log);

// This also logs 1,2,3!
pa.chain(function(x) {
	// promiseTArray (Promise a) -> (a -> promiseTArray (Promise b)) -> promiseTArray (Promise b)
	return PA.of(when(x));
}).map(log);

// Let's make sure it's still all async
log('If you see this before any of the PA results, then yep, it\'s all async!');

function log(x) {
	console.log(x);
	return x;
}
