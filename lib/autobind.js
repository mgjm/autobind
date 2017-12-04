'use strict';

const {defineProperty} = Object;

// the autobind decorator should be applied to class methods
const autobind = (target, key, {value: fn, enumerable, writable}) => {
	if(!fn.bind)
		throw new TypeError(`@autobind is only applicable to class methods, not: ${fn}`);

	// ie11 invokes the getter when Object.defineProperty is called
	// see: https://github.com/andreypopp/autobind-decorator/issues/23
	let isDefining = false;

	return {
		enumerable,
		get() {
			// return the plain function if it is accessed from the current or some child prototype
			if(isDefining || this === target || this.hasOwnProperty(key) || this.hasOwnProperty('constructor'))
				return fn;

			// bind the function to this
			const bound = fn.bind(this);

			// and store the bound function as a normal property
			isDefining = true;
			defineProperty(this, key, {
				enumerable,
				writable,
				value: bound,
			});
			isDefining = false;

			return bound;
		},
		set(value) {
			// if the property is set to a new value we overwrite our whole getter/setter logic
			isDefining = true;
			defineProperty(this, key, {
				enumerable,
				writable,
				value,
			});
			isDefining = false;
		},
	};
};

module.exports = autobind;
