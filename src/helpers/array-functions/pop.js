function pop()
{
	// Remove the element
	const removed = Array.prototype.pop.apply(this);

	// Update the appropriate indexes
	const keys = Object.keys(this.idx);
	for (let i = 0; i < keys.length; i++)
	{
		const key = keys[i];
		const index = this.idx[key][removed[key]];
		index.splice(index.indexOf(removed), 1);
	}

	return removed;
}

module.exports = pop;
