import React from "react";
import { ColourTheme } from "~/config/enum";

interface ITargetPill {
  target: string;
  theme: ColourTheme;
  styles?: string;
}

const TargetPill: React.FC<ITargetPill> = ({ target, theme, styles }) => {
  let pillStyles: string;
  switch (theme) {
    case ColourTheme.SUCCESS: {
      pillStyles = "text-[#08875D] border-[#08875D]";
      break;
    }
    case ColourTheme.SECONDARY: {
      pillStyles = "border-stone-300";
    }
    default:
      pillStyles = "";
  }
  return (
    <div className={`border inline-block px-2.5 py-1.5 rounded font-normal leading-none ${pillStyles} ${styles ?? ""}`}>
      {target}
    </div>
  );
};

export default TargetPill;
