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

			<main>
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
						text="this is a test post. everything should be fucked and also we are like 5hrs behind schedual send help"
					/>
				)}

        		</div>
			</main>
		</>
	);
}
