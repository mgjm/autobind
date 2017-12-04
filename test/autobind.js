'use strict';

const autobind = require('../lib/autobind');

const decoratorWithoutBabel = ({prototype}, key, decorator) => {
	let descriptor = Object.getOwnPropertyDescriptor(prototype, key);

	// does not handle the case where the decoretor returns nothing
	descriptor = decorator(prototype, key, descriptor);
	Object.defineProperty(prototype, key, descriptor);
};

let count = 0;
let successful = 0;
const assert = (name, a, b, message, expectedResult = true) => {
	count++;
	const equal = a === b;
	if(equal === expectedResult) {
		successful++;
		console.log(`${name}: OK`);
	} else {
		console.error(`${name}: ${message ? `Error: ${message}:` : 'Error:'} ${a}`);
	}
};

const LINE = '----------------------------------------------------------------';
const createTest = (name, callback) => {
	class TestA {
		test() {
			return this;
		}
	}
	const preDecoratorMethod = TestA.prototype.test;
	decoratorWithoutBabel(TestA, 'test', autobind);

	class TestB extends TestA {}

	class TestC extends TestA {
		test() {
			return super.test();
		}
	}
	const preDecoratorMethod2 = TestC.prototype.test;
	decoratorWithoutBabel(TestC, 'test', autobind);

	console.log(LINE);
	callback({
		TestA,
		TestB,
		TestC,
		preDecoratorMethod,
		preDecoratorMethod2,
		assert: assert.bind(null, name),
	});
};

module.exports = createTest;

require('./class-a');
require('./class-b');
require('./class-c');

console.log(LINE);
console.log(`${successful} of ${count} tests worked`);
if(successful !== count) {
	/* global process */
	if(typeof process === 'object')
		process.exit(1);
	else
		throw new Error(`${count - successful} tests failed`);
}
