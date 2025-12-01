import { useNavigate } from "react-router";
import { MobileContainer } from "../MobileContainer";
import { BottomNav } from "../BottomNav";
import {
  ShoppingCart,
  DollarSign,
  Calendar,
  MessageSquare,
  User,
  KeyRound,
  Bell,
  Settings,
} from "lucide-react";
import { useHouseMate } from "../../state/houseMateContext";

const features = [
  {
    icon: ShoppingCart,
    label: "Grocery List",
    path: "/grocery",
    lightColor: "#d4e3d0",
    darkColor: "#7a9b6f",
  },
  {
    icon: DollarSign,
    label: "Bill Splitter",
    path: "/bills",
    lightColor: "#d4e8f0",
    darkColor: "#4a6b7c",
  },
  {
    icon: Calendar,
    label: "Calendar",
    path: "/calendar",
    lightColor: "#ffd9e8",
    darkColor: "#d97aa0",
  },
  {
    icon: MessageSquare,
    label: "Bulletin Board",
    path: "/bulletin",
    lightColor: "#fff5cc",
    darkColor: "#d4b938",
  },
  {
    icon: User,
    label: "Profile",
    path: "/profile",
    lightColor: "#e9dff8",
    darkColor: "#403361",
  },
  {
    icon: KeyRound,
    label: "House Code",
    path: "/house-code",
    lightColor: "#ffd9c9",
    darkColor: "#e88560",
  },
];

export function DashboardScreen() {
  const navigate = useNavigate();
  const { activeHouse, activeMember } = useHouseMate();

  if (!activeHouse || !activeMember) {
    return (
      <MobileContainer>
        <div
          className="h-full flex flex-col items-center justify-center gap-6 px-8 text-center"
          style={{ backgroundColor: "#e9dff8" }}
        >
          <h2 style={{ color: "#403361" }}>
            Welcome to HouseMates!
          </h2>
          <p className="text-text">
            Create a house or join one with a code to start organizing
            groceries, bills, chores, and more.
          </p>
          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={() => navigate("/create-house")}
              className="w-full py-4 rounded-3xl text-white"
              style={{ backgroundColor: "#403361" }}
            >
              Create a House
            </button>
            <button
              onClick={() => navigate("/join-house")}
              className="w-full py-4 rounded-3xl text-text"
              style={{
                backgroundColor: "#ffffff",
                border: "2px solid #403361",
              }}
            >
              Join with Code
            </button>
          </div>
        </div>
      </MobileContainer>
    );
  }

  const totalHousemates = activeHouse.members.length;
  const activeHousemates = activeHouse.members.slice(0, 4);
  const openTasks = activeHouse.tasks.filter((task) => !task.completed);
  const myTasks = openTasks.filter(
    (task) => task.assignedTo === activeMember.id,
  );
  const groceriesToBuy = activeHouse.groceries.filter((item) => !item.checked);
  const unpaidBills = activeHouse.bills.length;

  return (
    <MobileContainer>
      <div className="h-full flex flex-col pb-20 overflow-y-auto">
        <div
          className="p-6"
          style={{ backgroundColor: "#e9dff8" }}
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 style={{ color: "#403361" }}>
                Welcome, {activeMember.name}
              </h2>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate("/notifications")}
                className="relative"
              >
                <div
                  className="w-11 h-11 rounded-full bg-surface flex items-center justify-center"
                  style={{
                    boxShadow: "var(--shadow-soft)",
                    backgroundColor: "#403361",
                  }}
                >
                  <Bell className="w-5 h-5 text-white" />
                </div>
              </button>

              <button onClick={() => navigate("/settings")}>
                <div
                  className="w-11 h-11 rounded-full bg-surface flex items-center justify-center"
                  style={{
                    boxShadow: "var(--shadow-soft)",
                    backgroundColor: "#403361",
                  }}
                >
                  <Settings className="w-5 h-5 text-white" />
                </div>
              </button>
            </div>
          </div>

          <div
            className="rounded-3xl p-4"
            style={{
              backgroundColor: "#ffffff",
              boxShadow: "var(--shadow-soft)",
            }}
          >
            {/* House name + Share Code aligned correctly */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-text-light text-sm">{activeHouse.name}</p>

              <button
                onClick={() => navigate("/house-code")}
                className="flex items-center gap-2 text-sm font-semibold text-text"
              >
                <KeyRound className="w-4 h-4" />
                Share code
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl p-3" style={{ backgroundColor: "#f5f0fc" }}>
                <p className="text-text-light text-xs">My Tasks</p>
                <p className="text-text text-lg font-semibold">
                  {myTasks.length} open
                </p>
              </div>
              <div className="rounded-2xl p-3" style={{ backgroundColor: "#f0f7ed" }}>
                <p className="text-text-light text-xs">Groceries</p>
                <p className="text-text text-lg font-semibold">
                  {groceriesToBuy.length} needed
                </p>
              </div>
              <div className="rounded-2xl p-3" style={{ backgroundColor: "#d4e8f0" }}>
                <p className="text-text-light text-xs">Bills</p>
                <p className="text-text text-lg font-semibold">
                  {unpaidBills} to pay
                </p>
              </div>
              <div className="rounded-2xl p-3" style={{ backgroundColor: "#fff5cc" }}>
                <p className="text-text-light text-xs">House Tasks</p>
                <p className="text-text text-lg font-semibold">
                  {openTasks.length} open
                </p>
              </div>
            </div>
          </div>

          <div
            className="rounded-3xl p-4 mt-6"
            style={{
              backgroundColor: "#ffffff",
              boxShadow: "var(--shadow-soft)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-text-light font-extrabold text-center">
                Housemates ({totalHousemates})
              </p>
            </div>
            <div className="flex gap-5 flex-wrap">
              {activeHousemates.length === 0 && (
                <p className="text-text-light text-sm">
                  Invite friends with your house code.
                </p>
              )}
              {activeHousemates.map((mate) => (
                <div
                  key={mate.id}
                  className="flex flex-col items-center gap-3"
                >
                  <div
                    className="w-18 h-18 rounded-full flex items-center justify-center text-white text-2xl"
                    style={{
                      width: "72px",
                      height: "72px",
                      backgroundColor: "#403361",
                      boxShadow: "var(--shadow-soft)",
                    }}
                  >
                    {mate.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-text-light">
                    {mate.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="flex-1 p-6"
          style={{ backgroundColor: "#f5f0fc" }}
        >
          <h3 className="text-text mb-4 text-center">
            Quick Actions
          </h3>

          <div style={{ height: "30px" }}></div>

          <div className="grid grid-cols-2 gap-4">
            {features.map((feature) => (
              <button
                key={feature.label}
                onClick={() => navigate(feature.path)}
                className="rounded-3xl p-6 flex flex-col items-center gap-3 text-text transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: feature.lightColor,
                  boxShadow: "var(--shadow-soft)",
                }}
              >
                <feature.icon
                  className="w-8 h-8"
                  style={{ color: feature.darkColor }}
                />
                <span className="text-center">
                  {feature.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </MobileContainer>
  );
}
