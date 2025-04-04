import {
  faProjectDiagram,
  faCheckCircle,
  faSpinner,
  faClock,
  faHome,
  faLayerGroup,
  faTasks,
  faFileAlt,
} from "@fortawesome/free-solid-svg-icons";

export const statsCardsList = [
  {
    title: "Total Projects",
    value: null,
    icon: faProjectDiagram,
    color: "blue",
  },
  {
    title: "Completed",
    value: null,
    icon: faCheckCircle,
    color: "green",
  },
  {
    title: "Active Projects",
    value: null,
    icon: faSpinner,
    color: "yellow",
  },
  {
    title: "High Priority",
    value: null,
    icon: faClock,
    color: "red",
  },
];
export const navigationItems = [
  { path: "/", label: "Dashboard", icon: faHome },
  { path: "/projects", label: "Projects", icon: faLayerGroup },
  { path: "/tasks", label: "Tasks", icon: faTasks },
  { path: "/reports", label: "Reports", icon: faFileAlt },
];
