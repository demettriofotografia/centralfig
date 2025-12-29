import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onChange: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onChange }) => {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div className="flex space-x-0.5 p-1 bg-[#27272A] rounded-lg border border-white/5">
      {[...Array(10)].map((_, index) => {
        const starValue = index + 1;
        return (
          <button
            key={index}
            type="button"
            className="focus:outline-none transition-transform hover:scale-110"
            onClick={() => onChange(starValue)}
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(null)}
          >
            <Star
              size={14}
              className={`${
                starValue <= (hover || rating)
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-gray-600'
              } transition-colors duration-200`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;