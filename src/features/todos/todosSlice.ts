import {
  createSlice,
  createSelector,
  createAsyncThunk,
  PayloadAction,
} from '@reduxjs/toolkit'
import { client } from '../../api/client'
import { RootState } from '../../store'
import { StatusFilters } from '../filters/filtersSlice'


export interface TodoItem {
  id: number,
  text: string, 
  completed: boolean, 
  color: string
}

export enum LoadingStatus {
  Idle = "idle",
  Loading = "loading"
} 

// maybe we should use an object to store id & entities
interface TodoState {
  entities: TodoItem[],
  loadingState: LoadingStatus 
}



const initialState: TodoState = {
  loadingState: LoadingStatus.Idle,
  entities: []
}



// Thunk functions
export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const response = await client.get('/fakeApi/todos')
  return response.todos
})

export const saveNewTodo = createAsyncThunk(
  'todos/saveNewTodo',
  async (text: string) => {
    const initialTodo = { text }
    const response = await client.post('/fakeApi/todos', { todo: initialTodo })
    return response.todo
  }
)

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    todoToggled(state, action: PayloadAction<number>) {
      const todoId = action.payload
      const selectedTodo = state.entities.find((todo) => todo.id === todoId);
      if (selectedTodo) {
        selectedTodo.completed = !selectedTodo.completed
      }
    },
    todoColorSelected: {
      reducer(state, action: PayloadAction<{
        todoId: number, 
        color: string
      }>) {
        const { color, todoId } = action.payload
        const selectedTodo = state.entities.find((todo) => todo.id === todoId);
        selectedTodo!.color = color
      },
      prepare(todoId, color) {
        return {
          payload: { todoId, color },
        }
      },
    },
    todoDeleted: {
      reducer(state, action: PayloadAction<{todoId: number}>) {
        const {todoId} = action.payload;
        state.entities = state.entities.filter((todo) => todo.id !== todoId);
      },
      prepare(todoId: number) {
        return {
          payload: {todoId}
        }
      }
    },
    allTodosCompleted(state) {
      state.entities.forEach((todo) => {
        todo.completed = true
      })
    },
    completedTodosCleared(state) {
      state.entities = state.entities.filter((todo) => !todo.completed);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state ) => {
        state.loadingState = LoadingStatus.Loading
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.entities = action.payload;
        state.loadingState = LoadingStatus.Idle
      })
      .addCase(saveNewTodo.fulfilled, (state, action) => {
        state.entities.push(action.payload);
      })
  },
})

export const {
  allTodosCompleted,
  completedTodosCleared,
  todoColorSelected,
  todoDeleted,
  todoToggled,
} = todosSlice.actions

export default todosSlice.reducer


export const selectTodos = (state: RootState) => state.todos.entities;

export const selectTodoById = (state: RootState, id: number) => state.todos.entities.find((todo) => todo.id === id) as TodoItem

export const selectTodoIds = createSelector(
  // First, pass one or more "input selector" functions:
  selectTodos,
  // Then, an "output selector" that receives all the input results as arguments
  // and returns a final result value
  (todos) => todos.map((todo) => todo.id)
)

export const selectFilteredTodos = createSelector(
  // First input selector: all todos
  selectTodos,
  // Second input selector: all filter values
  (state: RootState) => state.filters,
  // Output selector: receives both values
  (todos, filters) => {
    const { status, colors } = filters
    const showAllCompletions = status === StatusFilters.All
    if (showAllCompletions && colors.length === 0) {
      return todos
    }

    const completedStatus = status === StatusFilters.Completed
    // Return either active or completed todos based on filter
    return todos.filter((todo) => {
      const statusMatches =
        showAllCompletions || todo.completed === completedStatus
      const colorMatches = colors.length === 0 || colors.includes(todo.color)
      return statusMatches && colorMatches
    })
  }
)

export const selectFilteredTodoIds = createSelector(
  // Pass our other memoized selector as an input
  selectFilteredTodos,
  // And derive data in the output selector
  (filteredTodos) => filteredTodos.map((todo) => todo.id)
)

// see doc: https://blog.isquaredsoftware.com/2017/12/idiomatic-redux-using-reselect-selectors/
