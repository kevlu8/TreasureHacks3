import React from "react";
import { useRouter } from 'next/router';

function Skill(props) {
    const router = useRouter();
    const { skill } = router.query;

    return <h1>{skill}</h1>;
}

export default Skill;

