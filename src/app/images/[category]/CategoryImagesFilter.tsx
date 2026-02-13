'use client';

import { getCategoryLocations } from '@/lib/actions';
import { ScrollArea } from '@/shadcn_data/components/ui/scroll-area';
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from '@/shadcn_data/components/ui/sheet';
import { cn } from '@/shadcn_data/lib/utils';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LuFilter } from 'react-icons/lu';

interface CategoryImagesFilterProps {
	categorySlug: string;
}

const CategoryImagesFilter = ({ categorySlug }: CategoryImagesFilterProps) => {
	const searchParams = useSearchParams();
	const [showFilters, setShowFilters] = useState(false);
	const [states, setStates] = useState<string[]>([]);
	const [cities, setCities] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);

	// Get current filters from URL
	const stateFilter = searchParams.get('state') || undefined;
	const cityFilter = searchParams.get('city') || undefined;

	// Load available locations for this category
	useEffect(() => {
		const loadLocations = async () => {
			setLoading(true);
			try {
				const locations = await getCategoryLocations(categorySlug, stateFilter);
				setStates(locations.states);
				setCities(locations.cities);
			} catch (error) {
				console.error('Error loading category locations:', error);
			} finally {
				setLoading(false);
			}
		};

		if (categorySlug) {
			loadLocations();
		}
	}, [categorySlug, stateFilter]);

	// Build query params
	const buildQuery = (newState?: string, newCity?: string) => {
		const params = new URLSearchParams(searchParams.toString());

		// Preserve filter (category)
		if (searchParams.get('filter')) {
			params.set('filter', searchParams.get('filter')!);
		}

		// Update state filter
		if (newState === undefined) {
			params.delete('state');
		} else if (newState) {
			params.set('state', newState);
		}

		// Update city filter
		if (newCity === undefined) {
			params.delete('city');
		} else if (newCity) {
			params.set('city', newCity);
		}

		// Reset page when filter changes
		params.delete('page');

		return params.toString();
	};

	const capitalizeWords = (str: string) => {
		return str
			.split(' ')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	};

	return (
		<div className='absolute top-0 right-0 py-4 sm:px-6 sm:py-8 lg:px-8'>
			<Sheet
				open={showFilters}
				onOpenChange={(openValue) => setShowFilters(openValue)}
			>
				<SheetTrigger asChild>
					<button
						onClick={() => setShowFilters(!showFilters)}
						className='flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 hover:bg-gray-200 sm:px-4 sm:py-2 dark:bg-gray-800 dark:hover:bg-gray-700'
						aria-label='Open filters'
					>
						<LuFilter className='h-4 w-4 sm:h-5 sm:w-5' />
						<span className='font-poppins text-sm sm:text-base'>Filters</span>
					</button>
				</SheetTrigger>
				<SheetContent className='w-[90%] bg-white/75 sm:max-w-md dark:bg-gray-900/75'>
					<SheetHeader>
						<SheetTitle className='font-cinzel uppercase'>
							Location Filters
						</SheetTitle>
						<SheetDescription className='font-poppins text-gray-700 dark:text-gray-300'>
							Filter images by state and city. Click apply when you&apos;re
							done.
						</SheetDescription>
					</SheetHeader>

					<ScrollArea className='h-[60vh] sm:h-[70vh]'>
						<div className='py-4'>
							{loading ? (
								<div className='flex items-center justify-center py-8'>
									<p className='text-muted-foreground'>Loading locations...</p>
								</div>
							) : (
								<>
									{/* State Filter */}
									{states.length > 0 && (
										<div className='mb-4 sm:mb-6'>
											<h3 className='font-poppins mb-2 font-medium'>States</h3>
											<div className='font-poppins flex flex-wrap gap-1.5 sm:gap-2'>
												<Link
													href={`/images?filter=${categorySlug}&${buildQuery(undefined, cityFilter)}`}
													onClick={() => setShowFilters(false)}
													className={cn(
														'rounded-full px-2 py-1 text-sm sm:px-4 sm:py-2',
														!stateFilter
															? 'bg-black text-white dark:bg-white dark:text-black'
															: 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
													)}
												>
													All States
												</Link>
												{states.map((state) => (
													<Link
														key={state}
														href={`/images?filter=${categorySlug}&${buildQuery(state, cityFilter)}`}
														onClick={() => setShowFilters(false)}
														className={cn(
															'rounded-full px-2 py-1 text-sm capitalize sm:px-4 sm:py-2',
															stateFilter === state
																? 'bg-black text-white dark:bg-white dark:text-black'
																: 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
														)}
													>
														{capitalizeWords(state)}
													</Link>
												))}
											</div>
										</div>
									)}

									{/* City Filter */}
									{cities.length > 0 && (
										<div className='mb-4 sm:mb-6'>
											<h3 className='font-poppins mb-2 font-medium'>Cities</h3>
											<div className='font-poppins flex flex-wrap gap-1.5 sm:gap-2'>
												<Link
													href={`/images?filter=${categorySlug}&${buildQuery(stateFilter, undefined)}`}
													onClick={() => setShowFilters(false)}
													className={cn(
														'rounded-full px-2 py-1 text-sm sm:px-4 sm:py-2',
														!cityFilter
															? 'bg-black text-white dark:bg-white dark:text-black'
															: 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
													)}
												>
													All Cities
												</Link>
												{cities.map((city) => (
													<Link
														key={city}
														href={`/images?filter=${categorySlug}&${buildQuery(stateFilter, city)}`}
														onClick={() => setShowFilters(false)}
														className={cn(
															'rounded-full px-2 py-1 text-sm capitalize sm:px-4 sm:py-2',
															cityFilter === city
																? 'bg-black text-white dark:bg-white dark:text-black'
																: 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
														)}
													>
														{capitalizeWords(city)}
													</Link>
												))}
											</div>
										</div>
									)}

									{states.length === 0 && cities.length === 0 && (
										<div className='flex items-center justify-center py-8'>
											<p className='text-muted-foreground text-sm'>
												No location data available for this category
											</p>
										</div>
									)}
								</>
							)}
						</div>
					</ScrollArea>

					<SheetFooter className='mt-4'>
						<SheetClose asChild>
							<button
								onClick={() => setShowFilters(false)}
								className='font-poppins w-full rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-gray-800 sm:w-auto sm:text-base dark:bg-white dark:text-black dark:hover:bg-gray-200'
							>
								Close
							</button>
						</SheetClose>
					</SheetFooter>
				</SheetContent>
			</Sheet>
		</div>
	);
};

export default CategoryImagesFilter;
