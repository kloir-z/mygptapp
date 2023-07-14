import React, { useState } from "react";
import TodoList from "./TodoList";

type Todo = {
  text: string;
  isCompleted: boolean;
};

const App: React.FC = () => {
  const [value, setValue] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = (text: string): void => {
    const newTodos = [...todos, { text, isCompleted: false }];
    setTodos(newTodos);
  };

  const completeTodo = (index: number): void => {
    const newTodos = [...todos];
    newTodos[index].isCompleted = true;
    setTodos(newTodos);
  };

  const removeTodo = (index: number): void => {
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
  };

  return (
    <div>
      <div>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button onClick={() => addTodo(value)}>Add todo</button>
      </div>
      <TodoList todos={todos} completeTodo={completeTodo} removeTodo={removeTodo}/>
    </div>
  );
};

export default App;