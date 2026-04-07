import { createBrowserRouter } from "react-router";
import { Root } from "./screens/Root";
import { Login } from "./screens/Login";
import { Onboarding } from "./screens/Onboarding";
import { Dashboard } from "./screens/Dashboard";
import { DailyCheckin } from "./screens/DailyCheckin";
import { VoiceJournal } from "./screens/VoiceJournal";
import { Interventions } from "./screens/Interventions";
import { Profile } from "./screens/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Login },
      { path: "onboarding", Component: Onboarding },
      { path: "dashboard", Component: Dashboard },
      { path: "checkin", Component: DailyCheckin },
      { path: "journal", Component: VoiceJournal },
      { path: "interventions", Component: Interventions },
      { path: "profile", Component: Profile },
    ],
  },
]);