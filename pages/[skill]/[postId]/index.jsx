import React from "react";
import { useRouter } from 'next/router';

function Post(props) {
    const router = useRouter();
    const { skill, postId } = router.query;

    return (
        <div
            className="z-10 min-w-[40rem] max-w-[40rem] px-4 py-2 block flex-row justify-center items-center mt-8 bg-bg-tertiary rounded-lg border border-border"
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
        </div>
    );
}

export default Post;