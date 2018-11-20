const handler = require("../proxy-handler");

function push()
{
	const elements = [];
	for (let i = 0; i < arguments.length; i++)
		elements.push(new Proxy(arguments[i], handler(this)));

	// Add the element to the collection
	Array.prototype.push.apply(this, elements);

	// Then add it to the index
	const keys = Object.keys(this.idx);
	for (let i = 0; i < elements.length; i++)
		for (let j = 0; j < keys.length; j++)
		{
			const key = keys[j];
			if (this.idx[key].hasOwnProperty(elements[i][key]))
				this.idx[key][elements[i][key]].push(elements[i]);
			else
				this.idx[key][elements[i][key]] = [elements[i]];
		}

	return elements[elements.length - 1];
}

module.exports = push;
