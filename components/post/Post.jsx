import React from "react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpLong } from "@fortawesome/free-regular-svg-icons";

function Post(props) {
    const {text, video, stats, comments, data} = props;
    const {title, op, skill} = data;
    return (
        <div className="flex flex-row justify-center items-center mb-8 bg-bg-tertiary">
            <h1 className="text-2xl text-text-body">{title}</h1>
            {video ? video: ""}
            <p>
                {text ? text: ""}
            </p>
            <FontAwesomeIcon icon={faArrowUpLong} />
        </div>
    );
}

export default Post;