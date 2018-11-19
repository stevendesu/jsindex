function shift()
{
	// Remove the element
	const removed = Array.prototype.shift.apply(this);

	// Update the appropriate indexes
	for (const key in this.idx)
	{
		if (this.idx.hasOwnProperty(key))
		{
			const index = this.idx[key][removed[key]];
			index.splice(index.indexOf(removed), 1);
		}
	}

	return removed;
}

module.exports = shift;
