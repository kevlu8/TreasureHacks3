import React from "react";
import Image from "next/image";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";

function Comment(props) {
    const {text, stats, data, upvoteCount} = props;
    const {op} = data;
	const [upVoted, setUpVoted] = useState(false);
	const [downVoted, setDownVoted] = useState(false);
    
    return (
			<div
				className="pb-2 relative z-10 min-w-[40rem] max-w-[40rem] pl-10 block flex-row justify-center items-center mt-8 rounded-lg border border-border bg-bg-tertiary transition-color ease-in-out duration-300 hover:border-text-header"
			>
				<div className="absolute top-0 left-0 bottom-0 bg-bg-primary w-10 rounded-l-lg flex pt-2 flex-col justify-start items-center">
					<span className="block cursor-pointer">
						<FontAwesomeIcon
							icon={faArrowUp}
							style={upVoted && { color: "#DC2626" }}
							className={`text-sm text-text-body transition-color duration-300 ease-in-out hover:text-error`}
							onClick={() => {
								setUpVoted(!upVoted);
								setDownVoted(false);
							}}
						/>
					</span>

					<span className="text-text-header font-bold text-sm">2</span>

					<span className="block cursor-pointer">
						<FontAwesomeIcon
							icon={faArrowDown}
							style={downVoted && { color: "#2FA3D0" }}
							className={`text-sm text-text-body transition-color duration-300 ease-in-out hover:text-text-primary`}
							onClick={() => {
								setDownVoted(!downVoted);
								setUpVoted(false);
							}}
						/>
					</span>
				</div>

				<div className="px-4 py-2">
					<h1 className="text-2xl text-text-header font-semibold">{op.name}</h1>
					<p className="text-text-body">{text ? text : ""}</p>
				</div>
			</div>
		);
}

export default Comment;