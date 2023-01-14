import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";

import Navbar from "../components/navigation/Navbar";
import Modal from "../components/modal/Modal";
import Post from "../components/post/Post";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
	return (
		<>
			<Head>
				<title>ezSkill</title>
				<meta name="description" content="Forum to improve your skills" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/logo/favicon.ico" />
			</Head>

			<main>
				<Navbar />

				<div className="flex flex-col justify-center items-center">
          <Post data={{title: "test"}} text="this is a test post. everything should be fucked and also we are like 5hrs behind schedual send help"/>
        </div>
			</main>
		</>
	);
}
