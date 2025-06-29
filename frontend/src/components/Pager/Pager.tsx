import { useCallback, useEffect, useMemo, useState } from 'react';

interface PagerProps {
	currentPage: number;
	totalPages: number;
	isPrevEnabled: boolean;
	isNextEnabled: boolean;
	onPrev: () => void;
	onNext: () => void;
	onPageSelect: (page: number) => void;
}
export const Pager = ({
	currentPage,
	totalPages,
	isPrevEnabled,
	isNextEnabled,
	onPrev,
	onNext,
	onPageSelect,
}: PagerProps) => {
	return (
		<div>
			<button onClick={onPrev} disabled={!isPrevEnabled}>
				Prev
			</button>
			{Array.from({ length: totalPages }, (_, i) => (
				<span key={i} onClick={() => onPageSelect(i)}>
					{i}
					{i == currentPage ? '*' : ''}
				</span>
			))}
			<button onClick={onNext} disabled={!isNextEnabled}>
				Next
			</button>
		</div>
	);
};

interface UsePagerProps<T> {
	data: T[] | null | undefined;
	pageSize?: number;
}

export const usePager = <T,>({ data, pageSize = 5 }: UsePagerProps<T>) => {
	const [currentPage, setCurrentPage] = useState(0);

	const totalPages = Math.ceil((data?.length ?? 0) / pageSize);

	const pagedData = useMemo(() => {
		if (!data) {
			return [];
		}
		const start = currentPage * pageSize;
		return data.slice(start, start + pageSize);
	}, [currentPage, data, pageSize]);

	const prevPage = useCallback(() => {
		setCurrentPage((current) => Math.max(current - 1, 0));
	}, []);

	const nextPage = useCallback(() => {
		setCurrentPage((current) => Math.min(current + 1, totalPages - 1));
	}, [totalPages]);

	const goToPage = useCallback((page: number) => {
		setCurrentPage(page);
	}, []);

	const isPrevEnabled = currentPage > 0;
	const isNextEnabled = currentPage < totalPages - 1;

	useEffect(() => {
		if (currentPage >= totalPages) {
			setCurrentPage(Math.max(totalPages - 1, 0));
		}
	}, [currentPage, totalPages]);

	return {
		currentPage,
		totalPages,
		pagedData,
		isPrevEnabled,
		isNextEnabled,
		prevPage,
		nextPage,
		goToPage,
	};
};
