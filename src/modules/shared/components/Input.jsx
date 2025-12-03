function Input({ label, error = '', ...restProps }) {
  const { name } = restProps; 

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label
          htmlFor={name}
          className="text-black font-medium text-sm sm:text-base"
        >
          {label}:
        </label>
      )}

      <input
        id={name}
        {...restProps}
        className={`border border-gray-300 rounded-md p-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-400" : ""
        }`}
      />

      {error && (
        <p className="text-red-500 text-sm sm:text-xs">{error}</p>
      )}
    </div>
  );
}

export default Input;
