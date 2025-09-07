import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Send, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const NewMessagePage = () => {
  const { recipientId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [recipient, setRecipient] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      toast({ variant: "destructive", title: "Login Required", description: "Please login to send messages."});
      return;
    }

    const fetchRecipient = async () => {
      setIsLoading(true);
      
      try {
        // Check if recipient was passed in state
        if (location.state?.recipient) {
          setRecipient(location.state.recipient);
          setIsLoading(false);
          return;
        }

        // Fetch from registered users
        const registeredUsers = JSON.parse(localStorage.getItem('ruetAlumniRegisteredUsers')) || [];
        const foundRecipient = registeredUsers.find(u => u.id === recipientId);
        
        if (!foundRecipient) {
          toast({ variant: "destructive", title: "User Not Found", description: "The recipient is not a registered alumni." });
          navigate('/alumni');
          return;
        }

        setRecipient(foundRecipient);
      } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Failed to load recipient information." });
        navigate('/alumni');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipient();
  }, [user, navigate, toast, recipientId, location.state?.recipient]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!recipient) return;
    
    if (!messageText.trim()) {
      toast({ variant: "destructive", title: "Empty Message", description: "Cannot send an empty message." });
      return;
    }
    
    setIsSending(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate conversation ID
      const convoIdParts = [user.id, recipient.id].sort();
      const conversationId = `convo_${convoIdParts[0]}_${convoIdParts[1]}`;

      const messageData = {
        id: Date.now().toString(),
        senderId: user.id,
        text: messageText,
        timestamp: new Date().toISOString(),
      };

      // Update messages for current user
      const currentUserMessagesKey = `messages_${user.id}_${conversationId}`;
      const existingMessages = JSON.parse(localStorage.getItem(currentUserMessagesKey)) || [];
      existingMessages.push(messageData);
      localStorage.setItem(currentUserMessagesKey, JSON.stringify(existingMessages));

      // Update conversation list for current user
      const currentUserConvosKey = `conversations_${user.id}`;
      let conversations = JSON.parse(localStorage.getItem(currentUserConvosKey)) || [];
      const convoIndex = conversations.findIndex(c => c.id === conversationId);
      
      if (convoIndex > -1) {
        conversations[convoIndex] = { 
          ...conversations[convoIndex], 
          lastMessage: messageText, 
          timestamp: messageData.timestamp, 
          unread: 0 
        };
      } else {
        conversations.push({ 
          id: conversationId, 
          recipientId: recipient.id, 
          recipientName: recipient.name, 
          lastMessage: messageText, 
          timestamp: messageData.timestamp, 
          unread: 0 
        });
      }
      
      localStorage.setItem(currentUserConvosKey, JSON.stringify(conversations.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))));

      // Update for recipient
      const recipientMessagesKey = `messages_${recipient.id}_${conversationId}`;
      const existingRecipientMessages = JSON.parse(localStorage.getItem(recipientMessagesKey)) || [];
      existingRecipientMessages.push(messageData);
      localStorage.setItem(recipientMessagesKey, JSON.stringify(existingRecipientMessages));
      
      const recipientConvosKey = `conversations_${recipient.id}`;
      let recipientConversations = JSON.parse(localStorage.getItem(recipientConvosKey)) || [];
      const recipientConvoIndex = recipientConversations.findIndex(c => c.id === conversationId);
      
      if (recipientConvoIndex > -1) {
        recipientConversations[recipientConvoIndex] = { 
          ...recipientConversations[recipientConvoIndex], 
          lastMessage: messageText, 
          timestamp: messageData.timestamp, 
          unread: (recipientConversations[recipientConvoIndex].unread || 0) + 1 
        };
      } else {
        recipientConversations.push({ 
          id: conversationId, 
          recipientId: user.id, 
          recipientName: user.name, 
          lastMessage: messageText, 
          timestamp: messageData.timestamp, 
          unread: 1 
        });
      }
      
      localStorage.setItem(recipientConvosKey, JSON.stringify(recipientConversations.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))));

      toast({ title: "Message Sent!", description: `Your message to ${recipient.name} has been sent.` });
      navigate('/messages');
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to send message. Please try again." });
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!recipient) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-4">
        <h2 className="text-2xl font-semibold text-primary">Recipient Not Found</h2>
        <p className="text-muted-foreground mt-2">The alumni you're trying to message is not registered.</p>
        <Button onClick={() => navigate('/alumni')} className="mt-4">
          Back to Alumni Directory
        </Button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="bg-card/90 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center mb-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <CardTitle className="text-2xl text-primary">New Message</CardTitle>
          </div>
          <CardDescription>
            Compose your message to <span className="font-semibold text-accent">{recipient.name}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendMessage} className="space-y-6">
            <div>
              <Label htmlFor="messageText" className="sr-only">Message</Label>
              <Textarea
                id="messageText"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder={`Write your message to ${recipient.name}...`}
                rows={8}
                required
                className="text-base"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90" 
              disabled={isSending || !recipient}
            >
              {isSending ? (
                <>
                  <Send className="mr-2 h-4 w-4 animate-pulse" /> Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" /> Send Message
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NewMessagePage;