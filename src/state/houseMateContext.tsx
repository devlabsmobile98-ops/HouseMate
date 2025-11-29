import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  ReactNode,
} from "react";

type Member = {
  id: string;
  name: string;
};

type GroceryItem = {
  id: string;
  name: string;
  addedBy: string;
  checked: boolean;
  createdAt: string;
};

type Task = {
  id: string;
  title: string;
  assignedTo?: string;
  createdBy: string;
  completed: boolean;
  scope: "personal" | "house";
  createdAt: string;
};

type BillSplit = {
  memberId: string;
  amount: number;
};

type Bill = {
  id: string;
  name: string;
  total: number;
  splits: BillSplit[];
  createdAt: string;
};

type BulletinNote = {
  id: string;
  text: string;
  authorId: string;
  createdAt: string;
};

type CalendarEvent = {
  id: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  createdBy: string;
};

type ChatMessage = {
  id: string;
  memberId: string;
  text: string;
  timestamp: string;
};

type House = {
  id: string;
  name: string;
  code: string;
  members: Member[];
  groceries: GroceryItem[];
  tasks: Task[];
  bills: Bill[];
  notes: BulletinNote[];
  events: CalendarEvent[];
  messages: ChatMessage[];
  createdAt: string;
};

type HouseMateState = {
  houses: House[];
  activeHouseId?: string;
  activeMemberId?: string;
  notifications: Notification[];
};

type CreateHouseInput = {
  houseName: string;
  userName: string;
};

type JoinHouseInput = {
  code: string;
  userName: string;
};

type Notification = {
  id: string;
  type: "bill" | "grocery" | "task" | "event" | "message" | "note" | "member" | "delete";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
};

type HouseMateContextValue = {
  state: HouseMateState;
  activeHouse?: House;
  activeMember?: Member;
  notifications: Notification[];
  createHouse: (input: CreateHouseInput) => { code: string };
  joinHouse: (input: JoinHouseInput) => void;
  addGroceryItem: (name: string) => void;
  toggleGroceryItem: (id: string) => void;
  addBill: (name: string, total: number, memberIds: string[]) => void;
  removeBill: (id: string) => void;
  addTask: (title: string, assignedTo?: string, scope?: "personal" | "house") => void;
  toggleTask: (id: string) => void;
  addNote: (text: string) => void;
  removeNote: (id: string) => void;
  addEvent: (event: Omit<CalendarEvent, "id" | "createdBy">) => void;
  addMessage: (text: string) => void;
  setActiveMember: (memberId: string) => void;
  deleteMember: (memberId: string) => void;
  clearActiveHouse: () => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
};

const STORAGE_KEY = "housemate-state-v1";

const defaultState: HouseMateState = {
  houses: [],
  notifications: [],
};

type Action =
  | {
      type: "CREATE_HOUSE";
      payload: { house: House; memberId: string };
    }
  | {
      type: "SET_ACTIVE";
      payload: { houseId: string; memberId: string };
    }
  | {
      type: "CLEAR_ACTIVE";
    }
  | {
      type: "UPDATE_HOUSE";
      payload: { houseId: string; house: House };
    }
  | {
      type: "ADD_NOTIFICATION";
      payload: Notification;
    }
  | {
      type: "MARK_NOTIFICATION_READ";
      payload: string;
    }
  | {
      type: "CLEAR_ALL_NOTIFICATIONS";
    };

const HouseMateContext = createContext<HouseMateContextValue | null>(null);

const generateId = () =>
  (typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2)) as string;

const generateCode = (existingCodes: string[]) => {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";

  do {
    code = Array.from({ length: 6 })
      .map(
        () => alphabet[Math.floor(Math.random() * alphabet.length)],
      )
      .join("");
  } while (existingCodes.includes(code));

  return code;
};

const loadState = (): HouseMateState => {
  if (typeof window === "undefined") return defaultState;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    
    const parsed = JSON.parse(raw) as HouseMateState;
    // Ensure notifications array exists for backward compatibility
    return {
      ...parsed,
      notifications: parsed.notifications || [],
    };
  } catch {
    return defaultState;
  }
};

const reducer = (state: HouseMateState, action: Action): HouseMateState => {
  switch (action.type) {
    case "CREATE_HOUSE":
      return {
        ...state,
        houses: [...state.houses, action.payload.house],
        activeHouseId: action.payload.house.id,
        activeMemberId: action.payload.memberId,
      };
    case "SET_ACTIVE":
      return {
        ...state,
        activeHouseId: action.payload.houseId,
        activeMemberId: action.payload.memberId,
      };
    case "CLEAR_ACTIVE":
      return {
        ...state,
        activeHouseId: undefined,
        activeMemberId: undefined,
      };
    case "UPDATE_HOUSE":
      return {
        ...state,
        houses: state.houses.map((house) =>
          house.id === action.payload.houseId ? action.payload.house : house,
        ),
      };
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };
    case "MARK_NOTIFICATION_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, isRead: true } : n,
        ),
      };
    case "CLEAR_ALL_NOTIFICATIONS":
      return {
        ...state,
        notifications: [],
      };
    default:
      return state;
  }
};

type ProviderProps = {
  children: ReactNode;
};

export function HouseMateProvider({ children }: ProviderProps) {
  const [state, dispatch] = useReducer(reducer, defaultState, loadState);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const activeHouse = state.houses.find((h) => h.id === state.activeHouseId);
  const activeMember = activeHouse?.members.find(
    (member) => member.id === state.activeMemberId,
  );

  const updateHouse = useCallback(
    (houseId: string, updater: (house: House) => House) => {
      const currentHouse = state.houses.find((house) => house.id === houseId);
      if (!currentHouse) return;

      dispatch({
        type: "UPDATE_HOUSE",
        payload: { houseId, house: updater(currentHouse) },
      });
    },
    [state.houses],
  );

  const addNotification = useCallback(
    (notification: Omit<Notification, "id" | "timestamp" | "isRead">) => {
      dispatch({
        type: "ADD_NOTIFICATION",
        payload: {
          id: generateId(),
          ...notification,
          timestamp: new Date().toISOString(),
          isRead: false,
        },
      });
    },
    [],
  );

  const createHouse = useCallback(
    ({ houseName, userName }: CreateHouseInput) => {
      const houseId = generateId();
      const memberId = generateId();
      const code = generateCode(state.houses.map((house) => house.code));
      const timestamp = new Date().toISOString();

      const house: House = {
        id: houseId,
        name: houseName.trim(),
        code,
        members: [
          {
            id: memberId,
            name: userName.trim(),
          },
        ],
        groceries: [],
        tasks: [],
        bills: [],
        notes: [],
        events: [],
        messages: [],
        createdAt: timestamp,
      };

      dispatch({
        type: "CREATE_HOUSE",
        payload: { house, memberId },
      });

      return { code };
    },
    [state.houses],
  );

  const joinHouse = useCallback(
    ({ code, userName }: JoinHouseInput) => {
      const normalizedCode = code.trim().toUpperCase();
      const targetHouse = state.houses.find(
        (house) => house.code === normalizedCode,
      );

      if (!targetHouse) {
        throw new Error("House code not found");
      }

      const existingMember = targetHouse.members.find(
        (member) =>
          member.name.toLowerCase() === userName.trim().toLowerCase(),
      );

      if (existingMember) {
        dispatch({
          type: "SET_ACTIVE",
          payload: { houseId: targetHouse.id, memberId: existingMember.id },
        });
        return;
      }

      const memberId = generateId();
      const updatedHouse: House = {
        ...targetHouse,
        members: [
          ...targetHouse.members,
          { id: memberId, name: userName.trim() },
        ],
      };

      dispatch({
        type: "UPDATE_HOUSE",
        payload: { houseId: updatedHouse.id, house: updatedHouse },
      });

      dispatch({
        type: "SET_ACTIVE",
        payload: { houseId: updatedHouse.id, memberId },
      });

      dispatch({
        type: "ADD_NOTIFICATION",
        payload: {
          id: generateId(),
          type: "member",
          title: "New house member joined",
          message: `${userName.trim()} joined ${targetHouse.name}`,
          timestamp: new Date().toISOString(),
          isRead: false,
        },
      });
    },
    [state.houses],
  );

  const addGroceryItem = useCallback(
    (name: string) => {
      if (!activeHouse || !activeMember) return;

      updateHouse(activeHouse.id, (house) => ({
        ...house,
        groceries: [
          ...house.groceries,
          {
            id: generateId(),
            name: name.trim(),
            addedBy: activeMember.id,
            checked: false,
            createdAt: new Date().toISOString(),
          },
        ],
      }));

      addNotification({
        type: "grocery",
        title: `${activeMember.name} added a grocery item`,
        message: name.trim(),
      });
    },
    [activeHouse, activeMember, updateHouse, addNotification],
  );

  const toggleGroceryItem = useCallback(
    (id: string) => {
      if (!activeHouse || !activeMember) return;

      const item = activeHouse.groceries.find((i) => i.id === id);
      if (!item) return;

      updateHouse(activeHouse.id, (house) => ({
        ...house,
        groceries: house.groceries.map((item) =>
          item.id === id ? { ...item, checked: !item.checked } : item,
        ),
      }));

      addNotification({
        type: "grocery",
        title: `${activeMember.name} ${item.checked ? "unchecked" : "checked off"} a grocery item`,
        message: item.name,
      });
    },
    [activeHouse, activeMember, updateHouse, addNotification],
  );

  const addBill = useCallback(
    (name: string, total: number, memberIds: string[]) => {
      if (!activeHouse || !activeMember) return;
      const targets =
        memberIds.length > 0 ? memberIds : activeHouse.members.map((m) => m.id);
      const splitAmount = total / Math.max(targets.length, 1);

      updateHouse(activeHouse.id, (house) => ({
        ...house,
        bills: [
          {
            id: generateId(),
            name: name.trim(),
            total,
            splits: targets.map((memberId) => ({
              memberId,
              amount: Number(splitAmount.toFixed(2)),
            })),
            createdAt: new Date().toISOString(),
            },
          ...house.bills,
        ],
      }));

      addNotification({
        type: "bill",
        title: `${activeMember.name} added a new bill`,
        message: `${name.trim()} - $${total.toFixed(2)}`,
      });
    },
    [activeHouse, activeMember, updateHouse, addNotification],
  );

  const removeBill = useCallback(
    (id: string) => {
      if (!activeHouse || !activeMember) return;

      const bill = activeHouse.bills.find((b) => b.id === id);
      if (!bill) return;

      updateHouse(activeHouse.id, (house) => ({
        ...house,
        bills: house.bills.filter((bill) => bill.id !== id),
      }));

      addNotification({
        type: "delete",
        title: `${activeMember.name} removed a bill`,
        message: bill.name,
      });
    },
    [activeHouse, activeMember, updateHouse, addNotification],
  );

  const addTask = useCallback(
    (title: string, assignedTo?: string, scope: "personal" | "house" = "house") => {
      if (!activeHouse || !activeMember) return;

      const assignedMemberId = assignedTo?.trim() || activeMember.id;
      const assignedMember = activeHouse.members.find((m) => m.id === assignedMemberId);

      updateHouse(activeHouse.id, (house) => ({
        ...house,
        tasks: [
          {
            id: generateId(),
            title: title.trim(),
            assignedTo: assignedMemberId,
            createdBy: activeMember.id,
            completed: false,
            scope,
            createdAt: new Date().toISOString(),
          },
          ...house.tasks,
        ],
      }));

      addNotification({
        type: "task",
        title: `${activeMember.name} added a ${scope} task`,
        message: `${title.trim()}${assignedMember && assignedMember.id !== activeMember.id ? ` (assigned to ${assignedMember.name})` : ""}`,
      });
    },
    [activeHouse, activeMember, updateHouse, addNotification],
  );

  const toggleTask = useCallback(
    (id: string) => {
      if (!activeHouse || !activeMember) return;

      const task = activeHouse.tasks.find((t) => t.id === id);
      if (!task) return;

      updateHouse(activeHouse.id, (house) => ({
        ...house,
        tasks: house.tasks.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task,
        ),
      }));

      addNotification({
        type: "task",
        title: `${activeMember.name} ${task.completed ? "reopened" : "completed"} a task`,
        message: task.title,
      });
    },
    [activeHouse, activeMember, updateHouse, addNotification],
  );

  const addNote = useCallback(
    (text: string) => {
      if (!activeHouse || !activeMember) return;

      updateHouse(activeHouse.id, (house) => ({
        ...house,
        notes: [
          ...house.notes,
          {
            id: generateId(),
            text: text.trim(),
            authorId: activeMember.id,
            createdAt: new Date().toISOString(),
          },
        ],
      }));

      addNotification({
        type: "note",
        title: `${activeMember.name} posted a note`,
        message: text.trim().substring(0, 50) + (text.trim().length > 50 ? "..." : ""),
      });
    },
    [activeHouse, activeMember, updateHouse, addNotification],
  );

  const removeNote = useCallback(
    (id: string) => {
      if (!activeHouse || !activeMember) return;

      const note = activeHouse.notes.find((n) => n.id === id);
      if (!note) return;

      updateHouse(activeHouse.id, (house) => ({
        ...house,
        notes: house.notes.filter((note) => note.id !== id),
      }));

      addNotification({
        type: "delete",
        title: `${activeMember.name} removed a note`,
        message: note.text.substring(0, 50) + (note.text.length > 50 ? "..." : ""),
      });
    },
    [activeHouse, activeMember, updateHouse, addNotification],
  );

  const addEvent = useCallback(
    (event: Omit<CalendarEvent, "id" | "createdBy">) => {
      if (!activeHouse || !activeMember) return;

      try {
        const eventId = generateId();
        const taskId = generateId();
        
        updateHouse(activeHouse.id, (house) => ({
          ...house,
          events: [
            ...house.events,
            {
              ...event,
              id: eventId,
              createdBy: activeMember.id,
            },
          ],
          tasks: [
            {
              id: taskId,
              title: event.name,
              assignedTo: activeMember.id,
              createdBy: activeMember.id,
              completed: false,
              scope: "house",
              createdAt: new Date().toISOString(),
            },
            ...house.tasks,
          ],
        }));

        const dateStr = event.date
          ? new Date(event.date).toLocaleDateString()
          : event.date;
        addNotification({
          type: "event",
          title: `${activeMember.name} added a calendar event`,
          message: `${event.name}${dateStr ? ` on ${dateStr}` : ""}`,
        });
      } catch (error) {
        console.error("Error adding event:", error);
      }
    },
    [activeHouse, activeMember, updateHouse, addNotification],
  );

  const addMessage = useCallback(
    (text: string) => {
      if (!activeHouse || !activeMember) return;

      updateHouse(activeHouse.id, (house) => ({
        ...house,
        messages: [
          ...house.messages,
          {
            id: generateId(),
            memberId: activeMember.id,
            text: text.trim(),
            timestamp: new Date().toISOString(),
          },
        ],
      }));

      addNotification({
        type: "message",
        title: `${activeMember.name} sent a message`,
        message: text.trim().substring(0, 50) + (text.trim().length > 50 ? "..." : ""),
      });
    },
    [activeHouse, activeMember, updateHouse, addNotification],
  );

  const setActiveMember = useCallback(
    (memberId: string) => {
      if (!activeHouse) return;
      dispatch({
        type: "SET_ACTIVE",
        payload: { houseId: activeHouse.id, memberId },
      });
    },
    [activeHouse],
  );

  const deleteMember = useCallback(
    (memberId: string) => {
      if (!activeHouse) return;
      const updatedHouse: House = {
        ...activeHouse,
        members: activeHouse.members.filter((m) => m.id !== memberId),
        tasks: activeHouse.tasks.filter((t) => t.assignedTo !== memberId),
      };
      dispatch({
        type: "UPDATE_HOUSE",
        payload: { houseId: activeHouse.id, house: updatedHouse },
      });
      if (memberId === activeMember?.id) {
        dispatch({ type: "CLEAR_ACTIVE" });
      }
    },
    [activeHouse, activeMember],
  );

  const clearActiveHouse = useCallback(() => {
    dispatch({ type: "CLEAR_ACTIVE" });
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    dispatch({ type: "MARK_NOTIFICATION_READ", payload: id });
  }, []);

  const clearAllNotifications = useCallback(() => {
    dispatch({ type: "CLEAR_ALL_NOTIFICATIONS" });
  }, []);

  const value = useMemo(
    () => ({
      state,
      activeHouse,
      activeMember,
      notifications: state.notifications,
      createHouse,
      joinHouse,
      addGroceryItem,
      toggleGroceryItem,
      addBill,
      removeBill,
      addTask,
      toggleTask,
      addNote,
      removeNote,
      addEvent,
      addMessage,
      setActiveMember,
      deleteMember,
      clearActiveHouse,
      markNotificationRead,
      clearAllNotifications,
    }),
    [
      state,
      activeHouse,
      activeMember,
      createHouse,
      joinHouse,
      addGroceryItem,
      toggleGroceryItem,
      addBill,
      removeBill,
      addTask,
      toggleTask,
      addNote,
      removeNote,
      addEvent,
      addMessage,
      setActiveMember,
      deleteMember,
      clearActiveHouse,
      markNotificationRead,
      clearAllNotifications,
    ],
  );

  return (
    <HouseMateContext.Provider value={value}>
      {children}
    </HouseMateContext.Provider>
  );
}

export const useHouseMate = () => {
  const context = useContext(HouseMateContext);
  if (!context) {
    throw new Error("useHouseMate must be used within HouseMateProvider");
  }
  return context;
};

