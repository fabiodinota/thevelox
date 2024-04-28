"use client";

import { AnimatePresence } from "framer-motion";
import React, { FC } from "react";

interface AnimatePresenceProviderProps {
	children: React.ReactNode;
	mode?: "sync" | "popLayout" | "wait" | undefined;
}

const AnimatePresenceProvider: FC<AnimatePresenceProviderProps> = ({
	children,
	mode = "sync",
}) => {
	return <AnimatePresence mode={mode}>{children}</AnimatePresence>;
};

export default AnimatePresenceProvider;
