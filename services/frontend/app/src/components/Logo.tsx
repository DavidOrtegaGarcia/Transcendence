// import React from "react";
import nexusIcon from "../assets/NexusNineIcon.png";

interface LogoProps {
	className?: string;
}

const Logo = ({ className = "w-full h-full" }: LogoProps) => {
	return (
		<img
			src={nexusIcon}
			alt="Nexus Nine Logo"
			className={`object-contain ${className}`}
		/>
	);
};

export default Logo;
