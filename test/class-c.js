'use strict';

const createTest = require('./autobind');

createTest('Instance getter (subclass2)', ({assert, TestC, preDecoratorMethod}) => {
	const c = new TestC();
	assert(c.test, preDecoratorMethod, 'Should not return the original (unbound) method', false);
});

createTest('Direct access (subclass2)', ({assert, TestC}) => {
	const c = new TestC();
	assert(c.test(), c);
});

createTest('Bound access (subclass2)', ({assert, TestC}) => {
	const c = new TestC();
	const f = c.test;
	assert(f(), c);
});

createTest('Overwrite pre bind (subclass2)', ({assert, TestC}) => {
	const c = new TestC();
	c.test = 'foo';
	const f = c.test;
	assert(f, 'foo');
});

createTest('Overwrite post bind (subclass2)', ({assert, TestC}) => {
	const c = new TestC();
	const f = c.test;
	c.test = 'foo';
	assert(f(), c, 'The bound function should still work');
	assert(c.test, 'foo', 'The changed property should be stored');
});

createTest('Prototype getter (subclass2)', ({assert, TestC, preDecoratorMethod2}) => {
	assert(TestC.prototype.test, preDecoratorMethod2);
});

createTest('Prototype setter (subclass2)', ({assert, TestA, TestC, preDecoratorMethod}) => {
	const a1 = new TestA();
	const a2 = new TestA();
	const fa = a2.test;
	const c1 = new TestC();
	const c2 = new TestC();
	const f2 = c2.test;
	TestC.prototype.test = 'foo';

	assert(TestA.prototype.test, preDecoratorMethod, 'Should not influence superclass');
	assert(TestC.prototype.test, 'foo', 'The changed prototype property should be stored');

	assert(a1.test(), a1, 'Should not influence instances of the superclass (direct)');
	assert(a2.test, fa, 'Should not influence instances of the superclass (bound)');
	assert(fa(), a2, 'Should not influence instances of the superclass (bound)');

	assert(c1.test, 'foo', 'Should be visible to instances of this class');
	assert(c2.test, f2, 'Should not influence bound methods');
	assert(f2(), c2, 'The bound method should still work');
});
