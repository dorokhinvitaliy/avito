import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { 
  X, 
  Sparkles, 
  User, 
  Bot, 
  Loader2,
  Check,
} from 'lucide-react';
import { 
  Button, 
  Stack, 
  Flex, 
  Typography, 
} from '@/shared/ui';
import { 
  chatWithAi, 
  buildSystemPrompt, 
  extractDescription,
  hasDescriptionBlock,
  type ChatMessage 
} from '../../api/ollamaApi';
import { AiChatInput } from '../AiChatInput/AiChatInput';
import { useMediaQuery } from '@/shared/lib/hooks/useMediaQuery';
import type { ItemCategory, ItemParams } from '@/entities/ad';
import styles from './AiChatAside.module.css';

interface AiChatAsideProps {
  isOpen: boolean;
  onClose: () => void;
  adData: {
    title: string;
    category: ItemCategory;
    price: number | null;
    params: ItemParams;
    description: string;
  };
  onApplyDescription: (text: string) => void;
}

export function AiChatAside({ isOpen, onClose, adData, onApplyDescription }: AiChatAsideProps) {
  const isDesktop = useMediaQuery('(min-width: 800px)');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: inputValue };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    abortControllerRef.current?.abort();
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const systemPrompt = buildSystemPrompt(
        adData.title,
        adData.category,
        adData.price,
        adData.params,
        adData.description
      );

      const history: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        ...newMessages
      ];

      const response = await chatWithAi(history, abortController.signal);
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error: unknown) {
      if (error instanceof Error && error.name !== 'AbortError') {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Ошибка при запросе к ИИ. Попробуйте еще раз.' }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = (content: string) => {
    const description = extractDescription(content);
    onApplyDescription(description);
    setMessages(prev => [...prev, { role: 'system', content: 'Описание применено к объявлению' }]);
  };

  const asideVariants = isDesktop 
    ? {
        open: { width: 400, opacity: 1, x: 0 },
        closed: { width: 0, opacity: 0, x: 0 }
      }
    : {
        open: { x: 0, width: '100%', maxWidth: 600 },
        closed: { x: '100%', width: '100%', maxWidth: 600 }
      };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {!isDesktop && (
            <motion.div 
              className={styles.overlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
          )}
          <motion.aside
            className={`${styles.aside} ${isDesktop ? styles.inline : ''}`}
            variants={asideVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <Flex justify="between" align="center" className={styles.header}>
              <Flex align="center" gap={2}>
                <div className={styles.aiBadge}>
                  <Sparkles size={16} />
                </div>
                <Typography variant="h4">ИИ Помощник</Typography>
              </Flex>
              <Button variant="ghost" size="sm" onClick={onClose} icon={<X size={18} />} />
            </Flex>

            <div className={styles.chatArea} ref={scrollRef}>
              {messages.length === 0 && (
                <Stack align="center" justify="center" className={styles.emptyState} gap={4}>
                  <div className={styles.emptyIcon}>
                    <Sparkles size={40} />
                  </div>
                  <Typography align="center" color="tertiary">
                    Я помогу улучшить ваше объявление. Спросите меня, как сделать описание привлекательнее!
                  </Typography>
                </Stack>
              )}
              
              {messages.map((msg, idx) => (
                <div key={idx} className={`${styles.messageWrapper} ${styles[msg.role]}`}>
                  <Flex gap={2} align="start">
                    <div className={styles.avatar}>
                      {msg.role === 'user' ? <User size={14} /> : msg.role === 'assistant' ? <Bot size={14} /> : <Sparkles size={14} />}
                    </div>
                    <Stack gap={2} className={styles.messageContent}>
                      <div className={styles.markdownContent}>
                        {msg.role === 'user' ? (
                          <Typography variant="body2" className={styles.text} color="inverse">
                            {msg.content}
                          </Typography>
                        ) : (
                          <ReactMarkdown
                            components={{
                              code({ children }) {
                                return (
                                  <div className={styles.descriptionCard}>
                                    <Flex align="center" gap={2} className={styles.cardHeader}>
                                      <Sparkles size={14} className={styles.aiIcon} />
                                      <Typography variant="caption" weight="bold">Новый вариант описания</Typography>
                                    </Flex>
                                    <div className={styles.cardBody}>
                                      {children}
                                    </div>
                                  </div>
                                );
                              }
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        )}
                      </div>
                      
                      {msg.role === 'assistant' && hasDescriptionBlock(msg.content) && (
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          className={styles.applyBtn}
                          onClick={() => handleApply(msg.content)}
                          icon={<Check size={14} />}
                        >
                          Применить описание
                        </Button>
                      )}
                    </Stack>
                  </Flex>
                </div>
              ))}
              
              {isLoading && (
                <div className={`${styles.messageWrapper} ${styles.assistant}`}>
                  <Flex gap={2} align="center">
                    <div className={styles.avatar}>
                      <Bot size={14} />
                    </div>
                    <Loader2 size={18} className={styles.spin} />
                    <Typography variant="caption" color="tertiary">Думаю...</Typography>
                  </Flex>
                </div>
              )}
            </div>

            <div className={styles.footer}>
              <AiChatInput 
                value={inputValue}
                onChange={setInputValue}
                onSubmit={handleSend}
                isLoading={isLoading}
              />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
