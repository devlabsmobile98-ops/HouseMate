import { useState } from "react";
import { useNavigate } from "react-router";
import { MobileContainer } from "../MobileContainer";
import { BottomNav } from "../BottomNav";
import { ArrowLeft, Settings } from "lucide-react";
import { useHouseMate } from "../../state/houseMateContext";

export function ProfileScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"my" | "house">("my");
  const { activeHouse, activeMember, toggleTask } = useHouseMate();

  if (!activeHouse || !activeMember) {
    return (
      <MobileContainer>
        <div
          className="h-full flex flex-col items-center justify-center gap-4 px-8 text-center"
          style={{ backgroundColor: "#ffd9c9" }}
        >
          <p className="text-text">
            Create or join a house to view your profile details.
          </p>
          <button
            onClick={() => navigate("/create-house")}
            className="px-6 py-3 rounded-2xl text-white"
            style={{ backgroundColor: "#e88560" }}
          >
            Create a House
          </button>
        </div>
      </MobileContainer>
    );
  }

  // My Tasks: personal tasks assigned to me OR house tasks assigned to me
  const myTasks = activeHouse.tasks.filter(
    (task) => task.assignedTo === activeMember.id && !task.completed,
  );
  // House Tasks: all house tasks (regardless of assignment)
  const houseTasks = activeHouse.tasks.filter(
    (task) => task.scope === "house" && !task.completed,
  );

  return (
    <MobileContainer>
      <div className="h-full flex flex-col pb-20">
        {/* Header */}
        <div
          className="p-6"
          style={{ backgroundColor: "#ffd9c9" }}
        >
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => navigate(-1)}>
              <ArrowLeft className="w-7 h-7 text-text" />
            </button>
            <h2 style={{ color: "#e88560" }}>My Profile</h2>
            <button onClick={() => navigate("/settings")}>
              <Settings className="w-7 h-7 text-text" />
            </button>
          </div>

          <div className="flex flex-col items-center mb-6">
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center mb-3"
              style={{
                backgroundColor: "#e88560",
                border: "4px solid #fff",
                boxShadow: "var(--shadow-medium)",
                fontSize: "2.5rem",
              }}
            >
              {activeMember.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-text">{activeMember.name}</h2>
            <p className="text-text-light text-sm">
              {activeHouse.name}
            </p>
          </div>

          {/* Tabs */}
          <div
            className="bg-white rounded-3xl p-2 flex gap-2"
            style={{ boxShadow: "var(--shadow-soft)" }}
          >
            <button
              onClick={() => setActiveTab("my")}
              className={`flex-1 py-3 rounded-2xl transition-all duration-200 ${
                activeTab === "my"
                  ? "text-text"
                  : "text-text-light"
              }`}
              style={{
                backgroundColor:
                  activeTab === "my"
                    ? "#ffd9c9"
                    : "transparent",
              }}
            >
              My Tasks
            </button>

            <button
              onClick={() => setActiveTab("house")}
              className={`flex-1 py-3 rounded-2xl transition-all duration-200 ${
                activeTab === "house"
                  ? "text-text"
                  : "text-text-light"
              }`}
              style={{
                backgroundColor:
                  activeTab === "house"
                    ? "#ffd9c9"
                    : "transparent",
              }}
            >
              House Tasks
            </button>
          </div>
        </div>

        <div
          className="flex-1 p-6 overflow-y-auto space-y-3"
          style={{ backgroundColor: "#fff0e8" }}
        >
          {activeTab === "my" ? (
            myTasks.length === 0 ? (
              <p className="text-text-light text-center">
                You have no tasks assigned yet.
              </p>
            ) : (
              myTasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className="w-full rounded-3xl p-4 flex items-center gap-4 transition-all duration-200 active:scale-98"
                  style={{
                    backgroundColor: "#ffd9c9",
                    border: "3px solid #e88560",
                    boxShadow: "var(--shadow-soft)",
                  }}
                >
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: task.completed
                        ? "#e88560"
                        : "white",
                      border: "2px solid #e88560",
                    }}
                  >
                    {task.completed && (
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    className={`text-text flex-1 text-left ${
                      task.completed ? "line-through" : ""
                    }`}
                  >
                    {task.title}
                  </span>
                </button>
              ))
            )
          ) : houseTasks.length === 0 ? (
            <p className="text-text-light text-center">
              No other house tasks right now.
            </p>
          ) : (
            houseTasks.map((task) => {
              const member = activeHouse.members.find(
                (m) => m.id === task.assignedTo,
              );
              return (
                <button
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className="w-full rounded-3xl p-4 flex items-center gap-4 transition-all duration-200 active:scale-98"
                  style={{
                    backgroundColor: "#ffd9c9",
                    border: "3px solid #e88560",
                    boxShadow: "var(--shadow-soft)",
                  }}
                >
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: task.completed
                        ? "#e88560"
                        : "white",
                      border: "2px solid #e88560",
                    }}
                  >
                    {task.completed && (
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>

                  <span
                    className={`text-text flex-1 text-left ${
                      task.completed ? "line-through" : ""
                    }`}
                  >
                    {task.title}
                  </span>

                  <span className="text-text-light">
                    {member?.name ?? "Unassigned"}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>

      <BottomNav />
    </MobileContainer>
  );
}