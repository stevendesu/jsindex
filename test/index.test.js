/* global test, expect */
/* eslint-disable no-magic-numbers */

require("../src/index");

const collection = [
	{name: "Alice", age: 23, salary: 55000},
	{name: "Bob", age: 28, salary: 38000},
	{name: "Charlie", age: 42, salary: 80000},
	{name: "Dana", age: 27, salary: 40000},
	{name: "Eve", age: 18, salary: 15000}
];

test("No Arguments", () =>
{
	collection.index();
});

test("String Argument", () =>
{
	collection.index("age");
});

test("Array Argument", () =>
{
	collection.index(["name", "age"]);
});
