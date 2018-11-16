/* global beforeEach, test, expect */
/* eslint-disable no-magic-numbers */

require("../../../src/main");

let collection;

beforeEach(() =>
{
	collection = [
		{name: "Alice", age: 23, salary: 55000, gender: "female"},
		{name: "Bob", age: 28, salary: 38000, gender: "male"},
		{name: "Charlie", age: 42, salary: 80000, gender: "male"},
		{name: "Dana", age: 23, salary: 40000, gender: "female"},
		{name: "Eve", age: 18, salary: 15000, gender: "female"}
	];
	collection.index();
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

// https://github.com/stevendesu/jsindex/issues/9
test("Two criteria", () =>
{
	const results = collection.search({
		age: 28,
		salary: 38000
	});
	expect(results).toEqual([collection[1]]);
});

// https://github.com/stevendesu/jsindex/issues/9
test("Three criteria", () =>
{
	const results = collection.search({
		age: 28,
		salary: 38000,
		gender: "male"
	});
	expect(results).toEqual([collection[1]]);
});
