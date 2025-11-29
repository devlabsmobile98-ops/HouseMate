import { useState } from "react";
import { useNavigate } from "react-router";
import { MobileContainer } from "../MobileContainer";
import { ArrowLeft, X, Copy } from "lucide-react";
import { useHouseMate } from "../../state/houseMateContext";

export function CreateHouseScreen() {
  const navigate = useNavigate();
  const { createHouse } = useHouseMate();
  const [houseName, setHouseName] = useState("");
  const [userName, setUserName] = useState("");
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!houseName.trim()) {
      setError("Please name your house.");
      return;
    }

    if (!userName.trim()) {
      setError("Please enter your name.");
      return;
    }

    try {
      setIsSubmitting(true);
      const { code } = await createHouse({
        houseName,
        userName,
      });
      setGeneratedCode(code);
      setShowCodeModal(true);
    } catch {
      setError("We could not create your house. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinue = () => {
    setShowCodeModal(false);
    navigate("/dashboard");
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

        <form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col items-center px-8 pt-4 w-full"
        >
          <h2
            className="text-center mb-16"
            style={{ color: "#403361" }}
          >
            Create a House
          </h2>
          {/* Spacer to force space before buttons */}
<div style={{ height: "20px" }}></div>

          <div className="w-full space-y-6">
            <div>
              <label className="text-text mb-2 block">
                House Name
              </label>
              {/* Spacer to force space before buttons */}
<div style={{ height: "5px" }}></div>
              <input
                type="text"
                placeholder="e.g., Maple Street"
                value={houseName}
                onChange={(e) => setHouseName(e.target.value)}
                className="w-full bg-white rounded-2xl px-4 py-3 text-text"
                style={{ border: "2px solid #403361" }}
              />
            </div>

            <div>
              <label className="text-text mb-2 block">
                Your Name
              </label>
              {/* Spacer to force space before buttons */}
<div style={{ height: "5px" }}></div>
              <input
                type="text"
                placeholder="e.g., Mila"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-white rounded-2xl px-4 py-3 text-text"
                style={{ border: "2px solid #403361" }}
              />
            </div>

            {error && (
              <p className="text-red-600 font-semibold text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-4 rounded-3xl text-white transition-all duration-200 active:scale-95 disabled:opacity-50"
              style={{
                backgroundColor: "#403361",
                boxShadow: "var(--shadow-medium)",
              }}
              disabled={
                !houseName.trim() || !userName.trim() || isSubmitting
              }
            >
              {isSubmitting ? "Creating..." : "Create House"}
            </button>
          </div>
        </form>
      </div>

      {/* Code Generated Modal */}
      {showCodeModal && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-8">
          <div
            className="bg-white rounded-3xl p-6 w-full max-w-sm"
            style={{ boxShadow: "var(--shadow-large)" }}
          >
            <div className="flex justify-end mb-2">
              <button onClick={() => setShowCodeModal(false)}>
                <X className="w-6 h-6 text-text-light" />
              </button>
            </div>

              <h3 className="mb-2 text-center" style={{ color: "#403361" }}>
                House ready!
              </h3>
              {/* Spacer to force space before buttons */}
<div style={{ height: "10px" }}></div>
              <p className="text-center text-text-light mb-6">
                Share this code with your housemates so they can join.
              </p>
              {/* Spacer to force space before buttons */}
<div style={{ height: "20px" }}></div>
            <div
              className="rounded-3xl p-6 mb-6 text-center"
              style={{ border: "3px solid #403361" }}
            >
              <p className="text-text-light mb-4">
                Your Unique Code
              </p>

              <div className="flex items-center justify-center gap-3">
                <span
                  className="tracking-widest"
                  style={{ color: "#403361", fontSize: "2rem" }}
                >
                  {generatedCode}
                </span>

                <button
                  onClick={handleCopy}
                  className="p-2 rounded-lg transition-all duration-200 active:scale-95"
                  style={{ backgroundColor: "#e9dff8" }}
                >
                  <Copy
                    className="w-5 h-5"
                    style={{ color: "#403361" }}
                  />
                </button>
              </div>
            </div>

            <button
              onClick={handleContinue}
              className="w-full py-4 rounded-3xl text-white transition-all duration-200 active:scale-95"
              style={{
                backgroundColor: "#403361",
                boxShadow: "var(--shadow-medium)",
              }}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </MobileContainer>
  );
}