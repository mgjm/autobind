'use strict';

const createTest = require('./autobind');

createTest('Instance getter', ({assert, TestA, preDecoratorMethod}) => {
	const a = new TestA();
	assert(a.test, preDecoratorMethod, 'Should not return the original (unbound) method', false);
});

createTest('Direct access', ({assert, TestA}) => {
	const a = new TestA();
	assert(a.test(), a);
});

createTest('Bound access', ({assert, TestA}) => {
	const a = new TestA();
	const f = a.test;
	assert(f(), a);
});

createTest('Overwrite pre bind', ({assert, TestA}) => {
	const a = new TestA();
	a.test = 'foo';
	const f = a.test;
	assert(f, 'foo');
});

createTest('Overwrite post bind', ({assert, TestA}) => {
	const a = new TestA();
	const f = a.test;
	a.test = 'foo';
	assert(f(), a, 'The bound function should still work');
	assert(a.test, 'foo', 'The changed property should be stored');
});

createTest('Prototype getter', ({assert, TestA, preDecoratorMethod}) => {
	assert(TestA.prototype.test, preDecoratorMethod);
});

createTest('Prototype setter', ({assert, TestA}) => {
	const a1 = new TestA();
	const a2 = new TestA();
	const f2 = a2.test;
	TestA.prototype.test = 'foo';

	assert(TestA.prototype.test, 'foo', 'The changed prototype property should be stored');
	assert(a1.test, 'foo', 'The change should be visible to instances of this class');
	assert(a2.test, f2, 'The change should not influence bound methods');
	assert(f2(), a2, 'The bound method should still work');
});
