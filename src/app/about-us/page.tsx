'use client';

import Navbar from '@/components/Navbar';
import tellme_logo from '@/assets/images/tellme_logo.png';
import { motion } from 'motion/react';

const AboutUsPage = () => {
  return (
    <main className="min-h-screen bg-background">
      <div className="relative w-full overflow-hidden text-foreground">
        <div className="absolute top-0 left-0 right-0 z-20">
          <Navbar tellme_logo={tellme_logo} />
        </div>

        <section className="pt-24 pb-12 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold mb-4">
                About Us
              </h1>
              <h2 className="border-l-4 border-primary pl-4 italic text-muted-foreground text-lg sm:text-xl">
                Enhance your creativity with High-Quality panoramas and videos.
              </h2>
            </motion.div>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <p className="text-base sm:text-lg leading-relaxed">
                TellMe Media Hub is the brainchild of TellMe Digiinfotech, an
                Experiential Digital Media company with a profuse collection of aerial
                drone shots, HQ 4K cinematic videos and 6K-8K 360 panoramas and
                superior quality videos, both in Monoscopic and steariscopic
                views.TellMe Digiinfotech has been awarded &quot;The best Travel Tech
                company&quot; (under 10 years) by the Economics Times recognizing the
                innovative use we have put in our footages.
              </p>
              <p className="text-base sm:text-lg leading-relaxed">
                TellMe Media Hub is our exclusive online video library platform,
                launched to offer you an exclusive range of videos including
                superior-quality aerial drone shots at the best price. The videos and
                the shots are captured during the lockdown period which adds to its
                exclusivity of being undisturbed by unwanted background clutters.
                Therefore, you can save your editing time Now, be ready to get access
                to innovative and high-quality media content catering to your specific
                needs.
              </p>
              <p className="text-base sm:text-lg leading-relaxed">
                TellMe Media Hub is a rich repository of 4K 30 fps to 100 fps Videos,
                aerial videos, and other superb visual recordings that provide
                uniqueness to your creativity. All our footage is aesthetically
                appealing and also available in logs. We have an expert team of
                experienced and skilled videographers and photographers doing their
                best to deliver videos with crystal-clear resolution.
              </p>
              <p className="text-base sm:text-lg leading-relaxed">
                Our plethora of attractive footage covers a wide range of options from
                serene natural beauty to majestic heritage sites, upscale urban
                captures, and adventurous activity destinations. The videos of TellMe
                Media Hub are not only for professional users, but people can utilize
                them for several purposes to the optimum capacity.
              </p>
              <p className="text-base sm:text-lg leading-relaxed">
                Browse through our wide range of stunning videos and make the best
                choice to provide a creative boost to your marketing strategy at a
                reasonable rate.
              </p>
              
              <div className="mt-8 pt-8 border-t border-border">
                <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
                  Our Vision
                </h2>
                <p className="text-base sm:text-lg leading-relaxed">
                  TellMe Media Hub utilizes the power of the latest technology to
                  capture the footage that are rare and exclusive. We trust that our
                  videos can be helpful for a large community irrespective of personal
                  or professional background.
                </p>
              </div>
              
              <div className="mt-8 pt-8 border-t border-border">
                <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
                  Our Mission
                </h2>
                <p className="text-base sm:text-lg leading-relaxed">
                  Our motto is to be one of the top media providers offering
                  cost-effective video footage that everyone can use optimally to drive
                  towards business success. We are committed to making your visual world
                  come alive.
                </p>
              </div>
            </motion.section>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AboutUsPage;
