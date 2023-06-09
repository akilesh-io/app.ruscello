import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";

import styles from "@/styles/Home.module.css";
import Layout from "@/components/layout";

export default function Home() {
  const router = useRouter();
  const [userName, setUserName] = useState("");

  const joinRoom = (e) => {
    e.preventDefault();
    //localStorage.setItem('userName', userName);

    router.push(`/room/${Math.random().toString(36).slice(2)}`);
  };

  return (
    <div className={styles.container}>
      <Layout>
        <form className="flex flex-col justify-center" onSubmit={joinRoom}>
          <div className="flex justify-center align-middle items-center">
            <input
              type="text"
              id="username"
              name="username"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="User Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              // required
            />
          </div>

          <div className="flex justify-center align-middle items-center">
            <button className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                Create a room
              </span>
            </button>
          </div>
        </form>
      </Layout>
    </div>
  );
}
