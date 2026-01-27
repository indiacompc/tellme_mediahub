'use client';

import {
	loadShortsFromJSON,
	loadVideosFromJSON,
	searchVideosInDatabase
} from '@/lib/actions';
import type { YouTubeVideo } from '@/types/youtube';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ErrorState from './Error';
import SearchBar from './search-bar';
import VideoCard from './video-card';
import VideoSkeleton from './video-skeleton';

interface VideoGridProps {
	onVideoSelect?: (video: YouTubeVideo) => void;
}

type FilterType = 'videos' | 'shorts';

export default function VideoGrid({ onVideoSelect }: VideoGridProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [videos, setVideos] = useState<YouTubeVideo[]>([]);
	const [shorts, setShorts] = useState<YouTubeVideo[]>([]);
	const [searchResults, setSearchResults] = useState<YouTubeVideo[]>([]);
	const [loading, setLoading] = useState(true);
	const [searching, setSearching] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState('');

	// Initialize filter from URL params, default to "videos"
	const urlFilter = searchParams.get('filter') as FilterType | null;
	const [filter, setFilter] = useState<FilterType>(
		urlFilter === 'shorts' ? 'shorts' : 'videos'
	);

	// Update filter when URL param changes
	useEffect(() => {
		const urlFilter = searchParams.get('filter') as FilterType | null;
		if (urlFilter === 'shorts' || urlFilter === 'videos') {
			setFilter(urlFilter);
		}
	}, [searchParams]);

	const handleVideoSelect = (video: YouTubeVideo) => {
		// Include filter in URL so back button knows where to return
		const filterParam =
			filter === 'shorts' ? '?filter=shorts' : '?filter=videos';
		router.push(`/video/${video.slug}${filterParam}`);
		onVideoSelect?.(video);
	};

	useEffect(() => {
		const loadVideos = async () => {
			try {
				setLoading(true);
				setError(null);

				// Load shorts
				const shortsData = await loadShortsFromJSON();
				setShorts(shortsData);

				// Load random videos from tellme_videohub_db
				try {
					const response = await fetch(
						'/tellme_videohub_db_2025-07-18_171335.json'
					);
					if (response.ok) {
						const data = await response.json();
						if (data?.videos && Array.isArray(data.videos)) {
							// Filter only public videos with YouTube IDs (exclude shorts)
							const allVideos = data.videos.filter(
								(video: any) =>
									video?.youtube_video_id &&
									video?.status === 'public' &&
									!video?.is_short
							);

							// Remove duplicates by youtube_video_id
							const uniqueVideos = Array.from(
								new Map(
									allVideos.map((video: any) => [video.youtube_video_id, video])
								).values()
							);

							// Shuffle and get 15 random videos
							const shuffled = uniqueVideos.sort(() => 0.5 - Math.random());
							const random15 = shuffled.slice(0, 15);

							// Transform to YouTubeVideo format
							const videosData: YouTubeVideo[] = random15.map((video: any) => {
								const videoId = video.youtube_video_id;
								const title = video.title || '';
								const slug =
									video.slug ||
									title
										.toLowerCase()
										.replace(/[^a-z0-9]+/g, '-')
										.replace(/^-+|-+$/g, '') + `-${videoId}`;

								return {
									id: videoId,
									title: title,
									description: video.description || '',
									thumbnail:
										video.thumbnail_url ||
										`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
									publishedAt:
										video.published_on ||
										video.last_modified ||
										new Date().toISOString(),
									channelName: 'Tellme360',
									slug: slug,
									recordingLocation: video.recording_location || undefined
								} as YouTubeVideo;
							});

							setVideos(videosData);
						}
					}
				} catch {
					// Fallback to original videos if random videos fail
					const videosData = await loadVideosFromJSON();
					setVideos(videosData);
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Failed to load videos');
			} finally {
				setLoading(false);
			}
		};

		loadVideos();
	}, []);

	const handleSearch = async (query: string) => {
		setSearchQuery(query);

		if (!query || query.trim().length === 0) {
			setSearchResults([]);
			setSearching(false);
			return;
		}

		try {
			setSearching(true);
			setError(null);
			const results = await searchVideosInDatabase(query);
			setSearchResults(results);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to search videos');
			setSearchResults([]);
		} finally {
			setSearching(false);
		}
	};

	const isSearching = searchQuery.trim().length > 0;

	// When searching, filter results based on current filter selection
	// If filter is "videos", only show videos from search results
	// If filter is "shorts", only show shorts from search results
	let filteredSearchResults: YouTubeVideo[] = [];
	if (isSearching) {
		if (filter === 'videos') {
			filteredSearchResults = searchResults.filter((video) => !video.isShort);
		} else if (filter === 'shorts') {
			filteredSearchResults = searchResults.filter((video) => video.isShort);
		}
	}

	// When searching, use filtered search results; otherwise use loaded videos
	const allRegularVideos = isSearching
		? filteredSearchResults
		: videos.sort(
				(a, b) =>
					new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
			);

	const allShorts = isSearching ? filteredSearchResults : shorts;

	// Apply filter to determine what to display
	const regularVideos = filter === 'videos' ? allRegularVideos : [];
	const displayedShorts = filter === 'shorts' ? allShorts : [];

	if (loading) {
		return (
			<div>
				<SearchBar onSearch={handleSearch} />
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4'>
					{Array.from({ length: 12 }).map((_, i) => (
						<VideoSkeleton key={i} />
					))}
				</div>
			</div>
		);
	}

	if (error) {
		return <ErrorState message={error} />;
	}

	if (videos.length === 0 && !isSearching) {
		return (
			<div>
				<SearchBar onSearch={handleSearch} />
				<ErrorState message='No videos found' />
			</div>
		);
	}

	return (
		<div>
			<SearchBar onSearch={handleSearch} />

			{/* Modern Segmented Control */}
			<div className='mb-6 flex justify-center sm:mb-8'>
				<div className='bg-muted/50 border-border inline-flex items-center rounded-lg border p-1 shadow-sm'>
					<button
						onClick={() => setFilter('videos')}
						className={`relative rounded-md px-6 py-2 text-sm font-medium transition-all duration-200 sm:px-8 sm:py-2.5 sm:text-base ${
							filter === 'videos'
								? 'bg-primary text-primary-foreground shadow-sm'
								: 'text-muted-foreground hover:text-foreground'
						} `}
					>
						Videos
					</button>
					<button
						onClick={() => setFilter('shorts')}
						className={`relative rounded-md px-6 py-2 text-sm font-medium transition-all duration-200 sm:px-8 sm:py-2.5 sm:text-base ${
							filter === 'shorts'
								? 'bg-primary text-primary-foreground shadow-sm'
								: 'text-muted-foreground hover:text-foreground'
						} `}
					>
						Shorts
					</button>
				</div>
			</div>

			{isSearching && (
				<div className='text-muted-foreground mb-4 text-sm'>
					{searching
						? 'Searching...'
						: `Found ${filteredSearchResults.length} ${filter === 'videos' ? 'video' : 'short'}${filteredSearchResults.length !== 1 ? 's' : ''} for "${searchQuery}"`}
				</div>
			)}

			{searching ? (
				<div className='grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4'>
					{Array.from({ length: 6 }).map((_, i) => (
						<VideoSkeleton key={i} />
					))}
				</div>
			) : (
				<>
					{/* Regular Videos Section */}
					{regularVideos.length > 0 && (
						<div className='mb-8 sm:mb-12'>
							<h2 className='text-foreground mb-6 text-2xl font-bold sm:mb-8 sm:text-3xl lg:text-4xl'>
								Videos
							</h2>
							<div className='grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4'>
								{regularVideos.map((video) => (
									<VideoCard
										key={video.slug || video.id}
										video={video}
										onClick={() => handleVideoSelect(video)}
									/>
								))}

								{/* "For More Videos Search" Card */}
								{!isSearching && (
									<div
										onClick={() => {
											// Scroll to top and focus search bar
											window.scrollTo({ top: 0, behavior: 'smooth' });
											// Try to focus search if it exists
											setTimeout(() => {
												const searchInput = document.querySelector(
													'input[type="search"], input[name="query"], input[placeholder*="search" i]'
												) as HTMLInputElement;
												if (searchInput) {
													searchInput.focus();
												}
											}, 500);
										}}
										className='border-primary/50 hover:border-primary bg-card/50 hover:bg-card group flex min-h-[200px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed transition-all duration-300 hover:shadow-lg active:scale-95'
									>
										<div className='p-6 text-center'>
											<div className='bg-primary/10 group-hover:bg-primary/20 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full transition-colors'>
												<svg
													className='text-primary h-8 w-8'
													fill='none'
													stroke='currentColor'
													viewBox='0 0 24 24'
												>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={2}
														d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
													/>
												</svg>
											</div>
											<h4 className='text-foreground group-hover:text-primary mb-2 text-base font-semibold transition-colors sm:text-lg'>
												For More Videos
											</h4>
											<p className='text-muted-foreground text-sm'>
												Search Now
											</p>
										</div>
									</div>
								)}
							</div>
						</div>
					)}

					{/* Shorts Section - Show when not searching (main page) or when search has shorts */}
					{displayedShorts.length > 0 && (
						<div>
							<h2 className='text-foreground mb-6 text-2xl font-bold sm:mb-8 sm:text-3xl lg:text-4xl'>
								Shorts
							</h2>
							<div className='-mx-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6'>
								<div className='flex min-w-max gap-3 sm:gap-4'>
									{displayedShorts.map((video) => (
										<div
											key={video.slug || video.id}
											className='w-[160px] flex-shrink-0 sm:w-[180px] md:w-[200px]'
										>
											<VideoCard
												video={video}
												onClick={() => handleVideoSelect(video)}
											/>
										</div>
									))}
								</div>
							</div>
						</div>
					)}

					{/* Show message if no videos found */}
					{regularVideos.length === 0 && displayedShorts.length === 0 && (
						<ErrorState
							message={
								isSearching
									? `No videos found for "${searchQuery}"`
									: 'No videos found'
							}
						/>
					)}
				</>
			)}
		</div>
	);
}
