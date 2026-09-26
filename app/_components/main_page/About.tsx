'use client'
import { useGSAP } from '@gsap/react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import AnimatedTitle from './AnimatedTitle'

const IMAGEKIT_URL = process.env.NEXT_PUBLIC_IMAGEKIT_URL;
gsap.registerPlugin(ScrollTrigger)

function About() {

    useGSAP(()=>{
        const clipAnimation = gsap.timeline({
            scrollTrigger: {
                trigger: '#clip',
                start: 'center center',
                end: '+=800 center',
                scrub: 0.5,
                pin: true,
                pinSpacing: true,
            }
        })
        clipAnimation.to('.mask-clip-path',{
            width: '100vw',
            height: '100vh',
            borderRadius: 0
        })
    })
    
  return (
    <div id='about' className='min-h-screen w-screen'>
        <div className='relative mb-8 mt-36 flex flex-col items-center gap-5'>
            <h2 className='font-general text-sm uppercase md:text-[17px]'>
                Welcome to Byte Battle
            </h2>
            <AnimatedTitle 
                title='Bec<b>o</b>me the world&apos;s <br/> t<b>o</b>p Player, and earn the Trophy'
                containerClass='mt-5 !text-black text-center'
            />
            
            <div className='about-subtext'>
                <p> Battle other players, climb the leaderboard, and prove your coding skills to become the ultimate Byte Battle champion.
                </p>
            </div>
        </div>
        <div className='h-dvh w-screen' id='clip'>
            <div className='mask-clip-path about-image' >
                <Image 
                    src={`${IMAGEKIT_URL}/img/about.png`} 
                    alt='background' 
                    width={4000}
                    height={4000}
                    className='absolute left-0 top-0 size-full object-cover'
                />
            </div>
        </div>
    </div>
  )
}

export default About