const handler = require("../proxy-handler");

function unshift()
{
	// We must iterate the elements in reverse order
	const elements = [];
	for (let i = arguments.length - 1; i >= 0; i--)
		elements.unshift(new Proxy(arguments[i], handler(this)));

	// Add the element to the collection
	Array.prototype.unshift.apply(this, elements);

	// Then add it to the index
	for (let i = elements.length - 1; i >= 0; i--)
		for (const key in this.idx)
			if (this.idx.hasOwnProperty(key))
				if (this.idx[key].hasOwnProperty(elements[i][key]))
					this.idx[key][elements[i][key]].unshift(elements[i]);
				else
					this.idx[key][elements[i][key]] = [elements[i]];

	return elements[elements.length - 1];
}

module.exports = unshift;
