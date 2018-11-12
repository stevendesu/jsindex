const ArgumentError = require("./errors/ArgumentError");

const testCollection = require("./helpers/test-collection");
const arrayFunctions = require("./helpers/array-functions");

Array.prototype.index = function(indexes)
{
	// First verify that the array has the proper form
	testCollection(this);

	// Next, determine what indexes will be created
	var indexList;
	if (typeof indexes === "undefined")
		indexList = Object.keys(this[0]);
	else if (typeof indexes === "string")
		indexList = [indexes];
	else if (typeof indexes === "object" && Array.isArray(indexes))
		indexList = indexes;
	else
		throw new ArgumentError("Array.prototype.index() expects parameter to be a string or array or strings.");

	// Finally, let's build the index object
	this.idx = {};
	for (let i = 0; i < indexList.length; i++)
	{
		this.idx[indexList[i]] = {};
	}

	// One-pass construction of the indexes
	for (let i = 0; i < this.length; i++)
	{
		const element = this[i];

		// For now, all indexes are hash indexes
		// Soon (very soon) I want to make "number" types a B-tree style
		for (let j = 0; j < indexList.length; j++)
		{
			const value = element[indexList[j]];
			const idx = this.idx[indexList[j]];

			idx[value] = idx[value] || [];
			idx[value].push(element);
		}
	}

	// Bind several index functions
	this.search = arrayFunctions.search;

	// Finally, override several array functions to maintain indexes
	this.push = arrayFunctions.push;
	this.pop = arrayFunctions.pop;
	this.shift = arrayFunctions.shift;
	this.unshift = arrayFunctions.unshift;
};
