/* global test, expect */
/* eslint-disable no-magic-numbers */

const CollectionError = require("../../src/errors/CollectionError");
const ArgumentError = require("../../src/errors/ArgumentError");

test("CollectionError instanceof", () =>
{
	const err = new CollectionError();
	expect(err instanceof CollectionError).toBe(true);
});

test("CollectionError not instanceof", () =>
{
	const err = new CollectionError();
	expect(err instanceof ArgumentError).toBe(false);
});

test("CollectionError can be caught", () =>
{
	let returnValue = false;
	try
	{
		throw new CollectionError();
	}
	catch (e)
	{
		if (e.name === "CollectionError")
			returnValue = true;
	}
	expect(returnValue).toBe(true);
});
