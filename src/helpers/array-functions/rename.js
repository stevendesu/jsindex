const ArgumentError = require("../../errors/ArgumentError");

function rename(columns)
{
	// Ensure all keys are in the collection
	const keys = Object.keys(columns);
	for (let i = 0; i < keys.length; i++)
		if (!this[0].hasOwnProperty(keys[i]))
			throw new ArgumentError("Key `" + keys[i] + "` is not in collection.");

	// Update the records
	for (let i = 0; i < this.length; i++)
	{
		for (let j = 0; j < keys.length; j++)
		{
			const oldKey = keys[j];
			const newKey = columns[oldKey];
			if (oldKey !== newKey)
			{
				Object.defineProperty(
					this[i],
					newKey,
					Object.getOwnPropertyDescriptor(this[i], oldKey)
				);
				delete this[i][oldKey];
			}
		}
	}

	// Update the indexes
	for (let i = 0; i < keys.length; i++)
	{
		const oldKey = keys[i];
		const newKey = columns[oldKey];
		if (oldKey !== newKey)
		{
			Object.defineProperty(
				this.idx,
				newKey,
				Object.getOwnPropertyDescriptor(this.idx, oldKey)
			);
			delete this.idx[oldKey];
		}
	}

	return this;
}

module.exports = rename;
