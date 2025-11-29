import { useNavigate } from "react-router";
import { MobileContainer } from "../MobileContainer";
import { BottomNav } from "../BottomNav";
import { ArrowLeft, Copy, Share2 } from "lucide-react";
import { useHouseMate } from "../../state/houseMateContext";

export function HouseCodeScreen() {
  const navigate = useNavigate();
  const { activeHouse } = useHouseMate();

  if (!activeHouse) {
    return (
      <MobileContainer>
        <div
          className="h-full flex flex-col items-center justify-center gap-4 px-8 text-center"
          style={{ backgroundColor: "#ffd9c9" }}
        >
          <p className="text-text">
            Create or join a house to get a unique invite code.
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

  const handleCopy = () => {
    navigator.clipboard.writeText(activeHouse.code);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Join my house on Housemates",
        text: `Use code ${activeHouse.code} to join ${activeHouse.name}!`,
      });
    }
  };

  return (
    <MobileContainer>
      <div className="h-full flex flex-col pb-20">
        {/* Header */}
        <div
          className="p-6 pb-4"
          style={{ backgroundColor: "#ffd9c9" }}
        >
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => navigate(-1)}>
              <ArrowLeft className="w-7 h-7 text-text" />
            </button>
            <h2 style={{ color: "#e88560" }}>House Code</h2>
            <div className="w-6"></div>
          </div>
        </div>

        {/* Content */}
        <div
          className="flex-1 px-6 pb-8 flex flex-col items-center justify-center"
          style={{ backgroundColor: "#fff0e8" }}
        >
          <p className="text-text-light text-center mb-12 max-w-xs px-4">
            Invite NEW HouseMates by sharing the code below!
            Please do not share w/ strangers.
          </p>

          {/* Spacer to force space before buttons */}
          <div style={{ height: "30px" }}></div>

          <div
            className="w-full rounded-3xl p-10 mb-6"
            style={{
              backgroundColor: "#ffd9c9",
              boxShadow: "var(--shadow-soft)",
            }}
          >
            <div className="text-center mb-8">
              <span
                className="tracking-widest"
                style={{ fontSize: "3.5rem", color: "#e88560" }}
              >
                {activeHouse.code}
              </span>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleCopy}
                className="flex-1 py-4 rounded-2xl text-white flex items-center justify-center gap-2 transition-all duration-200 active:scale-95"
                style={{
                  backgroundColor: "#e88560",
                  boxShadow: "var(--shadow-soft)",
                }}
              >
                <Copy className="w-5 h-5" />
                <span>Copy</span>
              </button>

              <button
                onClick={handleShare}
                className="flex-1 py-4 rounded-2xl text-white flex items-center justify-center gap-2 transition-all duration-200 active:scale-95"
                style={{
                  backgroundColor: "#e88560",
                  boxShadow: "var(--shadow-soft)",
                }}
              >
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </MobileContainer>
  );
}