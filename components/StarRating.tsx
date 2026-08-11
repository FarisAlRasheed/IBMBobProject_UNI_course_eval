"use client";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function StarRating({
  value,
  onChange,
  readOnly = false,
  size = "md",
}: StarRatingProps) {
  const sizeClass = size === "sm" ? "text-lg" : size === "lg" ? "text-4xl" : "text-2xl";

  if (readOnly) {
    return (
      <div className="flex gap-0.5" aria-label={`Rating: ${value} out of 5`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`${sizeClass} ${
              star <= Math.round(value) ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Star rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} star${star !== 1 ? "s" : ""}`}
          onClick={() => onChange?.(star)}
          className={`
            ${sizeClass} leading-none transition-all duration-100
            cursor-pointer select-none focus:outline-none focus-visible:ring-2
            focus-visible:ring-blue-500 focus-visible:ring-offset-1 rounded-sm
            hover:scale-110
            ${star <= value ? "text-yellow-400" : "text-gray-300 hover:text-yellow-300"}
          `}
        >
          ★
        </button>
      ))}
    </div>
  );
}
