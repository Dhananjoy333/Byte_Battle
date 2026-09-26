"use client";
import Image from "next/image";
import AnimatedTitle from "./AnimatedTitle";
import { useRef } from "react";
import gsap from "gsap";
import RoundedCorners from "./RoundedCorners";
import Button from "./Button";

const IMAGEKIT_URL = process.env.NEXT_PUBLIC_IMAGEKIT_URL;

function Story() {
  const frameRef = useRef<HTMLImageElement | null>(null);

  const handleMouseLeave = () => {
    const element = frameRef.current;
    gsap.to(element, {
      duration: 0.3,
      rotateX: 0,
      rotateY: 0,
      ease: "power1.inOut",
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const element = frameRef.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    gsap.to(element, {
      duration: 0.3,
      rotateX,
      rotateY,
      transformPerspective: 500,
      ease: "power1.inOut",
    });
  };

  return (
    <section id="story" className="min-h-dvh w-screen bg-black text-blue-50">
      <div className="flex size-full flex-col items-center py-10 pb-24">
        <p className="font-general text-sm uppercase md:text-[17px]">
          THE ORIGIN OF BYTE BATTLE
        </p>
        <div className="relative size-full">
          <AnimatedTitle
            title="when c<b>o</b>de becomes <br/> co<b>m</b>bat"
            sectionId="#story"
            containerClass="mt-5 pointer-events-none mix-blend-difference relative z-10"
          />
          <div className="story-img-container">
            <div className="story-img-mask">
              <div className="story-img-content">
                <Image
                  onMouseLeave={handleMouseLeave}
                  onMouseUp={handleMouseLeave}
                  onMouseEnter={handleMouseLeave}
                  onMouseMove={handleMouseMove}
                   src={`${IMAGEKIT_URL}/img/entrance.webp`}
                  alt="entrance"
                  width={2000}
                  height={2000}
                  ref={frameRef}
                  className="object-contain md:w-full md:h-full"
                />
              </div>
            </div>
            <RoundedCorners />
          </div>
        </div>
        <div className="-mt-130 flex w-full justify-center md:-mt-104 md:me-44 md:justify-end ">
          <div className="flex h-full w-fit flex-col items-center md:items-start">
            <p className="mt-3 max-w-sm text-center font-circular-web text-violet-50 md:text-start">
              A mysterious force has pulled warriors from different worlds into one arena. Here, knowledge is power, code is your weapon, and only the sharpest minds survive.
            </p>

            <Button
              id="realm-btn"
              title="DISCOVER THE STORY"
              containerClass="mt-5"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Story;
