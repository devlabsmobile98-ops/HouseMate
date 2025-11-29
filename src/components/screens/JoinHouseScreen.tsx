import { useState } from "react";
import { useNavigate } from "react-router";
import { MobileContainer } from "../MobileContainer";
import { ArrowLeft } from "lucide-react";
import { useHouseMate } from "../../state/houseMateContext";

export function JoinHouseScreen() {
  const navigate = useNavigate();
  const { joinHouse } = useHouseMate();
  const [houseCode, setHouseCode] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (houseCode.trim().length !== 6) {
      setError("House code must be 6 characters.");
      return;
    }

    if (!userName.trim()) {
      setError("Please tell us your name.");
      return;
    }

    try {
      setIsSubmitting(true);
      await joinHouse({
        code: houseCode,
        userName,
      });
      navigate("/dashboard");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to join house.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MobileContainer>
      <div
        className="h-full flex flex-col"
        style={{ backgroundColor: "#e9dff8" }}
      >
        {/* Header */}
        <div className="p-6">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-7 h-7 text-text" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center px-8 pt-4">
          {/* TITLE MATCHED TO CREATE HOUSE SPACING */}
          <h2
            className="text-center mb-16"
            style={{ color: "#403361" }}
          >
            Join a House
          </h2>

          {/* Spacer to force space before buttons */}
          <div style={{ height: "40px" }}></div>

          {/* House Icon */}
          <div
            className="w-52 h-52 rounded-full flex items-center justify-center mx-auto mb-8"
            style={{
              backgroundColor: "#403361",
              boxShadow: "var(--shadow-medium)",
            }}
          >
            <div
              className="flex items-center justify-center"
              style={{
                width: "70%",
                height: "50%",
                fontSize: "8rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: "1",
              }}
            >
              🏠
            </div>
          </div>

          {/* Spacer to force space before buttons */}
          <div style={{ height: "30px" }}></div>

          <p className="text-text text-center mb-8 max-w-xs">
            Enter the 6-digit code shared by your HouseMate:
          </p>

          {/* Spacer to force space before buttons */}
          <div style={{ height: "40px" }}></div>

          <form
            onSubmit={handleJoin}
            className="w-full space-y-6"
          >
            <input
              type="text"
              placeholder="Your Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full bg-white rounded-2xl px-4 py-4 text-text text-center tracking-widest uppercase"
              style={{
                border: "3px solid #403361",
                fontSize: "1.1rem",
              }}
            />
{/* Spacer to force space before buttons */}
<div style={{ height: "1px" }}></div>

            <input
              type="text"
              placeholder="Enter House Code"
              value={houseCode}
              onChange={(e) =>
                setHouseCode(e.target.value.toUpperCase())
              }
              maxLength={6}
              className="w-full bg-white rounded-2xl px-4 py-4 text-text text-center tracking-widest uppercase"
              style={{
                border: "3px solid #403361",
                fontSize: "1.2rem",
              }}
            />

            {error && (
              <p className="text-center text-red-600 font-semibold">
                {error}
              </p>
            )}

            {/* Spacer to force space before buttons */}
            <div style={{ height: "10px" }}></div>

            <button
              type="submit"
              disabled={
                houseCode.length !== 6 ||
                !userName.trim() ||
                isSubmitting
              }
              className="w-full py-4 rounded-3xl text-white transition-all duration-200 active:scale-95 disabled:opacity-50"
              style={{
                backgroundColor: "#403361",
                boxShadow: "var(--shadow-medium)",
              }}
            >
              {isSubmitting ? "Joining..." : "Join House"}
            </button>
          </form>
        </div>
      </div>
    </MobileContainer>
  );
}