import React from 'react'

import Header from './features/header/Header'
import TodoList from './features/todos/TodoList'
import Footer from './features/footer/Footer'
import { CountDownComponent } from "./components/CountDown/CountDownClock"
import { CountDownDateMeta } from './components/CountDown/types'




function App() {
  return (
    //<div className="App">
    //   <nav>
    //     <section>
    //       <h1>Redux Fundamentals Example</h1>
    //     </section>
    //   </nav>
    //   <main>
    //     <section className="medium-container">
    //       <h2>Todos</h2>
    //       <div className="todoapp">
    //         <Header />
    //         <TodoList />
    //         <Footer />
    //       </div>
         
    //     </section>
    //   </main>
    // </div>
    <>
        <CountDownComponent endTime={Date.now() + 100000}></CountDownComponent>
        <CountDownComponent endTime={Date.now() + 2000000}></CountDownComponent>
    </>
  )
    
}

export default App
