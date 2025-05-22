import { Line, Polygon } from "~/components/Loaders";

export const ProgressTrackerLoader = () => (
	<section className="mt-5 border border-[#DEE3F6] rounded-md bg-white text-[#3E57BF] px-4 py-4">
		<Polygon size="lg" variant="rounded" className="w-1/3 h-8 mb-4" />
		<Line width="full" height="md" className="mb-6" />

		<div className="space-y-4">
			{[1, 2, 3].map((key) => (
				<div key={key} className="border rounded-lg p-4">
					<Line width="lg" height="sm" className="mb-2" />
					<Line width="md" height="sm" />
				</div>
			))}
		</div>
	</section>
);
