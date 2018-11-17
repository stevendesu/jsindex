const ArgumentError = require("../../errors/ArgumentError");

function drop(columns)
{
	// Ensure all keys are in the collection
	for (let i = 0; i < columns.length; i++)
		if (!this[0].hasOwnProperty(columns[i]))
			throw new ArgumentError("Key `" + columns[i] + "` is not in collection.");

	// Update the records
	for (let i = 0; i < this.length; i++)
	{
		for (let j = 0; j < columns.length; j++)
		{
			const key = columns[j];
			delete this[i][key];
		}
	}

	// Update the indexes
	for (let j = 0; j < columns.length; j++)
	{
		const key = columns[j];
		delete this.idx[key];
	}

	return this;
}

module.exports = drop;
