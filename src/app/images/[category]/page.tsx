import { getAllCategories, getImagesByCategorySlug } from '@/lib/actions';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import MasonryLayout from './MasonryLayout';

type PhotoCategoryPageProps = {
	params: Promise<{ category: string }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// Reduced limit to minimize bandwidth usage
const limit = 8;

export async function generateMetadata({
	params,
	searchParams
}: PhotoCategoryPageProps): Promise<Metadata> {
	const paramsAwaited = await params;
	const searchParamsAwaited = await searchParams;

	const page = searchParamsAwaited.page
		? Array.isArray(searchParamsAwaited.page)
			? searchParamsAwaited.page[0]
			: searchParamsAwaited.page
		: undefined;

	const pageNumber = page ? Number.parseInt(page) : 1;

	// Get category info
	const categories = await getAllCategories();
	const category = categories.find(
		(cat) => cat.slug === paramsAwaited.category
	);

	if (!category) {
		notFound();
	}

	const title = `${category.name}${pageNumber > 1 ? ` | Page ${pageNumber}` : ''}`;

	return {
		title,
		description: `Browse ${category.name} images`,
		category: 'Image Category Gallery',
		openGraph: {
			title,
			description: `Browse ${category.name} images`,
			type: 'website'
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description: `Browse ${category.name} images`
		}
	};
}

const PhotoCategoryPage = async ({
	params,
	searchParams
}: PhotoCategoryPageProps) => {
	const [paramsAwaited, searchParamsAwaited] = await Promise.all([
		params,
		searchParams
	]);

	const page = searchParamsAwaited.page
		? Array.isArray(searchParamsAwaited.page)
			? searchParamsAwaited.page[0]
			: searchParamsAwaited.page
		: undefined;

	const pageNumber = page ? Number.parseInt(page) : 1;

	// Get category info
	const categories = await getAllCategories();
	const category = categories.find(
		(cat) => cat.slug === paramsAwaited.category
	);

	if (!category) {
		notFound();
	}

	// Get images for this category (only first 10 initially)
	const skip = (pageNumber - 1) * limit;
	const { images: imageListingsData, total: total_images } =
		await getImagesByCategorySlug(paramsAwaited.category, limit, skip);

	return (
		<main className='min-h-screen'>
			<div className='relative container mx-auto px-4 py-4 sm:px-6 sm:py-8 lg:px-8'>
				<div className='mb-4 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between'></div>

				<Suspense>
					<MasonryLayout
						images={imageListingsData}
						categorySlug={paramsAwaited.category}
						pageNumber={pageNumber}
						totalPages={Math.ceil(total_images / limit)}
						limit={limit}
					/>
				</Suspense>
			</div>
		</main>
	);
};

export default PhotoCategoryPage;
