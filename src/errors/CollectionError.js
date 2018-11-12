function CollectionError(message)
{
	this.name = "CollectionError";
	this.message = message || "Collection contains invalid data.";
	var error = new Error(this.message);
	error.name = this.name;
	this.stack = error.stack;
}
CollectionError.prototype = Object.create(Error.prototype);

module.exports = CollectionError;
