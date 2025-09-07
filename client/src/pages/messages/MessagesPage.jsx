import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { Send, MessageSquare, Users, Search, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock data for users only (no default conversations)
const mockUsers = {
  'user1': { id: 'user1', name: 'Alice Wonderland', profilePicture: 'https://avatar.vercel.sh/alice.png' },
  'user2': { id: 'user2', name: 'Bob The Builder', profilePicture: 'https://avatar.vercel.sh/bob.png' },
  'user3': { id: 'user3', name: 'Charlie Brown', profilePicture: 'https://avatar.vercel.sh/charlie.png' },
};

const MessagesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user) {
      // Load conversations from localStorage - start with empty array if none exist
      const storedConversations = JSON.parse(localStorage.getItem(`conversations_${user.id}`)) || [];
      setConversations(storedConversations.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
    }
  }, [user]);

  useEffect(() => {
    if (selectedConversationId && user) {
      // Load messages for selected conversation - start with empty array if none exist
      const storedMessages = JSON.parse(localStorage.getItem(`messages_${user.id}_${selectedConversationId}`)) || [];
      setMessages(storedMessages.sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp)));
      
      // Mark as read
      const updatedConversations = conversations.map(c => 
        c.id === selectedConversationId ? { ...c, unread: 0 } : c
      );
      setConversations(updatedConversations);
      localStorage.setItem(`conversations_${user.id}`, JSON.stringify(updatedConversations));
    } else {
      setMessages([]);
    }
  }, [selectedConversationId, user, conversations]);

  const handleSelectConversation = (convoId) => {
    setSelectedConversationId(convoId);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversationId || !user) return;

    const recipient = conversations.find(c => c.id === selectedConversationId);
    if (!recipient) return;

    const messageData = {
      id: Date.now().toString(),
      senderId: user.id,
      text: newMessage,
      timestamp: new Date().toISOString(),
    };

    // Update messages for current user
    const updatedMessages = [...messages, messageData];
    setMessages(updatedMessages);
    localStorage.setItem(`messages_${user.id}_${selectedConversationId}`, JSON.stringify(updatedMessages));

    // Update last message in conversation list for current user
    const updatedConversationsForSender = conversations.map(c =>
      c.id === selectedConversationId ? { ...c, lastMessage: newMessage, timestamp: messageData.timestamp } : c
    ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setConversations(updatedConversationsForSender);
    localStorage.setItem(`conversations_${user.id}`, JSON.stringify(updatedConversationsForSender));
    
    // Simulate sending to recipient (update their localStorage too)
    const recipientConversationsKey = `conversations_${recipient.recipientId}`;
    const recipientConversations = JSON.parse(localStorage.getItem(recipientConversationsKey)) || [];
    const existingConvoWithSenderIndex = recipientConversations.findIndex(c => c.recipientId === user.id || c.id === selectedConversationId);
    
    let updatedRecipientConversations;
    let recipientConvoIdForMessages = selectedConversationId;

    if (existingConvoWithSenderIndex > -1) {
        recipientConvoIdForMessages = recipientConversations[existingConvoWithSenderIndex].id;
        updatedRecipientConversations = recipientConversations.map((c, index) => 
            index === existingConvoWithSenderIndex ? {...c, lastMessage: newMessage, timestamp: messageData.timestamp, unread: (c.unread || 0) + 1} : c
        );
    } else {
        // Create a new conversation for the recipient
        const newRecipientConvo = { 
            id: selectedConversationId,
            recipientId: user.id, 
            recipientName: user.name, 
            lastMessage: newMessage, 
            timestamp: messageData.timestamp, 
            unread: 1 
        };
        updatedRecipientConversations = [newRecipientConvo, ...recipientConversations];
        recipientConvoIdForMessages = newRecipientConvo.id;
    }
    localStorage.setItem(recipientConversationsKey, JSON.stringify(updatedRecipientConversations.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))));
    
    const recipientMessagesKey = `messages_${recipient.recipientId}_${recipientConvoIdForMessages}`;
    const recipientMessages = JSON.parse(localStorage.getItem(recipientMessagesKey)) || [];
    recipientMessages.push(messageData);
    localStorage.setItem(recipientMessagesKey, JSON.stringify(recipientMessages.sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp))));

    setNewMessage('');
    toast({ title: "Message Sent!" });
  };
  
  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase();
  };

  const filteredConversations = conversations.filter(convo =>
    convo.recipientName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const selectedConvoDetails = conversations.find(c => c.id === selectedConversationId);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-[calc(100vh-10rem)] flex flex-col md:flex-row gap-4"
    >
      {/* Conversations List */}
      <Card className="w-full md:w-1/3 lg:w-1/4 flex flex-col bg-card/80 backdrop-blur-sm">
        <CardHeader className="p-4 border-b">
          <div className="flex justify-between items-center mb-2">
            <CardTitle className="text-xl text-primary">Chats</CardTitle>
            <Button size="sm" variant="ghost" onClick={() => navigate('/alumni')} className="text-primary">
              <PlusCircle size={18} className="mr-1" /> New
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search chats..." 
              className="pl-8 h-9" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <ScrollArea className="flex-grow">
          <CardContent className="p-0">
            {filteredConversations.length > 0 ? filteredConversations.map(convo => (
              <div
                key={convo.id}
                className={`flex items-center p-3 hover:bg-accent/50 cursor-pointer border-b ${selectedConversationId === convo.id ? 'bg-accent/60' : ''}`}
                onClick={() => handleSelectConversation(convo.id)}
              >
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={mockUsers[convo.recipientId]?.profilePicture || `https://avatar.vercel.sh/${convo.recipientName}.png?size=40`} />
                  <AvatarFallback>{getInitials(convo.recipientName)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{convo.recipientName}</p>
                  <p className="text-xs text-muted-foreground truncate">{convo.lastMessage}</p>
                </div>
                {convo.unread > 0 && (
                  <span className="ml-2 bg-primary text-primary-foreground text-xs font-bold px-1.5 py-0.5 rounded-full">
                    {convo.unread}
                  </span>
                )}
              </div>
            )) : (
              <p className="p-4 text-center text-muted-foreground">No conversations yet. Start a new chat!</p>
            )}
          </CardContent>
        </ScrollArea>
      </Card>

      {/* Message Area */}
      <Card className="flex-1 flex flex-col bg-card/80 backdrop-blur-sm">
        {selectedConversationId && selectedConvoDetails ? (
          <>
            <CardHeader className="p-4 border-b flex flex-row items-center space-x-3">
               <Avatar className="h-10 w-10">
                  <AvatarImage src={mockUsers[selectedConvoDetails.recipientId]?.profilePicture || `https://avatar.vercel.sh/${selectedConvoDetails.recipientName}.png?size=40`} />
                  <AvatarFallback>{getInitials(selectedConvoDetails.recipientName)}</AvatarFallback>
                </Avatar>
              <div>
                <CardTitle className="text-lg text-primary">{selectedConvoDetails.recipientName}</CardTitle>
                <CardDescription className="text-xs">Online</CardDescription>
              </div>
            </CardHeader>
            <ScrollArea className="flex-grow p-4 space-y-4">
              {messages.length > 0 ? (
                messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${msg.senderId === user.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.senderId === user.id ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground text-left'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No messages yet. Send your first message!</p>
                </div>
              )}
            </ScrollArea>
            <CardFooter className="p-4 border-t">
              <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
                <Input 
                  placeholder="Type a message..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </CardFooter>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <MessageSquare size={64} className="text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold text-primary">Select a chat to start messaging</h2>
            <p className="text-muted-foreground">Or find an alumni and start a new conversation.</p>
            <Button onClick={() => navigate('/alumni')} className="mt-4">
              <Users size={18} className="mr-2" /> Find Alumni
            </Button>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default MessagesPage;