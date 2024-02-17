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
		<main className="flex h-full flex-col items-center justify-between p-24 gap-10">
			Hey
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
			<HeroQuickBook />
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
		</main>
	);
}
