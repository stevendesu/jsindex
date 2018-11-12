/* global test, expect */
/* eslint-disable no-magic-numbers */

require("../src/main");

test("Invalid formatter", () =>
{
	expect(() =>
	{
		Array.load("data", {type: "asdfxyz"});
	}).toThrow("is not implemented");
});
