function splice(start, deleteCount)
{
	const items = Array.from(arguments).slice(2);

	// Perform a normal splice first
	const removed = Array.prototype.splice.apply(
		this, [start, deleteCount].concat(items)
	);

	// Then update the index
	// The "items" must be appended to the appropriate indexes, and the
	// "removed" must be taken out
	// Adding "items"
	// NOTE: This doesn't preserve the order of the collection in the index
	for (let i = 0; i < items.length; i++)
		for (const key in this.idx)
			if (this.idx.hasOwnProperty(key))
				if (this.idx[key].hasOwnProperty(items[i][key]))
					this.idx[key][items[i][key]].push(items[i]);
				else
					this.idx[key][items[i][key]] = [items[i]];

	// Removing "removed"
	// First, organize the remove elements to match our index structure
	const affected = {};
	for (const key in this.idx)
		if (this.idx.hasOwnProperty(key))
		{
			affected[key] = {};
			for (let i = 0; i < removed.length; i++)
				if (affected[key].hasOwnProperty(removed[i][key]))
					affected[key][removed[i][key]].push(removed[i]);
				else
					affected[key][removed[i][key]] = [removed[i]];
		}
	// Now filter any sub-indexes that we need to
	for (const key in affected)
		if (affected.hasOwnProperty(key))
			for (const subkey in affected[key])
				if (affected[key].hasOwnProperty(subkey))
				{
					this.idx[key][subkey] = this.idx[key][subkey].filter(el =>
						affected[key][subkey].indexOf(el) >= 0
					);
				}

	// Finally, ensure API compatibility with Array.prototype.splice
	return removed;
}

module.exports = splice;
