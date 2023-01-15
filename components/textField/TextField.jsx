import React from "react";

function TextField(props) {
	const { name, textType, autoComplete, val, setVal, icon, mb, required } = props;

	return (
		<div
			className={`${mb} h-[40px] shadow-lg border border-border rounded-lg bg-bg-tertiary flex flex-row justify-center items-center px-3 group transition-colors ease-in-out duration-300 hover:bg-bg-secondary`}
		>
			{icon}

			<input
				value={val}
				onChange={setVal}
				type={textType}
				placeholder={name}
				className="w-full text-lg outline-none placeholder-text-body bg-bg-tertiary text-text-body transition-colors ease-in-out duration-300 group-hover:bg-bg-secondary"
				autoComplete={autoComplete}
				required={required}
			/>
		</div>
	);
}

export default TextField;
