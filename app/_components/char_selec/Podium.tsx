"use client";

import React, { useRef, useEffect, useMemo, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, useTexture, Center } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

const IMAGEKIT_URL = process.env.NEXT_PUBLIC_IMAGEKIT_URL;

const MODEL_URL = `${IMAGEKIT_URL}/models/white_mesh.glb`;
const DIFFUSE_URL = `${IMAGEKIT_URL}/models/podium_diffuse.png`;
const EMISSIVE_URL = `${IMAGEKIT_URL}/models/podium_emissive.png`;

interface ModelProps {
    characterId: string;
}

const CHAR_ORDER = ["aurelia", "raze", "kira", "lucien", "lior"];

function PodiumModel({ characterId }: ModelProps) {
    // 1. Load the 3D podium mesh geometry from ImageKit
    const { scene } = useGLTF(MODEL_URL);

    const modelRef = useRef<THREE.Group>(null);
    const prevCharRef = useRef<string>(characterId);
    const isFirstRender = useRef(true);

    // 2. Load textures from ImageKit
    const diffuseMap = useTexture(DIFFUSE_URL);
    const emissiveMap = useTexture(EMISSIVE_URL);

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

    // 3. Compute normals, UV mapping, and configure PBR material
    const preparedScene = useMemo(() => {
        const cloned = scene.clone(true);

        cloned.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;

                mesh.geometry = mesh.geometry.clone();

                // Compute normals for accurate 3D shading
                mesh.geometry.computeVertexNormals();

                // Map UV coordinates
                const pos = mesh.geometry.attributes.position;
                const uvs = new Float32Array(pos.count * 2);

                for (let i = 0; i < pos.count; i++) {
                    const x = pos.getX(i);
                    const y = pos.getY(i);
                    const z = pos.getZ(i);

                    if (y > 0.16) {
                        // Top platform
                        uvs[i * 2] = 0.25 + 0.245 * (x / 0.96);
                        uvs[i * 2 + 1] = 0.50 + 0.49 * (z / 0.96);
                    } else {
                        // Cylindrical side & base
                        const angle = Math.atan2(z, x);
                        const uNorm = angle / (2 * Math.PI) + 0.5;

                        const vNorm = Math.max(
                            0,
                            Math.min(
                                1,
                                (y - -0.25) / (0.16 - -0.25)
                            )
                        );

                        uvs[i * 2] = 0.5 + 0.5 * uNorm;
                        uvs[i * 2 + 1] = vNorm;
                    }
                }

                mesh.geometry.setAttribute(
                    "uv",
                    new THREE.BufferAttribute(uvs, 2)
                );

                const material = new THREE.MeshStandardMaterial({
                    map: diffuseMap,
                    emissiveMap: emissiveMap,
                    emissive: new THREE.Color("#ffffff"),
                    emissiveIntensity: 2.2,
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

    // 4. Rotate podium when character changes
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

            gsap.killTweensOf(modelRef.current.rotation);
            gsap.killTweensOf(modelRef.current.position);

            gsap.to(modelRef.current.rotation, {
                y: (direction >= 0 ? "+=" : "-=") + Math.PI * 2,
                duration: 1.15,
                ease: "power3.out",
                overwrite: "auto",
            });

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
            <Center>
                <primitive
                    object={preparedScene}
                    scale={2.5}
                />
            </Center>
        </group>
    );
}

// Preload ImageKit assets
useGLTF.preload(MODEL_URL);
useTexture.preload(DIFFUSE_URL);
useTexture.preload(EMISSIVE_URL);

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
                camera={{
                    position: [0, 1.5, 4.9],
                    fov: 32,
                }}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance",
                }}
                dpr={[1, 2]}
            >
                <ambientLight intensity={1.1} />

                <directionalLight
                    position={[4, 6, 4]}
                    intensity={2.6}
                    color="#fff8e7"
                />

                <directionalLight
                    position={[-4, 3, -2]}
                    intensity={1.2}
                    color="#94a3b8"
                />

                <directionalLight
                    position={[0, -2, 2]}
                    intensity={0.5}
                    color="#94a3b8"
                />

                <spotLight
                    position={[0, 5, 0]}
                    angle={0.7}
                    penumbra={0.9}
                    intensity={2.2}
                    color="#ffffff"
                />

                <pointLight
                    position={[0, 3, 1]}
                    intensity={1.5}
                    color="#ffd79a"
                />

                <pointLight
                    position={[0, -0.5, 2.5]}
                    intensity={1.8}
                    color="#ff3300"
                />

                <Suspense fallback={null}>
                    <PodiumModel characterId={characterId} />
                </Suspense>
            </Canvas>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-117.5 h-21.25 bg-[#ff3300]/25 blur-2xl rounded-full pointer-events-none -z-10" />

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-122.5 h-12 bg-black/70 blur-xl rounded-full pointer-events-none -z-20" />
        </div>
    );
};