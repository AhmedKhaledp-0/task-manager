import { ChangeEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Task } from "../../types/Types";
import Button from "../UI/Button";
import Spinner from "../UI/Spinner";
import StatusSelector, { StatusType } from "../UI/StatusSelector";
import PrioritySelector, { PriorityType } from "../UI/PrioritySelector";

interface TaskItemFormProps {
  editForm: Partial<Task>;
  isSaving: boolean;
  onInputChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onPriorityChange: (priority: PriorityType) => void;
  onStatusChange: (status: StatusType) => void;
  onSave: () => void;
  onCancel: (e: React.MouseEvent) => void;
}

const TaskItemForm = ({
  editForm,
  isSaving,
  onInputChange,
  onPriorityChange,
  onStatusChange,
  onSave,
  onCancel,
}: TaskItemFormProps) => {
  return (
    <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
      <div className="flex flex-col md:flex-row gap-2 justify-between items-start">
        <input
          type="text"
          id="name"
          name="name"
          value={editForm.name}
          onChange={onInputChange}
          className="font-medium text-gray-900 dark:text-white bg-transparent border-b border-gray-300 dark:border-zinc-700 focus:outline-none focus:border-blue-500 w-full md:w-auto"
          required
        />

        <div className="flex self-end gap-2">
          <PrioritySelector
            priority={editForm.priority as PriorityType}
            onPriorityChange={onPriorityChange}
          />
          <StatusSelector
            status={editForm.status as StatusType}
            onStatusChange={onStatusChange}
          />
        </div>
      </div>

      <textarea
        id="description"
        name="description"
        value={editForm.description}
        onChange={onInputChange}
        rows={2}
        placeholder="Task description"
        className="mt-2 text-sm text-gray-600 dark:text-zinc-400 w-full bg-transparent border border-gray-200 dark:border-zinc-700 rounded-md p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />

      <div className="mt-3 flex flex-wrap justify-between items-center text-sm">
        <div className="flex items-center text-gray-500 dark:text-zinc-400">
          <FontAwesomeIcon icon={faCalendar} className="mr-2" />
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={editForm.deadline}
            onChange={onInputChange}
            className="bg-transparent border-b border-gray-300 dark:border-zinc-700 focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={onCancel}>
            <FontAwesomeIcon icon={faTimes} className="mr-1" />
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onSave()}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Spinner size="sm" color="white" className="mr-1" />
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faSave} className="mr-1" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskItemForm;
