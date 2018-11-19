/* global beforeEach, test, expect */
/* eslint-disable no-magic-numbers */

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

test("Pop Element", () =>
{
	const eve = collection[4];
	const element = collection.pop();
	expect(element).toBe(eve);
	expect(collection[4]).toBe(undefined);
});

test("Pop Index", () =>
{
	collection.pop();
	expect(collection.idx.age).toEqual({
		18: [],
		23: [collection[0], collection[3]],
		28: [collection[1]],
		42: [collection[2]]
	});
});
