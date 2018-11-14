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
				let ref;

				// Remove from the old sub-index
				collection.idx[prop][oldValue] = collection.idx[prop][oldValue].filter(el =>
				{
					if (el.__self__ === obj)
					{
						ref = el;
						return false;
					}
					return true;
				});

				// Add to the new one
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
