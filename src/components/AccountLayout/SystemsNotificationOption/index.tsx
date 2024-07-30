import type { ChangeEvent } from "react";
import { useState } from "react";

type SystemsNotificationOptionProps = { optionLabel?: string; checked?: boolean };

const SystemsNotificationOption = ({ optionLabel, checked }: SystemsNotificationOptionProps) => {
  const [isChecked, setIsChecked] = useState<boolean | undefined>(false);

  const handleOptionChecked = (event: ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event?.target?.checked);
  };

  return (
    <p className="flex flex-row items-center">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={(event) => handleOptionChecked(event)}
        className="mr-4 w-[1rem] h-[1rem] rounded-[4px]"
      />{" "}
      <span className="color-[#344054] font-[14px]">{optionLabel}</span>
    </p>
  );
};

export default SystemsNotificationOption;
