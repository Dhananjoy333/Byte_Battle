'use client'

import { useRef, useState, useEffect } from "react"
import Button from "./Button"
import { TiLocationArrow } from "react-icons/ti"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"
import ExpandButton from "@/app/_components/main_page/ExpandButton";

gsap.registerPlugin(ScrollTrigger)

const TOTAL_VIDEOS = 4
const getVideoSrc = (index: number) => `videos/hero-${index}.mp4`

export default function Hero() {
  const [activeSlot, setActiveSlot] = useState<'A' | 'B'>('A')
  const [srcA, setSrcA] = useState(getVideoSrc(1))
  const [srcB, setSrcB] = useState(getVideoSrc(2))
  const [loading, setLoading] = useState(true)

  const videoRefA = useRef<HTMLVideoElement | null>(null)
  const videoRefB = useRef<HTMLVideoElement | null>(null)
  const currentIdxRef = useRef(1)

  // Preload initial videos
  useEffect(() => {
    let loadedCount = 0
    const neededVideos = [1, 2]

    neededVideos.forEach((idx) => {
      const video = document.createElement("video")
      video.src = getVideoSrc(idx)
      video.preload = "auto"

      const markLoaded = () => {
        loadedCount += 1
        if (loadedCount >= neededVideos.length) {
          setLoading(false)
        }
      }

      video.onloadeddata = markLoaded
      video.onerror = markLoaded
    })

    const timeout = setTimeout(() => setLoading(false), 4000)
    return () => clearTimeout(timeout)
  }, [])

  const handleVideoEnd = () => {
    const nextIdx = (currentIdxRef.current % TOTAL_VIDEOS) + 1
    currentIdxRef.current = nextIdx
    const nextSlot = activeSlot === 'A' ? 'B' : 'A'

    const expandingEl = nextSlot === 'B' ? videoRefB.current : videoRefA.current
    const retiringEl = nextSlot === 'B' ? videoRefA.current : videoRefB.current

    if (!expandingEl || !retiringEl) return

    // Position expanding element on top in small center box
    gsap.set(expandingEl, {
      zIndex: 20,
      scale: 0.25,
      width: '16rem',
      height: '16rem',
      transformOrigin: 'center center',
      visibility: 'visible'
    })

    expandingEl.currentTime = 0
    expandingEl.play()

    gsap.to(expandingEl, {
      scale: 1,
      width: '100%',
      height: '100%',
      duration: 1,
      ease: 'power1.inOut',
      onComplete: () => {
        // Drop retiring video to bottom and preload the subsequent video into it
        gsap.set(retiringEl, { zIndex: 10, visibility: 'hidden' })
        retiringEl.pause()

        const subsequentIdx = (nextIdx % TOTAL_VIDEOS) + 1
        if (nextSlot === 'B') {
          setSrcA(getVideoSrc(subsequentIdx))
        } else {
          setSrcB(getVideoSrc(subsequentIdx))
        }

        setActiveSlot(nextSlot)
      }
    })
  }

  useGSAP(() => {
    gsap.set('#video-frame', {
      clipPath: 'polygon(14% 0%, 72% 0%, 90% 90%, 0% 100%)',
      borderRadius: '0 0 40% 10%'
    })

    gsap.from('#video-frame', {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      borderRadius: '0 0 0 0',
      ease: 'power1.inOut',
      scrollTrigger: {
        trigger: '#video-frame',
        start: 'center center',
        end: 'bottom center',
        scrub: true
      }
    })
  })

  return (
      <div id="hero" className="relative h-dvh w-screen overflow-x-hidden">
        {loading && (
            <div className="flex-center absolute z-100 h-dvh w-screen overflow-hidden bg-violet-50">
              <div className="three-body">
                <div className="three-body__dot" />
                <div className="three-body__dot" />
                <div className="three-body__dot" />
              </div>
            </div>
        )}

        <div id="video-frame" className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75">
          <div>
            {/* Dual-buffer video slots */}
            <video
                ref={videoRefA}
                src={srcA}
                autoPlay
                muted
                playsInline
                onEnded={activeSlot === 'A' ? handleVideoEnd : undefined}
                className="absolute-center absolute left-0 top-0 size-full object-cover object-center"
                style={{ zIndex: activeSlot === 'A' ? 15 : 10 }}
            />

            <video
                ref={videoRefB}
                src={srcB}
                muted
                playsInline
                onEnded={activeSlot === 'B' ? handleVideoEnd : undefined}
                className="absolute-center invisible absolute left-0 top-0 size-full object-cover object-center"
                style={{ zIndex: activeSlot === 'B' ? 15 : 10 }}
            />
          </div>

          <h1 className="special-font hero-heading absolute bottom-5 right-5 z-40 text-blue-75">
            G<b>a</b>ming
          </h1>

          <div className="absolute left-0 top-0 z-40 size-full">
            <div className="mt-24 px-5 sm:px-10">
              <h1 className="special-font hero-heading text-blue-100">
                Redefi<b>n</b>e
              </h1>
              <p className="mb-5 max-w-84 font-robert-regular text-blue-100">
                Battle Against Bots or Players <br /> To Become Ultimate Programming Champion
              </p>
              <Button
                  id="watch-trailer"
                  title="Watch Trailer"
                  leftIcon={<TiLocationArrow />}
                  containerClass="!bg-yellow-300 flex-center gap-1"
              />
            </div>
          </div>
          <ExpandButton />
        </div>

        <h1 className="special-font hero-heading absolute bottom-5 right-5 text-black">
          G<b>a</b>ming
        </h1>
      </div>
  )
}