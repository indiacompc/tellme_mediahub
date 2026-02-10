'use client';

import ImageGrid from '@/components/ImageGrid';
import SearchBar from '@/components/SearchBar';
import { getAllCategories, getImagesByCategorySlug } from '@/lib/actions';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { LuArrowLeft } from 'react-icons/lu';
import MasonryLayout from './[category]/MasonryLayout';

function ImagesPageContent() {
	const searchParams = useSearchParams();
	const filter = searchParams.get('filter');
	const page = searchParams.get('page');

	const [searchQuery, setSearchQuery] = useState('');
	const [searching, setSearching] = useState(false);
	const [filteredImages, setFilteredImages] = useState<any[]>([]);
	const [categoryName, setCategoryName] = useState<string>('');
	const [loading, setLoading] = useState(false);
	const [totalImages, setTotalImages] = useState(0);
	const [currentPage, setCurrentPage] = useState(page ? parseInt(page) : 1);

	const limit = 10;

	useEffect(() => {
		const loadFilteredImages = async () => {
			if (!filter) {
				setFilteredImages([]);
				setCategoryName('');
				return;
			}

			setLoading(true);
			try {
				const categories = await getAllCategories();
				const category = categories.find((cat) => cat.slug === filter);

				if (category) {
					setCategoryName(category.name);
					const pageNumber = currentPage;
					const skip = (pageNumber - 1) * limit;
					const { images, total } = await getImagesByCategorySlug(
						filter,
						limit,
						skip
					);
					setFilteredImages(images);
					setTotalImages(total);
				} else {
					setFilteredImages([]);
					setCategoryName('');
				}
			} catch (error) {
				console.error('Error loading filtered images:', error);
				setFilteredImages([]);
			} finally {
				setLoading(false);
			}
		};

		loadFilteredImages();
	}, [filter, currentPage]);

	const handleSearch = (query: string) => {
		setSearching(true);
		setSearchQuery(query);
		// Reset searching state after a short delay to trigger the grid update
		setTimeout(() => setSearching(false), 100);
	};

	// If filter is present, show filtered images
	if (filter) {
		return (
			<main className='min-h-screen'>
				<div className='relative container mx-auto px-4 py-4 sm:px-6 sm:py-8 lg:px-8'>
					{categoryName && (
						<div className='mb-4 flex items-center gap-3 sm:mb-6'>
							<Link
								href='/?filter=images'
								className='flex items-center justify-center rounded-lg p-2 transition-colors hover:bg-gray-100'
								aria-label='Back to images'
							>
								<LuArrowLeft className='text-foreground h-5 w-5 sm:h-6 sm:w-6' />
							</Link>
							<h1 className='font-cinzel text-foreground text-xl font-semibold sm:text-2xl'>
								{categoryName}
							</h1>
						</div>
					)}

					{loading ? (
						<div className='flex min-h-[75dvh] w-full items-center justify-center'>
							<p>Loading...</p>
						</div>
					) : (
						<Suspense>
							<MasonryLayout
								images={filteredImages}
								categorySlug={filter}
								pageNumber={currentPage}
								totalPages={Math.ceil(totalImages / limit)}
								limit={limit}
							/>
						</Suspense>
					)}
				</div>
			</main>
		);
	}

	// Default view - show all categories
	return (
		<main className='container mx-auto px-4 py-8'>
			<div className='mb-8 space-y-4'>
				<h1 className='font-cinzel text-foreground text-4xl font-bold md:text-5xl'>
					Image Gallery
				</h1>
				<p className='text-muted-foreground text-lg'>
					Explore our collection of beautiful images organized by category
				</p>
			</div>

			<div className='mb-8'>
				<SearchBar
					onSearch={handleSearch}
					placeholder='Search image categories...'
				/>
			</div>

			<ImageGrid searchQuery={searchQuery} searching={searching} />
		</main>
	);
}

export default function ImagesPage() {
	return (
		<Suspense
			fallback={
				<main className='container mx-auto px-4 py-8'>
					<div className='flex min-h-[75dvh] w-full items-center justify-center'>
						<p>Loading...</p>
					</div>
				</main>
			}
		>
			<ImagesPageContent />
		</Suspense>
	);
}
