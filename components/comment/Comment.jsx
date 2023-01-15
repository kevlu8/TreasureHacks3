import React from "react";
import Image from "next/image";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";

function Comment(props) {
	let { karma, op, text } = props;
	const [upVoted, setUpVoted] = useState(false);
	const [downVoted, setDownVoted] = useState(false);
	const [sum, setSum] = useState(karma);
    
    return (
		<div className="relative z-10 min-w-[40rem] max-w-[40rem] min-h-[6.2rem] pl-10 block flex-row justify-center items-center mt-8 rounded-lg border border-border bg-bg-tertiary">
			<div className="absolute top-0 left-0 bottom-0 bg-bg-primary w-10 rounded-l-lg flex pt-2 flex-col justify-start items-center">
				<span className="block cursor-pointer">
					<FontAwesomeIcon
						icon={faArrowUp}
						style={upVoted && { color: "#DC2626" }}
						className={`text-2xl text-text-body transition-color duration-300 ease-in-out hover:text-error`}
						onClick={() => {
							if (downVoted) {
								setSum(sum + 2);
							} else if (upVoted) {
								setSum(sum - 1);
							} else {
								setSum(sum + 1);
							}
							setUpVoted(!upVoted);
							setDownVoted(false);
						}}
					/>
				</span>

				<span className="text-text-header font-bold mb-1">{sum}</span>

				<span className="block cursor-pointer">
					<FontAwesomeIcon
						icon={faArrowDown}
						style={downVoted && { color: "#2FA3D0" }}
						className={`text-2xl text-text-body transition-color duration-300 ease-in-out hover:text-text-primary`}
						onClick={() => {
							if (upVoted) {
								setSum(sum - 2);
							} else if (downVoted) {
								setSum(sum + 1);
							} else {
								setSum(sum - 1);
							}
							setDownVoted(!downVoted);
							setUpVoted(false);
						}}
					/>
				</span>
			</div>

			<div className="mt-1 px-4 py-2">
				<div className="flex flex-row justify-start items-center">
					<div className="text-text-body text-xs">
						<p className="inline-block">Comment by {op}</p>
					</div>
				</div>

				<hr className="border-border w-full mb-2 mt-4" />

				<div>
					<p className="text-text-body">{text}</p>
				</div>
			</div>
		</div>
	);
}

export default Comment;