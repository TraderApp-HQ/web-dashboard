import { TaskCategory } from "~/components/AdminLayout/taskCenter/taskFormData";

interface ICategoryProps {
	category: TaskCategory;
	theme: string;
}

const CategoryPill: React.FC<ICategoryProps> = ({ category, theme }) => {
	return (
		<div
			className={`flex px-3 py-1.5 w-fit font-black rounded-lg justify-center items-center gap-2 ${theme}`}
		>
			<p className="capitalize">{category}</p>
		</div>
	);
};

export default CategoryPill;
