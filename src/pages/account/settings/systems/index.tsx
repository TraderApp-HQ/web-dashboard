import ProfileTextAndSubText from "~/components/AccountLayout/ProfileTextAndSubText";
import SystemsNotificationOption from "~/components/AccountLayout/SystemsNotificationOption";

const Systems = () => {
  return (
    <div>
      <div className="w-12/12 lg:w-10/12 2xl:w-10/12">
        <ProfileTextAndSubText
          mainText="Notifications"
          subText="Get notification to find out what’s going on when you’re not online. You can turn them off anytime."
        />
      </div>
      <div className="mt-6 border-b" />
      <div className="mt-10 mb-6 border-b">
        <ProfileTextAndSubText mainText="Notify me" subText="Receive important notification." />
        <div className="mt-6 mb-6">
          <SystemsNotificationOption optionLabel={"When a new signal is posted"} checked={undefined} />
          <SystemsNotificationOption optionLabel={"When I enter a trade"} checked={undefined} />
          <SystemsNotificationOption optionLabel={"When I exit a trade"} checked={undefined} />
          <SystemsNotificationOption optionLabel={"When Other relevant notifications"} checked={undefined} />
        </div>
      </div>
      <div className="mt-10 mb-6 border-b">
        <div className="mt-6 mb-6">
          <ProfileTextAndSubText
            mainText="Default Currency"
            subText="Please select the currency you want to be set as default."
          />
          <div className="w-[150px]">
            <select
              defaultValue="USD"
              placeholder=""
              className="w-[170px] mt-[28px] py-[4px] px-[10px] text-[14px] border border-[#D1D7F0] bg-[#F6F8FE] rounded-[5px]"
            >
              <option value="USD">USD</option>
              <option value="NGN">NGN</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Systems;
