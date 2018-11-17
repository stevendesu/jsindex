const search = require("./search");
const merge = require("./merge");
const rename = require("./rename");
const drop = require("./drop");

const push = require("./push");
const pop = require("./pop");
const shift = require("./shift");
const unshift = require("./unshift");
const splice = require("./splice");
const concat = require("./concat");

module.exports = {
	search: search,
	merge: merge,
	rename: rename,
	drop: drop,

	push: push,
	pop: pop,
	shift: shift,
	unshift: unshift,
	splice: splice,
	concat: concat
};
