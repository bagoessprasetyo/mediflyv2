"use client";

import React, { useState } from "react";
import {
    SmilePlus,
    Send,
    MoreHorizontal,
    CheckCheck,
    Check,
    Stethoscope,
    Heart,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Message {
    id: string;
    content: string;
    sender: {
        name: string;
        avatar: string;
        isOnline: boolean;
        specialty?: string;
    };
    timestamp: string;
    status: "sent" | "delivered" | "read";
    reactions?: Array<{
        emoji: string;
        count: number;
        reacted: boolean;
    }>;
}

interface HealthcareChatProps {
    chatName?: string;
    messages?: Message[];
}

export default function HealthcareChat({
    chatName = "MediFly Specialists",
    messages = [
        {
            id: "1",
            content: "Good morning! I've reviewed your recent test results. Everything looks within normal ranges, but I'd like to discuss some preventive measures we can take. 🏥",
            sender: {
                name: "Dr. Sarah Chen",
                avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face&auto=format",
                isOnline: true,
                specialty: "Cardiologist"
            },
            timestamp: "9:15 AM",
            status: "read",
            reactions: [
                { emoji: "👍", count: 2, reacted: true },
                { emoji: "❤️", count: 1, reacted: false },
            ],
        },
        {
            id: "2",
            content: "Thank you Dr. Chen! I really appreciate your thorough analysis. What preventive measures would you recommend?",
            sender: {
                name: "Patient",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format",
                isOnline: true,
            },
            timestamp: "9:17 AM",
            status: "delivered",
        },
        {
            id: "3",
            content: "I'd recommend incorporating more omega-3 rich foods into your diet and maintaining regular exercise. I'll send you a personalized nutrition plan within the hour. 📋✨",
            sender: {
                name: "Dr. Sarah Chen",
                avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face&auto=format",
                isOnline: true,
                specialty: "Cardiologist"
            },
            timestamp: "9:20 AM",
            status: "delivered",
            reactions: [
                { emoji: "🙏", count: 1, reacted: false },
            ],
        },
    ],
}: HealthcareChatProps) {
    const [selectedSender, setSelectedSender] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState("");

    // Get unique senders from messages
    const uniqueSenders = Array.from(
        new Map(
            messages.map((m) => [m.sender.name, m.sender])
        ).values()
    );

    // Filter messages by selected sender or show all
    const filteredMessages = selectedSender
        ? messages.filter((m) => m.sender.name === selectedSender)
        : messages;

    const handleSendMessage = () => {
        if (inputValue.trim()) {
            // Here you could add the message to the chat
            console.log("Sending message:", inputValue);
            setInputValue("");
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-3xl shadow-xl flex flex-col h-[550px] border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <header className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-medifly-teal/10 rounded-xl">
                        <Stethoscope className="w-6 h-6 text-medifly-teal" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {chatName}
                        </h2>
                        <p className="text-sm text-medifly-teal font-medium">
                            Connect with verified healthcare professionals
                        </p>
                    </div>
                </div>
                <button
                    aria-label="More options"
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                    <MoreHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
            </header>

            {/* Body */}
            <main className="flex flex-1 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                {/* Specialists List */}
                <aside className="w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                        Available Specialists
                    </div>
                    {uniqueSenders.map((sender) => {
                        const isSelected = selectedSender === sender.name;
                        return (
                            <button
                                key={sender.name}
                                onClick={() =>
                                    setSelectedSender(
                                        isSelected ? null : sender.name
                                    )
                                }
                                className={cn(
                                    "flex items-center gap-3 w-full p-3 mb-2 rounded-xl transition-colors text-left",
                                    isSelected
                                        ? "bg-medifly-teal text-white"
                                        : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-300"
                                )}
                            >
                                <div className="relative">
                                    <Image
                                        src={sender.avatar}
                                        alt={sender.name}
                                        width={40}
                                        height={40}
                                        className="rounded-full ring-2 ring-white dark:ring-gray-600"
                                    />
                                    <span
                                        className={cn(
                                            "absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white dark:ring-gray-800",
                                            sender.isOnline
                                                ? "bg-green-500"
                                                : "bg-gray-400"
                                        )}
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium truncate text-sm">
                                        {sender.name}
                                    </div>
                                    {sender.specialty && (
                                        <div className={cn(
                                            "text-xs truncate",
                                            isSelected ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
                                        )}>
                                            {sender.specialty}
                                        </div>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </aside>

                {/* Messages */}
                <section className="flex-1 p-6 overflow-y-auto bg-white dark:bg-gray-900">
                    {filteredMessages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <Heart className="w-12 h-12 text-gray-400 mb-4" />
                            <p className="text-gray-500 dark:text-gray-400">
                                No messages to display. Start a conversation with your healthcare provider.
                            </p>
                        </div>
                    ) : (
                        filteredMessages.map((message) => (
                            <div
                                key={message.id}
                                className="mb-6 last:mb-0 group"
                            >
                                <div className="flex items-start gap-3 mb-2">
                                    <Image
                                        src={message.sender.avatar}
                                        alt={message.sender.name}
                                        width={36}
                                        height={36}
                                        className="rounded-full ring-2 ring-gray-200 dark:ring-gray-600 mt-1"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-gray-900 dark:text-white text-sm">
                                                {message.sender.name}
                                            </span>
                                            {message.sender.specialty && (
                                                <span className="px-2 py-0.5 bg-medifly-teal/10 text-medifly-teal text-xs rounded-full font-medium">
                                                    {message.sender.specialty}
                                                </span>
                                            )}
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {message.timestamp}
                                            </span>
                                        </div>
                                        <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                                            {message.content}
                                        </p>
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                                {message.status === "read" && (
                                                    <CheckCheck className="w-4 h-4 text-green-500" />
                                                )}
                                                {message.status === "delivered" && (
                                                    <Check className="w-4 h-4" />
                                                )}
                                                <span>Read</span>
                                            </div>
                                            <div className="flex gap-1">
                                                {message.reactions?.map((reaction) => (
                                                    <button
                                                        key={reaction.emoji}
                                                        className={cn(
                                                            "px-2 py-1 rounded-lg text-xs transition-colors",
                                                            reaction.reacted
                                                                ? "bg-medifly-teal/10 text-medifly-teal"
                                                                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
                                                            "hover:bg-medifly-teal/20"
                                                        )}
                                                    >
                                                        {reaction.emoji} {reaction.count}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </section>
            </main>

            {/* Footer */}
            <footer className="mt-6 flex items-center gap-3 border-t border-gray-200 dark:border-gray-700 pt-4">
                <button
                    aria-label="Add emoji"
                    className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                    <SmilePlus className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
                <input
                    type="text"
                    placeholder="Ask your specialist anything..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className={cn(
                        "flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700",
                        "bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400",
                        "focus:outline-none focus:ring-2 focus:ring-medifly-teal focus:border-transparent transition"
                    )}
                />
                <button
                    aria-label="Send message"
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className={cn(
                        "p-3 rounded-xl transition",
                        inputValue.trim()
                            ? "bg-medifly-teal text-white hover:bg-medifly-teal/90"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    )}
                >
                    <Send className="w-5 h-5" />
                </button>
            </footer>
        </div>
    );
}

export { HealthcareChat };