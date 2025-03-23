// components/Form/FormField.tsx
import { ReactElement } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FormFieldProps } from "../types/Types";

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
    className: `block w-full px-3 py-2 bg-white  border ${
      error ? "border-danger-300" : "border-neutral-300"
    } rounded-xl shadow-sm focus:outline-none focus:ring-2 ${
      error
        ? "focus:ring-danger-500 focus:border-danger-500"
        : "focus:ring-primary-500 focus:border-primary-500"
    } transition-colors duration-200`,
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
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-500">
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
        return <input type="number" {...commonProps} min={min} />;
      default:
        return <input type={type} {...commonProps} />;
    }
  };

  return (
    <>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-neutral-700  "
      >
        {label}
        {required && <span className="ml-1 text-danger-500">*</span>}
      </label>
      {renderInput()}
      {error && (
        <div className="mt-1 flex items-center text-danger-500 text-xs">
          <FontAwesomeIcon icon={faCircleInfo} className="mr-1" />
          {error.message}
        </div>
      )}
      {name === "tags" && (
        <span className="block mt-1 text-xs text-neutral-400 italic">
          Separate multiple tags with commas
        </span>
      )}
    </>
  );
};
