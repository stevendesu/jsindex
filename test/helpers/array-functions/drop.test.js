/* global test, expect */
/* eslint-disable no-magic-numbers, id-length, no-undefined */

require("../../../src/main");

test("Drop Columns", () =>
{
	const collection = [
		{a: 1, b: 2, c: 3},
		{a: 4, b: 5, c: 6},
		{a: 7, b: 8, c: 9}
	].index();
	collection.drop(["c"]);
	expect(collection[0]).toEqual({a: 1, b: 2});
	expect(collection[1]).toEqual({a: 4, b: 5});
	expect(collection[2]).toEqual({a: 7, b: 8});
});

test("Drop Indexes", () =>
{
	const collection = [
		{a: 1, b: 2, c: 3},
		{a: 4, b: 5, c: 6},
		{a: 7, b: 8, c: 9}
	].index();
	collection.drop(["c"]);
	expect(collection.idx.c).toBe(undefined);
});

test("Drop non-existent", () =>
{
	const collection = [
		{a: 1, b: 2, c: 3},
		{a: 4, b: 5, c: 6},
		{a: 7, b: 8, c: 9}
	].index();
	expect(() =>
	{
		collection.drop(["d"]);
	}).toThrow("Key `d` is not in collection.");
});
