Usage example:
```ts
async function getRemoteDate() {
    someAjax.getTime()
}

const countDown = new CountDown({
    endTime： Date.now() + 1000 * 100,
    onStep({d, h, m, s}) {
        console.log(d, h, m, s)
    },
    onStop() {
        console.log('finished');
    },
    manager: new CountDownManager({
        debounce: 1000 * 3,
        getRemoteDate,
    }),
})
```
We should share the same CountDownManager when there are multiple countdown instances



