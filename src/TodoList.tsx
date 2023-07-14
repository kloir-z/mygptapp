import React from "react";
import Todo from "./Todo";

type TodoListProps = {
  todos: { text: string; isCompleted: boolean }[];
  completeTodo: (index: number) => void;
  removeTodo: (index: number) => void;
};

const TodoList: React.FC<TodoListProps> = ({
  todos,
  completeTodo,
  removeTodo,
}) => {
  return (
    <div>
      {todos.map((todo, index) => (
        <Todo
          key={index}
          index={index}
          todo={todo}
          completeTodo={completeTodo}
          removeTodo={removeTodo}
        />
      ))}
    </div>
  );
};

export default TodoList;