const ArgumentError = require("./errors/ArgumentError");

const testCollection = require("./helpers/test-collection");
const formats = require("./formats");

Array.prototype.store = function(data, options)
{
	testCollection(data);

	const defaults = {
		type: "csv"
	};

	const opts = Object.assign({}, defaults, options);

	if (!formats.hasOwnProperty(opts.type))
		throw new ArgumentError("Type `" + opts.type + "` is not implemented");

	const formatter = formats[opts.type];

	return formatter.store(data, options);
};
