'use client'

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import LoadingDots from './ui/LoadingDots';

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: `Hey {{FirstName}},

It's {RepName}, I am with Shiney Insurance. Hope you're well.

Had my calendar ping me, but didn't want to disturb you without texting first.
{{Special/Offer/Update}}

If you prefer not to receive my texts, please respond with "delete".

Would you like to take a look at the details?`
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [threadId, setThreadId] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  useEffect(() => {
    // Call the /start endpoint to get the thread ID
    const initializeChat = async () => {
      try {
        const response = await fetch('https://insurancedemo.shiney.ai/start', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Origin': 'http://localhost:3000'
          },
          credentials: 'include',
          body: JSON.stringify({ contact_id: 'nGUEPVUI8y2BcPL8dUv5' }), // Replace with actual contact_id if needed
        });

        const data = await response.json();
        if (response.ok) {
          setThreadId(data.thread_id); // Ensure thread_id is set here
        } else {
          console.error('Error:', data);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    initializeChat();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && threadId) {
      // Immediately add the user's message
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'user', content: inputMessage },
      ]);
      setInputMessage('');

      // Set loading to true
      setIsLoading(true);

      try {
        const response = await fetch('https://insurancedemo.shiney.ai/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Origin': 'http://localhost:3000'
          },
          credentials: 'include',
          body: JSON.stringify({
            Memory: threadId,
            'Lead Response': inputMessage,
            contact_id: 'nGUEPVUI8y2BcPL8dUv5'
          }),
        });

        const data = await response.json();

        if (response.ok) {
          // Add the AI's response
          setMessages((prevMessages) => [
            ...prevMessages,
            { role: 'ai', content: data.message },
          ]);
        } else {
          console.error('Error:', data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        // Set loading to false
        setIsLoading(false);
      }
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <div className={`flex h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      <div className={`w-48 ${darkMode ? 'bg-gray-900' : 'bg-white'} p-4 hidden md:flex md:flex-col justify-between shadow-lg`}>
        <div>
          <div className="flex justify-center mb-8">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fd686c2d95a92265e7c9e08b2107269a_1200_80-aQEAikjgWcHhDRR4SaCmm1NX6yZfcx.webp"
              alt="Shiney.ai Logo"
              width={150}
              height={40}
            />
          </div>
          <Button className="w-full bg-teal-100 text-teal-600 hover:bg-teal-200 dark:bg-teal-700 dark:text-teal-100 dark:hover:bg-teal-600 rounded-2xl">SOLAR AI</Button>
        </div>
        <div className="flex items-center justify-center space-x-4">
          <Sun
            className={`h-6 w-6 cursor-pointer ${darkMode ? 'text-gray-400' : 'text-yellow-500'}`}
            onClick={toggleDarkMode}
          />
          <Moon
            className={`h-6 w-6 cursor-pointer ${darkMode ? 'text-yellow-500' : 'text-gray-400'}`}
            onClick={toggleDarkMode}
          />
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className={`flex-1 overflow-y-auto p-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.3 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                transition={{ type: "spring", stiffness: 500, damping: 30, mass: 1 }}
                className={`flex items-start mb-4 ${message.role === 'user' ? 'justify-end' : ''}`}
              >
                {message.role === 'ai' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mr-3 mt-1 flex-shrink-0"
                  >
                    <svg
                      className={`w-8 h-8 ${darkMode ? 'text-teal-300' : 'text-teal-500'}`}
                      fill="none"
                      height="32"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="32"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 8V4H8" />
                      <rect height="12" rx="2" width="16" x="4" y="8" />
                      <path d="M2 14h2" />
                      <path d="M20 14h2" />
                      <path d="M15 13v2" />
                      <path d="M9 13v2" />
                    </svg>
                  </motion.div>
                )}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className={`rounded-3xl ${darkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}>
                    <CardContent className="p-4">
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </CardContent>
                  </Card>
                </motion.div>
                {message.role === 'user' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="ml-3 mt-1 flex-shrink-0"
                  >
                    <Avatar className="rounded-2xl">
                      <AvatarFallback className={`${darkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-300 text-gray-600'} rounded-2xl`}>
                        <svg
                          className={`w-6 h-6 ${darkMode ? 'text-gray-200' : 'text-gray-600'}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          ></path>
                        </svg>
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                )}
              </motion.div>
            ))}

            {/* Loading animation as an AI message */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.3 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                transition={{ type: 'spring', stiffness: 500, damping: 30, mass: 1 }}
                className="flex items-start mb-4"
              >
                {/* AI Icon */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mr-3 mt-1 flex-shrink-0"
                >
                  <svg
                    className={`w-8 h-8 ${darkMode ? 'text-teal-300' : 'text-teal-500'}`}
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 8V4H8" />
                    <rect height="12" rx="2" width="16" x="4" y="8" />
                    <path d="M2 14h2" />
                    <path d="M20 14h2" />
                    <path d="M15 13v2" />
                    <path d="M9 13v2" />
                  </svg>
                </motion.div>

                {/* Loading Dots inside a message bubble */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className={`rounded-3xl ${darkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}>
                    <CardContent className="p-4">
                      <LoadingDots />
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <form onSubmit={handleSendMessage} className={`p-4 ${darkMode ? 'bg-gray-700 border-t border-gray-600' : 'bg-white border-t'} shadow-lg`}>
          <div className="flex items-center">
            <div className="flex-grow mr-2" style={{ width: '80%' }}>
              <Input
                className={`w-full rounded-2xl ${darkMode ? 'bg-gray-600 text-white border-gray-500' : 'border-gray-200'} text-black dark:text-white`}
                placeholder="Send your message"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                style={{ borderWidth: '1px' }}
              />
            </div>
            <Button type="submit" className={`rounded-2xl flex-shrink-0 ${darkMode ? 'bg-teal-600 hover:bg-teal-500 text-white' : ''}`}>Send</Button>
          </div>
        </form>
      </div>
    </div>
  )
}