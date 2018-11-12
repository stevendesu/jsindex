const CollectionError = require("../errors/CollectionError");

function arrayEquals(first, second)
{
	return first.sort().reduce((acc, el, idx) => acc && second[idx] === el);
}

function objectEquals(first, second)
{
	for (var key in first)
		if (first.hasOwnProperty(key) && first[key] !== second[key])
			return false;
	return true;
}

module.exports = function(collection)
{
	var keys;
	var types = {};

	for (let i = 0; i < collection.length; i++)
	{
		const element = collection[i];

		// 1. All elements must be objects
		if (typeof element !== "object")
			throw new TypeError("Non-object in collection.");

		// 2. All objects must have the same keys
		const elementKeys = Object.keys(element).sort();
		if (i === 0)
			keys = elementKeys;
		else if (!arrayEquals(keys, elementKeys))
			throw new TypeError("Keys did not match in collection.");

		// 3. Matching keys must have the same types
		const elementTypes = [];
		for (var j = 0; j < keys.length; j++)
			elementTypes[keys[j]] = typeof element[keys[j]];
		if (i === 0)
			types = elementTypes;
		else if (!objectEquals(types, elementTypes))
			throw new TypeError("Mismatched types in collection.");
	}

	return true;
};
