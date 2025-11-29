import { useState } from "react";
import { useNavigate } from "react-router";
import { MobileContainer } from "../MobileContainer";
import { BottomNav } from "../BottomNav";
import { ArrowLeft, Plus, X, Check } from "lucide-react";
import { useHouseMate } from "../../state/houseMateContext";

export function GroceryListScreen() {
  const navigate = useNavigate();
  const { activeHouse, addGroceryItem, toggleGroceryItem } =
    useHouseMate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState("");
  const [error, setError] = useState("");

  if (!activeHouse) {
    return (
      <MobileContainer>
        <div
          className="h-full flex flex-col items-center justify-center gap-4 px-8 text-center"
          style={{ backgroundColor: "#d4e3d0" }}
        >
          <p className="text-text">
            Create or join a house to start a shared grocery list.
          </p>
          <button
            onClick={() => navigate("/create-house")}
            className="px-6 py-3 rounded-2xl text-white"
            style={{ backgroundColor: "#7a9b6f" }}
          >
            Create a House
          </button>
        </div>
      </MobileContainer>
    );
  }

  const items = activeHouse.groceries;

  const handleToggle = (id: string) => {
    toggleGroceryItem(id);
  };

  const handleAdd = () => {
    if (!newItem.trim()) {
      setError("Please enter an item.");
      return;
    }
    setError("");
    addGroceryItem(newItem);
    setNewItem("");
    setShowAddModal(false);
  };

  return (
    <MobileContainer>
      <div className="h-full flex flex-col pb-20">
        {/* Header */}
        <div
          className="p-6 pb-4"
          style={{ backgroundColor: "#d4e3d0" }}
        >
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => navigate(-1)}>
              <ArrowLeft className="w-7 h-7 text-text" />
            </button>
            <h2 style={{ color: "#7a9b6f" }}>Grocery</h2>
            <button onClick={() => setShowAddModal(true)}>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: "#7a9b6f" }}
              >
                <Plus className="w-5 h-5" />
              </div>
            </button>
          </div>
        </div>

        <div
          className="flex-1 p-6 overflow-y-auto"
          style={{ backgroundColor: "#f0f7ed" }}
        >
          {items.length === 0 ? (
            <p className="text-text-light text-center">
              No groceries yet. Add the first item!
            </p>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl p-4 flex items-center gap-3"
                  style={{
                    backgroundColor: "#d4e3d0",
                    boxShadow: "var(--shadow-soft)",
                  }}
                >
                  <button
                    onClick={() => handleToggle(item.id)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
                    style={{
                      backgroundColor: item.checked
                        ? "#7a9b6f"
                        : "transparent",
                      color: item.checked ? "white" : "#7a9b6f",
                      border: "1.5px solid #7a9b6f",
                    }}
                  >
                    {item.checked && (
                      <Check className="w-5 h-5" />
                    )}
                  </button>

                  <span
                    className={`flex-1 ${
                      item.checked
                        ? "line-through text-text-light"
                        : "text-text"
                    }`}
                    style={{ fontSize: "20px" }}
                  >
                    {item.name}
                  </span>

                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                    style={{ backgroundColor: "#7a9b6f" }}
                  >
                    {activeHouse.members.find(
                      (member) => member.id === item.addedBy,
                    )?.name
                      ?.charAt(0)
                      .toUpperCase() ?? "?"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-8">
          <div
            className="bg-white rounded-3xl p-6 w-full max-w-sm"
            style={{ boxShadow: "var(--shadow-large)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ color: "#7a9b6f" }}>Add New Item</h3>
              <button onClick={() => setShowAddModal(false)}>
                <X className="w-6 h-6 text-text-light" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Enter item name"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleAdd()
                  }
                  className="w-full rounded-2xl px-4 py-3 text-text placeholder:text-text-light/50"
                  style={{ backgroundColor: "#f0f0f0" }}
                  autoFocus
                />
                {error && (
                  <p className="text-red-600 text-sm">{error}</p>
                )}
              </div>

              <div style={{ height: "5px" }}></div>

              <button
                onClick={handleAdd}
                className="w-full py-3 rounded-2xl text-white transition-all duration-200 active:scale-95"
                style={{ backgroundColor: "#7a9b6f" }}
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </MobileContainer>
  );
}