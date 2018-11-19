const ArgumentError = require("../../errors/ArgumentError");
const CollectionError = require("../../errors/CollectionError");

function search(descriptor)
{
	if (typeof descriptor !== "object" || Array.isArray(descriptor))
		throw new ArgumentError("Decsriptor must be an object");

	// Can't filter an empty collection
	if (this.length === 0)
		return [];

	// Grab the appropriate indexes (if possible
	const idxs = [];
	let allIndexed = true;
	for (const key in descriptor)
		if (descriptor.hasOwnProperty(key))
			if (this.idx.hasOwnProperty(key))
			{
				if (this.idx[key].hasOwnProperty(descriptor[key]))
					idxs.push(this.idx[key][descriptor[key]]);
				else
					// The value they searched for isn't in the collection
					return [];
			}
			else if (this[0].hasOwnProperty(key))
			{
				console.warn("Searching on non-indexed key `" + key + "`. This will cause performance issues.");
				allIndexed = false;
				break;
			}
			else
			{
				throw new CollectionError("Key `" + key + "` is not in collection.");
			}

	if (!allIndexed)
	{
		// Searching on a non-indexed key requires we do this the slow way
		const returnValue = new Array(this.length);
		let cnt = 0;
		for (let i = 0; i < this.length; i++)
		{
			const el = this[i];
			let keep = true;
			for (const key in descriptor)
			{
				if (descriptor.hasOwnProperty(key))
				{
					if (el[key] !== descriptor[key])
					{
						keep = false;
						break;
					}
				}
			}
			if (keep)
				returnValue[cnt++] = el;
		}
		returnValue.length = cnt;
		return returnValue;
	}

	if (idxs.length < 1)
		throw new ArgumentError("Must supply at least one search key.");
	else if (idxs.length === 1)
		return idxs[0];

	// Now merge the arrays
	// Using a hashmap we can efficiently test for existince in all arrays
	const refCount = new WeakMap();
	const returnValue = [];

	for (let j = 0; j < idxs[0].length; j++)
		refCount.set(idxs[0][j], 1);

	for (let i = 1; i < idxs.length - 1; i++)
		for (let j = 0; j < idxs[i].length; j++)
			if (refCount.has(idxs[i][j]))
				refCount.set(idxs[i][j], refCount.get(idxs[i][j]) + 1);

	const lastIdx = idxs[idxs.length - 1];
	for (let j = 0; j < lastIdx.length; j++)
		if (refCount.get(lastIdx[j]) === idxs.length - 1)
			returnValue.push(lastIdx[j]);

	return returnValue;
}

module.exports = search;
