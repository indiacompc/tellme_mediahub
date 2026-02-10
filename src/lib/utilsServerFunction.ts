'use server';

// Backend SDK imports - commented out since using JSON
// Uncomment if you need backend functionality
/*
import {
	blogCreateBlogPost,
	blogEditBlogPost,
	commonCreateGridAnimation,
	commonEditGridAnimation,
	commonSubmitContactUs,
	commonSubmitNewsLetterSubscription,
	fileHandlerRemoveFile,
	fileHandlerRemoveFolder,
	imagesCreateImageCategory,
	imagesCreateImageListing,
	imagesEditImageCategory,
	imagesEditImageListing,
	imagesGetImageListings,
	imagesRemoveImageListingById,
	paymentCreateCartItem,
	paymentCreateRazorpayOrder,
	paymentCreateTransaction,
	paymentCreateWishlistItem,
	paymentGetCartItemsByUserId,
	paymentGetDownloadDetailsByPurchaseId,
	paymentGetWishlistItemsByUserId,
	paymentRemoveCartItemById,
	paymentRemoveWishlistItemById,
	userRequestOtp,
	userUserPasswordChangeRequest,
	videosCreateVideoCategory,
	videosCreateVideoListing,
	videosEditVideoCategory,
	videosEditVideoListing,
	videosRemoveVideoListingById
} from '@/client/sdk.gen';
import type {
	BlogPostCreateInput,
	CartItemCreateInput,
	ContactUsFormInput,
	GridAnimationCreateInput,
	GridAnimationCreateOutput,
	ImageCategoryCreateInput,
	ImageCategoryCreateOutput,
	ImageCreateInput,
	ImageCreateOutput,
	ImageListingsInput,
	NewsLetterSubscriptionFormInput,
	RazorpayOrderCreateInput,
	RequestOtpInput,
	SingleBlogPostData,
	TransactionCreateInput,
	UserPasswordChangeRequestInput,
	VideoCategoryCreateInput,
	VideoCategoryCreateOutput,
	VideoCreateInput,
	VideoCreateOutput,
	WishlistItemCreateInput
} from '@/client/types.gen';
*/

// Backend functions - commented out since using JSON
// Uncomment and fix imports if you need backend functionality

/*
export const handleServerAction = async <T>(
	action: (...params: any[]) => Promise<T>,
	...params: any[]
): Promise<T> => {
	try {
		return await action(...params);
	} catch (error: any) {
		throw new Error(error.message);
	}
};

export const submitContactFormData = async (inputData: ContactUsFormInput) => {
	const { data, error } = await commonSubmitContactUs({
		body: inputData
	});
	return { data, error };
};

export const submitNewsLetterSubscription = async (
	inputData: NewsLetterSubscriptionFormInput
) => {
	const { data, error } = await commonSubmitNewsLetterSubscription({
		body: inputData
	});
	return { data, error };
};

export const requestOtp = async (inputData: RequestOtpInput) => {
	const { data, error } = await userRequestOtp({
		body: inputData
	});
	return { data, error };
};

export const createImageListing = async (inputData: ImageCreateInput) => {
	const { data, error } = await imagesCreateImageListing({
		body: inputData
	});
	revalidatePath('/india/photos');
	return { data, error };
};

export const createVideoListing = async (inputData: VideoCreateInput) => {
	const { data, error } = await videosCreateVideoListing({
		body: inputData
	});
	revalidatePath('/india/videos');
	return { data, error };
};

export const editVideoListing = async (inputData: VideoCreateOutput) => {
	const { data, error } = await videosEditVideoListing({
		body: inputData
	});
	revalidatePath('/india/videos');
	if (data) {
		revalidatePath(`/india/videos/detail/${data.slug}`);
	}
	return { data, error };
};

export const createImageCategory = async (
	inputData: ImageCategoryCreateInput
) => {
	const { data, error } = await imagesCreateImageCategory({
		body: inputData
	});
	revalidatePath('/india/photos');
	if (data) {
		revalidatePath(`/india/photos/category/${data.slug}`);
	}
	return { data, error };
};

export const createBlogPost = async (inputData: BlogPostCreateInput) => {
	const { data, error } = await blogCreateBlogPost({
		body: inputData
	});
	if (data) {
		revalidatePath('/blog');
		revalidatePath('/blog/posts');
		revalidatePath(`/india/photos/category/${data.slug}`);
	}
	return { data, error };
};

export const editBlogPost = async (inputData: SingleBlogPostData) => {
	const { data, error } = await blogEditBlogPost({
		body: inputData
	});
	if (data) {
		revalidatePath('/blog');
		revalidatePath('/blog/posts');
		revalidatePath(`/india/photos/category/${data.slug}`);
	}
	return { data, error };
};

export const editImageCategory = async (
	inputData: ImageCategoryCreateOutput
) => {
	const { data, error } = await imagesEditImageCategory({
		body: inputData
	});
	revalidatePath('/india/photos');
	if (data) {
		revalidatePath(`/india/photos/category/${data.slug}`);
	}
	return { data, error };
};

export const editImageListing = async (inputData: ImageCreateOutput) => {
	const { data, error } = await imagesEditImageListing({
		body: inputData
	});
	revalidatePath('/india/photos');
	if (data) {
		revalidatePath(`/india/photos/detail/${data.slug}`);
	}
	return { data, error };
};

export const userPasswordChangeRequest = async (
	inputData: UserPasswordChangeRequestInput
) => {
	const { data, error } = await userUserPasswordChangeRequest({
		body: inputData
	});
	return { data, error };
};

export const getDownloadDetailsByPurchaseId = async (purchaseId: number) => {
	const { data, error } = await paymentGetDownloadDetailsByPurchaseId({
		query: { id: purchaseId }
	});
	return { data, error };
};

export const removeImageListingById = async (id: number) => {
	const { data, error } = await imagesRemoveImageListingById({
		query: { id: id }
	});
	return { data, error };
};

export const removeVideoListingById = async (id: number) => {
	const { data, error } = await videosRemoveVideoListingById({
		query: { id: id }
	});
	return { data, error };
};

export const createGridAnimation = async (
	inputData: GridAnimationCreateInput
) => {
	const { data, error } = await commonCreateGridAnimation({
		body: inputData
	});
	revalidateTag('gridAnimation', '/');
	return { data, error };
};

export const editGridAnimation = async (
	inputData: GridAnimationCreateOutput
) => {
	const { data, error } = await commonEditGridAnimation({
		body: inputData,
		next: { revalidate: false }
	});
	revalidateTag('gridAnimation', '/');
	return { data, error };
};
*/

/*
export const createCartItem = async (inputData: CartItemCreateInput) => {
	const { data, error } = await paymentCreateCartItem({
		body: inputData
	});
	revalidatePath('/shop/cart');
	return { data, error };
};

export const removeCartItemById = async (id: number) => {
	const { data, error } = await paymentRemoveCartItemById({
		query: { id: id }
	});
	revalidatePath('/shop/cart');
	return { data, error };
};
*/

/**
 * Gets next page of images from JSON file by category slug
 * @param categorySlug - Category slug
 * @param pageNumber - Page number (1-indexed)
 * @param limit - Number of images per page
 * @returns Array of images
 */
export const getNextPageImageListingsData = async (
	categorySlug: string,
	pageNumber: number,
	limit: number
) => {
	const { getImagesByCategorySlug } = await import('@/lib/actions');
	const skip = (pageNumber - 1) * limit;
	const { images } = await getImagesByCategorySlug(categorySlug, limit, skip);
	return images;
};

/*
export const getCartItemsByUserId = async (created_by_id: number) => {
	const { data, error } = await paymentGetCartItemsByUserId({
		query: { created_by_id: created_by_id }
	});
	return { data, error };
};

export const createWishlistItem = async (
	inputData: WishlistItemCreateInput
) => {
	const { data, error } = await paymentCreateWishlistItem({
		body: inputData
	});
	return { data, error };
};

export const removeWishlistItemById = async (id: number) => {
	const { data, error } = await paymentRemoveWishlistItemById({
		query: { id: id }
	});
	return { data, error };
};

export const getWishlistItemsByUserId = async (created_by_id: number) => {
	const { data, error } = await paymentGetWishlistItemsByUserId({
		query: { created_by_id: created_by_id }
	});
	return { data, error };
};

export const createVideoCategory = async (
	inputData: VideoCategoryCreateInput
) => {
	const { data, error } = await videosCreateVideoCategory({
		body: inputData
	});
	return { data, error };
};

export const editVideoCategory = async (
	inputData: VideoCategoryCreateOutput
) => {
	const { data, error } = await videosEditVideoCategory({
		body: inputData
	});
	return { data, error };
};

export const removeFileOnServer = async (file_path: string) => {
	const { data, error } = await fileHandlerRemoveFile({
		query: { file_path: file_path }
	});
	return { data, error };
};

export const removeFolderOnServer = async (folder_path: string) => {
	const { data, error } = await fileHandlerRemoveFolder({
		query: { folder_path: folder_path }
	});
	return { data, error };
};

export const createRazorpayOrder = async (
	inputData: RazorpayOrderCreateInput
) => {
	const { data, error } = await paymentCreateRazorpayOrder({
		body: inputData
	});
	return { data, error };
};

export const createTransaction = async (inputData: TransactionCreateInput) => {
	const { data, error } = await paymentCreateTransaction({
		body: inputData
	});
	return { data, error };
};
*/
