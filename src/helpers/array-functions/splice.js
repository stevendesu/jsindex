function splice(start, deleteCount)
{
	const items = Array.from(arguments).slice(2);

	// Perform a normal splice first
	const removed = Array.prototype.splice.apply(
		this, [start, deleteCount].concat(items)
	);

	const indexKeys = Object.keys(this.idx);

	// Then update the index
	// The "items" must be appended to the appropriate indexes, and the
	// "removed" must be taken out
	// Adding "items"
	// NOTE: This doesn't preserve the order of the collection in the index
	for (let i = 0; i < items.length; i++)
	{
		for (let j = 0; j < indexKeys.length; j++)
		{
			const key = indexKeys[j];
			if (this.idx[key].hasOwnProperty(items[i][key]))
				this.idx[key][items[i][key]].push(items[i]);
			else
				this.idx[key][items[i][key]] = [items[i]];
		}
	}

	// Removing "removed"
	// First, organize the remove elements to match our index structure
	const affected = {};
	for (let i = 0; i < indexKeys.length; i++)
	{
		const key = indexKeys[i];
		affected[key] = {};
		for (let j = 0; j < removed.length; j++)
			if (affected[key].hasOwnProperty(removed[j][key]))
				affected[key][removed[j][key]].push(removed[j]);
			else
				affected[key][removed[j][key]] = [removed[j]];
	}

	// Now filter any sub-indexes that we need to
	const affectedKeys = Object.keys(affected);
	for (let i = 0; i < affectedKeys.length; i++)
	{
		const key = affectedKeys[i];
		const subkeys = Object.keys(affected[key]);
		for (let j = 0; j < subkeys.length; j++)
		{
			const subkey = subkeys[j];
			const oldIndex = this.idx[key][subkey];
			const newIndex = new Array(oldIndex.length);
			let cnt = 0;
			for (let k = 0; k < oldIndex.length; k++)
			{
				const el = oldIndex[k];
				if (affected[key][subkey].indexOf(el) >= 0)
					newIndex[cnt++] = el;
			}
			newIndex.length = cnt;
			this.idx[key][subkey] = newIndex;
		}
	}

	// Finally, ensure API compatibility with Array.prototype.splice
	return removed;
}

module.exports = splice;
