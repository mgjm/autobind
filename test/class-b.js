'use strict';

const createTest = require('./autobind');

createTest('Instance getter (subclass)', ({assert, TestB, preDecoratorMethod}) => {
	const b = new TestB();
	assert(b.test, preDecoratorMethod, 'Should not return the original (unbound) method', false);
});

createTest('Direct access (subclass)', ({assert, TestB}) => {
	const b = new TestB();
	assert(b.test(), b);
});

createTest('Bound access (subclass)', ({assert, TestB}) => {
	const b = new TestB();
	const f = b.test;
	assert(f(), b);
});

createTest('Overwrite pre bind (subclass)', ({assert, TestB}) => {
	const b = new TestB();
	b.test = 'foo';
	const f = b.test;
	assert(f, 'foo');
});

createTest('Overwrite post bind (subclass)', ({assert, TestB}) => {
	const b = new TestB();
	const f = b.test;
	b.test = 'foo';
	assert(f(), b, 'The bound function should still work');
	assert(b.test, 'foo', 'The changed property should be stored');
});

createTest('Prototype getter (subclass)', ({assert, TestB, preDecoratorMethod}) => {
	assert(TestB.prototype.test, preDecoratorMethod);
});

createTest('Prototype setter (subclass)', ({assert, TestA, TestB, preDecoratorMethod}) => {
	const a1 = new TestA();
	const a2 = new TestA();
	const fa = a2.test;
	const b1 = new TestB();
	const b2 = new TestB();
	const f2 = b2.test;
	TestB.prototype.test = 'foo';

	assert(TestA.prototype.test, preDecoratorMethod, 'Should not influence superclass');
	assert(TestB.prototype.test, 'foo', 'The changed prototype property should be stored');

	assert(a1.test(), a1, 'Should not influence instances of the superclass (direct)');
	assert(a2.test, fa, 'Should not influence instances of the superclass (bound)');
	assert(fa(), a2, 'Should not influence instances of the superclass (bound)');

	assert(b1.test, 'foo', 'Should be visible to instances of this class');
	assert(b2.test, f2, 'Should not influence bound methods');
	assert(f2(), b2, 'The bound method should still work');
});
