import React from "react";
import Image from "next/image";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpLong } from "@fortawesome/free-regular-svg-icons";

function Post(props) {
    const {text, video, stats, data} = props;
    const {title, op, skill, link, id} = data;
    
    return (
			<a
				href={`/${skill.name}/${id}`}
                className="z-10 max-w-[40rem] px-4 py-2 block flex-row justify-center items-center mt-8 bg-bg-tertiary rounded-lg border border-border"
            >
				<div className="flex flex-row align-center border-b-[0.1rem] border-border">
					<Image
						src={skill.logo}
						width="32"
						height="32"
						className="mb-2 ml-2 rounded-full"
					/>
					<div className="ml-2 mb-2 text-text-body italic text-xs">
						<p>s/{skill.name}</p>
						<p>{op.name}</p>
					</div>
				</div>

				<h1 className="text-2xl text-text-header font-semibold">{title}</h1>
				{video ? video : ""}
				<p className="text-text-body">{text ? text : ""}</p>
				<FontAwesomeIcon icon={faArrowUpLong} />
			</a>
		);
}

export default Post;