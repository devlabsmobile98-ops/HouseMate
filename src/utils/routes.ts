import { createBrowserRouter } from "react-router";
import { WelcomeScreen } from "../components/screens/WelcomeScreen";
import { SignUpScreen } from "../components/screens/SignUpScreen";
import { CreateHouseScreen } from "../components/screens/CreateHouseScreen";
import { JoinHouseScreen } from "../components/screens/JoinHouseScreen";
import { DashboardScreen } from "../components/screens/DashboardScreen";
import { GroceryListScreen } from "../components/screens/GroceryListScreen";
import { BillSplitterScreen } from "../components/screens/BillSplitterScreen";
import { AvatarSelectionScreen } from "../components/screens/AvatarSelectionScreen";
import { HouseCodeScreen } from "../components/screens/HouseCodeScreen";
import { GroupChatScreen } from "../components/screens/GroupChatScreen";
import { CalendarScreen } from "../components/screens/CalendarScreen";
import { BulletinBoardScreen } from "../components/screens/BulletinBoardScreen";
import { TaskListsScreen } from "../components/screens/TaskListsScreen";
import { SettingsScreen } from "../components/screens/SettingsScreen";
import { NotificationsScreen } from "../components/screens/NotificationsScreen";
import { ProfileScreen } from "../components/screens/ProfileScreen";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: WelcomeScreen,
  },
  {
    path: "/signup",
    Component: SignUpScreen,
  },
  {
    path: "/create-house",
    Component: CreateHouseScreen,
  },
  {
    path: "/join-house",
    Component: JoinHouseScreen,
  },
  {
    path: "/dashboard",
    Component: DashboardScreen,
  },
  {
    path: "/grocery",
    Component: GroceryListScreen,
  },
  {
    path: "/bills",
    Component: BillSplitterScreen,
  },
  {
    path: "/avatar",
    Component: AvatarSelectionScreen,
  },
  {
    path: "/house-code",
    Component: HouseCodeScreen,
  },
  {
    path: "/chat",
    Component: GroupChatScreen,
  },
  {
    path: "/calendar",
    Component: CalendarScreen,
  },
  {
    path: "/bulletin",
    Component: BulletinBoardScreen,
  },
  {
    path: "/tasks",
    Component: TaskListsScreen,
  },
  {
    path: "/settings",
    Component: SettingsScreen,
  },
  {
    path: "/notifications",
    Component: NotificationsScreen,
  },
  {
    path: "/profile",
    Component: ProfileScreen,
  },
]);