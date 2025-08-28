import React from "react";
const HandleIconEffect = ({
  icon: Icon,
  tooltip,
  gradientFrom,
  gradientTo,
  groupName,
}) => {
  return (
    <button
      className={`relative w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full 
                  flex items-center justify-center shadow-lg hover:shadow-xl
                  transition-all duration-300 hover:scale-110 hover:bg-gradient-to-r 
                  hover:from-${gradientFrom} hover:to-${gradientTo} group/${groupName} border border-gray-100`}
    >
      <Icon
        className={`w-4 h-4 text-gray-600 group-hover/${groupName}:text-white 
                    transition-colors duration-300`}
      />
      <div
        className={`absolute right-12 top-1/2 -translate-y-1/2 bg-gray-800/90 
                    text-white text-xs px-3 py-1.5 rounded-lg opacity-0 
                    group-hover/${groupName}:opacity-100 transition-all duration-300 
                    pointer-events-none whitespace-nowrap backdrop-blur-sm
                    after:content-[''] after:absolute after:left-full after:top-1/2 
                    after:-translate-y-1/2 after:border-4 after:border-transparent 
                    after:border-l-gray-800/90`}
      >
        {tooltip}
      </div>
    </button>
  );
};
export default HandleIconEffect;
