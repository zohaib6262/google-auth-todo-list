import React, { useState, useEffect } from "react";
import TodoForm from "../components/TodoForm";
import TodoFilter from "../components/TodoFilter";
import TodoList from "../components/TodoList";

const TodoDashboard = () => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://google-auth-todo-list.vercel.app/todos/get-todos",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "An error occurred");
        return;
      }

      setTodos(data);
    } catch (error) {
      setError("An error occurred while fetching todos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "pending") return !todo.completed;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Todo Dashboard
      </h1>
      <TodoForm fetchTodos={fetchTodos} />
      <TodoFilter setFilter={setFilter} filterName={filter} />

      {loading && (
        <div className="text-center py-4">
          <p className="text-gray-600">Loading todos...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      {!loading && !error && (
        <TodoList fetchTodos={fetchTodos} todos={filteredTodos} />
      )}
    </div>
  );
};

export default TodoDashboard;
