import { useState } from "react";
import { useNavigate } from "react-router";
import { MobileContainer } from "../MobileContainer";
import { BottomNav } from "../BottomNav";
import { ArrowLeft, Plus, X } from "lucide-react";
import { useHouseMate } from "../../state/houseMateContext";

export function TaskListsScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"my" | "house">("my");
  const [showModal, setShowModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState<string>("");
  const [scope, setScope] = useState<"personal" | "house">("house");
  const [error, setError] = useState("");

  const { activeHouse, activeMember, addTask, toggleTask } = useHouseMate();

  if (!activeHouse || !activeMember) {
    return (
      <MobileContainer>
        <div
          className="h-full flex flex-col items-center justify-center gap-4 px-8 text-center"
          style={{ backgroundColor: "#f5f0fc" }}
        >
          <p className="text-text">
            Create or join a house to start assigning tasks.
          </p>
          <button
            onClick={() => navigate("/create-house")}
            className="px-6 py-3 rounded-2xl text-white"
            style={{ backgroundColor: "#403361" }}
          >
            Create a House
          </button>
        </div>
      </MobileContainer>
    );
  }

  const myTasks = activeHouse.tasks.filter(
    (task) => task.assignedTo === activeMember.id,
  );
  const houseTasks = activeHouse.tasks.filter(
    (task) => task.assignedTo !== activeMember.id,
  );

  const handleAddTask = () => {
    if (!taskTitle.trim()) {
      setError("Give your task a name.");
      return;
    }
    setError("");
    addTask(taskTitle, assignedTo || undefined, scope);
    setTaskTitle("");
    setAssignedTo("");
    setScope("house");
    setShowModal(false);
  };

  return (
    <MobileContainer>
      <div className="h-full flex flex-col pb-20">
        {/* Header */}
        <div className="bg-gradient-to-br from-sage/40 to-mint/30 p-6 pb-4 rounded-b-[2.5rem]">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => navigate(-1)}>
              <ArrowLeft className="w-6 h-6 text-text" />
            </button>
            <h2 className="text-primary-dark">Tasks</h2>
            <button onClick={() => setShowModal(true)}>
              <div className="w-6 h-6">
                <Plus className="w-6 h-6 text-text" />
              </div>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 bg-surface/60 rounded-2xl p-1">
            <button
              onClick={() => setActiveTab('my')}
              className={`flex-1 py-2 rounded-xl transition-all ${
                activeTab === 'my'
                  ? 'bg-primary text-white'
                  : 'text-text-light'
              }`}
            >
              My Tasks
            </button>
            <button
              onClick={() => setActiveTab('house')}
              className={`flex-1 py-2 rounded-xl transition-all ${
                activeTab === 'house'
                  ? 'bg-primary text-white'
                  : 'text-text-light'
              }`}
            >
              House Tasks
            </button>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === "my" ? (
            myTasks.length === 0 ? (
              <p className="text-text-light text-center">
                No personal tasks yet. Add one!
              </p>
            ) : (
              <div className="space-y-3">
                {myTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-surface rounded-2xl p-4 flex items-center gap-3"
                    style={{ boxShadow: "var(--shadow-soft)" }}
                  >
                    <span
                      className={`flex-1 ${
                        task.completed
                          ? "line-through text-text-light"
                          : "text-text"
                      }`}
                    >
                      {task.title}
                    </span>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="w-6 h-6 rounded-lg accent-primary"
                    />
                  </div>
                ))}
              </div>
            )
          ) : houseTasks.length === 0 ? (
            <p className="text-text-light text-center">
              No shared tasks yet.
            </p>
          ) : (
            <div className="space-y-3">
              {houseTasks.map((task) => {
                const member = activeHouse.members.find(
                  (m) => m.id === task.assignedTo,
                );
                return (
                  <div
                    key={task.id}
                    className="bg-surface rounded-2xl p-4 flex items-center gap-3"
                    style={{ boxShadow: "var(--shadow-soft)" }}
                  >
                    <div className="flex-1">
                      <p
                        className={`${
                          task.completed
                            ? "line-through text-text-light"
                            : "text-text"
                        }`}
                      >
                        {task.title}
                      </p>
                      <p className="text-xs text-text-light mt-1">
                        Assigned to {member?.name ?? "Unassigned"}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-mint flex items-center justify-center text-white">
                      {member?.name.charAt(0).toUpperCase() ?? "?"}
                    </div>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="w-6 h-6 rounded-lg accent-primary"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-6">
          <div
            className="bg-white rounded-3xl p-6 w-full max-w-sm"
            style={{ boxShadow: "var(--shadow-large)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-text">Add task</h3>
              <button onClick={() => setShowModal(false)}>
                <X className="w-6 h-6 text-text-light" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-text-light mb-2 block">
                  Task title
                </label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full rounded-2xl px-4 py-3 text-text"
                  style={{ backgroundColor: "#f0f0f0" }}
                />
              </div>

              <div>
                <label className="text-text-light mb-2 block">
                  Assign to
                </label>
                <select
                  value={assignedTo || "self"}
                  onChange={(e) =>
                    setAssignedTo(e.target.value === "self" ? "" : e.target.value)
                  }
                  className="w-full rounded-2xl px-4 py-3 text-text"
                  style={{ backgroundColor: "#f0f0f0" }}
                >
                  <option value="self">Me ({activeMember.name})</option>
                  {activeHouse.members
                    .filter((member) => member.id !== activeMember.id)
                    .map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="text-text-light mb-2 block">
                  Task type
                </label>
                <select
                  value={scope}
                  onChange={(e) =>
                    setScope(e.target.value as "personal" | "house")
                  }
                  className="w-full rounded-2xl px-4 py-3 text-text"
                  style={{ backgroundColor: "#f0f0f0" }}
                >
                  <option value="house">House task</option>
                  <option value="personal">Personal reminder</option>
                </select>
              </div>

              {error && (
                <p className="text-red-600 text-center">{error}</p>
              )}

              <button
                onClick={handleAddTask}
                className="w-full py-3 rounded-2xl text-white transition-all duration-200 active:scale-95"
                style={{ backgroundColor: "#403361" }}
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </MobileContainer>
  );
}