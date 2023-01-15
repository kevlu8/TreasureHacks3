import React from "react";
import Image from "next/image";
import ReactPlayer from 'react-player';

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";

function Post(props) {
    const {text, video, stats, data, upvoteCount, commentCount, noRedirect} = props;
    const {title, op, skill, link, id} = data;

	const [upVoted, setUpVoted] = useState(false);
	const [downVoted, setDownVoted] = useState(false);

	if (noRedirect) {
		return (
			<div className="relative z-10 min-w-[40rem] max-w-[40rem] pl-10 block flex-row justify-center items-center mt-8 rounded-lg border border-border bg-bg-tertiary">
				<div className="absolute top-0 left-0 bottom-0 bg-bg-primary w-10 rounded-l-lg flex pt-2 flex-col justify-start items-center">
					<span className="block cursor-pointer">
						<FontAwesomeIcon
							icon={faArrowUp}
							style={upVoted && { color: "#DC2626" }}
							className={`text-2xl text-text-body transition-color duration-300 ease-in-out hover:text-error`}
							onClick={() => {
								setUpVoted(!upVoted);
								setDownVoted(false);
							}}
						/>
					</span>

					<span className="text-text-header font-bold mb-1">2</span>

					<span className="block cursor-pointer">
						<FontAwesomeIcon
							icon={faArrowDown}
							style={downVoted && { color: "#2FA3D0" }}
							className={`text-2xl text-text-body transition-color duration-300 ease-in-out hover:text-text-primary`}
							onClick={() => {
								setDownVoted(!downVoted);
								setUpVoted(false);
							}}
						/>
					</span>
				</div>

				<div className="px-4 py-2">
					<div className="flex flex-row justify-start items-center">
						<Image
							src={skill.logo}
							width="100"
							height="100"
							className="rounded-full border border-border w-[25px] h-[25px] mr-1"
						/>

						<div className="text-text-body text-xs">
							<p className="inline-block">s/{skill.name}</p>

							<span className="mx-1 inline-block">•</span>

							<p className="inline-block">posted by {op.name}</p>
						</div>
					</div>

					<hr className="border-border w-full mb-2 mt-4" />

					<div>
						<h1 className="text-2xl text-text-header font-semibold mb-2 truncate">
							{title}
						</h1>

						{video && <ReactPlayer url={video} />}

						<p className="text-text-body truncate">{text}</p>
					</div>
				</div>

				<div className="flex flex-row justify-start items-center my-2">
					<span
						className="text-text-body cursor-pointer duration-300 ease-in-out transition-color group hover:text-text-header"
					>
						<FontAwesomeIcon
							className="pl-4 text-xl text-text-body mr-1 transition-color duration-300 ease-in-out group-hover:text-text-header"
							icon={faEnvelope}
						/>
						{69} comments
					</span>
				</div>
			</div>
		);
	} else {
		return (
			<div className="relative z-10 min-w-[40rem] max-w-[40rem] pl-10 block flex-row justify-center items-center mt-8 rounded-lg border border-border bg-bg-tertiary transition-color ease-in-out duration-300 hover:border-text-header">
				<div className="absolute top-0 left-0 bottom-0 bg-bg-primary w-10 rounded-l-lg flex pt-2 flex-col justify-start items-center">
					<span className="block cursor-pointer">
						<FontAwesomeIcon
							icon={faArrowUp}
							style={upVoted && { color: "#DC2626" }}
							className={`text-2xl text-text-body transition-color duration-300 ease-in-out hover:text-error`}
							onClick={() => {
								setUpVoted(!upVoted);
								setDownVoted(false);
							}}
						/>
					</span>

					<span className="text-text-header font-bold mb-1">2</span>

					<span className="block cursor-pointer">
						<FontAwesomeIcon
							icon={faArrowDown}
							style={downVoted && { color: "#2FA3D0" }}
							className={`text-2xl text-text-body transition-color duration-300 ease-in-out hover:text-text-primary`}
							onClick={() => {
								setDownVoted(!downVoted);
								setUpVoted(false);
							}}
						/>
					</span>
				</div>

				<a className="px-4 py-2 block" href={`/${skill.name}/${id}`}>
					<div className="flex flex-row justify-start items-center">
						<Image
							src={skill.logo}
							width="100"
							height="100"
							className="rounded-full border border-border w-[25px] h-[25px] mr-1"
						/>

						<div className="text-text-body text-xs">
							<p className="inline-block">s/{skill.name}</p>

							<span className="mx-1 inline-block">•</span>

							<p className="inline-block">posted by {op.name}</p>
						</div>
					</div>

					<hr className="border-border w-full mb-2 mt-4" />

					<div>
						<h1 className="text-2xl text-text-header font-semibold mb-2 truncate">
							{title}
						</h1>

						{video && <ReactPlayer url={video} />}

						<p className="text-text-body truncate">{text}</p>
					</div>
				</a>

				<div className="flex flex-row justify-start items-center my-2">
					<a
						href={`/${skill.name}/${id}`}
						className="text-text-body cursor-pointer duration-300 ease-in-out transition-color group hover:text-text-header"
					>
						<FontAwesomeIcon
							className="pl-4 text-xl text-text-body mr-1 transition-color duration-300 ease-in-out group-hover:text-text-header"
							icon={faEnvelope}
						/>
						{69} comments
					</a>
				</div>
			</div>
		);
	}
}

export default Post;