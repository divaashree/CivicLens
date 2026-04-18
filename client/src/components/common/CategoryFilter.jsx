export default function CategoryFilter({ selectedCategory, onSelect }) {
  const categories = [
    { value: "all", label: "All" },
    { value: "pothole", label: "Pothole" },
    { value: "garbage", label: "Garbage" },
    { value: "streetlight", label: "Streetlight" },
    { value: "water", label: "Water" },
    { value: "parking", label: "Parking" },
    { value: "dumping", label: "Dumping" },
    { value: "other", label: "Other" },
  ];

  return (
    <div className="w-full">
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => onSelect(category.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
              selectedCategory === category.value
                ? "bg-gray-900 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
}
