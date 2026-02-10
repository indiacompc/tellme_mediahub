export interface ImageListing {
	id: number;
	title: string;
	description: string;
	slug: string;
	src: string;
	width: number;
	height: number;
	image_category_id: string;
	category_slug?: string;
	state: string;
	city: string;
	captured_location: string;
	captured_date: string;
	meta_title: string;
	meta_description: string;
	meta_keywords: string;
	status: string;
	priority: number;
	created_at: string;
	last_modified: string;
	latitude?: number;
	longitude?: number;
}

export interface ImageCategory {
	categoryId: string;
	categoryName: string;
	categorySlug?: string; // URL-friendly slug
	images: ImageListing[];
}
