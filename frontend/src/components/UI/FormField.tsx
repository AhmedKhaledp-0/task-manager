// components/Form/FormField.tsx
import { ReactElement } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FormFieldProps } from "../../types/Types";

export const FormField = ({
  type = "text",
  label,
  name,
  register,
  error,
  required,
  placeholder,
  options,
  rows,
  min,
}: FormFieldProps): ReactElement => {
  const commonProps = {
    ...register(name, { required }),
    id: name,
    "aria-label": label,
    placeholder,
    className: `block w-full px-4 py-2.5 bg-white dark:bg-zinc-800 border-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
      error
        ? "border-red-300 focus:ring-red-500 focus:border-red-500 dark:border-red-500"
        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:border-zinc-600 dark:focus:border-blue-500"
    }`,
  };

  const renderInput = () => {
    switch (type) {
      case "select":
        return (
          <div className="relative">
            <select
              {...commonProps}
              className={`${commonProps.className} appearance-none pr-8`}
            >
              {options?.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-zinc-400">
              <FontAwesomeIcon icon={faCaretDown} className="mr-1" />
            </div>
          </div>
        );
      case "textarea":
        return (
          <textarea
            {...commonProps}
            rows={rows}
            className={`${commonProps.className} resize-none`}
          />
        );
      case "number":
        return (
          <input
            type="number"
            {...commonProps}
            min={typeof min === "number" ? min : undefined}
          />
        );
      case "date":
        return (
          <input
            type="date"
            {...commonProps}
            min={typeof min === "string" ? min : undefined}
          />
        );
      default:
        return <input type={type} {...commonProps} />;
    }
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 dark:text-zinc-300"
      >
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {renderInput()}
      {error && (
        <div className="flex items-center text-red-500 text-sm">
          <FontAwesomeIcon icon={faCircleInfo} className="mr-2" />
          {error.message}
        </div>
      )}
      {name === "tags" && (
        <span className="block text-sm text-gray-500 dark:text-zinc-400">
          Separate multiple tags with commas
        </span>
      )}
    </div>
  );
};
