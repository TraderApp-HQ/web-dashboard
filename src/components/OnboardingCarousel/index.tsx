import React, { useState, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import DrawnEllipse from "~/components/icons/DrawnEllipse";
import ReferAndEarnIllustration from "~/components/icons/ReferAndEarnIllustration";
import TraderAppIllustration from "~/components/icons/TraderAppIllustration";

const OnboardingCarousel: React.FC = () => {
	const [currentSlide, setCurrentSlide] = useState(0);
	const sliderRef = useRef<Slider | null>(null);

	const CustomPaging = (i: number) => (
		<span
			className={`block rounded-full 
        ${currentSlide === i ? "bg-amber-500 w-11 h-2 rounded-3xl mt-[25px]" : "bg-zinc-300 w-2 h-2.5 mt-6"}
        transition-all duration-300`}
		/>
	);

	const slides = [
		{
			illustration: <TraderAppIllustration className="scale-75 lg:scale-100 mx-auto" />,
			title: (
				<h3 className="text-[#F0F5FF] text-4xl font-bold leading-normal tracking-wide flex items-center gap-2">
					<span className="relative inline-block">
						Easy
						<span className="absolute -left-[84px] top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
							<DrawnEllipse />
						</span>
					</span>
					trading
				</h3>
			),
			subtitle: "Trading made easy with TraderApp",
		},
		{
			illustration: <ReferAndEarnIllustration className="mx-auto scale-75" />,
			title: (
				<h3 className="text-[#F0F5FF] text-4xl font-bold leading-normal tracking-wide flex items-center gap-2">
					Refer and
					<span className="relative inline-block">
						earn
						<span className="absolute -left-[68px] top-[40%] -translate-y-1/2 pointer-events-none flex items-center justify-center">
							<DrawnEllipse className="scale-90 -rotate-45" />
						</span>
					</span>
				</h3>
			),
			subtitle: "Trading made easy with TraderApp",
		},
	];

	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		autoplay: true,
		autoplaySpeed: 4000,
		pauseOnHover: true,
		beforeChange: (_: number, next: number) => setCurrentSlide(next),
		arrows: false,
		customPaging: CustomPaging,
	};

	return (
		<div className="px-4 w-full onboarding-carousel">
			<Slider {...settings} ref={sliderRef}>
				{slides.map((slide, index) => (
					<div key={index} className="outline-none">
						{slide.illustration}
						<div className="flex flex-col items-center -mt-5 lg:mt-0">
							{slide.title}
							<p className="text-[#E1E6EF] text-sm font-normal mt-2">
								{slide.subtitle}
							</p>
						</div>
					</div>
				))}
			</Slider>
		</div>
	);
};

export default OnboardingCarousel;
