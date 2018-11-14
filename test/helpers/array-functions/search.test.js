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
	];
	collection.index("age");
});

test("Search 1", () =>
{
	const results = collection.search({
		age: 23
	});
	expect(results).toEqual([collection[0], collection[3]]);
});

test("Search 2", () =>
{
	const results = collection.search({
		age: 42
	});
	expect(results).toEqual([collection[2]]);
});

test("Search 3", () =>
{
	const results = collection.search({
		age: 30
	});
	expect(results).toEqual([]);
});
