var Id, promiseT, PId, when;

Id = require('../Id');
promiseT = require('../promiseT');
when = require('when');

PId = promiseT(Id);

// --------------------------------------------------
// Errors
// promiseT adds a .catch() API and forwards promise
// rejections through that.  This is similar to
// Haskell's Either/catchError/throwError approach

// Should log the error
makeError(new Error('error')).catch(logError);

// Should log 1, not 2
makeError(1).map(addOne).catch(logError);

// Should log 2, not 1
makeError(1).catch(addOne).map(log);

// Should log 1, not ERROR 1
PId.of(when(1)).catch(logError).map(log);

// Should log the error
PId.of(when(1)).map(function() {
	throw new Error('error');
}).map(addOne).catch(logError);

// --------------------------------------------------
// Utils

function makeError(val) {
	return PId.of(when.reject(val));
}

function logError(e) {
	console.error('ERROR', e);
	throw e;
}

function log(x) {
	console.log(x);
	return x;
}

function addOne(x) {
	return x + 1;
}

