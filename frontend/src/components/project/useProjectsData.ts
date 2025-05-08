import { useState, useEffect, useCallback, useRef } from "react";
import { useProjects, useCreateProject } from "../../hooks/useApi";
import { Data, ProjectData, ProjectFormData } from "../../types/Types";
import { getProjects } from "../../lib/api";
import { areFiltersActive, filterAndSortProjects, FilterState, DEFAULT_FILTERS } from "./projectUtils";

export function useProjectsData(initialPage = 1, limit = 10) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [allProjectsPages, setAllProjectsPages] = useState<ProjectData[]>([]);
  const [isLoadingAllPages, setIsLoadingAllPages] = useState(false);
  const [filteredProjects, setFilteredProjects] = useState<ProjectData[]>([]);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  const isFetchingCancelled = useRef(false);

  // Get projects for the current page
  const {
    data: projectsData,
    isLoading,
    error,
    refetch,
  } = useProjects(
    {
      select: (data: Data) => data,
    },
    currentPage,
    limit
  );
  const createProjectMutation = useCreateProject();
  const currentPageProjects = projectsData?.data?.projects || [];

  useEffect(() => {
    if (projectsData?.data?.pages) {
      setTotalPages(projectsData.data.pages);
    }
  }, [projectsData]);

  const fetchAllPages = useCallback(async () => {
    isFetchingCancelled.current = false;
    setIsLoadingAllPages(true);

    try {
      const allProjects: ProjectData[] = [];

      if (currentPageProjects.length > 0) {
        allProjects.push(...currentPageProjects);
      }
      const pagesToFetch = Array.from(
        { length: totalPages },
        (_, i) => i + 1
      ).filter((page) => page !== currentPage);

      const fetchPromises = pagesToFetch.map(async (page) => {
        if (isFetchingCancelled.current) {
          return [];
        }
        try {
          const response = await getProjects(page, limit);
          return response?.data?.projects || [];
        } catch (error) {
          console.error(`Error fetching page ${page}:`, error);
          return [];
        }
      });

      const results = await Promise.all(fetchPromises);

      if (isFetchingCancelled.current) {
        return;
      }

      results.forEach((projects) => {
        if (Array.isArray(projects)) {
          allProjects.push(...projects);
        }
      });

      setAllProjectsPages(allProjects);
    } catch (err) {
      console.error("Error fetching all pages:", err);
    } finally {
      if (!isFetchingCancelled.current) {
        setIsLoadingAllPages(false);
      }
    }
  }, [currentPage, totalPages, limit, currentPageProjects]);

  useEffect(() => {
    return () => {
      isFetchingCancelled.current = true;
    };
  }, [currentPage, totalPages]);

  useEffect(() => {
    const shouldUseAllPages = hasActiveFilters && allProjectsPages.length > 0;
    const projectsToFilter = shouldUseAllPages
      ? allProjectsPages
      : currentPageProjects;

    const result = filterAndSortProjects(projectsToFilter, filters);
    setFilteredProjects(result);
  }, [allProjectsPages, currentPageProjects, filters, hasActiveFilters]);

  useEffect(() => {
    const activeFilters = areFiltersActive(filters);
    setHasActiveFilters(activeFilters);
    if (activeFilters && totalPages > 1 && allProjectsPages.length === 0) {
      fetchAllPages();
    }
  }, [filters, totalPages, fetchAllPages, allProjectsPages.length]);

  const handleAddProject = useCallback((data: ProjectFormData) => {
    createProjectMutation.mutate(data, {
      onSuccess: () => {
        setAllProjectsPages([]);
        refetch();
      },
    });
  }, [createProjectMutation, refetch]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage > 0 && newPage <= totalPages) {
        setCurrentPage(newPage);
      }
    },
    [totalPages]
  );

  const handleSearch = useCallback((searchTerm: string) => {
    setFilters((prev) => ({ ...prev, searchTerm }));
  }, []);

  const handleFilterChange = useCallback(
    (filterType: string, value: string | null) => {
      setFilters((prev) => ({
        ...prev,
        [filterType === "status" ? "statusFilter" : "priorityFilter"]: value,
      }));
    },
    []
  );

  const handleSortChange = useCallback(
    (sortBy: string, sortDirection: "asc" | "desc") => {
      setFilters((prev) => ({ ...prev, sortBy, sortDirection }));
    },
    []
  );

  const handleClearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const projectsToDisplay = hasActiveFilters
    ? filteredProjects
    : currentPageProjects;
  const isProjectsLoading = isLoading || isLoadingAllPages;

  return {
    projectsToDisplay,
    currentPageProjects,
    filteredProjects,
    filters,
    hasActiveFilters,
    totalPages,
    currentPage,
    isLoading: isProjectsLoading,
    isLoadingAllPages,
    error,
    
    handleSearch,
    handleFilterChange,
    handleSortChange,
    handleClearFilters,
    handlePageChange,
    handleAddProject,
    refetchProjects: refetch,
  };
}