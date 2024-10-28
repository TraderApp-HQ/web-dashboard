import { TaskCategory } from "~/components/AdminLayout/taskCenter/taskFormData";

interface ICategoryProps {
	category: TaskCategory;
	theme: string;
}

const CategoryPill: React.FC<ICategoryProps> = ({ category, theme }) => {
	return (
		<div className="flex justify-center">
			<div
				className={`flex px-3 py-2 font-black rounded-lg justify-center items-center gap-2 w-fit ${theme}`}
			>
				<p className="capitalize">{category}</p>
			</div>
		</div>
	);
};

export default CategoryPill;
