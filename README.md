## Curry Town

Currying is a functional programming (FP) paradigm that breaks down functions that take multiple arguments into a sequence of functions each taking only one argument.

Why would you want to do such a thing?

Currying encourages the creation of pure functions with single responsibilities. It increases maintainability and fits within the greater idea of functional programming that seeks to avoid tedious bugs arising from side effects or collisions with application state/context. These are the kind of bugs that tend to crop up in large applications.

This pattern is completely in-line with JavaScript guiding principles and is well established in the language. If you've ever used or written a [closure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures#closure), you've performed basic currying:

```
const greeting = (message) => {
   return (name) => {
        return `${message} ${name}`;
   }
}
let sayHi = greeting('Hi');
let sayHello = greeting('Hello');

console.log(sayHi('John'));     // Hi John
console.log(sayHello('John'));  // Hello John
```

This is a sandbox to play around with and learn currying. Here is a [helpful resource](https://javascript.info/currying-partials) to learn more about practical currying.

### develop
```
cd curry-town
npm i
npm run watch
```

Open `dist/index.html` in your preferred browser.

### deploy
```
npm run build
copy `dist/*` to web server
```

http://curry-town.steve-steele.com
