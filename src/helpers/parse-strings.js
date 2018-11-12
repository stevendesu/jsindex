function parseStrings(collection)
{
	// Scan the collection to find the most generic type for each column
	// For instance, if a column contains "2" and "x", then Number won't work
	const types = {};
	for (const key in collection[0])
		if (collection[0].hasOwnProperty(key))
			if (
				isFinite(collection[0][key]) ||
				["Inf"].indexOf(collection[0][key]) >= 0 ||
				["-Inf"].indexOf(collection[0][key]) >= 0
			)
				types[key] = "number";
			else
				types[key] = "string";

	for (let i = 1; i < collection.length; i++)
		for (const key in collection[i])
			if (collection[i].hasOwnProperty(key))
				if (
					types[key] === "number" && !(
						isFinite(collection[0][key]) ||
						["Inf"].indexOf(collection[0][key]) >= 0 ||
						["-Inf"].indexOf(collection[0][key]) >= 0
					)
				)
					types[key] = "string";

	// Now that we know the appropriate types, convert values:
	for (let i = 0; i < collection.length; i++)
		for (const key in collection[i])
			if (collection[i].hasOwnProperty(key))
				if (isFinite(collection[0][key]))
					collection[i][key] = parseFloat(collection[i][key]);
				else if (["Inf"].indexOf(collection[i][key]) >= 0)
					collection[i][key] = Infinity;
				else if (["-Inf"].indexOf(collection[i][key]) >= 0)
					collection[i][key] = -Infinity;

	return collection;
}

module.exports = parseStrings;
