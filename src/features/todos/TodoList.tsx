import React from 'react'
import { useAppSelector } from '../../store'
import TodoListItem from './TodoListItem'

import { selectFilteredTodoIds } from './todosSlice'

const TodoList = () => {
  const todoIds = useAppSelector(selectFilteredTodoIds)
  const loadingStatus = useAppSelector((state) => state.todos.loadingState)

  if (loadingStatus === 'loading') {
    return (
      <div className="todo-list">
        <div className="loader" />
      </div>
    )
  }

  const renderedListItems = todoIds.map((todoId) => {
    return <TodoListItem key={todoId} id={todoId} />
  })

  return <ul className="todo-list">{renderedListItems}</ul>
}

export default TodoList
