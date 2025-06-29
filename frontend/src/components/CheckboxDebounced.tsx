import {
	useCallback,
	useEffect,
	useRef,
	useState,
	type ChangeEventHandler,
} from 'react';

interface CheckboxDebouncedProps {
	value: boolean;
	debounce?: number;
	onChange: (value: boolean) => void;
}

export const CheckboxDebounced = ({
	value,
	debounce = 1000,
	onChange,
}: CheckboxDebouncedProps) => {
	const [internalValue, setInternalValue] = useState(false);
	const debounceTimerRef = useRef<number | null>(null);

	const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
		(e) => {
			const checked = e.target.checked;
			setInternalValue(checked);
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}
			debounceTimerRef.current = setTimeout(() => {
				if (checked === value) {
					return;
				}
				onChange(checked);
			}, debounce);
		},
		[debounce, onChange, value]
	);

	useEffect(() => {
		setInternalValue(value);
	}, [value]);

	useEffect(() => {
		return () => {
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}
		};
	}, []);

	return (
		<input
			type="checkbox"
			checked={internalValue}
			onChange={handleChange}
		/>
	);
};

interface TextInputDebouncedProps {
	value: string;
	debounce?: number;
	onChange: (value: string) => void;
}

export const TextInputDebounced = ({
	value,
	debounce = 1000,
	onChange,
}: TextInputDebouncedProps) => {
	const [internalValue, setInternalValue] = useState('');
	const debounceTimerRef = useRef<number | null>(null);
	const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
		(e) => {
			const v = e.target.value;
			setInternalValue(v);

			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}

			debounceTimerRef.current = setTimeout(() => {
				if (value === v) {
					return;
				}
				onChange(v);
			}, debounce);
		},
		[debounce, onChange, value]
	);

	useEffect(() => {
		setInternalValue(value);
	}, [value]);

	useEffect(() => {
		return () => {
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}
		};
	}, []);

	return <input value={internalValue} onChange={handleChange} />;
};
