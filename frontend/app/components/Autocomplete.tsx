import React, {
	useState,
	useEffect,
	useRef,
	useMemo,
	useCallback,
} from "react";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import AnimatePresenceProvider from "../context/AnimatePresenceProvider";
import { motion } from "framer-motion";

interface Props {
	id: string;
	placeholder: string;
	suggestions: any[];
	onSelectionChange: (value: string) => void;
    svgIcon?: React.ReactNode;
}

const CustomAutocomplete: React.FC<Props> = ({
	id,
	placeholder,
	suggestions,
	onSelectionChange,
    svgIcon
}) => {
	const [inputValue, setInputValue] = useState("");
	const [showSuggestions, setShowSuggestions] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
	const [isMouseInside, setIsMouseInside] = useState(false);

	// Memoize filtered suggestions
	const isObjectSuggestion = useMemo(
        () => suggestions.some((suggestion) => typeof suggestion === 'object' && 'value' in suggestion && 'label' in suggestion),
        [suggestions]
      );
    
      const filteredSuggestions = useMemo(() => {
        const lowerInputValue = inputValue.toString().toLowerCase(); // Ensure inputValue is treated as a string
        if (!lowerInputValue) return suggestions; // Show all if no input value
        return suggestions.filter((suggestion) =>
          isObjectSuggestion
            ? suggestion.label.toLowerCase().includes(lowerInputValue)
            : suggestion.toString().toLowerCase().includes(lowerInputValue)
        );
      }, [inputValue, suggestions, isObjectSuggestion]);
    
     

	// Handle input change with useCallback to prevent function recreation
	const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        onSelectionChange(newValue);
      
        if (filteredSuggestions.length > 0) {
          const lastSuggestion = filteredSuggestions[filteredSuggestions.length - 1];
          // Ensure lastSuggestion is not undefined before accessing its properties
          const lastSuggestionValue = isObjectSuggestion && lastSuggestion ? lastSuggestion.value.toString() : lastSuggestion;
      
          if (newValue === lastSuggestionValue) {
            setShowSuggestions(false);
          } else {
            setShowSuggestions(true);
          }
        }
      }, [onSelectionChange, filteredSuggestions, isObjectSuggestion, setShowSuggestions]);
      

	const handleFocus = useCallback(() => {
        setShowSuggestions(true);
        const lastSuggestion = filteredSuggestions[filteredSuggestions.length - 1];
        const lastSuggestionValue = isObjectSuggestion ? lastSuggestion.value : lastSuggestion;
        
        if (inputValue === lastSuggestionValue) {
          setShowSuggestions(false);
        } else {
          setShowSuggestions(true);
        }
	}, []);

	const handleBlur = useCallback(() => {
		if (!isMouseInside) {
			setShowSuggestions(false);
		}
	}, [isMouseInside]);

    const handleSuggestionClick = useCallback((suggestion: any) => {
        if (isObjectSuggestion && typeof suggestion === 'object' && 'label' in suggestion && 'value' in suggestion) {
          setInputValue(suggestion.label); // Assuming label is of type string
          onSelectionChange(suggestion.value); // Assuming value is the type you need for onSelectionChange
        } else if (typeof suggestion === 'string') {
          setInputValue(suggestion);
          onSelectionChange(suggestion);
        }
        setShowSuggestions(false);
        setActiveSuggestionIndex(0);
      }, [onSelectionChange, isObjectSuggestion]);

      const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && e.metaKey) {
          e.preventDefault();
          setInputValue('');
          setActiveSuggestionIndex(0);
          onSelectionChange('');
          setShowSuggestions(true);
        } else switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            setActiveSuggestionIndex(prevIndex => 
              prevIndex < filteredSuggestions.length - 1 ? prevIndex + 1 : prevIndex);
            break;
          case 'ArrowUp':
            e.preventDefault();
            setActiveSuggestionIndex(prevIndex => 
              prevIndex > 0 ? prevIndex - 1 : 0);
            break;
          case 'Enter':
            e.preventDefault();
            if (filteredSuggestions.length > 0) {
              const selectedSuggestion = filteredSuggestions[activeSuggestionIndex];
              if (selectedSuggestion !== undefined) {
                if (isObjectSuggestion && typeof selectedSuggestion === 'object' && 'label' in selectedSuggestion && 'value' in selectedSuggestion) {
                  setInputValue(selectedSuggestion.label); // Use the label for display
                  onSelectionChange(selectedSuggestion.value.toString()); // Pass the value for further processing
                } else if (typeof selectedSuggestion === 'string') {
                  setInputValue(selectedSuggestion);
                  onSelectionChange(selectedSuggestion);
                }
                setShowSuggestions(false);
                setActiveSuggestionIndex(0);
                inputRef.current?.focus();
              }
            }
            break;
          case 'Backspace':
            // No additional logic needed here
            break;
          default:
            break;
        }
      }, [activeSuggestionIndex, filteredSuggestions, onSelectionChange, isObjectSuggestion]);
      
      
      const popoverVariant = {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: "easeOut" }},
        exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2, ease: "easeIn" }},
    };

	return (
		<div
			className="relative w-full"
			onMouseEnter={() => setIsMouseInside(true)}
			onMouseLeave={() => setIsMouseInside(false)}
		>   
            <div className="w-full h-[80px] relative cursor-pointer bg-secondary rounded-xl flex flex-row justify-start items-center px-5">
                <div className="w-12 flex-shrink-0 h-12 grid place-content-center relative">
                    {svgIcon}
                    <div className="w-full h-full absolute top-0 left-0 bg-accent z-0 rounded-full"></div>
                </div>
                <div className="flex items-center flex-row w-full relative">
                    <label htmlFor={id} className={`absolute cursor-pointer left-3 text-foreground/50 transition-all duration-200 ease-in-out top-1/2 -translate-y-1/2 ${inputValue || showSuggestions ? 'transform -translate-y-6 text-[15px]' : 'text-lg'}`}>
                        {placeholder}
                    </label>                
                    <input
                        ref={inputRef}
                        type="text"
                        id={id}
                        value={inputValue}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        autoComplete="off"
                        autoCapitalize="off"
                        autoCorrect="off"
                        className="w-full bg-secondary pt-4 pl-3 text-[18px] font-medium border-none outline-none"
                    />
                </div>
            </div>
            <AnimatePresenceProvider>
                {showSuggestions && filteredSuggestions.length > 0 && (
                    <> 
                        <motion.div 
                            variants={popoverVariant} 
                            initial="initial" 
                            animate="animate" 
                            exit="exit" 
                            key={id}
                            className="absolute z-50 w-full max-h-80 overflow-auto noscrollbar p-0 border bg-background border-muted rounded-lg"
                        >
                            {filteredSuggestions.map((suggestion, index) => {
                                const displayValue = isObjectSuggestion ? suggestion.label : suggestion
                                return (
                                    <>  
                                        {index !== 0 && <hr className="w-[100%] h-[1px] bg-secondary/20" />}
                                        <div key={index} onClick={() => handleSuggestionClick(suggestion)} className={`px-5 py-3 cursor-pointer text-foreground text-[18px] font-medium ${index === activeSuggestionIndex ? 'bg-[#fafafa] dark:bg-[#202020] ' : 'bg-background'}`}>
                                            {displayValue}
                                        </div>
                                    </>
                                );
                            })}
                        </motion.div>
                    </>
                )} 
            </AnimatePresenceProvider>
		</div>
	);
};

export default CustomAutocomplete;
