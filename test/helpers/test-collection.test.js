/* global test, expect */
/* eslint-disable no-magic-numbers */

const testCollection = require("../../src/helpers/test-collection");

test("Valid Collection", () =>
{
	const collection = [
		{name: "Alice", age: 23, salary: 55000},
		{name: "Bob", age: 28, salary: 38000},
		{name: "Charlie", age: 42, salary: 80000},
		{name: "Dana", age: 27, salary: 40000},
		{name: "Eve", age: 18, salary: 15000}
	];
	expect(testCollection(collection)).toBe(true);
});

test("Non-Object Collection", () =>
{
	const collection = [
		{name: "Alice", age: 23, salary: 55000},
		{name: "Bob", age: 28, salary: 38000},
		80000,
		{name: "Dana", age: 27, salary: 40000},
		{name: "Eve", age: 18, salary: 15000}
	];
	expect(() =>
	{
		testCollection(collection);
	}).toThrow("Non-object in collection.");
});

test("Non-Matching Keys", () =>
{
	const collection = [
		{name: "Alice", age: 23, salary: 55000},
		{name: "Bob", age: 28, salary: 38000},
		{name: "Charlie", species: "Human"},
		{name: "Dana", age: 27, salary: 40000},
		{name: "Eve", age: 18, salary: 15000}
	];
	expect(() =>
	{
		testCollection(collection);
	}).toThrow("Keys did not match in collection.");
});

test("Mismatched Types", () =>
{
	const collection = [
		{name: "Alice", age: 23, salary: 55000},
		{name: "Bob", age: 28, salary: 38000},
		{name: "Charlie", age: 42, salary: "80000"},
		{name: "Dana", age: 27, salary: 40000},
		{name: "Eve", age: 18, salary: 15000}
	];
	expect(() =>
	{
		testCollection(collection);
	}).toThrow("Mismatched types in collection.");
});
