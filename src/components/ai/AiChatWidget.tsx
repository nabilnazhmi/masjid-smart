'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, MessageSquare, AlertCircle, RefreshCw, User } from 'lucide-react';
import { Button } from '@/lib/../components/ui/Button';
import { DataStore } from '@/lib/data/store';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  source?: string;
  disclaimer?: string;
}

const QUICK_QUESTIONS = [
  '📅 Kapan kajian berikutnya?',
  '💰 Berapa saldo kas masjid saat ini?',
  '👥 Siapa saja pengurus DKM?',
  '🏦 Bagaimana cara infaq / rekening masjid?',
  '📢 Apa pengumuman terbaru?',
];

export function AiChatWidget({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Assalamu'alaikum Warahmatullahi Wabarakatuh. Saya **MasjidSmart AI Assistant** siap membantu Anda dengan informasi kegiatan, kajian, transparansi kas, dan layanan masjid. Ada yang bisa saya bantu?",
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Gather latest live data to inject as context
      const settings = DataStore.getSettings();
      const activities = DataStore.getActivities('upcoming');
      const announcements = DataStore.getAnnouncements('published');
      const categories = DataStore.getCategories();
      const transactions = DataStore.getTransactions({ publicOnly: true });

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-4).map((m) => ({ role: m.role, content: m.content })),
          contextData: {
            settings,
            activities,
            announcements,
            categories,
            transactions,
          },
        }),
      });

      if (!res.ok) {
        throw new Error('Gagal menghubungi asisten AI');
      }

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Mohon maaf, terjadi kendala dalam merespon.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        source: data.source,
        disclaimer: data.disclaimer,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          role: 'assistant',
          content:
            'Mohon maaf, saat ini sistem AI sedang mengalami gangguan koneksi. Silakan periksa koneksi internet Anda atau hubungi langsung sekretariat pengurus DKM.',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-emerald-800 text-white rounded-full shadow-xl hover:bg-emerald-900 transition-all hover:scale-105 border-2 border-amber-400 group focus:outline-none focus:ring-4 focus:ring-emerald-700/50"
          aria-label="Buka Chatbot AI"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-amber-300" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
            </span>
          </div>
          <span className="font-semibold text-sm">Tanya AI Masjid</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[95vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-emerald-900/10 dark:border-gray-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 p-4 text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-700/60 rounded-xl border border-amber-400/30">
                <Bot className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="font-bold text-sm flex items-center gap-1.5">
                  MasjidSmart AI Assistant
                  <span className="bg-amber-400/20 text-amber-300 text-[10px] px-1.5 py-0.5 rounded border border-amber-400/30 font-medium">
                    Resmi
                  </span>
                </h3>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                  Tersambung ke Data Masjid Realtime
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  setMessages([
                    {
                      id: 'welcome',
                      role: 'assistant',
                      content:
                        "Assalamu'alaikum. Percakapan telah direset. Ada informasi masjid yang ingin Anda tanyakan?",
                      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                    },
                  ])
                }
                title="Reset Percakapan"
                className="p-1.5 text-emerald-200 hover:text-white hover:bg-emerald-700/50 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-emerald-200 hover:text-white hover:bg-emerald-700/50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Carousel */}
          <div className="bg-emerald-50/70 dark:bg-gray-800/50 border-b border-emerald-100 dark:border-gray-800 p-2 overflow-x-auto flex gap-1.5 scrollbar-thin">
            {QUICK_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q.replace(/^[^\s]+\s/, ''))}
                className="whitespace-nowrap text-[11px] bg-white dark:bg-gray-800 hover:bg-emerald-100/60 dark:hover:bg-gray-700 text-emerald-900 dark:text-emerald-300 border border-emerald-200/60 dark:border-gray-700 px-2.5 py-1 rounded-full transition-colors font-medium shadow-2xs"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Message List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-gray-50/50 dark:bg-gray-950/40 text-sm">
            {messages.map((m) => {
              const isBot = m.role === 'assistant';
              return (
                <div
                  key={m.id}
                  className={cn('flex items-start gap-2.5', isBot ? 'justify-start' : 'justify-end')}
                >
                  {isBot && (
                    <div className="w-7 h-7 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center shrink-0 mt-0.5 text-xs shadow-xs">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={cn(
                      'rounded-2xl px-4 py-2.5 max-w-[85%] shadow-xs leading-relaxed',
                      isBot
                        ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200/80 dark:border-gray-700/60'
                        : 'bg-emerald-800 text-white rounded-br-xs'
                    )}
                  >
                    <div className="whitespace-pre-wrap text-[13px]">{m.content}</div>
                    <div
                      className={cn(
                        'flex items-center justify-between gap-2 mt-1.5 text-[10px]',
                        isBot ? 'text-gray-400 dark:text-gray-500' : 'text-emerald-200 justify-end'
                      )}
                    >
                      {isBot && m.source && (
                        <span className="capitalize text-[9px] bg-gray-100 dark:bg-gray-700 px-1.5 py-0.2 rounded">
                          {m.source}
                        </span>
                      )}
                      <span>{m.timestamp}</span>
                    </div>
                  </div>

                  {!isBot && (
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs shadow-xs">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 text-gray-500 text-xs italic p-2 bg-white dark:bg-gray-800 rounded-xl w-fit border border-gray-200 dark:border-gray-700">
                <Bot className="w-4 h-4 text-emerald-700 animate-spin" />
                <span>MasjidSmart AI sedang memeriksa data masjid...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Tanyakan jadwal kajian, kas, atau pengurus..."
                className="flex-1 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 text-gray-900 dark:text-gray-100 placeholder-gray-400"
                disabled={isLoading}
              />
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={!inputValue.trim() || isLoading}
                className="rounded-xl px-3"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
            <p className="text-[10px] text-gray-400 text-center mt-2 flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Jawaban bersumber langsung dari database MasjidSmart AI.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
