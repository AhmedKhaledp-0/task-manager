import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faCheckSquare,
  faBriefcase,
} from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import Spinner from "../Spinner";
import { useEffect } from "react";
import {
  selectAllProjects,
  selectProjectsError,
  selectProjectsLoading,
} from "../../store/selectors";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  fetchProjects,
  fetchProjectById,
} from "../../store/slices/projectSlice";
import { ProjectData } from "../../types/Types";

import { getProjectStats, getTaskStats } from "../ProjectTaskStates";

interface ReportHeaderProps {
  className?: string;
}

export function ReportHeader({ className }: ReportHeaderProps) {
  const dispatch = useAppDispatch();
  const projects = useAppSelector(selectAllProjects);
  const loading = useAppSelector(selectProjectsLoading);
  const error = useAppSelector(selectProjectsError);

  useEffect(() => {
    const fetchProjectsWithTasks = async () => {
      try {
        const response = await dispatch(fetchProjects()).unwrap();
        const rawProjects = Array.isArray(response)
          ? response
          : response.data ?? [];

        const projectsWithTasks = await Promise.all(
          rawProjects.map(async (project: ProjectData) => {
            const projectDetails = await dispatch(
              fetchProjectById(project.id)
            ).unwrap();
            return projectDetails;
          })
        );
        dispatch(fetchProjects.fulfilled(projectsWithTasks, ""));
      } catch (error) {
        console.error("Error fetching projects with tasks:", error);
      }
    };

    fetchProjectsWithTasks();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  const { active } = getProjectStats(projects);
  const { inProgress } = getTaskStats(projects);

  return (
    <div className={clsx("flex flex-col space-y-2", className)}>
      <h1 className="text-3xl font-bold tracking-tight">
        Productivity Reports
      </h1>
      <p className="text-gray-600 dark:text-gray-400 text-sm leading-6">
        Track productivity, monitor progress, and improve team performance
      </p>
      <div className="flex flex-wrap items-center gap-4 mt-2">
        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
          <FontAwesomeIcon icon={faCalendarDays} className="h-4 w-4" />
          <span>Last updated: {new Date().toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
          <FontAwesomeIcon icon={faCheckSquare} className="h-4 w-4" />
          <span>{inProgress} Active Tasks</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
          <FontAwesomeIcon icon={faBriefcase} className="h-4 w-4" />
          <span>{active} Active Projects</span>
        </div>
      </div>
    </div>
  );
}

export default ReportHeader;
