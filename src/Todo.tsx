import React from "react";

type TodoProps = {
  todo: {
    text: string;
    isCompleted: boolean;
  };
  index: number;
  completeTodo: (index: number) => void;
  removeTodo: (index: number) => void;
};

const Todo: React.FC<TodoProps> = ({
  todo,
  index,
  completeTodo,
  removeTodo,
}) => {
  return (
    <div style={{ textDecoration: todo.isCompleted ? "line-through" : "" }}>
      {todo.text}
      <button onClick={() => completeTodo(index)}>Complete</button>
      <button onClick={() => removeTodo(index)}>x</button>
    </div>
  );
};

export default Todo;