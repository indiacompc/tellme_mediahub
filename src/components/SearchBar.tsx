'use client';

import { Search, X } from 'lucide-react';
import { useState } from 'react';

interface SearchBarProps {
	onSearch: (query: string) => void;
	placeholder?: string;
}

export default function SearchBar({
	onSearch,
	placeholder = 'Search videos...'
}: SearchBarProps) {
	const [query, setQuery] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSearch(query);
	};

	const handleClear = () => {
		setQuery('');
		onSearch('');
	};

	return (
		<form onSubmit={handleSubmit} className='mx-auto mb-6 w-full max-w-2xl'>
			<div className='relative'>
				<div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
					<Search className='text-muted-foreground h-5 w-5' />
				</div>
				<input
					type='text'
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder={placeholder}
					className='border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary w-full rounded-lg border py-3 pr-10 pl-10 transition-all focus:border-transparent focus:ring-2 focus:outline-none'
				/>
				{query && (
					<button
						type='button'
						onClick={handleClear}
						className='text-muted-foreground hover:text-foreground absolute inset-y-0 right-0 flex items-center pr-3 transition-colors'
					>
						<X className='h-5 w-5' />
					</button>
				)}
			</div>
		</form>
	);
}
