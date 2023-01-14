import React from "react";
import Image from "next/image";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpLong } from "@fortawesome/free-regular-svg-icons";

function Post(props) {
    const {text, video, stats, comments, data} = props;
    const {title, op, skill} = data;
    return (
        <div className="z-10 max-w-[40rem] px-8 block flex-row justify-center items-center mt-8 bg-bg-tertiary rounded-lg border border-border">
            <Image src={skill.logo} width="32" height="32" className="mt-2 rounded-full"/>
            <h1 className="text-2xl text-text-header font-semibold">{title}</h1>
            {video ? video: ""}
            <p className="text-text-body">
                {text ? text: ""}
            </p>
            <FontAwesomeIcon icon={faArrowUpLong} />
        </div>
    );
}

export default Post;