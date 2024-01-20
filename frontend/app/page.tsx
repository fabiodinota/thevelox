"use client";

import Image from "next/image";
import React from "react";
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Home() {
    const [data, setData] = useState(null);

    const handleTest = async () => {
        const result = await axios(
            `${process.env.NEXT_PUBLIC_API_URL}`,
        ).catch((err) => {
            console.log("Err: ", err);
        });
    
        setData(result?.data);
    }
   
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        Hey
       {data && (
          <div className="data-container">
            <h1>Data:</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
        <button onClick={handleTest}>
            Test
        </button>
    </main>
  );
}
