"use client";
import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        const handleRouteChange = () => {
            setIsOpen(false);
        };

        // Handle route changes
        handleRouteChange();

    }, [pathname, searchParams]);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        const response = await fetch('/api/getMessages');
        const data = await response.json();
        const fetchedMessages = data.messages.map((msg: any) => msg.message);
        setMessages(fetchedMessages);
    };

    const handleSendMessage = async () => {
        const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
        if (textarea.value.trim()) {
            const newMessage = textarea.value;
            setMessages([...messages, newMessage]);
            textarea.value = '';

            await fetch('/api/saveMessage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: newMessage }),
            });
        }
    };

    const handleCloseChat = async () => {
        setIsOpen(false);
        await fetch('/api/deleteMessages', {
            method: 'POST',
        });
        setMessages([]);
    };


    return (
        <div className="fixed bottom-5 right-5 z-50">
            {isOpen ? (
                <div className="w-96 h-96 p-4 bg-white rounded-lg shadow-lg flex flex-col">
                    <button onClick={handleCloseChat} className="self-start text-gray-500 text-sm p-1">
                        ×
                    </button>
                    <div className="flex-1 overflow-y-auto p-2 border border-gray-300 rounded mt-2 mb-4">
                        {messages.map((message, index) => (
                            <div key={index} className="mb-2 p-2 bg-gray-100 rounded">
                                {message}
                            </div>
                        ))}
                    </div>
                    <textarea className="p-2 border border-gray-300 rounded mt-2 mb-4" placeholder="Type your message..."></textarea>
                    <button onClick={handleSendMessage} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Send
                    </button>
                </div>
            ) : (
                <button className="h-14 w-14 bg-blue-500 rounded-full text-white text-lg p-3 flex items-center justify-center shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out"
                        onClick={() => setIsOpen(true)}>
                    Chat
                </button>
            )}
        </div>
    );
};

export default ChatBot;