import { memo, useState } from 'react';
import { AddTodoForm, TodoListItem } from '../components';
import { TextInputDebounced } from '../components/CheckboxDebounced';
import { Pager, usePager } from '../components/Pager/Pager';
import { useFetchAllTodosQuery } from '../store/todos/api';

const HomePage = () => {
	const { data: todos, isLoading, error } = useFetchAllTodosQuery();
	const {
		currentPage,
		totalPages,
		pagedData,
		isPrevEnabled,
		isNextEnabled,
		prevPage,
		nextPage,
		goToPage,
	} = usePager({ data: todos, pageSize: 3 });
	const [value, setValue] = useState('');
	return (
		<div>
			<TextInputDebounced
				value={value}
				onChange={(value) => {
					console.log(value);
					setValue(value);
				}}
			/>
			<Pager
				currentPage={currentPage}
				totalPages={totalPages}
				isPrevEnabled={isPrevEnabled}
				isNextEnabled={isNextEnabled}
				onPrev={prevPage}
				onNext={nextPage}
				onPageSelect={goToPage}
			/>
			{error ? (
				<p>{error.message}</p>
			) : isLoading ? (
				<p>Loading...</p>
			) : (
				<section>
					<AddTodoForm />
					<ul>
						{pagedData?.map(({ id, title, completed }) => (
							<li key={id}>
								<TodoListItem
									id={id}
									title={title}
									completed={completed}
								/>
							</li>
						))}
					</ul>
				</section>
			)}
		</div>
	);
};

export default memo(HomePage);
