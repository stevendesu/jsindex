const handler = require("../proxy-handler");

function push()
{
	const elements = [];
	for (let i = 0; i < arguments.length; i++)
		elements.push(new Proxy(arguments[i], handler(this)));

	// Add the element to the collection
	Array.prototype.push.apply(this, elements);

	// Then add it to the index
	for (let i = 0; i < elements.length; i++)
		for (const key in this.idx)
			if (this.idx.hasOwnProperty(key))
				if (this.idx[key].hasOwnProperty(elements[i][key]))
					this.idx[key][elements[i][key]].push(elements[i]);
				else
					this.idx[key][elements[i][key]] = [elements[i]];

	return elements[elements.length - 1];
}

module.exports = push;
