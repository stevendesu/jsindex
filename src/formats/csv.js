const parseStrings = require("../helpers/parse-strings");

const csvParse = require("csv-parse");
const csvParseSync = require("csv-parse/lib/sync");

const csvStringify = require("csv-stringify");
const csvStringifySync = require("csv-stringify/lib/sync");

function load(string, options)
{
	const defaults = {
		columns: true
	};

	const opts = Object.assign({}, defaults, options);

	if (opts.sync)
		return parseStrings(csvParseSync(string, opts));
	else
		return new Promise(function(resolve, reject)
		{
			csvParse(string, opts, function(err, value)
			{
				if (err)
					reject(err);
				else
					resolve(parseStrings(value));
			});
		});
}

function store(data, options)
{
	const defaults = {
		header: true
	};

	const opts = Object.assign({}, defaults, options);

	if (opts.sync)
		return csvStringifySync(data, opts);
	else
		return new Promise(function(resolve, reject)
		{
			csvStringify(data, opts, function(err, value)
			{
				if (err)
					reject(err);
				else
					resolve(value);
			});
		});
}

module.exports = {
	load: load,
	store: store
};
