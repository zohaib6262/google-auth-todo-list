import React, { useState } from "react";
import moment from "moment";

const TodoForm = ({ fetchTodos }) => {
  const [todoName, setTodoName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!todoName) {
      setError("Todo name is required.");
      return;
    }

    if (dueDate && moment(dueDate).isBefore(moment(), "day")) {
      setError("Due date cannot be in the past.");
      return;
    }
    if (todoName.trim().length === 0 || !todoName) {
      setError("Please,Enter todo title");
      return;
    }
    if (!dueDate) {
      setError("Please,Select due date");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        "https://google-auth-todo-list.vercel.app/todos/create-todo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            name: todoName,
            completed: false,
            dueDate: dueDate,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Failed to create todo.");
      } else {
        setTodoName("");
        setDueDate("");
        setError("");
        fetchTodos();
      }
    } catch (error) {
      setError("An error occurred while creating the todo.");
    } finally {
      setLoading(false);
    }
  };

  const todayDate = moment().format("YYYY-MM-DD");

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 p-6 bg-white shadow-lg rounded-lg space-y-6"
    >
      <div className="flex gap-4 items-center">
        <input
          type="text"
          value={todoName}
          onChange={(e) => setTodoName(e.target.value)}
          placeholder="Enter new todo"
          disabled={loading}
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 p-2 text-sm transition duration-150 ease-in-out"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          min={todayDate}
          disabled={loading}
          className="rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 p-2 text-sm transition duration-150 ease-in-out"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition duration-150 ease-in-out"
        >
          {loading ? "Adding..." : "Add Todo"}
        </button>
      </div>
      {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
    </form>
  );
};

export default TodoForm;
