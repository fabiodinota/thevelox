import React, {
	useState,
	useEffect,
	useRef,
	useMemo,
	useCallback,
} from "react";

interface Props {
	id: string;
	placeholder: string;
	suggestions: any[];
	onSelectionChange: (value: string) => void;
}

const CustomAutocomplete: React.FC<Props> = ({
	id,
	placeholder,
	suggestions,
	onSelectionChange,
	...props
}) => {
	const [inputValue, setInputValue] = useState("");
	const [showSuggestions, setShowSuggestions] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
	const [isMouseInside, setIsMouseInside] = useState(false);

	// Memoize filtered suggestions
	const filteredSuggestions = useMemo(() => {
        if (!inputValue) return suggestions; // Show all if no input value
        return suggestions.filter(suggestion =>
          suggestion.toLowerCase().includes(inputValue.toLowerCase())
        );
      }, [inputValue, suggestions]);

	// Handle input change with useCallback to prevent function recreation
	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setInputValue(e.target.value);
			onSelectionChange(e.target.value);
		},
		[onSelectionChange]
	);

	const handleFocus = useCallback(() => {
		setShowSuggestions(true);
	}, []);

	const handleBlur = useCallback(() => {
		// Only hide suggestions if the mouse is not over the suggestion list
		if (!isMouseInside) {
			setShowSuggestions(false);
		}
	}, [isMouseInside]);

	const handleSuggestionClick = useCallback((value: string) => {
        setInputValue(value); // Assuming this sets the input display value directly
        onSelectionChange(value); // Pass the full string for form handling
        setShowSuggestions(false);
        setActiveSuggestionIndex(0); // Reset the index
      }, [onSelectionChange]);

      const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        // Check for Cmd (Meta) + Backspace combination on macOS
        if (e.key === 'Backspace' && e.metaKey) {
          // Prevent the default action to avoid navigating back in browser history
          e.preventDefault();
          // Clear the input field
          setInputValue('');
          // Optionally, reset the active suggestion index
          setActiveSuggestionIndex(0);
          // Notify parent component or form about the change
          onSelectionChange('');
          // Since the input is cleared, you might want to hide suggestions or handle as needed
          setShowSuggestions(true);
        } else switch (e.key) {
          case 'ArrowDown':
            e.preventDefault(); // Prevent cursor movement in input
            setActiveSuggestionIndex(prevIndex => 
              prevIndex < filteredSuggestions.length - 1 ? prevIndex + 1 : prevIndex);
            break;
          case 'ArrowUp':
            e.preventDefault(); // Prevent cursor movement in input
            setActiveSuggestionIndex(prevIndex => 
              prevIndex > 0 ? prevIndex - 1 : 0);
            break;
          case 'Enter':
            e.preventDefault(); // Prevent form submission or losing focus
            const selectedSuggestion = filteredSuggestions[activeSuggestionIndex];
            if (selectedSuggestion !== undefined) {
              setInputValue(selectedSuggestion);
              onSelectionChange(selectedSuggestion);
              setShowSuggestions(false);
              setActiveSuggestionIndex(0);
              inputRef.current?.focus();
            }
            break;
          case 'Backspace':
            break;
          default:
            break;
        }
      }, [activeSuggestionIndex, filteredSuggestions, onSelectionChange]);
      
      

	return (
		<div
			className="relative"
			onMouseEnter={() => setIsMouseInside(true)}
			onMouseLeave={() => setIsMouseInside(false)}
		>
			<input
				ref={inputRef}
				type="text"
				id={id}
				placeholder={placeholder}
				value={inputValue}
				onChange={handleChange}
				onFocus={handleFocus}
				onBlur={handleBlur}
				onKeyDown={handleKeyDown}
				{...props}
				className="w-full h-[50px] border border-gray-500 bg-white dark:bg-background rounded-xl px-5"
			/>
			{showSuggestions && filteredSuggestions.length > 0 && (
				<ul className="absolute z-10 bg-white dark:bg-background border border-gray-300 dark:border-gray-700 rounded-md w-full max-h-80 overflow-auto noscrollbar">
					{filteredSuggestions.map((suggestion, index) => (
						<li
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)} // Adjust this if necessary
                        className={`px-4 py-2 cursor-pointer ${index === activeSuggestionIndex ? 'bg-gray-100' : 'bg-white'}`}
                      >
                            {suggestion}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default CustomAutocomplete;
