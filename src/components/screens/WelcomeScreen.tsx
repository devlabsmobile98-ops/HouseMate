import { useNavigate } from "react-router";
import { MobileContainer } from "../MobileContainer";
import houseImage from "figma:asset/e7f9c14aa136325fd05524532b2ee803b83ce8a5.png";

export function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <MobileContainer>
      <div
        className="h-full flex flex-col items-center justify-between p-8 pt-16 pb-12"
        style={{ backgroundColor: "#CCC3E1" }}
      >
        {/* House illustration and buttons */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative mb-8">
            <img
              src={houseImage}
              alt="House"
              className="w-64 h-auto object-contain"
            />
          </div>

          <h1
            style={{ color: "#403361" }}
            className="mb-3 text-center"
          >
            HouseMates
          </h1>
          <p className="text-text text-center max-w-xs mb-20">
            Make shared living simple, friendly, and organized!
          </p>

          {/* Spacer to force space before buttons */}
          <div style={{ height: "40px" }}></div>

          {/* Action buttons */}
          <div className="w-full px-8 flex flex-col gap-4">
            <button
              onClick={() => navigate("/create-house")}
              className="w-full py-4 rounded-3xl text-white transition-all duration-200 active:scale-95"
              style={{
                backgroundColor: "#403361",
                boxShadow: "var(--shadow-medium)",
              }}
            >
              Create a House
            </button>

            <button
              onClick={() => navigate("/join-house")}
              className="w-full py-4 rounded-3xl transition-all duration-200 active:scale-95 font-extrabold"
              style={{
                backgroundColor: "#ffffff",
                color: "#6b4f8a",
                boxShadow: "var(--shadow-medium)",
                border: "2px solid #6b4f8a",
              }}
            >
              Join a House
            </button>
          </div>
        </div>

        <div className="h-8"></div>
      </div>
    </MobileContainer>
  );
}