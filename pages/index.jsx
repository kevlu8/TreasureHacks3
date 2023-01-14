import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";

import Navbar from "../components/navigation/Navbar";
import Modal from "../components/modal/Modal";
import Post from "../components/post/Post";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
	const [posts, setPosts] = useState([{
		data: {
			title: "test", 
			skill: {
				name: "skill",
				logo: "/logo/logo_primary.png",
			},
			op: {
				name: "sireButItsUnique",
			},
			id: "haoLovesThoseBBCs"
		},
		text: "this is a test post. everything should be fucked and also we are like 5hrs behind schedual send help"
	}, {
		data: {
			title: "How HuTao changed my life", 
			skill: {
				name: "copypasta",
				logo: "/logo/logo_primary.png",
			},
			op: {
				name: "Atheril",
			},
			id: "hutaocopypasta"
		},
		text: "As I write this, immense tears of pleasure flows from my eyes. Words alone cannot express the feelings and emotions my heart goes through when I think of Hu Tao. On the 22nd of February 2021, my life changed for the better, the day I saw a leaked footage of HuTao. Something awoken in me that day, a buzzing sensation rushed through my body. I knew, it was love at first sight. I stared hours and hours at the leaked gameplay footage of HuTao, her beautiful charge attacks and butterfly effects when she sprinted was mesmerising. Then, she turned around. I froze. Her eyes, her deep red eyes, the shape of her pupils, her face.From this point, a goal spouted in my head: acquire a c6r5 HuTao at any cost. A goal which I eventually did fulfil. The lengths I’d take for Hu Tao shouldnt be underestimated So some people might be wondering, what so special about Hu Tao, what makes her the best waifu? Well sit back and grab some popcorn. I will enlighten you as to why, HuTao is the best thing, to be ever created since the creation of the heavens and earth. Regardless the size of her bust, Hu Tao has all the qualities of a sssss+ tier waifu. She’s so precious, her smile, her beautiful unique red eyes. No a day goes by without me listening to all of Hu Taos voice lines on repeat, for 1 hour. While cuddling my HuTao pillow. Her eyes has her blood bosom shape. Hu Tao is a really vibrant person,she try’s to keep herself upbeat working in the funeral parlour, having to prepare dead people to be buried can be a very tedious task. Hu Tao, I’m here for you, I’m all yours. I’ll comfort you. During Hu Taos, story quest it reveals that sad part of her, which almost made me cry my heart out. She’s really sad deep down but true to give off the vibrant, joyful and unwavering aura in which she manages to pull of successfully. This quest made Hu Tao feel like my Soulmate, I was able to relate with her, and she to related to me. I felt like giving her head pats and hugs."
	}, {
		data: {
			title: "test", 
			skill: {
				name: "skill",
				logo: "/logo/logo_primary.png",
			},
			op: {
				name: "sireButItsUnique",
			},
			id: "haoLovesThoseBBCs"
		},
		text: "."
	}, {
		data: {
			title: "test", 
			skill: {
				name: "skill",
				logo: "/logo/logo_primary.png",
			},
			op: {
				name: "sireButItsUnique",
			},
			id: "haoLovesThoseBBCs"
		},
		text: "this is a test post. everything should be fucked and also we are like 5hrs behind schedual send help"
	}, {
		data: {
			title: "test", 
			skill: {
				name: "skill",
				logo: "/logo/logo_primary.png",
			},
			op: {
				name: "sireButItsUnique",
			},
			id: "haoLovesThoseBBCs"
		},
		text: "this is a test post. everything should be fucked and also we are like 5hrs behind schedual send help"
	}, {
		data: {
			title: "test", 
			skill: {
				name: "skill",
				logo: "/logo/logo_primary.png",
			},
			op: {
				name: "sireButItsUnique",
			},
			id: "haoLovesThoseBBCs"
		},
		text: "this is a test post. everything should be fucked and also we are like 5hrs behind schedual send help"
	}, {
		data: {
			title: "test", 
			skill: {
				name: "skill",
				logo: "/logo/logo_primary.png",
			},
			op: {
				name: "sireButItsUnique",
			},
			id: "haoLovesThoseBBCs"
		},
		text: "this is a test post. everything should be fucked and also we are like 5hrs behind schedual send help"
	}, {
		data: {
			title: "test", 
			skill: {
				name: "skill",
				logo: "/logo/logo_primary.png",
			},
			op: {
				name: "sireButItsUnique",
			},
			id: "haoLovesThoseBBCs"
		},
		text: "this is a test post. everything should be fucked and also we are like 5hrs behind schedual send help"
	}]);

	return (
		<>
			<Head>
				<title>ezSkill</title>
				<meta name="description" content="Forum to improve your skills" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/logo/favicon.ico" />
			</Head>

			<main className="pb-20">
				<Navbar className="bg-fixed"/>

				<div className="mt-20 flex flex-col justify-center items-center">
				{posts.map(post =>
					<Post 
						className = "z-20"
						data={{
							title: post.data.title, 
							skill: {
								name: post.data.skill.name,
								logo: post.data.skill.logo,
							},
							op: {
								name: post.data.op.name,
							},
							id: post.data.id
						}} 
						text={post.text}
					/>
				)}

        		</div>
			</main>
		</>
	);
}
