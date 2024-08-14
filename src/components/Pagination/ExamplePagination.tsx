import React from "react";
import Pagination from ".";

const ExamplePagination: React.FC = () => {
	const [currentPage, setCurrentPage] = React.useState<number>(1);
	const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);

	const totalRecord = 5; // Example total rows
	const totalPages = Math.ceil(totalRecord / rowsPerPage);

	// Example data
	const data = Array.from({ length: totalRecord }, (_, i) => `Item ${i + 1}`);

	// Calculate the rows to display
	const startIndex = (currentPage - 1) * rowsPerPage;
	const displayedData = data.slice(startIndex, startIndex + rowsPerPage);

	React.useEffect(() => {
		// Reset to the first page when rowsPerPage changes
		setCurrentPage(1);
	}, [rowsPerPage]);

	return (
		<div className="container mx-auto py-4">
			<div className="overflow-x-auto">
				<table className="min-w-full border">
					<thead>
						<tr>
							<th className="border px-4 py-2">Item</th>
						</tr>
					</thead>
					<tbody>
						{displayedData.map((item, index) => (
							<tr key={index}>
								<td className="border px-4 py-2">{item}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div className="flex justify-between w-full items-center">
				<div></div>
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					rowsPerPage={rowsPerPage}
					totalRecord={totalRecord} // records
					setRowsPerPage={setRowsPerPage}
					onNext={setCurrentPage}
					onPrev={setCurrentPage}
				/>
			</div>
		</div>
	);
};

export default ExamplePagination;
