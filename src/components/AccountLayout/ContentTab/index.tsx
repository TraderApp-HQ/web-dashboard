import { useState, ReactNode } from "react";
import clsx from "clsx";

interface Tab {
  label: string;
}

interface ContentTabProps {
  tabs: Tab[];
  children: ReactNode[];
}

const ContentTab: React.FC<ContentTabProps> = ({ tabs, children }) => {
  const [activeTab, setActiveTab] = useState<string>(tabs[0].label);

  const handleTabClick = (label: string) => {
    setActiveTab(label);
  };

  return (
    <div>
      <div className="flex justify-center">
      <div className="flex justify-center md:w-[80%] lg:w-[60%] 2xl:w-[50%] overflow-x-auto border-b gap-x-8 md:gap-x-[27px] my-10">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => handleTabClick(tab.label)}
            className={clsx(
              "px-2 py-2 mx-0 focus:outline-none text-sm sm:text-base font-bold leading-normal whitespace-nowrap",
              `${activeTab === tab.label ? "border-b-2 border-blue-800 text-blue-800" : "text-zinc-500"}`
            )}
            aria-label={tab.label}
          >
            <div className="whitespace-nowrap">{tab.label}</div>
          </button>
        ))}
      </div>
      </div>
      <div>
        {children.map((child, index) => (
          <div
            key={tabs[index].label}
            className={clsx(`${activeTab === tabs[index].label ? 'block' : 'hidden'}`)}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentTab;
