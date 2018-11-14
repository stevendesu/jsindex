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
 - [Features](#features)
   - [Indexing](#indexing)
   - [Searching](#searching)
   - [Joining / Merging](#joining-merging)
   - [Loading](#loading)
   - [Storing](#storing)
 - [Array Functions](#array-functions)
 - [Contributin'](#contributin)
 - [Implementation Details](#implementation-details)

## Installation

```
npm install --save jsindex
```

## Features

### Indexing

This entire library operates under the assumption you're dealing with a
***collection*** -- that is, an array of JavaScript objects with the same
schema. This is very common in web applications. For instance, if you query a
database for all students you may end up with something like the following:

```js
var students = [
	{name: "Steven Barnett", gpa: 2.5, language: "English"},
	{name: "Jose Ramirez", gpa: 4.0, language: "Spanish"},
	{name: "Alice Example", gpa: 3.2, language: "English"},
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
		Steven Barnett: [
			{name: "Steven Barnett", gpa: 2.5, language: "English"},
			...
		],
		Jose Ramirez: [
			{name: "Jose Ramirez", gpa: 4.0, language: "Spanish"},
			...
		],
		Alice Example: [
			{name: "Alice Example", gpa: 3.2, language: "English"},
			...
		],
		...
	},
	gpa: {
		2.5: [
			{name: "Steven Barnett", gpa: 2.5, language: "English"},
			...
		],
		3.2: [
			{name: "Alice Example", gpa: 3.2, language: "English"},
			...
		],
		4.0: [
			{name: "Jose Ramirez", gpa: 4.0, language: "Spanish"},
			...
		],
		...
	},
	language: {
		English: [
			{name: "Steven Barnett", gpa: 2.5, language: "English"},
			{name: "Alice Example", gpa: 3.2, language: "English"},
			...
		],
		Spanish: [
			{name: "Jose Ramirez", gpa: 4.0, language: "Spanish"},
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

This will set `Steven Barnett`s name to `Paul` ***everywhere*** (in the index,
in the original collection, etc).

### Searching

### Joining / Merging

### Loading

### Storing

## Array Functions

Several native array functions have been overriden in order to

## Contributin'

## Implementation Details

I kept asking myself why I did things one wya instead of another. So I decided
to document my thought processes in the README for my future-self's benefit.

This could also benefit anyone who chooses to contribute to this library.

>**Why do we override the array functions instead of using an observer?**

[Array.observe][1] has been deprecated and replaced by [Proxy][2]. Some common
array operations, when using a Proxy, involve potentially HUNDREDS of function
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

This is only deleting a single element, reindexes ***every other element***.

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
	{name: "Steven Barnett", gpa: 2.5, language: "English"},
	{name: "Jose Ramirez", gpa: 4.0, language: "Spanish"},
	{name: "Alice Example", gpa: 3.2, language: "English"}
];
students.index();
students[0].language = "Spanish";
console.log(students.idx.language.Spanish);
```

Since `Steven Barnett`s langauge was changed to `Spanish`, this index needs to
be updated to return `Steven Barnett` as well as `Jose Ramirez`. To do this we
use the [Proxy API][2] to trap changes to records and update the index.


  [1]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/observe
  [2]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
