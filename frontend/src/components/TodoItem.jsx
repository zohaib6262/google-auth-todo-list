import React, { useState, useEffect } from "react";
import moment from "moment";

const TodoItem = ({ todo, fetchTodos }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(todo.name);
  const [newDueDate, setNewDueDate] = useState(todo.dueDate || "");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  const todayDate = moment().format("YYYY-MM-DD");

  useEffect(() => {
    if (todo.dueDate) {
      setNewDueDate(moment(todo.dueDate).format("YYYY-MM-DD"));
    }
  }, [todo.dueDate]);

  const handleUpdate = async (todoId, completed) => {
    setIsUpdating(true);
    setError(null);

    try {
      const response = await fetch(
        `https://google-auth-todo-list.vercel.app/todos/update-todo/${todoId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            name: newName,
            completed: completed !== undefined ? completed : todo.completed,
            dueDate: newDueDate,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Error updating todo");
      }

      await fetchTodos();
      setIsEditing(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error updating todo");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(
        `https://google-auth-todo-list.vercel.app/todos/delete-todo/${todo.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Error deleting todo");
      }

      await fetchTodos();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error deleting todo");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className={`bg-white p-6 rounded-lg shadow ${
        todo.completed ? "opacity-75" : ""
      }`}
    >
      <div className="flex items-center gap-6">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => handleUpdate(todo.id, !todo.completed)}
          className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />

        {isEditing ? (
          <div className="flex-1 flex gap-6">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 p-3 text-lg transition duration-150 ease-in-out"
            />
            <input
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              min={todayDate}
              className="rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 p-3 text-lg transition duration-150 ease-in-out"
            />
          </div>
        ) : (
          <div className="flex-1">
            <p
              className={`text-lg ${
                todo.completed ? "line-through text-gray-500" : "text-gray-900"
              }`}
            >
              {todo.name.length > 20 ? (
                <span>{todo.name.slice(0, 20)}...</span>
              ) : (
                <span>{todo.name}</span>
              )}
            </p>
            {newDueDate && (
              <p className="text-sm text-gray-500">
                Due: {moment(newDueDate).format("MMMM Do YYYY")}
              </p>
            )}
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={() => {
              if (isEditing) {
                handleUpdate(todo.id);
              } else {
                setIsEditing(true);
              }
            }}
            disabled={todo.completed || isUpdating}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {isUpdating ? "Saving..." : isEditing ? "Save" : "Edit"}
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {error && <div className="mt-2 text-red-600 text-sm">{error}</div>}
    </div>
  );
};

export default TodoItem;
