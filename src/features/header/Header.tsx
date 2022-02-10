import React, { KeyboardEvent, useState } from 'react'
import { useAppDispatch } from '../../store'
import { LoadingStatus } from "../todos/todosSlice"
import { saveNewTodo } from '../todos/todosSlice'

const Header = () => {
  const [text, setText] = useState('')
  const [status, setStatus] = useState(LoadingStatus.Idle)
  const dispatch = useAppDispatch()

  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => setText(e.currentTarget.value)

  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    // If the user pressed the Enter key:
    const trimmedText = text.trim()
    if (e.key === "Enter" && trimmedText) {
      // Create and dispatch the thunk function itself
      setStatus(LoadingStatus.Loading)
      await dispatch(saveNewTodo(trimmedText))
      // And clear out the text input
      setText('')
      setStatus(LoadingStatus.Idle)
    }
  }

  let isLoading = status === LoadingStatus.Loading
  let placeholder = isLoading ? '' : 'What needs to be done?'
  let loader = isLoading ? <div className="loader" /> : null

  return (
    <header className="header">
      <input
        className="new-todo"
        placeholder={placeholder}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
      />
      {loader}
    </header>
  )
}

export default Header
