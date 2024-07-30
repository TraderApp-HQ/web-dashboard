type UserProfileFieldProps = {
  fieldLabel?: string;
  fieldValue?: string;
};

const UserProfileField = ({ fieldLabel, fieldValue }: UserProfileFieldProps) => {
  return (
    <div className="max-w-[419px] w-full">
      <h2 className="text-[#344054] font-bold text=[14px] mb-4">{fieldLabel}</h2>
      <div className="h-[56px] bg-[#F3F7FF] p-4 mb-4 border border-[#EAEBFF] rounded-[4px]">{fieldValue}</div>
    </div>
  );
};

export default UserProfileField;
