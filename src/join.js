const NotImplementedError = require("./errors/NotImplementedError");

module.exports = function()
{
	throw new NotImplementedError();
};
