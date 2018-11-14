function ArgumentError(message)
{
	this.name = "ArgumentError";
	this.message = message || "Invalid arguments passed to function.";
	const error = new Error(this.message);
	error.name = this.name;
	this.stack = error.stack;
}
ArgumentError.prototype = Object.create(Error.prototype);

module.exports = ArgumentError;
