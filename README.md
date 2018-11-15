# Index.JS

This is a medium-weight library I created to simplify a singular task I kept
running into at my work. If this library isn't useful to you, I'm not offended.

The goal of this library is to create indexes on collections of JavaScript
objects so that they can be filtered more efficiently.

The reason I say "medium-weight" is because I've added several hepler functions
that go beyond the basic scope of the library in order to simplify tasks I
encounter at my job.

## Table of Contents

 - [Installation](#installation)
 - [Documentation](#documentation)
 - [Features](#features)
   - [Indexing](#indexing)
   - [Searching](#searching)
   - [Joining / Merging](#joining--merging)
   - [Loading](#loading)
   - [Storing](#storing)
 - [Array Functions](#array-functions)
 - [Contributin'](#contributin)
 - [Implementation Details](#implementation-details)
 - [License](#license)

## Installation

```
npm install --save jsindex
```

## Documentation

I'll create a GitHub wiki to document the APIs, parameters, etc.

## Features

### Indexing

This entire library operates under the assumption you're dealing with a
***collection*** -- that is, an array of JavaScript objects with the same
schema. This is very common in web applications. For instance, if you query a
database for all students you may end up with something like the following:

```js
var students = [
	{name: "Alice", gpa: 4.0, language: "English"},
	{name: "Bob", gpa: 2.5, language: "Spanish"},
	{name: "Charlie", gpa: 3.2, language: "English"},
	...
];
```

Given a collection like this, the easiest way to utilize indexing is as like
so:

```js
students.index();
```

After calling this, the `students` array will have a new `idx` member:

```js
console.log(students.idx);

// Outputs:
{
	name: {
		Alice: [
			{name: "Alice", gpa: 4.0, language: "English"},
			...
		],
		Bob: [
			{name: "Bob", gpa: 2.5, language: "Spanish"},
			...
		],
		Charlie: [
			{name: "Charlie", gpa: 3.2, language: "English"},
			...
		],
		...
	},
	gpa: {
		2.5: [
			{name: "Bob", gpa: 2.5, language: "Spanish"},
			...
		],
		3.2: [
			{name: "Charlie", gpa: 3.2, language: "English"},
			...
		],
		4.0: [
			{name: "Alice", gpa: 4.0, language: "English"},
			...
		],
		...
	},
	language: {
		English: [
			{name: "Alice", gpa: 4.0, language: "English"},
			{name: "Charlie", gpa: 3.2, language: "English"},
			...
		],
		Spanish: [
			{name: "Bob", gpa: 2.5, language: "Spanish"},
			...
		],
		...
	}
}
```

Each object in the index is actually a reference to the original object in the
collection, so this index takes up very little memory. As well, because the
index consists of references, you can do the following:

```js
students.idx["langauge"]["English"][0].name = "Paul";
```

This will set `Alice`s name to `Paul` ***everywhere*** (in the index,
in the original collection, etc).

The advantage to this structure is that it lets us filter the array in constant
time. Instead of:

```js
students.filter(s => s.name === "Alice");
```

We can just write:

```js
student.idx.name["Alice"];
```

### Joining / Merging

This is the primary reason this library was created. At my job I often have
multiple collections like the following:

```js
var parties = [
	{party: "R", partyName: "Republican"},
	{party: "D", partyName: "Democrat"}
];
var candidates = [
	{name: "Hillary", party: "D"},
	{name: "Trump", party: "R"}
];
```

This means I'm often writing code like the following:

```js
document.getElementById("trumps-party").innerHTML = (
	parties.filter(p => p.party === (
		candidates.filter(c => c.name === "Trump")[0].party
	))[0].partyName
);
```

This is obviously inefficient. Each time we want to display a candidate's
political party we have to scan the ***entire*** list of parties. If we have a
table of politicians, we scan the entire list once per candidate. This kind of
`N^2` problem can make dashboards run really slow.

To correct this I usually write code like the following:

```js
var partyMap = {};
for (var i = 0; i < parties.length; i++)
	partyMap[parties[i].party] = parties[i].partyName;

document.getElementById("trumps-party").innerHTML = (
	partyMap[
		candidates.filter(c => c.name === "Trump")[0].party
	]
);
```

Note how we've removed the `parties.filter` and replaced it with a simple
object property lookup (a constant-time operation).

The problem is that I find myself re-writing this mapping for loop on ***every
single project*** I do. So I felt like I should abstract it into its own
library. So long as I was doing that, I thought I could make the API a bit more
powerful and useful. Consider the new code:

```js
require("jsindex");
parties.index();
candidates.index();
candidates.merge(parties, "party");
document.getElementById("trumps-party").innerHTML = (
	candidates.filter(c => c.name === "Trump")[0].partyName
);
```

Now we've even eliminated the map lookup! The two collections have been merged
into one:

```js
console.log(candidates.merge(parties, "party"));

// Outputs:
[
	{name: "Hillary", party: "D", partyName: "Democrat"},
	{name: "Trump", party: "R", partyName: "Republican"}
]
```

### Searching

This is another feature I found myself constantly using at my job. Given a
collection with various properties, I may want to filter on multiple properties
based on user input:

```js
var housesForSale = [
	{address: "123 Sample Dr", sqft: 1600, beds: 3, baths: 2, basement: false},
	{address: "987 Example St", sqft: 3200, beds: 5, baths: 3, basement: true},
	...
]
```

If a user selects that they want 3 bedrooms, I could use the index to filter
like so:

```js
housesForSale.index();
console.log(housesForSale.idx.beds[3]);
```

However what if a user selects 3 bedrooms ***and*** a basement? Now I need to
select all records in one index that are also in the other index, and I'm back
to writing a `.filter()`:

```js
housesForSale.index();
beds = housesForSale.idx.beds[3];
basement = housesForSale.idx.basement[true];
console.log(beds.filter(house => basement.indexOf(house) >= 0));
```

Not only is this ugly, but notice that we have a new `N^2` problem! We run the
`indexOf` operator (which iterates the entire `basement` array) once per
element of the `beds` array. As with the `partyMap` solution in the `merge`
feature, it's possible to utilize hashmaps to solve this more efficiently. But
rather than writing all of the code each time, I just created the following
API:

```js
housesForSale.index();
console.log(housesForSale.search({
	beds: 3,
	basement: true
}));
```

Fun, fast, and efficient!

### Loading

One more thing I do all of the time with my job. I often receive a CSV (or a
list of CSVs) that I need to load into a JavaScript object. There actually
wasn't much work to do here, because I just used the `csv-parse` library. But
I override some of the default options with my preferred options.

```js
var collection = Array.load(csvData);
```

### Storing

One more thing I do all of the time with my job. My boss likes to have "CSV
export" buttons on all data tables. Why re-write this code 1000 times? I just
use the `csv-stringify` library, override a couple default options, and then
I get this:

```js
var csvData = Array.store(collection);
```

## Array Functions

Several native array functions have been overriden in order to ensure the index
stays valid as you modify the collection or any record in the collection.

 - push
 - pop
 - shift
 - unshift
 - splice
 - concat

## Contributin'

Like with all of my projects (see [minimux][1]) I don't do this as a full-time
job. Well, this one I kind of do, but you get my point. There will be bugs, and
I won't fix them all. Feel free to submit issues, make pull requests, or just
email me.

Unlike minimux, this library is ***not*** minimalist. I will accept any new
features so long as they don't come with a major performance impact to existing
functionality.

## Implementation Details

I kept asking myself why I did things one way instead of another. So I decided
to document my thought processes in the README for my future-self's benefit.

This could also benefit anyone who chooses to contribute to this library.

>**Why do we override the array functions instead of using an observer?**

[Array.observe][2] has been deprecated and replaced by [Proxy][3]. Some common
array operations, when using a Proxy, involve incredible numbers of function
calls. For example, consider the following:

```js
var arr = [];
for (var i = 0; i < 1000000; i++)
	arr.push(i);
arr = new Proxy(arr, {
	has: function(obj, prop) { console.log("has"); return prop in obj; },
	set: function(obj, prop, val) { console.log("set"); obj[prop] = val; return true; },
	deleteProperty: function(obj, prop) { console.log("delete"); delete obj[prop]; return true; }
});

arr.splice(1, 1);
```

This only deletes a single element, yet it reindexes ***every other element***.

The V8 engine can do this very efficiently for a normal array. However when we
use a Proxy, you'll see `has` and `set` each get called 1 million times:

 - has 1? (true)
 - has 2? (true)
 - has 3? (true)
 - ...
 - has 999999? (true)
 - has 1000000? (false)
 - set 1 = 2
 - set 2 = 3
 - set 3 = 4
 - ...
 - set 999998 = 999999
 - delete 999999

A quick test in Chrome found that the native `splice` function was ***300x
faster*** than running `splice` through a Proxy like this for an array of
1 million elements.

This incredible overhead for modifying the collection is why we instead replace
the native functions with our own. When you call `splice`, we first call
`Array.prototype.splice.apply(this, ...)` (getting the full speed of the V8
engine) and then update the index once, after everything has finished changing.

>**Why is the order not preserved in the index?**

Certain array functions (notably `sort` and `splice`) can affect arbitrary
elements in the array. In order to preserve the order of elements we would need
to iterate over the entire collection once per key each time one of these
functions was called - effectively rebuilding the index from scratch.

By giving up this requirement, we can simply append new elements to the end of
the indexes and only remove elements from the specific sub-indexes affected.
This is potentially hundreds of times faster for very large collections.

>**Why does console.log(collection) show [Proxy, Proxy, Proxy, ...]?**

If you update an indexed property of a record, the indexes need to be updated
to reflect the change. For instance, consider the following:

```js
var students = [
	{name: "Alice", gpa: 4.0, language: "English"},
	{name: "Bob", gpa: 2.5, language: "Spanish"},
	{name: "Charlie", gpa: 3.2, language: "English"}
];
students.index();
students[0].language = "Spanish";
console.log(students.idx.language.Spanish);
```

Since `Alice`s langauge was changed to `Spanish`, this index needs to
be updated to return `Alice` as well as `Bob`. To do this we
use the [Proxy API][3] to trap changes to records and update the index.

## License

**MIT**

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


  [1]: https://github.com/stevendesu/minimux
  [2]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/observe
  [3]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
