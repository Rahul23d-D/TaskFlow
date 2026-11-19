
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  CheckCircle2,
  Clock,
  ListTodo,
  Plus,
  Search,
  Trash2,
  Check,
  CalendarDays,
  Pencil,
  X
} from "lucide-react";

import "./App.css";

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("taskflow-tasks")) || [];
    } catch {
      return [];
    }
  });

  const [taskInput, setTaskInput] = useState("");
  const [category, setCategory] = useState("College");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [activePage, setActivePage] = useState("Dashboard");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem("taskflow-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const resetForm = () => {
    setTaskInput("");
    setCategory("College");
    setPriority("Medium");
    setDueDate("");
    setEditingId(null);
  };

  const addTask = () => {
    if (!taskInput.trim()) {
      alert("Please enter a task!");
      return;
    }

    if (editingId !== null) {
      setTasks(tasks.map(task =>
        task.id === editingId
          ? {
              ...task,
              title: taskInput.trim(),
              category,
              priority,
              dueDate
            }
          : task
      ));
    } else {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          title: taskInput.trim(),
          category,
          priority,
          dueDate,
          completed: false,
          date: new Date().toLocaleDateString()
        }
      ]);
    }

    resetForm();
  };

  const editTask = (task) => {
    setTaskInput(task.title);
    setCategory(task.category || "College");
    setPriority(task.priority || "Medium");
    setDueDate(task.dueDate || "");
    setEditingId(task.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id
        ? { ...task, completed: !task.completed }
        : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));

    if (editingId === id) {
      resetForm();
    }
  };

  const completed = tasks.filter(task => task.completed).length;
  const pending = tasks.length - completed;

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesPage =
      activePage !== "Completed" || task.completed;

    const matchesFilter =
      filter === "All" ||
      (filter === "Completed" && task.completed) ||
      (filter === "Pending" && !task.completed);

    return matchesSearch && matchesPage && matchesFilter;
  });

  return (
    <div className="app">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2 className="logo">Task<span>Flow.</span></h2>

        <p className="menu-label">MENU</p>

        <button
          className={`nav-item ${activePage === "Dashboard" ? "active" : ""}`}
          onClick={() => {
            setActivePage("Dashboard");
            setFilter("All");
          }}
        >
          <LayoutDashboard size={19} />
          Dashboard
        </button>

        <button
          className={`nav-item ${activePage === "My Tasks" ? "active" : ""}`}
          onClick={() => {
            setActivePage("My Tasks");
            setFilter("All");
          }}
        >
          <ListTodo size={19} />
          My Tasks
        </button>

        <button
          className={`nav-item ${activePage === "Completed" ? "active" : ""}`}
          onClick={() => {
            setActivePage("Completed");
            setFilter("All");
          }}
        >
          <CheckCircle2 size={19} />
          Completed
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main">

        <header className="topbar">
          <div>
            <p className="greeting">WORKSPACE / OVERVIEW</p>
            <h1>
              {activePage === "Dashboard"
                ? "My Dashboard"
                : activePage}
            </h1>
            <p className="subtitle">
              Stay organized. Get things done.
            </p>
          </div>

          <div className="profile">TF</div>
        </header>

        {/* STATISTICS */}
        <section className="stats">

          <div className="stat-card">
            <div className="stat-icon purple">
              <ListTodo />
            </div>
            <p>Total Tasks</p>
            <h2>{tasks.length}</h2>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <CheckCircle2 />
            </div>
            <p>Completed</p>
            <h2>{completed}</h2>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">
              <Clock />
            </div>
            <p>Pending</p>
            <h2>{pending}</h2>
          </div>

        </section>

        {/* TASK SECTION */}
        <section className="task-section">

          <div className="section-heading">
            <div>
              <h2>
                {activePage === "Dashboard"
                  ? "My Tasks"
                  : activePage}
              </h2>
              <p>Manage your daily activities</p>
            </div>

            <span className="task-count">
              {filteredTasks.length} tasks
            </span>
          </div>

          {/* ADD / EDIT TASK */}
          {activePage !== "Completed" && (
            <>
              <div className="add-task">
                <input
                  value={taskInput}
                  onChange={e => setTaskInput(e.target.value)}
                  onKeyDown={e =>
                    e.key === "Enter" && addTask()
                  }
                  placeholder="What needs to be done?"
                />

                <button onClick={addTask}>
                  {editingId !== null
                    ? <Check size={18} />
                    : <Plus size={18} />}

                  {editingId !== null
                    ? "Save Changes"
                    : "Add Task"}
                </button>

                {editingId !== null && (
                  <button
                    className="cancel-btn"
                    onClick={resetForm}
                    title="Cancel editing"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              <div className="task-options">

                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                >
                  <option>College</option>
                  <option>Personal</option>
                  <option>Work</option>
                </select>

                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value)}
                >
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>

                <input
                  type="date"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  aria-label="Task due date"
                />

              </div>
            </>
          )}

          {/* SEARCH AND FILTER */}
          <div className="toolbar">

            <div className="search-box">
              <Search size={18} />

              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search tasks..."
              />
            </div>

            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
            >
              <option>All</option>
              <option>Pending</option>
              <option>Completed</option>
            </select>

          </div>

          {/* TASK LIST */}
          <div className="task-list">

            {filteredTasks.length === 0 ? (
              <div className="empty">
                <CalendarDays size={35} />
                <h3>No tasks found</h3>
                <p>Your tasks will appear here.</p>
              </div>
            ) : (

              filteredTasks.map(task => (

                <div className="task-item" key={task.id}>

                  <button
                    className={`check-btn ${
                      task.completed ? "checked" : ""
                    }`}
                    onClick={() => toggleTask(task.id)}
                    title="Mark complete"
                  >
                    {task.completed && <Check size={15} />}
                  </button>

                  <div className="task-info">

                    <h3 className={task.completed ? "done" : ""}>
                      {task.title}
                    </h3>

                    <p>
                      {task.category || "College"} · Created {task.date}
                      {task.dueDate && ` · Due ${task.dueDate}`}
                    </p>

                    <div className="task-tags">

                      <span className={`priority ${
                        (task.priority || "Medium").toLowerCase()
                      }`}>
                        {task.priority || "Medium"} Priority
                      </span>

                      <span className="category-tag">
                        {task.category || "College"}
                      </span>

                    </div>
                  </div>

                  <span className={`status ${
                    task.completed ? "success" : "waiting"
                  }`}>
                    {task.completed ? "Completed" : "Pending"}
                  </span>

                  <button
                    className="delete-btn"
                    onClick={() => editTask(task)}
                    title="Edit task"
                  >
                    <Pencil size={17} />
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteTask(task.id)}
                    title="Delete task"
                  >
                    <Trash2 size={18} />
                  </button>

                </div>
              ))
            )}

          </div>
        </section>

        <footer>
          © 2026 TaskFlow. Built to keep you productive.
        </footer>

      </main>
    </div>
  );
}

export default App;
