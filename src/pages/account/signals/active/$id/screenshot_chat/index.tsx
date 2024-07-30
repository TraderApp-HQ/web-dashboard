import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { getAsset } from "~/lib/utils";
import data from "../../../data.json";
import { useLoaderData } from "@remix-run/react";
import type { Signal } from "~/lib/types";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;
  const asset = await getAsset(id, data);
  return json(asset);
};

export default function ScreenshotChart() {
  const asset: Signal | null = useLoaderData<typeof loader>();

  return (
    <>
      <div className="sm:w-[100%] grid gap-y-8">
        <div className="flex justify-center rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl">
          <img src={asset?.signalImage} width={"100%"} alt="signal chart" />
        </div>
      </div>
    </>
  );
}
