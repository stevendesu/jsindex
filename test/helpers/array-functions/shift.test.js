/* global beforeEach, test, expect */
/* eslint-disable no-magic-numbers, no-undefined */

require("../../../src/main");

let collection;

beforeEach(() =>
{
	collection = [
		{name: "Alice", age: 23, salary: 55000},
		{name: "Bob", age: 28, salary: 38000},
		{name: "Charlie", age: 42, salary: 80000},
		{name: "Dana", age: 23, salary: 40000},
		{name: "Eve", age: 18, salary: 15000}
	].index();
});

test("Shift Element", () =>
{
	const alice = collection[0];
	const bob = collection[1];
	const element = collection.shift();
	expect(element).toBe(alice);
	expect(collection[0]).toBe(bob);
	expect(collection[4]).toBe(undefined);
});

test("Shift Index", () =>
{
	collection.shift();
	expect(collection.idx.age).toEqual({
		18: [collection[3]],
		23: [collection[2]],
		28: [collection[0]],
		42: [collection[1]]
	});
});
