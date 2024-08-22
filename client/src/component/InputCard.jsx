import React from "react";

const InputCard = ({
  id,
  label,
  type,
  value,
  pattern,
  required,
  handleInputChange,
}) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        pattern={pattern}
        required={required}
        onChange={handleInputChange}
        className="mt-2 p-3 block w-full border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      />
    </div>
  );
};

export default InputCard;
