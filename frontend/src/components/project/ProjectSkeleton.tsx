const ProjectSkeleton = () => {
  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden animate-pulse">
      <div className="p-6">
        <div className="flex items-start justify-between mb-6 ">
          <div className="h-5 bg-gray-200 dark:bg-zinc-700 rounded w-3/4"></div>
          <div className="h-5 bg-gray-200 dark:bg-zinc-700 rounded-full w-16"></div>
        </div>

        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded-full w-1/4"></div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSkeleton;
