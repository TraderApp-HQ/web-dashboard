import { Form } from "@remix-run/react";
import React from "react";
import Button from "~/components/AccountLayout/Button";
import Date from "~/components/AccountLayout/Date";
import Select from "~/components/AccountLayout/Select";
import { DropdownMenu, DropdownMenuItem } from "~/components/Dropdown";
import { Card, Line, Polygon, StepCard } from "~/components/Loaders";
import { ExamplePagination } from "~/components/Pagination";
import SelectBox from "~/components/common/SelectBox";
import Toast from "~/components/common/Toast";

const Loader = () => {
  const [shouldVanish, setShouldVanish] = React.useState(false);
  return (
    <>
      <div className="p-5 space-y-5">
        <h1>Dropdown Components</h1>
        <div className="md:flex items-start gap-5 border-2 p-4">
          <DropdownMenu trigger={<span>Open Menu</span>}>
            <DropdownMenuItem component="text">Search anything</DropdownMenuItem>
            <DropdownMenuItem component="text">
              <Form onSubmit={() => {}} method="post">
                <SelectBox
                  placeholder="Select trade"
                  labelText="Trade"
                  options={[
                    { displayText: "BTC", value: "btc" },
                    { displayText: "ETH", value: "eth" },
                  ]}
                />
                <SelectBox
                  placeholder="Select trade"
                  labelText="Trade"
                  options={[
                    { displayText: "BTC", value: "btc" },
                    { displayText: "ETH", value: "eth" },
                  ]}
                />
                <Date label="Date" name="selectedDate" value={""} onChange={() => {}} required />
                <SelectBox
                  placeholder="Select trade"
                  labelText="Trade"
                  options={[
                    { displayText: "BTC", value: "btc" },
                    { displayText: "ETH", value: "eth" },
                  ]}
                />
                <Button type="submit" onClick={() => {}} fluid className="mt-2">
                  Search
                </Button>
              </Form>
            </DropdownMenuItem>
          </DropdownMenu>
          <DropdownMenu trigger={<span>Open Menu</span>}>
            <DropdownMenuItem component="text">Search anything</DropdownMenuItem>
            <DropdownMenuItem component="text">
              <Form onSubmit={() => {}} method="post">
                <SelectBox
                  placeholder="Select trade"
                  labelText="Trade"
                  options={[
                    { displayText: "BTC", value: "btc" },
                    { displayText: "ETH", value: "eth" },
                  ]}
                />
                <Select
                  name="createdAt"
                  label="CreatedAt"
                  options={[
                    { value: "BTC", text: "BTC" },
                    { value: "ETH", text: "ETH" },
                  ]}
                  classNames={{
                    input: "cursor-pointer",
                  }}
                  onChange={() => {}}
                  selected={{ value: "BTC" }}
                />
                <Date label="Date" name="selectedDate" value={""} onChange={() => {}} required />

                <Select
                  name="time"
                  label="Time"
                  options={[
                    { value: "BTC", text: "BTC" },
                    { value: "ETH", text: "ETH" },
                  ]}
                  classNames={{
                    input: "cursor-pointer",
                  }}
                  onChange={() => {}}
                  selected={{ value: "BTC" }}
                />
                <Button type="submit" onClick={() => {}} fluid className="mt-2">
                  Search
                </Button>
              </Form>
            </DropdownMenuItem>
          </DropdownMenu>
        </div>
      </div>

      <div className="p-5 space-y-5">
        <h1>Polygon loader Components</h1>
        <div className="md:flex items-start gap-5 border-2 p-4">
          <p>size: xl, variant: circle</p>
          <Polygon size="xl" variant="circle" />
          <p>size: xl, variant: circle, opacity: open</p>
          <Polygon size="xl" opacity="open" variant="circle" />
          <p>size: lg, variant: rounded</p>
          <Polygon size="lg" variant="rounded" />
          <p>size: md, variant: square</p>
          <Polygon size="md" variant="square" />
        </div>

        <div className="p-5 space-y-5">
          <h1>Line loader Components</h1>
          <div className="md:flex items-start gap-5 border-2 p-4">
            <p>Default</p>
            <Line />
            <p>width: sm</p>
            <Line width="sm" />
            <p>width: md, height: sm</p>
            <Line width="md" height="sm" />
            <p>width: lg, height: md</p>
            <Line width="lg" height="md" />
            <p>width: full, height: lg</p>
            <Line width="full" height="lg" />
          </div>
        </div>

        <div className="p-5 space-y-5">
          <h1>Stepper Loader Components</h1>
          <div className="md:flex items-start gap-5 border-2 p-4">
            {/* <StepCard style="filled" />  DEFAULT*/}
            <p>style: filled</p>
            <StepCard className="p-2" style="filled" />
            <p>style: filled, opacity: open</p>
            <StepCard className="p-2" style="filled" opacity="open" />
            <p>style: bordered, opacity: open</p>
            <StepCard className="p-2" style="bordered" opacity="open" />
            <p>style: bordered</p>
            <StepCard className="p-2" style="bordered" />
            <p>style: clear</p>
            <StepCard className="p-2" style="clear" />
            <p>direction: ltr (DEFAULT)</p>
            <StepCard direction="ltr" />
            <p>direction: rtl</p>
            <StepCard direction="rtl" />
          </div>
        </div>

        <div className="p-5 space-y-5">
          <h1>Card Loader Components</h1>
          <div className="md:flex items-start gap-5 border-2 p-4">
            <p>(DEFULT)</p>
            <Card />
          </div>
        </div>

        <div className="p-5 space-y-5">
          <h1>SelectBox Components</h1>
          <div className="md:flex items-start gap-5 border-2 p-4">
            <p>(DEFULT)</p>
            <SelectBox
              options={[
                {
                  displayText: "Option 1",
                  value: "1",
                },
                {
                  displayText: "Option 2",
                  value: "2",
                },
                {
                  displayText: "Option 3",
                  value: "3",
                },
                {
                  displayText: "Option 4",
                  value: "4",
                },
              ]}
            />
            <p>with placeholder, label</p>
            <SelectBox
              options={[
                {
                  displayText: "Option 1",
                  value: "1",
                },
                {
                  displayText: "Option 2",
                  value: "2",
                },
                {
                  displayText: "Option 3",
                  value: "3",
                },
                {
                  displayText: "Option 4",
                  value: "4",
                },
              ]}
              placeholder="Select an option"
              labelText="Select option"
              isSearchable={true}
              option={{
                displayText: "Option 4",
                value: "4",
              }}
            />
          </div>
        </div>

        <div className="p-5 space-y-5">
          <h1>Toast Components</h1>
          <div className="md:flex items-start gap-5 border-2 p-4">
            <div>
              <p>type: success</p>
              <Toast title="Some success" type="success" />
            </div>
            <div>
              <p>type: warning</p>
              <Toast title="Some warning" type="warning" message="Some cool message" />
            </div>
            <div>
              <p>type: error, autoVanish: true, </p>
              <Toast title="Some error" type="error" message="Some very cool message" autoVanish />
            </div>
            <div>
              <p>
                type: info, variant: outlined, autoVanish: <b>{shouldVanish ? "Will Vanish" : "Will not vanish"}</b>,
                autoVanishTimeout: 20 (seconds){" "}
                <button onClick={() => setShouldVanish(!shouldVanish)} className="bg-slate-200">
                  Toggle autoVanish
                </button>
              </p>
              <Toast
                title="Some important"
                type="info"
                variant="outlined"
                autoVanish={shouldVanish}
                autoVanishTimeout={20}
              />
            </div>
          </div>
        </div>

        <div className="p-5 space-y-5">
          <h1>Pagination Components</h1>
          <div className="md:flex items-start gap-5 border-2 p-4">
            <ExamplePagination />
          </div>
        </div>
      </div>
    </>
  );
};

export default Loader;
