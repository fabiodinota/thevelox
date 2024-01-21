"use client";

import Image from "next/image";
import React, { useContext, useRef, useEffect, useState } from "react";
import axios from 'axios';
import { useTheme } from "./context/themeContext";
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber'
import * as THREE from 'three'

function Box(props: ThreeElements['mesh']) {
    const meshRef = useRef<THREE.Mesh>(null!)
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)
    useFrame((state, delta) => (meshRef.current.rotation.x += delta))
    return (
      <mesh
        {...props}
        ref={meshRef}
        scale={active ? 1.5 : 1}
        onClick={(event) => setActive(!active)}
        onPointerOver={(event) => setHover(true)}
        onPointerOut={(event) => setHover(false)}>
        <octahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} wireframe />
      </mesh>
    )
  }

export default function Home() {
    const [data, setData] = useState<object[]>([]);

    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const { theme, toggleTheme } = useTheme();

    const handleTest = async () => {
        await axios(
            `${process.env.NEXT_PUBLIC_API_URL}`,
        )
        .then((res) => {
            setData(res?.data);
        })
        .catch((err) => {
            console.log("Err: ", err);
        });

        toggleTheme()
    

    }

    const handleSignUp = async () => {
        await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
            {
                username: username,
                email: email,
                password: password
            }
        )
        .then((res) => {
            console.log("Res: ", res);
        })
        .catch((err) => {
            console.log("Err: ", err);
        });

        handleTest();
    }
   
  return (
    <main className="flex h-full flex-col items-center justify-between p-24">
        Hey
       {data && (
          <div className="data-container">
            <h1>Data:</h1>
            {
                data.map((item: any, index: number) => {
                    return (
                        <div key={index}>
                            <p className="text-red-500 dark:text-blue-500">{item.username}</p>
                            <p>{item.email}</p>
                        </div>
                    )
                })
            }
          </div>
        )}

        <div className="flex flex-col w-full max-w-[800px] gap-5">
            <input onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Username" className="w-full h-[50px] border border-gray-500 bg-white dark:bg-background rounded-xl px-5" />
            <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="w-full h-[50px] border border-gray-500 bg-white dark:bg-background rounded-xl px-5" />
            <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="w-full h-[50px] border border-gray-500 bg-white dark:bg-background rounded-xl px-5" />
            <button onClick={handleSignUp} className="rounded-lg bg-red-500 py-3 ">Submit</button>
        </div>

        <button onClick={handleTest}>
            Test
        </button>

        <Canvas>
            <ambientLight intensity={Math.PI / 2} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
            <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
            <Box position={[-1.2, 0, 0]} />
            <Box position={[1.2, 0, 0]} />
        </Canvas>
    </main>
  );
}
