/* global test, expect */
/* eslint-disable no-magic-numbers */

require("../../src/main");

test("Valid CSV", () =>
{
	const csv = "name,age,salary\nAlice,23,55000\nBob,28,38000\nCharlie,42,80000\nDana,23,40000\nEve,18,15000";
	const data = Array.load(csv, {type: "csv", sync: true});
	expect(data).toEqual([
		{name: "Alice", age: 23, salary: 55000},
		{name: "Bob", age: 28, salary: 38000},
		{name: "Charlie", age: 42, salary: 80000},
		{name: "Dana", age: 23, salary: 40000},
		{name: "Eve", age: 18, salary: 15000}
	]);
});

test("Default Type CSV", () =>
{
	const csv = "name,age,salary\nAlice,23,55000\nBob,28,38000\nCharlie,42,80000\nDana,23,40000\nEve,18,15000";
	const data = Array.load(csv, {sync: true, columns: true});
	expect(data).toEqual([
		{name: "Alice", age: 23, salary: 55000},
		{name: "Bob", age: 28, salary: 38000},
		{name: "Charlie", age: 42, salary: 80000},
		{name: "Dana", age: 23, salary: 40000},
		{name: "Eve", age: 18, salary: 15000}
	]);
});
