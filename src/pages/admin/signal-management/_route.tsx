import PageTab from "~/components/AccountLayout/Tabs";
import { Outlet, useNavigate } from "@remix-run/react";
import Button from "~/components/common/old/Button";

const SignalManagement: React.FC = () => {
  const navigate = useNavigate();

  const tabs = [
    { title: "Active Signal", href: "active" },
    { title: "Signal History", href: "history" },
  ];

  const handleCreateSignal = () => {
    navigate("create-signal");
  };

  return (
    <div>
      <div className="flex mb-8 justify-between items-center">
        <div className="w-12/12 lg:w-2.5/12">
          <PageTab tabs={tabs} />
        </div>
        <Button onClick={handleCreateSignal}>Create signal</Button>
      </div>

      <div className="mt-6" />
      <Outlet />
    </div>
  );
};

export default SignalManagement;
