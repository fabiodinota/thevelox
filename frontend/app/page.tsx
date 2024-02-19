"use client";

import Image from "next/image";
import React, { useRef, useState, FormEvent } from "react";
import axios from "axios";
import { useTheme } from "./context/themeContext";
import { Canvas, useFrame, ThreeElements } from "@react-three/fiber";
import * as THREE from "three";
import { useSession } from "./context/sessionContext";
import Link from "next/link";
import { HeroQuickBook } from "./components/HeroQuickBook";
import HeroBackground from "@/public/hero_background.png";

function Box(props: ThreeElements["mesh"]) {
	const meshRef = useRef<THREE.Mesh>(null!);
	const [hovered, setHover] = useState(false);
	const [active, setActive] = useState(false);

	useFrame((state, delta) => (meshRef.current.rotation.x += delta));
	return (
		<mesh
			{...props}
			ref={meshRef}
			scale={active ? 1.5 : 1}
			onClick={(event) => setActive(!active)}
			onPointerOver={(event) => setHover(true)}
			onPointerOut={(event) => setHover(false)}
		>
			<octahedronGeometry args={[1, 1]} />
			<meshStandardMaterial
				color={hovered ? "hotpink" : "orange"}
				wireframe
			/>
		</mesh>
	);
}

export default function Home() {
	const [data, setData] = useState<object[]>([]);

	const [username, setUsername] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const { theme, toggleTheme } = useTheme();
	const { user, signUp, signIn, signOut, isAuthenticated } = useSession();

	const handleTest = async () => {
		if (isAuthenticated) {
			await axios(`${process.env.NEXT_PUBLIC_API_URL}`, {
				withCredentials: true,
			})
				.then((res) => {
					setData(res?.data);
				})
				.catch((err) => {
					console.log("Err: ", err);
				});
		}

		toggleTheme();
	};

	const handleSignUp = async (e: FormEvent) => {
		e.preventDefault();
		await signUp({
			username,
			email,
			password,
		});
	};

	const handleSignIn = async (e: FormEvent) => {
		e.preventDefault();
		await signIn({
			username,
			password,
		});
	};

	const handleSignOut = async (e: FormEvent) => {
		e.preventDefault();
		await signOut();
	};

	return (
		<div>
            <div className="w-full min-h-[700px] h-[700px] md:h-[70vh] xl:h-[60vh] max-h-[900px] relative flex justify-center items-center flex-col px-5">
                <h1 className='relative top-[270px] md:top-[320px] xl:top-[270px] text-[10vw] sm:text-[60px] md:text-[70px] text-left max-w-[1400px] w-full font-bold text-white leading-snug whitespace-pre-wrap'>Book the <br className="md:hidden block" />best & <br className="hidden md:block" />cheapest <br className="md:hidden block" />tickets around!</h1>
                <HeroQuickBook className="relative top-[300px] md:top-[350px] xl:top-[300px] shadow-[0px_0px_20px_0px_#00000015] dark:shadow-[0px_0px_20px_0px_#FFFFFF07]" />
                <div className="w-full min-h-[700px] h-[700px] md:h-[70vh] xl:h-[60vh] max-h-[900px] xl:rounded-b-[75px] overflow-hidden absolute top-0 left-0 -z-10">
                    <div className="w-full h-full bg-hero-gradient relative top-0 left-0 z-50"></div>
                    <Image src={HeroBackground} layout="fill" className="object-cover object-bottom" alt="background_hero" />
                </div>
            </div>
            <div className="w-full h-[300px]"></div>

            <div className="flex flex-col gap-5 justify-center items-center py-10 px-5">
                {data && (
                    <div className="data-container">
                        <h1>Data:</h1>
                        {data.map((item: any, index: number) => {
                            return (
                                <div key={index}>
                                    <p className="text-red-500 dark:text-blue-500">
                                        {item.username}
                                    </p>
                                    <p>{item.email}</p>
                                </div>
                            );
                        })}
                    </div>
                )}
                <h1>Current User</h1>
                {user && (
                    <div>
                        <p>{user.username}</p>
                        <p>{user.email}</p>
                    </div>
                )}
                <form
                    onSubmit={handleSignUp}
                    className="flex flex-col w-full max-w-[800px] gap-5"
                >
                    <h1>Sign Up</h1>
                    <input
                        onChange={(e) => setUsername(e.target.value)}
                        type="text"
                        placeholder="Username"
                        className="w-full h-[50px] border border-gray-500 bg-white dark:bg-background rounded-xl px-5"
                    />
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="Email"
                        className="w-full h-[50px] border border-gray-500 bg-white dark:bg-background rounded-xl px-5"
                    />
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        placeholder="Password"
                        className="w-full h-[50px] border border-gray-500 bg-white dark:bg-background rounded-xl px-5"
                    />
                    <button
                        disabled={isAuthenticated}
                        type="submit"
                        className="rounded-lg bg-red-500 py-3 disabled:opacity-50"
                    >
                        Submit
                    </button>
                </form>
                <form
                    onSubmit={handleSignIn}
                    className="flex flex-col w-full max-w-[800px] gap-5"
                >
                    <h1>Sign In</h1>
                    <input
                        onChange={(e) => setUsername(e.target.value)}
                        type="text"
                        placeholder="Username"
                        className="w-full h-[50px] border border-gray-500 bg-white dark:bg-background rounded-xl px-5"
                    />
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        placeholder="Password"
                        className="w-full h-[50px] border border-gray-500 bg-white dark:bg-background rounded-xl px-5"
                    />
                    <button
                        disabled={isAuthenticated}
                        type="submit"
                        className="rounded-lg bg-red-500 py-3 disabled:opacity-50"
                    >
                        Submit
                    </button>
                </form>
                <form
                    onSubmit={handleSignOut}
                    className="flex flex-col w-full max-w-[800px] gap-5"
                >
                    <h1>Sign Out</h1>
                    <button type="submit" className="rounded-lg bg-red-500 py-3 ">
                        Submit
                    </button>
                </form>
                <button onClick={handleTest}>Test</button>
                <Canvas>
                    <ambientLight intensity={Math.PI / 2} />
                    <spotLight
                        position={[10, 10, 10]}
                        angle={0.15}
                        penumbra={1}
                        decay={0}
                        intensity={Math.PI}
                    />
                    <pointLight
                        position={[-10, -10, -10]}
                        decay={0}
                        intensity={Math.PI}
                    />
                    <Box position={[-1.2, 0, 0]} />
                    <Box position={[1.2, 0, 0]} />
                </Canvas>
                {/* start station input */}
                {/* start station input */}
                <Link href={isAuthenticated ? "/map" : "/signin"}>Go to Map</Link>
            </div>
		</div>
	);
}
