/* global beforeEach, test, expect */
/* eslint-disable no-magic-numbers */

require("../src/index");

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
});

test("No Arguments", () =>
{
	// For now, just testing that this doesn't throw an error
	collection.index();
});

test("String Argument", () =>
{
	// For now, just testing that this doesn't throw an error
	collection.index("age");
});

test("Array Argument", () =>
{
	// For now, just testing that this doesn't throw an error
	collection.index(["name", "age"]);
});

test("Object === Index", () =>
{
	collection.index("age");
	expect(collection[0]).toBe(collection.idx.age[23][0]);
	expect(collection[1]).toBe(collection.idx.age[28][0]);
	expect(collection[2]).toBe(collection.idx.age[42][0]);
	expect(collection[3]).toBe(collection.idx.age[23][1]);
	expect(collection[4]).toBe(collection.idx.age[18][0]);
});

// https://github.com/stevendesu/jsindex/issues/8
test("Empty Index", () =>
{
	collection.index("age");
	expect(collection.idx.age[20]).toEqual([]);
});
