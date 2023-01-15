import React from "react";

function TextArea(props) {
    const { placeholder, val, setVal, bg, row, col } = props;

    return (
        <textarea 
            classname="text-lg"
            placeholder={placeholder} 
            val={val} 
            onChange={setVal}
            className={`${bg} max-h-[25vh] outline-none border border-border w-full px-3 py-1 shadow-lg text-lg rounded-lg transition-color duration-300 ease-in-out hover:bg-bg-secondary`} 
            row={row} 
            col={col} 
        />
    )
}

export default TextArea;