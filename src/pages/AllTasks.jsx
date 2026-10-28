import {
  ArrowDownUp,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock3,
  Code2,
  Command,
  FileImage,
  Filter,
  FolderKanban,
  LayoutGrid,
  ListFilter,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  UploadCloud,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Axios from "../api/axios.js";
import { useNavigate } from "react-router-dom";

const statusStyles = {
  Todo: "border-slate-500/20 bg-slate-500/10 text-slate-300",
  InProgress: "border-violet-400/20 bg-violet-400/10 text-violet-300",
  Completed: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
};

const priorityStyles = {
  High: "text-rose-400",
  Medium: "text-amber-300",
  Low: "text-sky-300",
};

export const AllTasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    techStacks: "",
    thumbnail: null,
    priority: "Medium",
    status: "Todo",
    dueDate: "",
  });
  const [imagePreview, setImagePreview] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImage = (e) => {
    const imageFile = e.target.files[0];

    if (!imageFile) return;

    setFormData((prev) => ({ ...prev, thumbnail: imageFile }));

    const imageUrl = URL.createObjectURL(imageFile);
    setImagePreview(imageUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.loading(
      editingTaskId
        ? "Your task is being edited..."
        : "Your task is being created...",
      { id: "task-action" },
    );

    try {
      // Step 1: Prepare your task object
      const taskData = {
        ...formData,
        techStacks: formData.techStacks
          .split(",")
          .map((tech) => tech.trim())
          .filter(Boolean),
      };

      // Step 2: Prepare the request for file upload
      const uploadData = new FormData();

      Object.entries(taskData).forEach(([key, value]) => {
        if (key === "thumbnail") {
          if (value) {
            uploadData.append("thumbnail", value);
          }
        } else if (key === "techStacks") {
          uploadData.append(key, JSON.stringify(value));
        } else if (value !== null && value !== "") {
          uploadData.append(key, value);
        }
      });

      // Step 3: Send to your Express backend
      const response = editingTaskId
        ? await Axios.put(`/task/updateTask/${editingTaskId}`, uploadData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
        : await Axios.post("/task/createTask", uploadData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

      // Step 4: Handle success
      toast.success(
        editingTaskId
          ? "Task edited successfully"
          : response.data.message || "Task created successfully",
        { id: "task-action" },
      );

      if (editingTaskId) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === editingTaskId ? response.data.task : task,
          ),
        );
      } else {
        setTasks((prevTasks) => [response.data.task, ...prevTasks]);
      }

      setEditingTaskId(null);

      setFormData({
        title: "",
        description: "",
        techStacks: "",
        thumbnail: null,
        priority: "Medium",
        status: "Todo",
        dueDate: "",
      });

      setImagePreview("");

      e.target.reset();
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message, {
        id: "task-action",
      });
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await Axios.get("/task/getTasks", {
          withCredentials: true,
        });

        const fetchedTasks = response.data.tasks;

        setTasks(Array.isArray(fetchedTasks) ? fetchedTasks : []);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleDelete = async (taskId) => {
    try {
      const response = await Axios.delete(`/task/deleteTask/${taskId}`, {
        withCredentials: true,
      });

      setTasks((prevtask) => prevtask.filter((task) => task._id !== taskId));
      toast.success("Task deleted successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete task");
    }
  };

  const handleEdit = (task) => {
    setEditingTaskId(task._id);

    setFormData({
      title: task.title || "",
      description: task.description || "",
      techStacks: Array.isArray(task.techStacks)
        ? task.techStacks.join(", ")
        : "",
      thumbnail: null,
      priority: task.priority || "Medium",
      status: task.status || "Todo",
      dueDate: task.dueDate
        ? new Date(task.dueDate).toISOString().split("T")[0]
        : "",
    });

    setImagePreview(task.thumbnail || "");

    document
      .getElementById("create-task")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleClear = () => {
    setEditingTaskId(null);
    setFormData({
      title: "",
      description: "",
      techStacks: "",
      thumbnail: null,
      priority: "Medium",
      status: "Todo",
      dueDate: "",
    });
    setImagePreview("");
  };

  const handleLogout = async () => {
    try {
      await Axios.post("/auth/logout", {}, { withCredentials: true });
      toast.success("Logged out successfully! 👋");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const filteredTasks = tasks
    .filter((task) => {
      const query = searchQuery.toLowerCase().trim();

      const matchesSearch =
        task.title?.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }

      if (sortOrder === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }

      if (sortOrder === "title") {
        return (a.title || "").localeCompare(b.title || "");
      }

      return 0;
    });

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#090b12] text-white selection:bg-violet-500/30">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-[420px] w-[420px] rounded-full bg-violet-600/[0.09] blur-[130px]" />
        <div className="absolute -right-40 top-[500px] h-[400px] w-[400px] rounded-full bg-indigo-500/[0.07] blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-4 py-6 sm:px-8 lg:px-12 lg:py-12">
        {/* Top navigation */}
        <header className="mb-10 sm:mb-12 flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-6 sm:pb-7">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/20">
              <Command size={23} strokeWidth={2.2} />
            </div>

            <div>
              <h2 className="text-lg font-bold tracking-tight">
                taskflow<span className="text-violet-400">.</span>
              </h2>
              <p className="text-xs text-slate-500">Your workspace</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 sm:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs text-slate-400">Personal workspace</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex cursor-pointer h-9 w-20 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/10 text-sm font-semibold text-violet-200 transition hover:bg-violet-400/20"
            >
              Log Out
            </button>
          </div>
        </header>

        {/* Hero section */}
        <section className="mb-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/[0.07] px-3.5 py-1.5 text-xs font-medium text-violet-300">
            <Sparkles size={14} />
            Your productivity space
          </div>

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold tracking-tight sm:text-5xl lg:text-[56px] lg:leading-[1.12]">
                Make progress.
                <br />
                <span className="bg-gradient-to-r from-violet-300 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  One task at a time.
                </span>
              </h1>

              <p className="mt-4 sm:mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                All your projects, ideas, and deadlines in one place. Stay
                organized, keep building, and turn your plans into something
                real.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("create-task")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="inline-flex w-full sm:w-auto shrink-0 items-center cursor-pointer justify-center gap-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3.5 text-sm font-semibold shadow-lg shadow-violet-600/20 transition hover:brightness-110"
            >
              <Plus size={18} />
              Create new task
              <ArrowUpRight size={16} />
            </button>
          </div>
        </section>

        {/* Overview cards */}
        <section className="mb-10 sm:mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/[0.08] bg-[#10121b] p-5">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-sm text-slate-400">Total tasks</span>
              <span className="rounded-xl bg-violet-400/10 p-2.5 text-violet-300">
                <FolderKanban size={19} />
              </span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold">{tasks.length}</span>
              <span className="text-xs text-slate-500">
                Across all projects
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#10121b] p-5">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-sm text-slate-400">In progress</span>
              <span className="rounded-xl bg-blue-400/10 p-2.5 text-blue-300">
                <Clock3 size={19} />
              </span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold">
                {tasks.filter((task) => task.status === "InProgress").length}
              </span>
              <span className="text-xs text-blue-300">Currently active</span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#10121b] p-5">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-sm text-slate-400">Completed</span>
              <span className="rounded-xl bg-emerald-400/10 p-2.5 text-emerald-300">
                <CheckCircle2 size={19} />
              </span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold">
                {tasks.filter((task) => task.status === "Completed").length}
              </span>
              <span className="text-xs text-emerald-300">Nicely done</span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#10121b] p-5">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-sm text-slate-400">High priority</span>
              <span className="rounded-xl bg-rose-400/10 p-2.5 text-rose-300">
                <Zap size={19} />
              </span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold">
                {tasks.filter((task) => task.priority === "High").length}
              </span>
              <span className="text-xs text-rose-300">Needs attention</span>
            </div>
          </div>
        </section>

        {/* All tasks heading */}
        <section className="mb-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold tracking-tight">All tasks</h2>
                <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-slate-400">
                  {tasks.length}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                Your projects, organized your way.
              </p>
            </div>

            <button
              type="button"
              className="flex items-center gap-2 rounded-xl border border-white/10 px-3.5 py-2.5 text-sm text-slate-300 transition hover:bg-white/[0.04]"
            >
              <LayoutGrid size={16} />
              Grid view
              <ChevronDown size={15} />
            </button>
          </div>

          {/* Search and filter toolbar */}
          <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.08] bg-[#10121b] p-3 sm:flex-row sm:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3">
              <Search size={18} className="shrink-0 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by task title or description..."
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              />
              <span className="hidden shrink-0 rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-slate-500 md:inline">
                SEARCH
              </span>
            </div>
            {/* with status  */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full cursor-pointer appearance-none rounded-xl border border-white/10 bg-[#10121b] py-3 pl-10 pr-9 text-sm text-white outline-none transition hover:bg-white/[0.06] focus:border-violet-400/50"
                >
                  <option className="bg-[#10121b] text-white" value="All">
                    All statuses
                  </option>
                  <option className="bg-[#10121b] text-white" value="Todo">
                    To do
                  </option>
                  <option
                    className="bg-[#10121b] text-white"
                    value="InProgress"
                  >
                    In progress
                  </option>
                  <option className="bg-[#10121b] text-white" value="Completed">
                    Completed
                  </option>
                </select>

                <Filter
                  size={15}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-violet-300"
                />

                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>

              {/* with priorities  */}
              <div className="relative flex-1 sm:flex-none">
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full cursor-pointer appearance-none rounded-xl border border-white/10 bg-[#10121b] py-3 pl-10 pr-9 text-sm text-white outline-none transition hover:bg-white/[0.06] focus:border-violet-400/50"
                >
                  <option className="bg-[#10121b] text-white" value="All">
                    All priorities
                  </option>
                  <option className="bg-[#10121b] text-white" value="Low">
                    Low
                  </option>
                  <option className="bg-[#10121b] text-white" value="Medium">
                    Medium
                  </option>
                  <option className="bg-[#10121b] text-white" value="High">
                    High
                  </option>
                </select>

                <SlidersHorizontal
                  size={15}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-violet-300"
                />

                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
              {/* with sort btn  */}
              <button
                type="button"
                aria-label="Sort tasks"
                title={`Sort: ${sortOrder}`}
                onClick={() => {
                  setSortOrder((current) => {
                    if (current === "newest") return "oldest";
                    if (current === "oldest") return "title";
                    return "newest";
                  });
                }}
                className="flex shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.025] px-3.5 py-3 text-slate-300 transition hover:bg-white/[0.06]"
              >
                <ArrowDownUp size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* Task cards */}
        <section className="mb-20">
          <div className="mb-5 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Recently updated
            </span>
            <button
              type="button"
              className="flex items-center gap-1.5 text-sm text-violet-300 transition hover:text-violet-200"
            >
              View all
              <ArrowRight size={15} />
            </button>
          </div>
          {/* dynamic card  */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {loading ? (
              <p className="text-sm text-slate-400">Loading tasks...</p>
            ) : tasks.length === 0 ? (
              <p className="text-sm text-slate-400">
                No tasks found. Create your first task!
              </p>
            ) : (
              filteredTasks.map((task, index) => (
                <article
                  key={task._id || index}
                  className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-[#10121b] transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/30 hover:shadow-[0_12px_45px_-20px_rgba(139,92,246,0.35)]"
                >
                  <div className="relative h-48 overflow-hidden bg-[#191a29]">
                    {task.thumbnail ? (
                      <>
                        {/* Fill empty space with a blurred image */}
                        <img
                          src={task.thumbnail}
                          alt=""
                          aria-hidden="true"
                          className="absolute inset-0 h-full w-full object-cover scale-110 blur-xl opacity-50"
                        />

                        {/* Display the complete original image */}
                        <img
                          src={task.thumbnail}
                          alt={task.title}
                          className="relative z-10 h-full w-full object-contain transition-transform duration-500"
                        />
                      </>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <FileImage size={40} className="text-slate-500" />
                      </div>
                    )}

                    <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-[#10121b] via-transparent to-black/20" />

                    {/* Keep your existing priority badge, menu, and task ID here */}
                  </div>

                  <div className="p-5">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <h3 className="text-lg font-semibold tracking-tight text-white transition-colors group-hover:text-violet-300 break-words">
                        {task.title}
                      </h3>

                      <span
                        className={`mt-1 flex shrink-0 items-center gap-1.5 text-xs font-medium ${priorityStyles[task.priority]}`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {task.priority}
                      </span>
                    </div>

                    <p className="mb-5 min-h-[60px] text-sm leading-6 text-slate-400 break-words">
                      {task.description}
                    </p>

                    <div className="mb-5 flex min-h-7 flex-wrap gap-2">
                      {(Array.isArray(task.techStacks)
                        ? task.techStacks
                        : []
                      ).map((tech, techIndex) => (
                        <span
                          key={`${tech}-${techIndex}`}
                          className="rounded-md border border-white/[0.07] bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium ${statusStyles[task.status]}`}
                      >
                        {task.status === "Completed" ? (
                          <CheckCircle2 size={13} />
                        ) : task.status === "InProgress" ? (
                          <Clock3 size={13} />
                        ) : (
                          <Circle size={13} />
                        )}
                        {task.status === "InProgress"
                          ? "In Progress"
                          : task.status}
                      </span>

                      <span className="flex items-center gap-1.5 text-xs text-slate-400">
                        <CalendarDays size={14} />
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : "No due date"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleEdit(task)}
                        className="rounded-xl cursor-pointer border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-violet-400/40 hover:bg-violet-400/5 hover:text-white"
                      >
                        Edit task
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(task._id)}
                        className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-rose-400/15 px-4 py-2.5 text-sm font-medium text-rose-300 transition hover:bg-rose-400/10"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        {/* Create task form at the bottom */}
        <section id="create-task" className="scroll-mt-8">
          <div className="mb-7 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/10 text-violet-300">
              <Plus size={23} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-bold tracking-tight">
                  Create a new task
                </h2>
                <span className="rounded-md border border-violet-400/20 bg-violet-400/[0.07] px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-violet-300">
                  New task
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Add your project details, choose a priority, and set a deadline
                to get started.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-3xl border border-white/[0.09] bg-[#10121b] shadow-2xl shadow-black/10"
          >
            {/* Form header */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] px-6 py-5 sm:px-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] text-slate-300">
                  <FileImage size={19} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Task details
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Complete the fields below
                  </p>
                </div>
              </div>

              <span className="text-xs text-slate-500">
                <span className="text-violet-300">*</span> Required fields
              </span>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-7 p-6 sm:p-8 lg:grid-cols-2">
              {/* Title */}
              <div className="lg:col-span-2">
                <label
                  htmlFor="title"
                  className="mb-2.5 block text-sm font-medium text-slate-200"
                >
                  Task title <span className="text-violet-400">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g. Build a modern portfolio website"
                  className="w-full rounded-xl border border-white/[0.09] bg-[#0b0d15] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/50 focus:ring-4 focus:ring-violet-400/[0.06]"
                />
              </div>

              {/* Description */}
              <div className="lg:col-span-2">
                <label
                  htmlFor="description"
                  className="mb-2.5 block text-sm font-medium text-slate-200"
                >
                  Description <span className="text-violet-400">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe your task, its goals, and what you want to accomplish..."
                  className="w-full resize-y rounded-xl border border-white/[0.09] bg-[#0b0d15] px-4 py-3.5 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/50 focus:ring-4 focus:ring-violet-400/[0.06]"
                />
              </div>

              {/* Tech stacks */}
              <div className="lg:col-span-2">
                <label
                  htmlFor="techStacks"
                  className="mb-2.5 flex items-center gap-2 text-sm font-medium text-slate-200"
                >
                  <Code2 size={16} className="text-violet-300" />
                  Technology stack <span className="text-violet-400">*</span>
                </label>
                <input
                  id="techStacks"
                  name="techStacks"
                  value={formData.techStacks}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g. React, Node.js, MongoDB, Tailwind CSS"
                  className="w-full rounded-xl border border-white/[0.09] bg-[#0b0d15] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/50 focus:ring-4 focus:ring-violet-400/[0.06]"
                />
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Separate technologies with commas. You can connect this field
                  to an array when you add the functionality.
                </p>
              </div>

              {/* Thumbnail upload */}
              <div className="lg:col-span-2">
                <label className="mb-2.5 block text-sm font-medium text-slate-200">
                  Project thumbnail
                </label>

                <label
                  htmlFor="thumbnail"
                  className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.14] bg-[#0b0d15] px-4 py-8 text-center transition hover:border-violet-400/50 hover:bg-violet-400/[0.025] sm:px-6 sm:py-10"
                >
                  {imagePreview ? (
                    <div className="relative mb-4 w-full max-w-xl mx-auto overflow-hidden rounded-2xl border border-white/10 bg-[#090b14] shadow-2xl group/preview">
                      <img
                        src={imagePreview}
                        alt="Selected thumbnail preview"
                        className="h-56 sm:h-64 lg:h-72 w-full object-cover transition-transform duration-300 group-hover/preview:scale-[1.02]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                        <span className="flex items-center gap-1.5 rounded-lg bg-black/70 px-3 py-1.5 backdrop-blur-md border border-white/10 font-medium">
                          <FileImage size={14} className="text-violet-300" />
                          Thumbnail preview
                        </span>
                        <span className="flex items-center gap-1.5 rounded-lg bg-violet-600/90 px-3 py-1.5 backdrop-blur-md font-medium text-white shadow-lg shadow-violet-600/30 transition hover:bg-violet-500">
                          <Sparkles size={13} />
                          Change image
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/[0.08] text-violet-300 transition group-hover:scale-105">
                      <UploadCloud size={26} />
                    </div>
                  )}

                  <p className="text-sm font-semibold text-slate-200">
                    {imagePreview
                      ? "Click anywhere to change or replace thumbnail"
                      : "Click to upload your thumbnail"}
                  </p>
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    PNG, JPG, WEBP or JPEG
                  </p>

                  <span className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-medium text-slate-300">
                    <Plus size={14} />
                    {imagePreview ? "Replace image" : "Choose image"}
                  </span>

                  <input
                    id="thumbnail"
                    name="thumbnail"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImage}
                    type="file"
                    className="sr-only"
                  />
                </label>

                <p className="mt-2.5 text-xs leading-5 text-slate-500">
                  Your future upload handler will send this image to Cloudinary
                  and save its URL with the task.
                </p>
              </div>

              {/* Priority */}
              <div>
                <label
                  htmlFor="priority"
                  className="mb-2.5 block text-sm font-medium text-slate-200"
                >
                  Priority
                </label>
                <div className="relative">
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full appearance-none rounded-xl border border-white/[0.09] bg-[#0b0d15] px-4 py-3.5 pr-10 text-sm text-slate-200 outline-none transition focus:border-violet-400/50 focus:ring-4 focus:ring-violet-400/[0.06]"
                  >
                    <option value="Low">Low priority</option>
                    <option value="Medium">Medium priority</option>
                    <option value="High">High priority</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="status"
                  className="mb-2.5 block text-sm font-medium text-slate-200"
                >
                  Status
                </label>
                <div className="relative">
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full appearance-none rounded-xl border border-white/[0.09] bg-[#0b0d15] px-4 py-3.5 pr-10 text-sm text-slate-200 outline-none transition focus:border-violet-400/50 focus:ring-4 focus:ring-violet-400/[0.06]"
                  >
                    <option value="Todo">To do</option>
                    <option value="InProgress">In progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                </div>
              </div>

              {/* Due date */}
              <div>
                <label
                  htmlFor="dueDate"
                  className="mb-2.5 block text-sm font-medium text-slate-200"
                >
                  Due date
                </label>
                <div className="relative">
                  <input
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    type="date"
                    className="w-full rounded-xl border border-white/[0.09] bg-[#0b0d15] px-4 py-3.5 text-sm text-slate-300 outline-none transition focus:border-violet-400/50 focus:ring-4 focus:ring-violet-400/[0.06] [color-scheme:dark]"
                  />
                </div>
              </div>

              {/* Thumbnail helper / upload note */}
              <div className="flex items-end">
                <div className="flex w-full items-start gap-3 rounded-xl border border-violet-400/10 bg-violet-400/[0.04] p-4">
                  <Sparkles
                    size={17}
                    className="mt-0.5 shrink-0 text-violet-300"
                  />
                  <p className="text-xs leading-5 text-slate-400">
                    <span className="font-medium text-slate-200">Pro tip:</span>{" "}
                    Add a clear project image and relevant technologies to make
                    your task cards easier to recognize.
                  </p>
                </div>
              </div>
            </div>

            {/* Form footer */}
            <div className="flex flex-col-reverse gap-3 border-t border-white/[0.07] bg-white/[0.015] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-5">
              <p className="text-xs text-slate-500 text-center sm:text-left">
                Your task details will appear in your workspace.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex-1 rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/[0.05] sm:flex-none"
                >
                  Clear form
                </button>

                <button
                  type="submit"
                  className="group flex w-full sm:w-auto min-h-12 items-center cursor-pointer justify-center gap-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600  px-6 py-3.5 text-sm font-semibold text-white  shadow-lg shadow-violet-600/20  transition-all duration-200 hover:brightness-110 hover:shadow-violet-600/30  active:scale-[0.98]"
                >
                  {editingTaskId ? <Check size={17} /> : <Plus size={17} />}

                  <span>{editingTaskId ? "Update task" : "Create task"}</span>

                  <ArrowRight
                    size={16}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* Footer */}
        <footer className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/[0.07] pt-7 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-slate-500">
            © 2026 TaskFlow. Built to help you do more.
          </p>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
            Made for focused work
          </div>
        </footer>
      </div>
    </main>
  );
};
