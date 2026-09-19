"use client";

import React, { useRef, useEffect, useMemo, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, useTexture, Center } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

interface ModelProps {
    characterId: string;
}

const CHAR_ORDER = ["aurelia", "raze", "kira", "lucien", "lior"];

function PodiumModel({ characterId }: ModelProps) {
    // 1. Load the 3D podium mesh geometry
    const { scene } = useGLTF("/models/white_mesh.glb");
    const modelRef = useRef<THREE.Group>(null);
    const prevCharRef = useRef<string>(characterId);
    const isFirstRender = useRef(true);

    // 2. Load the custom-baked high-res diffuse & emissive texture maps
    const diffuseMap = useTexture("/models/podium_diffuse.png");
    const emissiveMap = useTexture("/models/podium_emissive.png");

    // Optimize textures for sharp rendering & accurate color
    useMemo(() => {
        diffuseMap.colorSpace = THREE.SRGBColorSpace;
        diffuseMap.generateMipmaps = true;
        diffuseMap.minFilter = THREE.LinearMipmapLinearFilter;
        diffuseMap.magFilter = THREE.LinearFilter;
        diffuseMap.anisotropy = 8;

        emissiveMap.colorSpace = THREE.SRGBColorSpace;
        emissiveMap.generateMipmaps = true;
        emissiveMap.minFilter = THREE.LinearMipmapLinearFilter;
        emissiveMap.magFilter = THREE.LinearFilter;
        emissiveMap.anisotropy = 8;
    }, [diffuseMap, emissiveMap]);

    // 3. Compute normals, UV mapping, and configure realistic PBR metallic material
    const preparedScene = useMemo(() => {
        const cloned = scene.clone(true);
        cloned.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                mesh.geometry = mesh.geometry.clone();

                // Compute normals for accurate 3D shading
                mesh.geometry.computeVertexNormals();

                // Map UV coordinates: top platform gets planar unwrap, sides get cylindrical unwrap
                const pos = mesh.geometry.attributes.position;
                const uvs = new Float32Array(pos.count * 2);

                for (let i = 0; i < pos.count; i++) {
                    const x = pos.getX(i);
                    const y = pos.getY(i);
                    const z = pos.getZ(i);

                    if (y > 0.16) {
                        // Top platform: maps to left half [0.0..0.5] of texture atlas
                        uvs[i * 2] = 0.25 + 0.245 * (x / 0.96);
                        uvs[i * 2 + 1] = 0.50 + 0.49 * (z / 0.96);
                    } else {
                        // Cylindrical side & base: maps to right half [0.5..1.0]
                        const angle = Math.atan2(z, x);
                        const uNorm = (angle / (2 * Math.PI)) + 0.5;
                        const vNorm = Math.max(0, Math.min(1, (y - (-0.25)) / (0.16 - (-0.25))));
                        uvs[i * 2] = 0.5 + 0.5 * uNorm;
                        uvs[i * 2 + 1] = vNorm;
                    }
                }
                mesh.geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));

                // High-fidelity standard material with gold metallic reflections & fiery emissive vents
                const material = new THREE.MeshStandardMaterial({
                    map: diffuseMap,
                    emissiveMap: emissiveMap,
                    emissive: new THREE.Color("#ffffff"),
                    emissiveIntensity: 2.2, // Blazing magma neon vents
                    roughness: 0.32,
                    metalness: 0.72,
                    flatShading: false,
                });

                mesh.material = material;
                mesh.castShadow = true;
                mesh.receiveShadow = true;
            }
        });
        return cloned;
    }, [scene, diffuseMap, emissiveMap]);

    // 4. Reactive GSAP 360-degree rotation when changing character in characterRail
    useEffect(() => {
        if (!modelRef.current) return;

        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (prevCharRef.current !== characterId) {
            const prevIndex = CHAR_ORDER.indexOf(prevCharRef.current);
            const nextIndex = CHAR_ORDER.indexOf(characterId);
            const direction = nextIndex >= prevIndex ? 1 : -1;
            prevCharRef.current = characterId;

            // Kill any in-flight tweens for instant snappy response
            gsap.killTweensOf(modelRef.current.rotation);
            gsap.killTweensOf(modelRef.current.position);

            // Snappy full 360 rotation in direction of rail selection
            gsap.to(modelRef.current.rotation, {
                y: (direction >= 0 ? "+=" : "-=") + Math.PI * 2,
                duration: 1.15,
                ease: "power3.out",
                overwrite: "auto",
            });

            // Subtle vertical spring settling effect
            gsap.fromTo(
                modelRef.current.position,
                { y: -0.05 },
                {
                    y: 0,
                    duration: 0.7,
                    ease: "back.out(1.6)",
                    overwrite: "auto",
                }
            );
        }
    }, [characterId]);

    return (
        <group ref={modelRef}>
            {/* Center automatically calculates bounding box and centers the pivot at (0,0,0) */}
            <Center>
                <primitive object={preparedScene} scale={2.5} />
            </Center>
        </group>
    );
}

// Preload the model & textures for instant rendering
useGLTF.preload("/models/white_mesh.glb");
useTexture.preload("/models/podium_diffuse.png");
useTexture.preload("/models/podium_emissive.png");

interface PodiumProps {
    characterId: string;
}

export const Podium: React.FC<PodiumProps> = ({ characterId }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div
                className="relative w-140 h-47.5 flex items-center justify-center"
                suppressHydrationWarning
            >
                {/* Fallback ambient glow and shadow matching mounted stage dimensions */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-117.5 h-21.25 bg-[#ff3300]/25 blur-2xl rounded-full pointer-events-none -z-10" />
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-122.5 h-12 bg-black/70 blur-xl rounded-full pointer-events-none -z-20" />
            </div>
        );
    }

    return (
        <div
            className="relative w-140 h-60 flex items-center justify-center"
            suppressHydrationWarning
        >
            <Canvas
                camera={{ position: [0, 1.5, 4.9], fov: 32 }}
                gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
                dpr={[1, 2]}
            >
                {/* Balanced studio lighting specifically tuned for gold trim & dark obsidian metal */}
                <ambientLight intensity={1.1} />
                <directionalLight position={[4, 6, 4]} intensity={2.6} color="#fff8e7" />
                <directionalLight position={[-4, 3, -2]} intensity={1.2} color="#94a3b8" />
                <directionalLight position={[0, -2, 2]} intensity={0.5} color="#94a3b8" />
                <spotLight position={[0, 5, 0]} angle={0.7} penumbra={0.9} intensity={2.2} color="#ffffff" />
                
                {/* Warm golden light overhead for the compass star emblem */}
                <pointLight position={[0, 3, 1]} intensity={1.5} color="#ffd79a" />
                
                {/* Fiery red-orange accent light underneath for dramatic magma glow */}
                <pointLight position={[0, -0.5, 2.5]} intensity={1.8} color="#ff3300" />

                <Suspense fallback={null}>
                    <PodiumModel characterId={characterId} />
                </Suspense>
            </Canvas>

            {/* Glowing magma red-orange stage aura ring underneath the podium */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-117.5 h-21.25 bg-[#ff3300]/25 blur-2xl rounded-full pointer-events-none -z-10" />

            {/* Ground shadow beneath the podium */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-122.5 h-12 bg-black/70 blur-xl rounded-full pointer-events-none -z-20" />
        </div>
    );
};