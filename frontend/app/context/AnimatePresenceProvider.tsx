"use client";

import { AnimatePresence } from 'framer-motion'
import React, { FC } from 'react'

interface AnimatePresenceProviderProps {
    children: React.ReactNode
}

const AnimatePresenceProvider: FC<AnimatePresenceProviderProps> = ({ children }) => {
  return (
    <AnimatePresence mode='sync'>
        {children}
    </AnimatePresence>
  )
}

export default AnimatePresenceProvider