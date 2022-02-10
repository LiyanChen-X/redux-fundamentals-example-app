# actual implementation of thunk middleware

```js
const thunkMiddleware = 
    ({dispatch, getState}) => 
    next => 
    action => {
        if (typeof action === 'function') {
            return action(dispatch, getState)
        }

        return next(action)
    }

```

It's important to note that middleware can be used to allow passing values that are not action objects into `store.dispatch`, as long as the middleware intercepts those values and does not let them reach the reducers.

The thunk middleware returning whatever the called thunk function returns.

Redux Toolkit has a `createAsyncThunk` API that abstracts the process of generating those actions, dispatching them based on a `Promise` lifecycle, and handling the errors correctly. It accepts a partial action type string(used to generate the action types for `pending`, `fulfilled`, and `rejected`), and a `payload creation callback` that does the actual async request and returns a `Promise`. It then automatically dispatches the actions before and after the request, with the right arguments. 


The thunk action creator has the action creators for `pending`, `fulfilled` and `rejected` attached. You can use the `extraReducers` option in `createSlice` to listen for those action types and update the slice's state accordingly.



We pass 'todos/fetchTodos' as the string prefix, and a "payload creator" function that calls our API and returns a promise containing the fetched data. Inside, createAsyncThunk will generate three action creators and action types, plus a thunk function that automatically dispatches those actions when called. In this case, the action creators and their types are:
- fetchTodos.pending: todos/fetchTodos/pending
- fetchTodos.fulfilled: todos/fetchTodos/fulfilled
- fetchTodos.rejected: todos/fetchTodos/rejected
