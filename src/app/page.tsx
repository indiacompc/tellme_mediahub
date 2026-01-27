import tellme_logo from '@/assets/images/tellme_logo.png';
import BannerSection from '@/components/BannerSection';
import HomeContent from '@/components/HomeContent';

export default function Home() {
	return (
		<main>
			<BannerSection tellme_logo={tellme_logo} />
			<HomeContent />
		</main>
	);
}
