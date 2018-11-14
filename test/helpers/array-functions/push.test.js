/* global test, expect */
/* eslint-disable no-magic-numbers */

require("../../../src/main");

test("Array Push", () =>
{
	const collection = [
		{name: "Alice", age: 23, salary: 55000},
		{name: "Bob", age: 28, salary: 38000},
		{name: "Charlie", age: 42, salary: 80000},
		{name: "Dana", age: 23, salary: 40000},
		{name: "Eve", age: 18, salary: 15000}
	];
	collection.index("age");

	const newPerson = {name: "Fred", age: 18, salary: 15000};
	collection.push(newPerson);

	// The elements of the collection are actually Proxy objects
	// Therefore collection[5] will EQUAL newPerson, but not BE newPerson
	expect(collection[5]).toEqual(newPerson);
	// The __self__ helper was created to access the internal object
	expect(collection[5].__self__).toBe(newPerson);
	// Verify that the index was updated
	expect(collection.idx.age[18][0]).toBe(collection[4]);
	expect(collection.idx.age[18][1]).toBe(collection[5]);
});

test("Multi-Push", () =>
{
	const collection = [
		{key: 1, idx: 1},
		{key: 2, idx: 2},
		{key: 3, idx: 1},
		{key: 4, idx: 1},
		{key: 5, idx: 2}
	];
	collection.index("idx");

	collection.push(
		{key: 6, idx: 2},
		{key: 7, idx: 3}
	);

	expect(collection.length).toBe(7);
	expect(collection[5]).toEqual({key: 6, idx: 2});
	expect(collection.idx.idx[3]).toEqual([{key: 7, idx: 3}]);
});
