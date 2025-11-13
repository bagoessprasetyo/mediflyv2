"use client"

import * as React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Menu, X, Stethoscope, Phone, Globe, User } from "lucide-react"
import Link from "next/link"
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const navigation = [
  { name: 'Find Specialists', href: '/specialists' },
  { name: 'Find Hospitals', href: '/hospitals' },
  { name: 'Browse Destinations', href: '/destinations' },
  { name: 'About', href: '/about' },
]

export function PublicHeader() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <div className="flex justify-center w-full py-6 px-4 fixed top-0 left-0 z-50">
      <div className="flex items-center justify-between px-6 py-3 bg-white/95 backdrop-blur-sm rounded-full shadow-lg border border-gray-200/50 w-full max-w-6xl relative z-10">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <motion.div
            className="flex items-center gap-3"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-10 h-10 bg-medifly-teal rounded-xl flex items-center justify-center">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-medifly-dark">MediFly</span>
              <span className="text-xs text-medifly-gray hidden sm:block">World-Class Healthcare</span>
            </div>
          </motion.div>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navigation.map((item) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <Link href={item.href} className="text-sm text-medifly-gray hover:text-medifly-teal transition-colors font-medium">
                {item.name}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
          {/* 24/7 Support Badge */}
          <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
            <Phone className="h-3 w-3 mr-1" />
            24/7 Support
          </Badge>

          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-medifly-gray" />
            <span className="text-sm text-medifly-gray">EN</span>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {/* <Button asChild variant="ghost" className="text-medifly-gray hover:text-medifly-teal">
              <Link href="/login">
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Link>
            </Button> */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <Button asChild className="bg-medifly-teal text-white hover:bg-medifly-teal/90 rounded-full">
                <Link href="/get-started">
                  Get Started
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <motion.button className="lg:hidden flex items-center" onClick={toggleMenu} whileTap={{ scale: 0.9 }}>
          <Menu className="h-6 w-6 text-gray-900" />
        </motion.button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-white z-50 pt-24 px-6 lg:hidden"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <motion.button
              className="absolute top-6 right-6 p-2"
              onClick={toggleMenu}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <X className="h-6 w-6 text-gray-900" />
            </motion.button>

            {/* Mobile Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-medifly-teal rounded-lg flex items-center justify-center">
                <Stethoscope className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-medifly-dark">MediFly</span>
            </div>

            {/* Mobile Navigation */}
            <div className="flex flex-col space-y-6">
              {navigation.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.1 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Link href={item.href} className="text-base text-medifly-dark font-medium hover:text-medifly-teal transition-colors" onClick={toggleMenu}>
                    {item.name}
                  </Link>
                </motion.div>
              ))}

              {/* Mobile Support Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-2 p-3 bg-green-50 rounded-lg"
              >
                <Phone className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">24/7 Support Available</span>
              </motion.div>

              {/* Mobile Auth Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                exit={{ opacity: 0, y: 20 }}
                className="pt-6 flex flex-col gap-3"
              >
                <Button asChild variant="outline" className="w-full justify-center">
                  <Link href="/login" onClick={toggleMenu}>
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
                <Button asChild className="w-full justify-center bg-medifly-teal text-white hover:bg-medifly-teal/90 rounded-full">
                  <Link href="/get-started" onClick={toggleMenu}>
                    Get Started Free
                  </Link>
                </Button>
              </motion.div>

              {/* Language and Region */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="pt-4 border-t border-gray-200"
              >
                <div className="flex items-center justify-between text-sm text-medifly-gray">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span>English</span>
                  </div>
                  <span>🇺🇸 USD</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}