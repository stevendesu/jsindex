function getHandler(collection)
{
	return {
		get: function(obj, prop)
		{
			// We need some way to grab the object underlying the Proxy
			if (prop === "__self__")
				return obj;
			else
				return obj[prop];
		},
		set: function(obj, prop, val)
		{
			// Set the new value
			const oldValue = obj[prop];
			obj[prop] = val;

			// Update the index
			if (oldValue && collection.idx.hasOwnProperty(prop))
			{
				// Remove from the old sub-index
				// Unfortunately the Proxy API doesn't give us a way to access
				// the Proxy object itself. "this" refers to the handler, and
				// "obj" refers to the target. So we can't just use .indexOf()
				// to find the element
				//
				// Once we've found it, we'll store it so we can push it onto
				// the new index
				let ref;
				let loc;
				const oldIndex = collection.idx[prop][oldValue];
				for (let i = 0; i < oldIndex.length; i++)
				{
					if (oldIndex[i].__self__ === obj)
					{
						ref = oldIndex[i];
						loc = i;
						break;
					}
				}
				oldIndex.splice(loc, 1);

				// Now add the element to the new index
				if (collection.idx[prop].hasOwnProperty(val))
					collection.idx[prop][val].push(ref);
				else
					collection.idx[prop][val] = [ref];
			}

			// Necessary:
			return true;
		},
	};
}

module.exports = getHandler;
