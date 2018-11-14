/* global beforeEach, test, expect */
/* eslint-disable no-magic-numbers */

require("../../../src/main");

let people;
let parties;
let addresses;

beforeEach(() =>
{
	people = [
		{name: "Steven", party: "R", address: 1},
		{name: "Stephanie", party: "X", address: 1},
		{name: "Michael", party: "D", address: 2}
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

	people.index();
	parties.index();
	addresses.index();
});

test("Left Join", () =>
{
	const combined = people.merge(parties, "party");
	expect(combined).toEqual([
		{name: "Steven", party: "R", address: 1, partyName: "Republican"},
		{name: "Stephanie", party: "X", address: 1, partyName: null},
		{name: "Michael", party: "D", address: 2, partyName: "Democrat"},
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
		{name: "Steven", party: "R", address: 1, street: "123 Example St", city: "Example", state: "EX"},
		{name: "Stephanie", party: "X", address: 1, street: "123 Example St", city: "Example", state: "EX"},
		{name: "Michael", party: "D", address: 2, street: "987 Sample Rd", city: "Sample", state: "SM"}
	]);
});

test("Inner Join", () =>
{
	const combined = people.merge(parties, {
		joinOn: "party",
		joinType: "inner"
	});
	expect(combined).toEqual([
		{name: "Steven", party: "R", address: 1, partyName: "Republican"},
		{name: "Michael", party: "D", address: 2, partyName: "Democrat"},
	]);
});

test("Right Join", () =>
{
	const combined = people.merge(parties, {
		joinOn: "party",
		joinType: "right"
	});
	expect(combined).toEqual([
		{name: "Steven", party: "R", address: 1, partyName: "Republican"},
		{name: "Michael", party: "D", address: 2, partyName: "Democrat"},
		{name: null, party: "I", address: null, partyName: "Independent"},
	]);
});

test("Outer Join", () =>
{
	expect(() =>
	{
		const combined = people.merge(parties, {
			joinOn: "party",
			joinType: "outer"
		});
	}).toThrow("not implemented");
});
