var Id, promiseT, PId, m, pm, u, v, w, f, g, when;

Id = require('../Id');
promiseT = require('../promiseT');
when = require('when');

// --------------------------------------------------
// Id

// Functor
m = Id.of(1);
f = addOne;
g = addOne;

fcompare('u.map(identity) === u', m.map(identity), m);

fcompare('u.map(function(x) { return f(g(x)); }) === u.map(f).map(g)',
	m.map(function(x) {
		return f(g(x));
	}),
	m.map(f).map(g)
);

// Applicative
u = Id.of(addOne);
v = Id.of(addOne);
w = Id.of(1);
m = Id.of(identity);

fcompare('a.of(identity).ap(v) === v', m.ap(w), w);

fcompare('a.of(f).ap(a.of(x)) === a.of(f(x))',
	m.ap(Id.of(f)),
	Id.of(identity(f)));

fcompare('u.ap(a.of(y)) === a.of(function(f) { return f(y); }).ap(u)',
	m.ap(Id.of(addOne)),
	Id.of(function(f) { return f(addOne); }).ap(m));

fcompare('a.of(function(f) { return function(g) { return function(x) { return f(g(x))}; }; }).ap(u).ap(v).ap(w) === u.ap(v.ap(w))',
	Id.of(function(f) { return function(g) { return function(x) { return f(g(x))}; }; }).ap(u).ap(v).ap(w), u.ap(v.ap(w)));

// Chain/Monad
m = Id.of(1);
f = addOneM(Id);
g = addOneM(Id);

fcompare('m.chain(f).chain(g) === m.chain(function(x) { return f(x).chain(g); })',
	m.chain(f).chain(g),
	m.chain(function(x) {
		return f(x).chain(g);
	}));

// --------------------------------------------------
// promiseT(Id)

PId = promiseT(Id);

// Functor
pm = PId.of(when(1));
f = addOne;
g = addOne;

fcompare('promiseT u.map(identity) === u', pm.map(identity), pm);

fcompare('promiseT u.map(function(x) { return f(g(x)); }) === u.map(f).map(g)',
	pm.map(function(x) {
		return addOne(addOne(x));
	}),
	pm.map(addOne).map(addOne)
);

// Applicative
u = PId.of(when(addOne));
v = PId.of(when(addOne));
w = PId.of(when(1));
pm = PId.of(when(identity));

fcompare('promiseT a.of(identity).ap(v) === v', pm.ap(w), w);

fcompare('promiseT a.of(f).ap(a.of(x)) === a.of(f(x))',
	pm.ap(PId.of(when(f))),
	PId.of(when(identity(f))));

fcompare('promiseT u.ap(a.of(y)) === a.of(function(f) { return f(y); }).ap(u)',
	pm.ap(PId.of(when(addOne))),
	PId.of(when(function(f) { return f(addOne); })).ap(pm));

fcompare('promiseT a.of(function(f) { return function(g) { return function(x) { return f(g(x))}; }; }).ap(u).ap(v).ap(w) === u.ap(v.ap(w))',
	PId.of(when(function(f) {
		return function(g) {
			return function(x) {
				return f(g(x))
			};
		};
	})).ap(u).ap(v).ap(w),
	u.ap(v.ap(w)));

// Chain
pm = PId.of(when(1));
f = addOnePM(PId);
g = addOnePM(PId);

fcompare('promiseT m.chain(f).chain(g) === m.chain(function(x) { return f(x).chain(g); })',
	pm.chain(f).chain(g),
	pm.chain(function(x) {
		return f(x).chain(g);
	}));

// Monad
fcompare('promiseT m.of(a).chain(f) === f(a)',
	PId.of(when(1)).chain(f),
	f(1)
);

fcompare('promiseT m.chain(m.of) === m',
	pm.chain(PId.of),
	pm
);

// --------------------------------------------------
// Utils
function identity(x) {
	return x;
}

function addOne(x) {
	return x + 1;
}

function addOneM(M) {
	return function(x) {
		return M.of(x + 1);
	};
}

function addOnePM(PM) {
	return function(x) {
		return PM.of(when(addOne(x)));
	};
}

function fcompare(msg, functor1, functor2) {
	functor1.map(function(x) {
		functor2.map(function(y) {
			console.log(x === y ? 'PASS' : 'FAIL', msg);
			if(x !== y) {
				console.log('\tvalues:', x && x.name || x, y && y.name || y);
			}
		});
	});
}
