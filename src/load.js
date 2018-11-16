const ArgumentError = require("./errors/ArgumentError");

const formats = require("./formats");

Array.load = function(source, options)
{
	if (typeof source !== "string")
		throw new ArgumentError("Source should be a string.");

	if (source.length === 0)
		throw new ArgumentError("Source does not contain any data.");

	const defaults = {
		type: "csv",
		sync: true
	};

	const opts = Object.assign({}, defaults, options);

	if (!formats.hasOwnProperty(opts.type))
		throw new ArgumentError("Type `" + opts.type + "` is not implemented");

	const formatter = formats[opts.type];

	return formatter.load(source, opts);
};
