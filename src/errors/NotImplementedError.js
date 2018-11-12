function NotImplementedError(message)
{
	this.name = "NotImplementedError";
	this.message = message || "This feature is not implemented yet.";
	var error = new Error(this.message);
	error.name = this.name;
	this.stack = error.stack;
}
NotImplementedError.prototype = Object.create(Error.prototype);

module.exports = NotImplementedError;
