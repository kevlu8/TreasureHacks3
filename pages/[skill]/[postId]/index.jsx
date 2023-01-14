import React from "react";
import { useRouter } from 'next/router';

function Post(props) {
    const router = useRouter();
    const { skill, postId } = router.query;

    return <h1 className="text-text-primary">{`{postId}}</h1>;
}

export default Post;