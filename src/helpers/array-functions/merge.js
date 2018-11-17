const ArgumentError = require("../../errors/ArgumentError");
const CollectionError = require("../../errors/CollectionError");
const NotImplementedError = require("../../errors/NotImplementedError");

function findValidKey(collection, key)
{
	if (collection.hasOwnProperty(key))
	{
		let testKey = 2;

		while (collection.hasOwnProperty(key + "_" + testKey))
			testKey += 1;

		return key + "_" + testKey;
	}
	else
		return key;
}

function mergeRow(left, right, keys, inPlace)
{
	const merged = inPlace ? left : Object.assign({}, left);

	for (let i = 0; i < keys.length; i++)
		if (right === null)
			merged[findValidKey(merged, keys[i])] = null;
		else
			merged[findValidKey(merged, keys[i])] = right[keys[i]];

	return merged;
}

function leftMerge(left, right, opts)
{
	const leftOn = opts.joinOn.left;
	const rightOn = opts.joinOn.right;

	const merged = [];
	const keys = Object.keys(right[0]).filter(key => key !== rightOn);

	for (let i = 0; i < left.length; i++)
	{
		const matches = right.idx[rightOn][left[i][leftOn]];
		if (typeof matches === "undefined")
			merged.push(
				mergeRow(left[i], null, keys, opts.inPlace)
			);
		else if (matches.length > 1)
			throw new CollectionError("More than one row matched.");
		else if (matches.length === 1)
			merged.push(
				mergeRow(left[i], matches[0], keys, opts.inPlace)
			);
		else
			merged.push(
				mergeRow(left[i], null, keys, opts.inPlace)
			);
	}

	return merged;
}

function innerMerge(left, right, opts)
{
	const leftOn = opts.joinOn.left;
	const rightOn = opts.joinOn.right;

	const merged = [];
	const keys = Object.keys(right[0]).filter(key => key !== rightOn);

	for (let i = 0; i < left.length; i++)
	{
		const matches = right.idx[rightOn][left[i][leftOn]];

		if (matches.length === 0)
			continue;
		else if (matches.length > 1)
			throw new CollectionError("More than one row matched.");
		else if (matches.length === 1)
			merged.push(
				mergeRow(left[i], matches[0], keys, opts.inPlace)
			);
		else if (opts.inPlace)
			left.splice(i, 1);
	}

	return merged;
}

function rightMerge(left, right, opts)
{
	const leftOn = opts.joinOn.left;
	const rightOn = opts.joinOn.right;

	const merged = [];
	let keys = Object.keys(left[0]);

	if (leftOn === rightOn)
		keys = keys.filter(key => key !== leftOn);

	for (let i = 0; i < right.length; i++)
	{
		const matches = left.idx[leftOn][right[i][rightOn]];
		let row;
		if (typeof matches === "undefined")
			row = mergeRow(right[i], null, keys, false);
		else if (matches.length > 1)
			throw new CollectionError("More than one row matched.");
		else if (matches.length === 1)
			row = mergeRow(right[i], matches[0], keys, false);
		else
			row = mergeRow(right[i], null, keys, false);

		if (leftOn !== rightOn)
			delete row[rightOn];
		merged.push(row);
	}

	if (opts.inPlace)
		left.splice(0, left.length, merged);

	return merged;
}

function outerMerge()
{
	throw new NotImplementedError();
}

function merge(right, options)
{
	const defaults = {
		joinType: "left",
		inPlace: true
	};

	if (typeof right.merge === "undefined")
		throw new CollectionError("Right-hand side is not indexed.");
	if (right.length === 0)
		throw new CollectionError("Cannot merge empty collection.");

	let opts;
	if (typeof options === "string")
		opts = Object.assign({}, defaults, { joinOn: options });
	else if (typeof options === "object" && !Array.isArray(options))
		opts = Object.assign({}, defaults, options);
	else
		throw new ArgumentError("Invalid options passed to merge method.");

	if (typeof opts.joinOn === "string")
		opts.joinOn = { left: opts.joinOn, right: opts.joinOn };

	switch (opts.joinType)
	{
	case "left":
		return leftMerge(this, right, opts);
	case "inner":
		return innerMerge(this, right, opts);
	case "outer":
		return outerMerge(this, right, opts);
	case "right":
		return rightMerge(this, right, opts);
	default:
		throw new ArgumentError("Join type is invalid.");
	}
}

module.exports = merge;
