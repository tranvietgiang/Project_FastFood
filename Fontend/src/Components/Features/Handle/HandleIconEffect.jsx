import { useState } from "react";

const HandleIconEffect = ({
  icon: Icon,
  tooltip,
  gradientFrom,
  gradientTo,
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        className={`relative w-10 h-10 rounded-full flex items-center justify-center 
                    shadow-lg transition-all duration-300 border border-gray-100
                    ${
                      hovered
                        ? `scale-110 bg-gradient-to-r ${gradientFrom} ${gradientTo} shadow-xl`
                        : "bg-white/95 backdrop-blur-sm"
                    }
                    `}
      >
        <Icon
          className={`w-4 h-4 transition-colors duration-300 
                     ${hovered ? "text-white" : "text-gray-600"}`}
        />
      </button>

      {hovered && (
        <div
          className="absolute right-12 top-1/2 -translate-y-1/2 bg-gray-800/90 
                     text-white text-xs px-3 py-1.5 rounded-lg 
                     whitespace-nowrap backdrop-blur-sm z-50
                     after:content-[''] after:absolute after:left-full after:top-1/2 
                     after:-translate-y-1/2 after:border-4 after:border-transparent 
                     after:border-l-gray-800/90"
        >
          {tooltip}
        </div>
      )}
    </div>
  );
};

export default HandleIconEffect;
