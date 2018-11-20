const CollectionError = require("../errors/CollectionError");

function arrayEquals(first, second)
{
	// Assumes the two arrays are sorted
	// In my case, I know this is true

	if (first.length !== second.length)
		return false;

	for (let i = 0; i < first.length; i++)
	{
		if (first[i] !== second[i])
			return false;
	}

	return true;
}

function objectEquals(first, second)
{
	const keys = Object.keys(first);
	for (let i = 0; i < keys.length; i++)
	{
		const key = keys[i];
		if (first[key] !== second[key])
			return false;
	}
	return true;
}

module.exports = function(collection)
{
	let keys;
	let types = {};

	for (let i = 0; i < collection.length; i++)
	{
		const element = collection[i];

		// 1. All elements must be objects
		if (typeof element !== "object")
			throw new CollectionError("Non-object in collection.");

		// 2. All objects must have the same keys
		const elementKeys = Object.keys(element).sort();
		if (i === 0)
			keys = elementKeys;
		else if (!arrayEquals(keys, elementKeys))
			throw new CollectionError("Keys did not match in collection.");

		// 3. Matching keys must have the same types
		const elementTypes = [];
		for (let j = 0; j < keys.length; j++)
			elementTypes[keys[j]] = typeof element[keys[j]];
		if (i === 0)
			types = elementTypes;
		else if (!objectEquals(types, elementTypes))
			throw new CollectionError("Mismatched types in collection.");
	}

	return true;
};
