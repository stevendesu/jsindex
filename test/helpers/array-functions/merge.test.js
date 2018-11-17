/* global beforeEach, test, expect */
/* eslint-disable id-length, no-empty-function */

require("../../../src/main");

let people;
let parties;
let addresses;

beforeEach(() =>
{
	people = [
		{name: "Alice", party: "R", address: 1, c: "Example", s: "EX"},
		{name: "Bob", party: "X", address: 1, c: "Example", s: "EX"},
		{name: "Charlie", party: "D", address: 2, c: "Sample", s: "SM"}
	];

	parties = [
		{party: "R", partyName: "Republican"},
		{party: "D", partyName: "Democrat"},
		{party: "I", partyName: "Independent"}
	];

	addresses = [
		{id: 1, street: "123 Example St", city: "Example", state: "EX"},
		{id: 2, street: "987 Sample Rd", city: "Sample", state: "SM"}
	];

	people.index(["party", "address", "city"]);
	parties.index("party");
	addresses.index("id");
});

test("Left Join", () =>
{
	const combined = people.merge(parties, "party");
	expect(combined).toEqual([
		{name: "Alice", party: "R", address: 1, c: "Example", s: "EX", partyName: "Republican"},
		{name: "Bob", party: "X", address: 1, c: "Example", s: "EX", partyName: null},
		{name: "Charlie", party: "D", address: 2, c: "Sample", s: "SM", partyName: "Democrat"},
	]);
});

test("Custom Join On", () =>
{
	const combined = people.merge(addresses, {
		joinOn: {
			left: "address",
			right: "id"
		}
	});
	expect(combined).toEqual([
		{
			name: "Alice",
			party: "R",
			address: 1,
			c: "Example",
			s: "EX",
			street: "123 Example St",
			city: "Example",
			state: "EX"
		},
		{
			name: "Bob",
			party: "X",
			address: 1,
			c: "Example",
			s: "EX",
			street: "123 Example St",
			city: "Example",
			state: "EX"
		},
		{
			name: "Charlie",
			party: "D",
			address: 2,
			c: "Sample",
			s: "SM",
			street: "987 Sample Rd",
			city: "Sample",
			state: "SM"
		}
	]);
});

test("Inner Join", () =>
{
	const combined = people.merge(parties, {
		joinOn: "party",
		joinType: "inner"
	});
	expect(combined).toEqual([
		{name: "Alice", party: "R", address: 1, c: "Example", s: "EX", partyName: "Republican"},
		{name: "Charlie", party: "D", address: 2, c: "Sample", s: "SM", partyName: "Democrat"},
	]);
});

test("Right Join", () =>
{
	const combined = people.merge(parties, {
		joinOn: "party",
		joinType: "right"
	});
	expect(combined).toEqual([
		{name: "Alice", party: "R", address: 1, c: "Example", s: "EX", partyName: "Republican"},
		{name: "Charlie", party: "D", address: 2, c: "Sample", s: "SM", partyName: "Democrat"},
		{name: null, party: "I", address: null, c: null, s: null, partyName: "Independent"},
	]);
});

test("Outer Join", () =>
{
	expect(() =>
	{
		people.merge(parties, {
			joinOn: "party",
			joinType: "outer"
		});
	}).toThrow("not implemented");
});

test("Merge Indexed with Non-Indexed Column", () =>
{
	// Replace console.warn with a NOOP for this test
	const oldWarn = console.warn;
	console.warn = () => {};
	expect(people.merge(addresses, {
		joinOn: {
			left: "c",
			right: "city"
		}
	})).toEqual([
		{name: "Alice", party: "R", address: 1, c: "Example", s: "EX", id: 1, street: "123 Example St", state: "EX"},
		{name: "Bob", party: "X", address: 1, c: "Example", s: "EX", id: 1, street: "123 Example St", state: "EX"},
		{name: "Charlie", party: "D", address: 2, c: "Sample", s: "SM", id: 2, street: "987 Sample Rd", state: "SM"}
	]);
	console.warn = oldWarn;
});

test("Merge Two Non-Indexed Columns", () =>
{
	// Replace console.warn with a NOOP for this test
	const oldWarn = console.warn;
	console.warn = () => {};
	expect(people.merge(addresses, {
		joinOn: {
			left: "s",
			right: "state"
		}
	})).toEqual([
		{
			name: "Alice",
			party: "R",
			address: 1,
			c: "Example",
			s: "EX",
			id: 1,
			street: "123 Example St",
			city: "Example"
		},
		{
			name: "Bob",
			party: "X",
			address: 1,
			c: "Example",
			s: "EX",
			id: 1,
			street: "123 Example St",
			city: "Example"
		},
		{
			name: "Charlie",
			party: "D",
			address: 2,
			c: "Sample",
			s: "SM",
			id: 2,
			street: "987 Sample Rd",
			city: "Sample"
		}
	]);
	console.warn = oldWarn;
});
