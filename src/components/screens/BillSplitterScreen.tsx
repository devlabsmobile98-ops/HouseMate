import { useState } from "react";
import { useNavigate } from "react-router";
import { MobileContainer } from "../MobileContainer";
import { BottomNav } from "../BottomNav";
import { ArrowLeft, Plus, X } from "lucide-react";
import { useHouseMate } from "../../state/houseMateContext";

const colors = ["#0A4C8A", "#8A0F3A", "#0E7040", "#8A6A0F"];

export function BillSplitterScreen() {
  const navigate = useNavigate();
  const { activeHouse, addBill, removeBill } = useHouseMate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [billName, setBillName] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const [error, setError] = useState("");

  if (!activeHouse) {
    return (
      <MobileContainer>
        <div
          className="h-full flex flex-col items-center justify-center gap-4 px-8 text-center"
          style={{ backgroundColor: "#d4e8f0" }}
        >
          <p className="text-text">
            Create or join a house to split bills together.
          </p>
          <button
            onClick={() => navigate("/create-house")}
            className="px-6 py-3 rounded-2xl text-white"
            style={{ backgroundColor: "#4a6b7c" }}
          >
            Create a House
          </button>
        </div>
      </MobileContainer>
    );
  }

  const toggleMember = (memberId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((m) => m !== memberId)
        : [...prev, memberId],
    );
  };

  const handleAddBill = () => {
    if (!billName.trim()) {
      setError("Name your bill.");
      return;
    }
    if (!totalAmount) {
      setError("Add a total amount.");
      return;
    }

    const amount = Number(totalAmount);
    const membersToSplit =
      selectedMembers.length > 0
        ? selectedMembers
        : activeHouse.members.map((member) => member.id);

    if (membersToSplit.length === 0) {
      setError("Invite housemates first.");
      return;
    }

    setError("");
    addBill(billName, amount, membersToSplit);
    setBillName("");
    setTotalAmount("");
    setSelectedMembers([]);
    setShowMemberDropdown(false);
    setShowAddModal(false);
  };

  return (
    <MobileContainer>
      <div className="h-full flex flex-col pb-20">
        <div
          className="p-6 pb-4"
          style={{ backgroundColor: "#d4e8f0" }}
        >
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => navigate(-1)}>
              <ArrowLeft className="w-7 h-7 text-text" />
            </button>
            <h2 style={{ color: "#4a6b7c" }}>Bill Splitter</h2>
            <button onClick={() => setShowAddModal(true)}>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: "#4a6b7c" }}
              >
                <Plus className="w-5 h-5" />
              </div>
            </button>
          </div>
        </div>

        <div
          className="flex-1 p-6 overflow-y-auto space-y-4"
          style={{ backgroundColor: "#e8f4f8" }}
        >
          {activeHouse.bills.length === 0 && (
            <p className="text-text-light text-center">
              No bills yet. Add one to track what is owed.
            </p>
          )}
          {activeHouse.bills.map((bill) => (
            <div
              key={bill.id}
              className="rounded-3xl p-5 border-4"
              style={{
                backgroundColor: "#d4e8f0",
                borderColor: "#4a6b7c",
                boxShadow: "var(--shadow-soft)",
              }}
            >
              <div
                className="flex justify-between items-center mb-4 pb-3 border-b-2"
                style={{ borderColor: "#4a6b7c" }}
              >
                <h3 className="text-text">{bill.name}</h3>
                <span className="text-text">${bill.total.toFixed(2)}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {bill.splits.map((split, idx) => {
                  const member = activeHouse.members.find(
                    (m) => m.id === split.memberId,
                  );
                  return (
                    <div
                      key={`${bill.id}-${split.memberId}-${idx}`}
                      className="rounded-xl p-3 text-center text-white"
                      style={{
                        backgroundColor:
                          colors[idx % colors.length],
                      }}
                    >
                      <p className="mb-1">{member?.name ?? "Member"}</p>
                      <p>${split.amount.toFixed(2)}</p>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => removeBill(bill.id)}
                className="w-full py-2 rounded-xl text-center font-medium 
             bg-black/10 hover:bg-black/20 transition-all active:scale-95"
                style={{ color: "#000" }}
              >
                REMOVE
              </button>
            </div>
          ))}
        </div>
      </div>

      {showAddModal && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-8">
          <div
            className="bg-white rounded-3xl p-6 w-full max-w-sm"
            style={{ boxShadow: "var(--shadow-large)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ color: "#4a6b7c" }}>Add New Bill</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowMemberDropdown(false);
                }}
              >
                <X className="w-6 h-6 text-text-light" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-text-light mb-2 block">
                  Bill Name
                </label>
                <div style={{ height: "5px" }}></div>
                <input
                  type="text"
                  placeholder="Enter bill name"
                  value={billName}
                  onChange={(e) => setBillName(e.target.value)}
                  className="w-full rounded-2xl px-4 py-3 text-text placeholder:text-text-light/50"
                  style={{
                    backgroundColor: "#f0f0f0",
                    border: "none",
                  }}
                />
              </div>

              <div>
                <label className="text-text-light mb-2 block">
                  Bill Amount
                </label>
                <div style={{ height: "5px" }}></div>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={totalAmount}
                  onChange={(e) =>
                    setTotalAmount(e.target.value)
                  }
                  className="w-full rounded-2xl px-4 py-3 text-text placeholder:text-text-light/50"
                  style={{
                    backgroundColor: "#f0f0f0",
                    border: "none",
                  }}
                />
              </div>

              <div className="relative">
                <label className="text-text-light mb-2 block">
                  Split Among
                </label>
                <div style={{ height: "5px" }}></div>

                <button
                  onClick={() =>
                    setShowMemberDropdown(!showMemberDropdown)
                  }
                  className="w-full rounded-2xl px-4 py-3 text-left flex items-center justify-between"
                  style={{
                    backgroundColor: "#f0f0f0",
                    border: "none",
                  }}
                >
                  <span className="text-text">
                    {selectedMembers.length === 0
                      ? "All Members"
                      : `${selectedMembers.length} selected`}
                  </span>

                  <svg
                    className="w-4 h-4 text-text-light"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {showMemberDropdown && (
                  <div
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl p-2 border z-10"
                    style={{
                      boxShadow: "var(--shadow-medium)",
                      borderColor: "#e0e0e0",
                    }}
                  >
                    {activeHouse.members.map((mate) => (
                      <button
                        key={mate.id}
                        onClick={() => toggleMember(mate.id)}
                        className="w-full px-4 py-3 rounded-xl text-left hover:bg-gray-50 flex items-center gap-3"
                      >
                        <div
                          className="w-5 h-5 rounded flex items-center justify-center"
                          style={{
                            backgroundColor:
                              selectedMembers.includes(
                                mate.id,
                              )
                                ? "#4a6b7c"
                                : "white",
                            border: "2px solid #4a6b7c",
                          }}
                        >
                          {selectedMembers.includes(
                            mate.id,
                          ) && (
                            <svg
                              className="w-3 h-3 text-white"
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
                        <span className="text-text">
                          {mate.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div style={{ height: "20px" }}></div>

            {error && (
              <p className="text-red-600 text-center mb-2">
                {error}
              </p>
            )}

            <button
              onClick={handleAddBill}
              className="w-full mt-2 py-3 rounded-2xl text-white transition-all duration-200 active:scale-95"
              style={{ backgroundColor: "#4a6b7c" }}
            >
              Add Bill
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </MobileContainer>
  );
}