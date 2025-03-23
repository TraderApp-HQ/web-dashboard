import clsx from "clsx";
import SearchIcon from "~/components/icons/SearchIcon";

interface SearchFormProps {
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onSubmit?: React.FormEventHandler<HTMLFormElement>;
	placeHolder: string;
	"aria-label": string;
	className?: string;
	defaultValue?: string;
	marginTop?: string;
}

export default function SearchForm({
	onChange,
	"aria-label": ariaLabel,
	placeHolder,
	onSubmit,
	className,
	defaultValue,
	marginTop = "mt-6",
}: SearchFormProps) {
	return (
		<form className="flex-1" onSubmit={onSubmit}>
			<label
				className={clsx(
					className,
					"mb-[0.7rem] md:mb-4 sm:w-96 w-[100%] h-12 px-5 py-3 bg-gray-100 border rounded-xl justify-start items-center gap-3.5 inline-flex",
					marginTop,
				)}
			>
				<div className="w-6 h-6 justify-center items-center flex">
					<SearchIcon aria-label={ariaLabel} />
				</div>
				<input
					onChange={onChange}
					placeholder={placeHolder}
					className="text-gray-800 text-sm font-normal focus:outline-none  inline-block pr-8 pl-2 w-full leading-normal placeholder-gray-400 bg-transparent border-gray-lighter focus:border-blue-800 focus:ring-gray-100"
					type="search"
					name="term"
					defaultValue={defaultValue}
				/>
			</label>
		</form>
	);
}
