var promiseT, a, a2, PA, pa, pa2, when;

// A promise lib we'll use to make promises
when = require('when');

// promiseT Monad transformer that adds promised
// asynchrony to any Functor, Applicative, Monad, etc.
promiseT = require('../promiseT');

// Javascript Array isn't a Monad, but Array.prototype.map
// is a Functor, so we can still use it.
PA = promiseT(Array);

// Plain old Array
a = [1,2,3];

// log all the values
a.map(log);

// Array whose elements are promises
pa = a.map(when);

// try to log all the values
// Hmmm, doesn't do what we want
// logs: [object],[object],[object]
pa.map(log);

// Let's lift it and make it understand promises
// Now pa is a list that knows how to deal with the fact
// that it's elements are promises
pa = PA.lift(pa);

// Now log it. Yay, it logs values!
pa.map(log);

// Let's see what else works

// We know map works, but let's test it further
a.map(addOne).map(log);
// We can do the same with lists of promises.
pa.map(addOne).map(log);

// We know we can concat Arrays
a2 = [4,5,6];
a.concat(a2).map(log);
// Hey look, we can concat lists of promises too, easy.
pa2 = PA.lift(a2.map(when));
pa.concat(pa2).map(log);

// Arrays are foldable, and lists of promises are now too
// Folding a list of values yields a value
log(a.reduceRight(add, 0));
// Folding a list of promises yields a promise, fun!
pa.reduceRight(add, when(0)).then(log);

// Similarly, from the left
log(a.reduce(add, 0));
pa.reduce(add, when(0)).then(log);

// And we can put it all together
log(a.concat(a2).map(addOne).reduce(add, 0));
pa.concat(pa2).map(addOne).reduce(add, when(0)).then(log);

// Is it really async?  Let's see
pa = PA.lift([delay(3000, 1), delay(2000, 2), delay(1000, 3)]);
pa.map(log);
pa.reduce(add, when(0)).then(log);

log('If you see this before any of the PA results, then yep, it\'s all async!');

function log(x) {
	console.log(x);
	return x;
}

function addOne(x) {
	return x+1;
}

function add(x, y) {
	return x + y;
}

function delay(ms, x) {
	return when.promise(function(r) {
		setTimeout(r.bind(null, x), ms);
	});
}