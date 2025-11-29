import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { MobileContainer } from "../MobileContainer";
import { BottomNav } from "../BottomNav";
import { ArrowLeft } from "lucide-react";

export function AvatarSelectionScreen() {
  const navigate = useNavigate();

  // Load saved avatar from localStorage or fallback to the fox
  const [selectedAvatar, setSelectedAvatar] = useState(
    localStorage.getItem("myAvatar") || "🦊",
  );

  // Manage housemates here too
  const [housemates, setHousemates] = useState([
    {
      name: "Mila",
      avatar: localStorage.getItem("myAvatar") || "🦊",
    }, // YOU
    { name: "Roy", avatar: "🐻" },
    { name: "Ella", avatar: "🐰" },
    { name: "Cindy", avatar: "🐨" },
  ]);

  const takenAvatars = housemates.map((m) => m.avatar);

  const avatars = [
    "🦁",
    "🐯",
    "🐸",
    "🐷",
    "🐮",
    "🐵",
    "🐔",
    "🐧",
    "🦉",
    "🦄",
    "🐙",
    "🐱",
    "🐶",
    "🐭",
    "🐹",
    "🦓",
    "🦒",
  ].filter(
    (a) => !takenAvatars.includes(a) || a === selectedAvatar,
  );

  // Reinsert your avatar into the list when switching so you can pick another
  useEffect(() => {
    setHousemates((prev) =>
      prev.map((mate, i) =>
        i === 0 ? { ...mate, avatar: selectedAvatar } : mate,
      ),
    );
  }, [selectedAvatar]);

  // Save avatar + persist to localStorage
  const saveAvatar = () => {
    localStorage.setItem("myAvatar", selectedAvatar);
    navigate(-1);
  };

  return (
    <MobileContainer>
      <div className="h-full flex flex-col pb-20">
        {/* HEADER */}
        <div
          className="p-6 pb-4"
          style={{ backgroundColor: "#e9dff8" }}
        >
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => navigate(-1)}>
              <ArrowLeft className="w-7 h-7 text-text" />
            </button>
            <h2 style={{ color: "#403361" }}>Choose Avatar</h2>
            <div className="w-6"></div>
          </div>

          <p className="text-text-light text-center">
            Select an avatar for your character!
          </p>
        </div>

        {/* PREVIEW */}
        <div
          className="flex items-center justify-center py-6"
          style={{ backgroundColor: "#e9dff8" }}
        >
          <div
            className="w-28 h-28 rounded-3xl flex items-center justify-center transition-all duration-300"
            style={{
              backgroundColor: "#403361",
              boxShadow: "var(--shadow-medium)",
              fontSize: "3.5rem",
              transform: "scale(1.05)",
            }}
          >
            {selectedAvatar}
          </div>
        </div>

        {/* CONTENT */}
        <div
          className="flex-1 p-6 overflow-y-auto"
          style={{ backgroundColor: "#f5f0fc" }}
        >
          {/* HOUSEMATES */}
          <div className="mb-4">
            <p className="text-text-light mb-3">
              Your Housemates
            </p>

            {/* Spacer to force space before buttons */}
            <div style={{ height: "20px" }}></div>

            <div className="flex gap-4 justify-center flex-wrap">
              {housemates.map((mate, index) => (
                <div
                  key={mate.name}
                  className="flex flex-col items-center gap-2 relative"
                >
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center relative"
                    style={{
                      backgroundColor: "#403361",
                      boxShadow: "var(--shadow-soft)",
                      fontSize: "2.5rem",
                    }}
                  >
                    {mate.avatar}

                    {/* CLEAN “ME” BADGE */}
                    {index === 0 && (
                      <div
                        className="absolute -top-1 -right-1 rounded-full w-9 h-7 flex items-center justify-center bg-white"
                        style={{
                          border: "2px solid #403361",
                          boxShadow: "var(--shadow-soft)",
                        }}
                      >
                        <span
                          className="text-[0.4rem] font-semibold"
                          style={{ color: "#403361" }}
                        >
                          Me
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-text-light">
                    {mate.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* DIVIDER */}
          <div
            className="h-px my-4"
            style={{ backgroundColor: "#403361" }}
          ></div>

          {/* AVAILABLE AVATARS */}
          <div>
            <p className="text-text-light mb-3">
              Available Avatars
            </p>

            {/* Spacer to force space before buttons */}
            <div style={{ height: "20px" }}></div>

            <div className="grid grid-cols-4 gap-4">
              {avatars.map((avatar) => {
                const isSelected = selectedAvatar === avatar;

                return (
                  <button
                    key={avatar}
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`
                      aspect-square rounded-2xl flex items-center justify-center 
                      transition-all duration-200 active:scale-95 
                      ${isSelected ? "scale-110 ring-4" : "opacity-90 hover:opacity-100"}
                    `}
                    style={{
                      backgroundColor: isSelected
                        ? "#403361"
                        : "#e9dff8",
                      ringColor: "#403361",
                      boxShadow: "var(--shadow-soft)",
                      fontSize: "2.2rem",
                      transition:
                        "transform 0.25s ease, background-color 0.25s ease",
                    }}
                  >
                    {avatar}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SAVE BUTTON */}
          <button
            onClick={saveAvatar}
            className="w-full mt-8 py-4 rounded-3xl text-white transition-all duration-200 active:scale-95"
            style={{
              backgroundColor: "#403361",
              boxShadow: "var(--shadow-medium)",
            }}
          >
            Save Avatar
          </button>
        </div>
      </div>

      <BottomNav />
    </MobileContainer>
  );
}