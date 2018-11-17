function drop(columns)
{
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
