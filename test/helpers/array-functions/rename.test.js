/* global test, expect */
/* eslint-disable id-length, no-undefined */

require("../../../src/main");

test("Rename Columns", () =>
{
	const collection = [
		{a: 1, b: 2, c: 3},
		{a: 4, b: 5, c: 6},
		{a: 7, b: 8, c: 9}
	].index();
	collection.rename({
		a: "x",
		b: "y",
		c: "z"
	});
	expect(collection[0]).toEqual({x: 1, y: 2, z: 3});
	expect(collection[1]).toEqual({x: 4, y: 5, z: 6});
	expect(collection[2]).toEqual({x: 7, y: 8, z: 9});
});

test("Rename Indexes", () =>
{
	const collection = [
		{a: 1, b: 2, c: 3},
		{a: 4, b: 5, c: 6},
		{a: 7, b: 8, c: 9}
	].index();
	collection.rename({
		a: "x",
		b: "y",
		c: "z"
	});

	expect(collection.idx.a).toBe(undefined);
	expect(collection.idx.x).toEqual({
		1: [collection[0]],
		4: [collection[1]],
		7: [collection[2]]
	});
});

test("Rename non-existent", () =>
{
	const collection = [
		{a: 1, b: 2, c: 3},
		{a: 4, b: 5, c: 6},
		{a: 7, b: 8, c: 9}
	].index();
	expect(() =>
	{
		collection.rename({
			d: "x"
		});
	}).toThrow("Key `d` is not in collection.");
});
