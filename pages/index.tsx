import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect } from "react";



export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const roomId = Math.random().toString(36).slice(2);
    router.push(`/room/${roomId}`);
  }, []); // Empty dependency array ensures this runs once on component mount


  return (
    <>
    </>
  );
}
