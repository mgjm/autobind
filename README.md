# @mgjm/autobind

Automatically bind class methods to `this` on first access.

Compatible with TypeScript and Babel.

[babel-plugin-transform-decorators-legacy](https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy) is needed for Babel 6.

## Install
```
npm install @mgjm/autobind
```

## Usage
Decorate any class method that should be bound to `this`:
```js
class Foo {
    @autobind
    handleClick() {
        this.doSomething();
    }
}
```

The following is an equivalent (not lazy) class definition:
```js
class Bar {
    constructor() {
        this.handleClick = this.handleClick.bind();
    }

    handleClick() {
        this.doSomething();
    }
}
```

## Why?
`@autobind` works lazy and calls bind only once.

- Compared to `this.handleClick = this.handleClick.bind()` in the constructor it only binds the method if it is needed.

- Compared to calling `.bind()` every time you need to pass your method (e.g. in `render()` of a `React.Component`) it stores the bound method for further use.

- Compared to class properties (`handleClick = () => { this.doSomething() }`) it does not need to create a new function for every instance.

## Credits
Inspired by [autobind-decorator](https://github.com/andreypopp/autobind-decorator) and [core-decorators](https://github.com/jayphelps/core-decorators#autobind).
