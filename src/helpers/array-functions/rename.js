const ArgumentError = require("../../errors/ArgumentError");

function rename(columns)
{
	// Ensure all keys are in the collection
	for (const key in columns)
		if (!this[0].hasOwnProperty(key))
			throw new ArgumentError("Key `" + key + "` is not in collection.");

	// Update the records
	for (let i = 0; i < this.length; i++)
	{
		for (const key in columns)
		{
			if (columns.hasOwnProperty(key))
			{
				const oldKey = key;
				const newKey = columns[key];
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
	}

	// Update the indexes
	for (const key in columns)
	{
		if (columns.hasOwnProperty(key))
		{
			const oldKey = key;
			const newKey = columns[key];
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
	}

	return this;
}

module.exports = rename;
