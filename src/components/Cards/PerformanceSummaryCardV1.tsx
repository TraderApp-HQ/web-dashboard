import Card from "~/components/AccountLayout/Card";

const PerformanceSummaryCardv1 = () => {
  return;
  <Card className="w-12/12 lg:w-8/12 2xl:w-7/12">
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div className="flex-col justify-center items-start gap-0.5 py-3">
        <h3 className="text-neutral-700 text-sm font-normal leading-tight">Total Active signal</h3>
        <div className="justify-center items-center gap-9 inline-flex">
          <p className="text-neutral-700 text-base font-bold">signals.signals.totalActiveSignal</p>
        </div>
      </div>

      <div className="py-3">
        <div className="w-12 h-px origin-top-left rotate-90 border border-stone-300 border-opacity-20 sm:block hidden" />
        <div className="flex-col justify-center items-start gap-0.5 ml-3">
          <h3 className="text-neutral-700 text-sm font-normal leading-tight">Total Capital</h3>
          <div className="justify-center items-center gap-9 inline-flex">
            <p className="text-neutral-700 text-base font-bold">signals.signals.totalCapital.00 USD</p>
          </div>
        </div>
      </div>

      <div className="py-3">
        <div className="w-80 h-px border border-stone-300 border-opacity-20 mb-4 sm:hidden block" />
        <div className="w-12 h-px origin-top-left rotate-90 border border-stone-300 border-opacity-20 sm:block hidden" />
        <div className="flex-col justify-center items-start gap-2 ml-0 sm:ml-3">
          <h3 className="text-neutral-700 text-sm font-semibold leading-tight">Best performer</h3>
          <div className="justify-start items-center gap-12 inline-flex">
            <div className="justify-start items-center gap-2 flex">
              {/* <img
                  src={signals.signals.bestSignal.image}
                  alt={signals.signals.bestSignal.name}
                  className="w-6 h-6 relative"
                /> */}
              <p className="text-slate-900 text-xs font-semibold leading-none">signals.signals.bestSignal.name</p>
            </div>
            <div className="justify-start items-center flex">
              <div className="w-4 h-4 relative origin-top-left -rotate-180" />
              <p className="text-emerald-700 text-sm font-normal">signals.signals.percentage</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Card>;
};

export default PerformanceSummaryCardv1;
