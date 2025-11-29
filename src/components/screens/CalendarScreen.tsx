import { useState } from "react";
import { useNavigate } from "react-router";
import { MobileContainer } from "../MobileContainer";
import { BottomNav } from "../BottomNav";
import {
  ArrowLeft,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useHouseMate } from "../../state/houseMateContext";

export function CalendarScreen() {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [error, setError] = useState("");

  const { activeHouse, activeMember, addEvent } = useHouseMate();

  if (!activeHouse || !activeMember) {
    return (
      <MobileContainer>
        <div
          className="h-full flex flex-col items-center justify-center gap-4 px-8 text-center"
          style={{ backgroundColor: "#ffd9e8" }}
        >
          <p className="text-text">
            Create or join a house to plan events together.
          </p>
          <button
            onClick={() => navigate("/create-house")}
            className="px-6 py-3 rounded-2xl text-white"
            style={{ backgroundColor: "#d97aa0" }}
          >
            Create a House
          </button>
        </div>
      </MobileContainer>
    );
  }

  const to12Hour = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;
    return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } =
    getDaysInMonth(currentMonth);

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() - 1,
      ),
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
      ),
    );
  };

  const handleDateClick = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDate(dateStr);
    setShowDateModal(true);
  };

  const getEventsForDate = (dateStr: string) =>
    activeHouse.events.filter((event) => event.date === dateStr);

  const handleAddEvent = () => {
    if (!eventName.trim() || !eventDate || !startTime || !endTime) {
      setError("Fill out every field.");
      return;
    }

    try {
      addEvent({
        name: eventName,
        date: eventDate,
        startTime,
        endTime,
      });

      setEventName("");
      setEventDate("");
      setStartTime("");
      setEndTime("");
      setError("");
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding event:", error);
      setError("Failed to add event. Please try again.");
    }
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Sort upcoming tasks
  const upcomingEvents = [...activeHouse.events].sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date);
    if (dateCompare !== 0) return dateCompare;
    return a.startTime.localeCompare(b.startTime);
  });

  return (
    <MobileContainer>
      <div className="h-full flex flex-col pb-20">
        {/* Header */}
        <div
          className="p-6 pb-4"
          style={{ backgroundColor: "#ffd9e8" }}
        >
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => navigate(-1)}>
              <ArrowLeft className="w-7 h-7 text-text" />
            </button>
            <h2 style={{ color: "#d97aa0" }}>Calendar</h2>
            <button onClick={() => setShowAddModal(true)}>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: "#d97aa0" }}
              >
                <Plus className="w-5 h-5" />
              </div>
            </button>
          </div>
        </div>

        {/* Calendar */}
        <div
          className="flex-1 p-6 overflow-y-auto"
          style={{ backgroundColor: "#fff0f6" }}
        >
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={handlePrevMonth} className="p-2">
              <ChevronLeft
                className="w-6 h-6"
                style={{ color: "#d97aa0" }}
              />
            </button>
            <h3 className="text-text">
              {monthNames[currentMonth.getMonth()]}{" "}
              {currentMonth.getFullYear()}
            </h3>
            <button onClick={handleNextMonth} className="p-2">
              <ChevronRight
                className="w-6 h-6"
                style={{ color: "#d97aa0" }}
              />
            </button>
          </div>

          {/* Day Labels */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {["S", "M", "T", "W", "T", "F", "S"].map(
              (day, i) => (
                <div
                  key={i}
                  className="text-center text-text-light"
                >
                  {day}
                </div>
              ),
            )}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-3 mb-8">
            {Array.from({ length: startingDayOfWeek }).map(
              (_, i) => (
                <div key={`empty-${i}`} />
              ),
            )}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const hasEvents =
                getEventsForDate(dateStr).length > 0;

              return (
                <button
                  key={day}
                  onClick={() => handleDateClick(day)}
                  className="aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all duration-200 active:scale-95"
                  style={{
                    backgroundColor: hasEvents
                      ? "#d97aa0"
                      : "#ffd9e8",
                    color: hasEvents ? "#fff" : "#000",
                    fontSize: "1.125rem",
                    boxShadow: "var(--shadow-soft)",
                  }}
                >
                  <span>{day}</span>
                  {hasEvents && (
                    <div className="absolute bottom-0 translate-y-1 w-2 h-2 rounded-full bg-white" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Upcoming Tasks Section */}
          <h3 className="text-text mb-3 text-lg font-semibold">
            Upcoming Tasks
          </h3>

          {/* Spacer to force space before buttons */}
          <div style={{ height: "20px" }}></div>

          <div className="space-y-4">
                {upcomingEvents.map((ev) => {
                  const owner = activeHouse.members.find(
                    (member) => member.id === ev.createdBy,
                  );
                  return (
              <div
                key={ev.id}
                className="rounded-2xl p-4 flex items-center gap-4"
                style={{
                  backgroundColor: "#ffd9e8",
                  boxShadow: "var(--shadow-soft)",
                }}
              >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-xl text-white"
                      style={{ backgroundColor: "#d97aa0" }}
                    >
                      {owner?.name.charAt(0).toUpperCase() ?? "?"}
                    </div>

                <div className="flex-1">
                  <div className="font-semibold text-text">
                    {ev.name}
                  </div>
                  <div className="text-text font-medium">
                        {owner?.name ?? "HouseMate"}
                  </div>
                  <div className="mt-1 text-text-light text-sm">
                    {new Date(ev.date).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric" },
                    )}
                    {" • "}
                    {to12Hour(ev.startTime)} –{" "}
                    {to12Hour(ev.endTime)}
                  </div>
                </div>
              </div>
                  );
                })}
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddModal && activeHouse && activeMember && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-8 z-50">
          <div
            className="bg-white rounded-3xl p-6 w-full max-w-sm"
            style={{ boxShadow: "var(--shadow-large)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ color: "#d97aa0" }}>Add Event</h3>
              <button onClick={() => setShowAddModal(false)}>
                <X className="w-6 h-6 text-text-light" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-text-light mb-2 block">
                  Event Name
                </label>
                {/* Spacer to force space before buttons */}
                <div style={{ height: "5px" }}></div>
                <input
                  type="text"
                  placeholder="e.g., House Meeting"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full rounded-2xl px-4 py-3 text-text placeholder:text-text-light/50"
                  style={{
                    backgroundColor: "#f0f0f0", // MATCH Grocery modal
                    border: "none",
                  }}
                />
              </div>

              <div>
                <label className="text-text-light mb-2 block">
                  Date
                </label>
                {/* Spacer to force space before buttons */}
                <div style={{ height: "5px" }}></div>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full rounded-2xl px-4 py-3 text-text"
                  style={{
                    backgroundColor: "#f0f0f0", // MATCH Grocery modal
                    border: "none",
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-text-light mb-2 block">
                    Start Time
                  </label>
                  {/* Spacer to force space before buttons */}
                  <div style={{ height: "5px" }}></div>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) =>
                      setStartTime(e.target.value)
                    }
                    className="w-full rounded-2xl px-4 py-3 text-text"
                    style={{
                      backgroundColor: "#f0f0f0", // MATCH Grocery modal
                      border: "none",
                    }}
                  />
                </div>
                <div>
                  <label className="text-text-light mb-2 block">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full rounded-2xl px-4 py-3 text-text"
                    style={{
                      backgroundColor: "#f0f0f0", // MATCH Grocery modal
                      border: "none",
                    }}
                  />
                </div>
              </div>
            </div>
            {/* Spacer to force space before buttons */}
            <div style={{ height: "20px" }}></div>
            {error && (
              <p className="text-red-600 text-center mb-2">{error}</p>
            )}
            <button
              onClick={handleAddEvent}
              className="w-full mt-6 py-3 rounded-2xl text-white transition-all duration-200 active:scale-95"
              style={{ backgroundColor: "#d97aa0" }}
            >
              Add Event
            </button>
          </div>
        </div>
      )}

      {/* Date Events Modal */}
      {showDateModal && selectedDate && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-8">
          <div
            className="bg-white rounded-3xl p-6 w-full max-w-sm"
            style={{ boxShadow: "var(--shadow-large)" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 style={{ color: "#d97aa0" }}>
                {new Date(selectedDate).toLocaleDateString(
                  "en-US",
                  { month: "long", day: "numeric" },
                )}
              </h3>
              <button onClick={() => setShowDateModal(false)}>
                <X className="w-6 h-6 text-text-light" />
              </button>
            </div>

            <div className="space-y-4">
              {getEventsForDate(selectedDate).length === 0 ? (
                <p className="text-text-light text-center py-4">
                  No events scheduled
                </p>
              ) : (
                getEventsForDate(selectedDate).map((event) => {
                  const owner = activeHouse.members.find(
                    (member) => member.id === event.createdBy,
                  );
                  return (
                  <div
                    key={event.id}
                    className="rounded-2xl p-4"
                    style={{
                      backgroundColor: "#ffd9e8",
                      boxShadow: "var(--shadow-soft)",
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xl text-white"
                        style={{ backgroundColor: "#d97aa0" }}
                      >
                        {owner?.name.charAt(0).toUpperCase() ?? "?"}
                      </div>
                      <div>
                        <h4 className="font-semibold text-text">
                          {event.name}
                        </h4>
                        <p className="text-text-light text-sm">
                          {owner?.name ?? "HouseMate"}
                        </p>
                      </div>
                    </div>

                    <div className="text-text-light text-sm">
                      <span className="font-medium text-text">
                        {to12Hour(event.startTime)}
                      </span>
                      <span className="mx-1">–</span>
                      <span className="font-medium text-text">
                        {to12Hour(event.endTime)}
                      </span>
                    </div>
                  </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </MobileContainer>
  );
}