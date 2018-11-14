/* global beforeEach, expect, test */
/* eslint-disable no-magic-numbers */

require("../../src/main");

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

test("Set Property", () =>
{
	collection[3].age = 42;
	expect(collection.idx.age[23][0]).toBe(collection[0]);
	expect(collection.idx.age[42][0]).toBe(collection[2]);
	expect(collection.idx.age[42][1]).toBe(collection[3]);
});
