import React, { useState } from 'react';

const TimelineDial = ({ compact = false }) => {
  const [selectedItem, setSelectedItem] = useState({
    time: "11:43 PM",
    title: "Water",
    icon: "water_drop",
    color: "bg-blue-500"
  });

  const timelineItems = [
    { angle: -60, time: "7:00 AM", title: "Wake Up", icon: "sunny", color: "bg-amber-400" },
    { angle: -30, time: "8:00 AM", title: "Vitamin D", icon: "pill", color: "bg-amber-500" },
    { angle: 30, time: "12:00 PM", title: "Balanced Meal", icon: "restaurant", color: "bg-emerald-500" },
    { angle: 90, time: "3:00 PM", title: "Hydration", icon: "water_drop", color: "bg-blue-500" },
    { angle: 150, time: "7:00 PM", title: "Evening Walk", icon: "fitness_center", color: "bg-indigo-500" },
    { angle: 210, time: "9:00 PM", title: "Magnesium", icon: "pill", color: "bg-purple-500" },
    { angle: 240, time: "11:00 PM", title: "Sleep", icon: "nights_stay", color: "bg-slate-900" },
  ];

  const getPosition = (angle, radius) => {
    const radian = (angle - 90) * (Math.PI / 180);
    return {
      left: `${50 + radius * Math.cos(radian)}%`,
      top: `${50 + radius * Math.sin(radian)}%`,
    };
  };

  const dialSize = compact ? "max-w-[280px]" : "max-w-[340px]";
  const innerSize = compact ? "w-[140px] h-[140px]" : "w-[180px] h-[180px]";
  const iconSize = compact ? "w-10 h-10" : "w-12 h-12";

  return (
    <div className={`relative w-full aspect-square ${dialSize} transition-all duration-500`}>
      {/* Outer Circle Ring */}
      <div className="absolute inset-0 rounded-full border-[12px] border-slate-50 shadow-inner"></div>
      
      {/* Clock Face Inner Shadow Area */}
      <div className="absolute inset-[12px] rounded-full bg-slate-50/50 flex items-center justify-center">
        
        {/* Hour Markers */}
        {[12, 3, 6, 9].map((num, i) => {
          const angle = i * 90;
          const pos = getPosition(angle, 42);
          return (
            <div 
              key={num} 
              className="absolute text-[9px] font-black text-slate-300"
              style={{ left: pos.left, top: pos.top, transform: 'translate(-50%, -50%)' }}
            >
              {num}
            </div>
          );
        })}

        {/* Center Display */}
        <div className={`${innerSize} rounded-full bg-white shadow-2xl flex flex-col items-center justify-center text-center p-4 border border-slate-50 relative z-10 transition-all duration-500`}>
          <span className={`${compact ? 'text-sm' : 'text-xl'} font-black text-amber-500 mb-0.5`}>{selectedItem.time}</span>
          <span className={`${compact ? 'text-[10px]' : 'text-sm'} font-bold text-slate-900 mb-2 truncate max-w-full`}>{selectedItem.title}</span>
          <div className={`${compact ? 'w-6 h-6' : 'w-8 h-8'} rounded-lg ${selectedItem.color} flex items-center justify-center shadow-lg transition-all`}>
             <span className={`material-symbols-outlined text-white ${compact ? 'text-xs' : 'text-sm'}`}>{selectedItem.icon}</span>
          </div>
        </div>
      </div>

      {/* Timeline Items (Outer Edge) */}
      {timelineItems.map((item, idx) => {
        const pos = getPosition(item.angle, 50);
        const isSelected = selectedItem.title === item.title;
        return (
          <button
            key={idx}
            onClick={() => setSelectedItem(item)}
            className={`absolute ${iconSize} rounded-full cursor-pointer transition-all duration-500 z-20 flex items-center justify-center shadow-lg border-2 border-white transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 active:scale-95 ${item.color} ${isSelected ? 'scale-110 ring-4 ring-amber-500/20' : ''}`}
            style={{ left: pos.left, top: pos.top }}
          >
            <span className={`material-symbols-outlined text-white ${compact ? 'text-base' : 'text-xl'}`}>{item.icon}</span>
            
            {isSelected && (
              <div 
                className={`absolute top-1/2 left-1/2 ${compact ? 'h-[50px]' : 'h-[70px]'} w-0.5 bg-amber-500/30 origin-top z-[-1] transition-all duration-500`}
                style={{ transform: `rotate(${item.angle + 180}deg)` }}
              ></div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default TimelineDial;
