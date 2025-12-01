import { useState } from "react";
import { useNavigate } from "react-router";
import { MobileContainer } from "../MobileContainer";
import { BottomNav } from "../BottomNav";
import {
  ArrowLeft,
  Plus,
  X as XIcon,
  Shield,
  Trash2,
} from "lucide-react";
import { useHouseMate } from "../../state/houseMateContext";

const colorPairs = [
  { light: "#fff5cc", dark: "#d4b938" },
  { light: "#d4e3d0", dark: "#7a9b6f" },
  { light: "#ffd9c9", dark: "#e88560" },
  { light: "#e9dff8", dark: "#403361" },
  { light: "#ffd9e8", dark: "#d97aa0" },
  { light: "#d4e8f0", dark: "#4a6b7c" },
];

export function BulletinBoardScreen() {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newNote, setNewNote] = useState("");
  const { activeHouse, addNote, removeNote } = useHouseMate();

  if (!activeHouse) {
    return (
      <MobileContainer>
        <div
          className="h-full flex flex-col items-center justify-center gap-4 px-8 text-center"
          style={{ backgroundColor: "#fff5cc" }}
        >
          <p className="text-text">
            Create or join a house to post on the bulletin board.
          </p>
          <button
            onClick={() => navigate("/create-house")}
            className="px-6 py-3 rounded-2xl text-white"
            style={{ backgroundColor: "#d4b938" }}
          >
            Create a House
          </button>
        </div>
      </MobileContainer>
    );
  }

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    addNote(newNote);
    setNewNote("");
    setShowAddModal(false);
  };

  return (
    <MobileContainer>
      <div className="h-full flex flex-col pb-20">
        {/* Header */}
        <div
          className="p-6 pb-4"
          style={{ backgroundColor: "#fff5cc" }}
        >
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => navigate(-1)}>
              <ArrowLeft className="w-7 h-7 text-text" />
            </button>
            <h2 style={{ color: "#d4b938" }}>Bulletin Board</h2>
            <button onClick={() => setShowAddModal(true)}>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: "#d4b938" }}
              >
                <Plus className="w-5 h-5" />
              </div>
            </button>
          </div>

          <div className="bg-white/60 rounded-2xl px-4 py-2 flex items-center gap-2">
            <Shield
              className="w-4 h-4"
              style={{ color: "#d4b938" }}
            />
            <p className="text-text-light">
              Anonymous & Safe Space
            </p>
          </div>
        </div>

        {/* Notes Grid */}
        <div
          className="flex-1 p-6 overflow-y-auto"
          style={{ backgroundColor: "#fffdf0" }}
        >
          <div className="grid grid-cols-2 gap-4">

            {activeHouse.notes.map((note, index) => {
              const colors = colorPairs[index % colorPairs.length];
              const rotation = ((index * 3) % 5) - 2;
              return (
              <div
                key={note.id}
                className="rounded-2xl p-4 relative flex flex-col break-words"
                style={{
                  backgroundColor: colors.light,
                  boxShadow: "var(--shadow-soft)",
                  transform: `rotate(${rotation}deg)`,
                  border: `3px solid ${colors.dark}`,
                }}
              >
                {/* Pushpin */}
                <div
                  className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.dark }}
                >
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>

                {/* Note Text */}
                <p className="text-text pt-2 mb-4 break-words">
                  {note.text}
                </p>

                <div style={{ height: "10px" }}></div>

                {/* 🗑️ Trash Button Under Text */}
                <div className="flex justify-center mt-auto">
                  <button
                    onClick={() => removeNote(note.id)}
                    className="p-3 rounded-full bg-black/10 hover:bg-black/20 
                               transition-all active:scale-90"
                  >
                    <Trash2 className="w-6 h-6 text-black" />
                  </button>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Note Modal */}
      {showAddModal && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div
            className="bg-surface rounded-3xl p-6 w-full max-w-sm"
            style={{ boxShadow: "var(--shadow-large)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ color: "#d4b938" }}>Add Note</h3>
              <button onClick={() => setShowAddModal(false)}>
                <XIcon className="w-6 h-6 text-text-light" />
              </button>
            </div>

            <textarea
              placeholder="Write your note here..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="w-full rounded-2xl px-4 py-3 text-text placeholder:text-text-light/50 min-h-[120px] resize-none mb-4 break-words"
              style={{
                backgroundColor: "#f0f0f0",
                wordBreak: "break-word",
                overflowWrap: "break-word",
              }}
              autoFocus
            />

            <div style={{ height: "20px" }}></div>

            <button
              onClick={handleAddNote}
              className="w-full py-3 rounded-2xl text-white transition-all duration-200 active:scale-95"
              style={{ backgroundColor: "#d4b938" }}
            >
              Post Note
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </MobileContainer>
  );
}