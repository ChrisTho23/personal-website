"use client";
import { useChat } from 'ai/react';
import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const ChatBot = () => {
    const { messages, input, handleInputChange, handleSubmit, setMessages } = useChat({
        api: '/api/chat',
    });
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setIsOpen(false);
    }, [pathname, searchParams]);

    const handleCloseChat = () => {
        setIsOpen(false);
    };

    const handleResetChat = () => {
        setMessages([]); // Reset the chat messages
    };

    return (
        <div className="fixed bottom-5 right-5 z-50">
            {isOpen ? (
                <div className="w-96 h-[600px] p-4 bg-gradient-to-tl from-zinc-700/80 via-zinc-700 to-zinc-700/80 text-white rounded-lg shadow-lg flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-zinc-300 text-xl font-bold">ChrisGPT</h2>
                        <button onClick={handleCloseChat} className="text-zinc-400 text-sm p-1">
                            ×
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 border border-zinc-500 rounded mt-2 mb-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`mb-2 p-2 rounded-lg max-w-xs ${message.role === 'user' ? 'bg-zinc-200 text-zinc-600 self-end mr-4' : 'bg-zinc-600 text-white self-start ml-4 text-right'}`}
                            >
                                {message.content}
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleSubmit} className="flex mt-2 items-center">
                        <button
                            type="button"
                            onClick={handleResetChat}
                            className="bg-gradient-to-tl from-zinc-100/55 via-zinc-100 to-zinc-100/55 text-black h-12 w-12 rounded-full flex items-center justify-center"
                        >
                            <svg data-testid="geist-icon" height="16" stroke-linejoin="round" viewBox="0 0 16 16" width="16" style={{ color: "currentColor" }}>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M8.00002 1.25C5.33749 1.25 3.02334 2.73677 1.84047 4.92183L1.48342 5.58138L2.80253 6.29548L3.15958 5.63592C4.09084 3.91566 5.90986 2.75 8.00002 2.75C10.4897 2.75 12.5941 4.40488 13.2713 6.67462H11.8243H11.0743V8.17462H11.8243H15.2489C15.6631 8.17462 15.9989 7.83883 15.9989 7.42462V4V3.25H14.4989V4V5.64468C13.4653 3.06882 10.9456 1.25 8.00002 1.25ZM1.50122 10.8555V12.5V13.25H0.0012207V12.5V9.07538C0.0012207 8.66117 0.337007 8.32538 0.751221 8.32538H4.17584H4.92584V9.82538H4.17584H2.72876C3.40596 12.0951 5.51032 13.75 8.00002 13.75C10.0799 13.75 11.8912 12.5958 12.8266 10.8895L13.1871 10.2318L14.5025 10.9529L14.142 11.6105C12.9539 13.7779 10.6494 15.25 8.00002 15.25C5.05453 15.25 2.53485 13.4313 1.50122 10.8555Z" fill="currentColor"></path>
                            </svg>
                        </button>
                        <textarea
                            name="prompt"
                            value={input}
                            onChange={handleInputChange}
                            className="flex-1 h-12 p-2 border border-zinc-800 rounded-full resize-none ml-2 bg-zinc-600 text-white placeholder-zinc-400 flex items-center"
                            placeholder="Type your message..."
                            rows={1}
                            style={{ display: 'flex', alignItems: 'center' }}
                        />
                        <button type="submit" className="ml-2 bg-gradient-to-tl from-zinc-100/55 via-zinc-100 to-zinc-100/55 text-black h-12 px-4 rounded-full flex items-center justify-center">
                            Send
                        </button>
                    </form>
                </div>
            ) : (
                <button
                    className="h-14 w-32 bg-gradient-to-tl from-zinc-100/55 via-zinc-100 to-zinc-100/55 rounded-full text-black text-xl p-3 flex items-center justify-center"
                    onClick={() => setIsOpen(true)}
                >
                    <svg data-testid="geist-icon" height="16" stroke-linejoin="round" viewBox="0 0 16 16" width="16" style={{ color: "currentColor" }} className="mr-2">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8.75 2.79933C9.19835 2.53997 9.5 2.05521 9.5 1.5C9.5 0.671573 8.82843 0 8 0C7.17157 0 6.5 0.671573 6.5 1.5C6.5 2.05521 6.80165 2.53997 7.25 2.79933V5H7C4.027 5 1.55904 7.16229 1.08296 10H0V13H1V14.5V16H2.5H13.5H15V14.5V13H16V10H14.917C14.441 7.16229 11.973 5 9 5H8.75V2.79933ZM7 6.5C4.51472 6.5 2.5 8.51472 2.5 11V14.5H13.5V11C13.5 8.51472 11.4853 6.5 9 6.5H7ZM7.25 11.25C7.25 12.2165 6.4665 13 5.5 13C4.5335 13 3.75 12.2165 3.75 11.25C3.75 10.2835 4.5335 9.5 5.5 9.5C6.4665 9.5 7.25 10.2835 7.25 11.25ZM10.5 13C11.4665 13 12.25 12.2165 12.25 11.25C12.25 10.2835 11.4665 9.5 10.5 9.5C9.5335 9.5 8.75 10.2835 8.75 11.25C8.75 12.2165 9.5335 13 10.5 13Z" fill="currentColor"></path>
                    </svg>
                    <span>Chat</span>
                </button>
            )}
        </div>
    );
};

export default ChatBot;