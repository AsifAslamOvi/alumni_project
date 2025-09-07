import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { CalendarDays, MapPin, Users, Search, PlusCircle, ExternalLink, Clock, FileText, X, MessageSquare, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const EventCard = ({ event, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    whileHover={{ scale: 1.03, boxShadow: "0px 8px 15px rgba(0,0,0,0.1)" }}
    onClick={onClick}
    className="cursor-pointer"
  >
    <Card className="overflow-hidden bg-card/80 backdrop-blur-sm h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl text-primary">{event.name}</CardTitle>
        <CardDescription className="text-sm">
          <Users size={14} className="inline mr-1 text-accent" /> Type: {event.type}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 flex-grow">
        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarDays size={14} className="mr-2 text-accent" /> {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock size={14} className="mr-2 text-accent" /> {event.time}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin size={14} className="mr-2 text-accent" /> {event.location}
        </div>
        <p className="text-sm text-foreground pt-2">{event.description.substring(0,100)}{event.description.length > 100 ? '...' : ''}</p>
        {event.attachedFile && (
            <div className="flex items-center text-sm text-muted-foreground pt-1">
                <FileText size={14} className="mr-2 text-accent" /> Attached: {event.attachedFile}
            </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-3 border-t">
        <div className="text-xs text-muted-foreground">
          Posted By: {event.postedBy}
        </div>
        <div className="flex items-center gap-2">
          
          <Button 
            variant="default" 
            size="sm" 
            className="bg-primary hover:bg-primary/80" 
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            DETAILS <ExternalLink size={14} className="ml-2"/>
          </Button>
        </div>
      </CardFooter>
    </Card>
  </motion.div>
);

const Comment = ({ comment }) => {
  const { user } = useAuth();
  const isCurrentUser = user?.email === comment.userEmail;
  
  return (
    <div className={`flex gap-3 ${isCurrentUser ? 'justify-end' : ''}`}>
      {!isCurrentUser && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.userAvatar} />
          <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
        </Avatar>
      )}
      <div className={`flex flex-col ${isCurrentUser ? 'items-end' : ''}`}>
        <div className={`rounded-lg px-4 py-2 ${isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
          <p>{comment.text}</p>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {comment.userName} • {new Date(comment.timestamp).toLocaleString()}
        </p>
      </div>
      {isCurrentUser && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.userAvatar} />
          <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

const EventDetailsModal = ({ event, isOpen, onClose }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(event?.comments || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (event) {
      setComments(event.comments || []);
    }
  }, [event]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast({ variant: "destructive", title: "Authentication Error", description: "You must be logged in to comment." });
      return;
    }
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newComment = {
      id: Date.now().toString(),
      text: commentText,
      userName: user.name || 'Anonymous',
      userEmail: user.email,
      userAvatar: user.avatar,
      timestamp: new Date().toISOString()
    };

    try {
          setIsLoading(true)
            const response = await fetch(
                `http://localhost:5000/eventComment/${event._id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newComment),
                }
            );

            const data = await response.json();

            if (data.modifiedCount > 0) {
                setComments([...comments, newComment]); // update UI instantly
            }
        } catch (err) {
            console.error("Error updating comment:", err);
        }
        finally {
          setIsLoading(false)
    }

    // const updatedComments = [...comments, newComment];
    // setComments(updatedComments);
    
    // const storedEvents = JSON.parse(localStorage.getItem('ruetAlumniEvents')) || [];
    // const updatedEvents = storedEvents.map(ev => 
    //   ev.id === event.id ? { ...ev, comments: updatedComments } : ev
    // );
    // localStorage.setItem('ruetAlumniEvents', JSON.stringify(updatedEvents));
    
    setCommentText('');
    setIsSubmitting(false);
  };

  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl flex justify-between items-center">
            <span>{event.name}</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X size={18} />
            </Button>
          </DialogTitle>
          <DialogDescription className="flex items-center">
            <Users size={14} className="mr-1 text-accent" /> {event.type}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <CalendarDays size={16} className="mr-2 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p>{new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Clock size={16} className="mr-2 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p>{event.time}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-start">
              <MapPin size={16} className="mr-2 text-accent mt-1" />
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p>{event.location}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-2">Description</p>
              <p className="whitespace-pre-line">{event.description}</p>
            </div>
            
            {event.attachedFile && (
              <div className="flex items-center">
                <FileText size={16} className="mr-2 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Attached File</p>
                  <p>{event.attachedFile}</p>
                </div>
              </div>
            )}
            
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">Posted By: {event.postedBy}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium flex items-center mb-4">
              <MessageSquare size={18} className="mr-2 text-accent" /> 
              Comments ({comments.length})
            </h3>
            
            <div className="space-y-4 mb-4">
              {comments.length > 0 ? (
                comments.map(comment => (
                  <Comment key={comment.id} comment={comment} />
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <Input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1"
              disabled={!user}
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={!commentText.trim() || isSubmitting || !user}
            >
              <Send size={18} />
            </Button>
          </form>
          {!user && (
            <p className="text-xs text-muted-foreground mt-2">
              You must be logged in to comment.
            </p>
          )}
        </div>

        {event.rsvpLink && (
          <DialogFooter>
            <Button asChild className="w-full">
              <a href={event.rsvpLink} target="_blank" rel="noopener noreferrer">
                RSVP / More Details <ExternalLink size={14} className="ml-2"/>
              </a>
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

const EventForm = ({ onEventSubmitted }) => {
  const [formData, setFormData] = useState({ 
    name: '', 
    date: '', 
    time: '', 
    location: '',
    type: 'Meetup', 
    description: '', 
    rsvpLink: '', 
    attachedFile: null,
    comments: []
  });
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState('');
  const formRef = useRef(null);
  const formContentRef = useRef(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, attachedFile: file });
      setFileName(file.name);
    } else {
      setFormData({ ...formData, attachedFile: null });
      setFileName('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast({ variant: "destructive", title: "Authentication Error", description: "You must be logged in to post an event." });
      return;
    }
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newEvent = { 
      ...formData, 
      id: Date.now().toString(), 
      postedBy: user.name || 'Alumni', 
      isVerified: false,
      attachedFile: fileName,
      comments: []
    };
    
    const existingEvents = JSON.parse(localStorage.getItem('ruetAlumniEvents')) || [];
    existingEvents.unshift(newEvent); 
    localStorage.setItem('ruetAlumniEvents', JSON.stringify(existingEvents));

    onEventSubmitted(newEvent);
    toast({ title: "Event Submitted!", description: "Your event has been submitted for admin verification." });
    setFormData({ 
      name: '', 
      date: '', 
      time: '', 
      location: '', 
      type: 'Meetup', 
      description: '', 
      rsvpLink: '', 
      attachedFile: null,
      comments: [] 
    });
    setFileName('');
    setIsSubmitting(false);
  };

  return (
    <form 
      ref={formRef}
      onSubmit={handleSubmit} 
      className="flex flex-col h-full"
    >
      <div 
        ref={formContentRef}
        className="flex-1 overflow-y-auto pr-2 space-y-4 pb-4"
        style={{ maxHeight: 'calc(80vh - 150px)' }}
        onWheel={(e) => {
          e.stopPropagation();
        }}
      >
        <div><Label htmlFor="name">Event Name</Label><Input id="name" name="name" value={formData.name} onChange={handleChange} required /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><Label htmlFor="date">Date</Label><Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required /></div>
          <div><Label htmlFor="time">Time</Label><Input id="time" name="time" type="time" value={formData.time} onChange={handleChange} required /></div>
        </div>
        <div><Label htmlFor="location">Location / Platform</Label><Input id="location" name="location" value={formData.location} onChange={handleChange} placeholder="e.g., RUET Auditorium or Online (Zoom)" required /></div>
        <div><Label htmlFor="type">Event Type</Label><Input id="type" name="type" value={formData.type} onChange={handleChange} placeholder="e.g., Meetup, Webinar, Reunion, Workshop" /></div>
        <div><Label htmlFor="description">Description</Label><Textarea id="description" name="description" value={formData.description} onChange={handleChange} required /></div>
        <div><Label htmlFor="rsvpLink">RSVP/Details Link</Label><Input id="rsvpLink" name="rsvpLink" value={formData.rsvpLink} onChange={handleChange} placeholder="https://example.com/event-details" /></div>
        
        <div className="space-y-2">
          <Label htmlFor="eventAttachedFile">Attach File (Optional)</Label>
          <div className="flex items-center gap-2">
            <label
              htmlFor="eventAttachedFile"
              className="flex flex-col items-center justify-center w-full px-4 py-6 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors"
            >
              <FileText size={24} className="mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-primary">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">PDF, DOCX, or image files (max 5MB)</p>
              <Input
                id="eventAttachedFile"
                name="attachedFile"
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
            </label>
          </div>
          {fileName && (
            <div className="flex items-center gap-2 p-2 text-sm border rounded-md bg-muted/20">
              <FileText size={16} className="text-primary" />
              <span className="truncate flex-1">{fileName}</span>
              <Button
                type="button"
                variant="ghost"
                size="iconSm"
                onClick={() => {
                  setFormData({ ...formData, attachedFile: null });
                  setFileName('');
                }}
              >
                <X size={16} />
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <DialogFooter className="border-t pt-4 bg-background sticky bottom-0">
        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full"
        >
          {isSubmitting ? 'Submitting for Review...' : 'Submit Event for Review'}
        </Button>
      </DialogFooter>
    </form>
  );
};

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { user } = useAuth();
  const dialogContentRef = useRef(null);
  const [totalEvents, setTotalEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch("http://localhost:5000/events");

                const result = await response.json();
                setTotalEvents(result);
            } catch (err) {
                console.error("Failed to fetch users:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []); 

  useEffect(() => {
    setEvents(totalEvents.filter((event) => event.isVerified));
  }, [totalEvents,events]);

const handleEventSubmitted = async (newEvent) => {
    try {
        setIsFormOpen(false);
        setIsLoading(true);

        const response = await fetch("http://localhost:5000/events", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newEvent),
        });

        if (!response.ok) {
            throw new Error("Failed to create event");
        }

        const savedEvent = await response.json();

        // Update events in state (add the new one at the top)
        // setEvents((prev) => [{ ...savedEvent, comments: [] }, ...prev]);
    } catch (error) {
        console.error(error.message);
    } finally {
        setIsLoading(false);
    }
};


  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsDetailsOpen(true);
  };

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg shadow-md flex flex-col md:flex-row justify-between items-center"
      >
        <div>
          <h1 className="text-4xl font-bold text-primary mb-3">Events & Announcements</h1>
          <p className="text-muted-foreground mb-4 md:mb-0">Stay informed about upcoming alumni events, webinars, and university announcements.</p>
        </div>
        {user && user.isVerified && (
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <PlusCircle size={18} className="mr-2" /> Post an Event
              </Button>
            </DialogTrigger>
            <DialogContent 
              className="sm:max-w-[525px] h-[80vh] flex flex-col overflow-hidden"
              onInteractOutside={(e) => {
                if (isFormOpen) {
                  e.preventDefault();
                }
              }}
            >
              <DialogHeader className="border-b">
                <DialogTitle className="text-2xl">Post a New Event/Announcement</DialogTitle>
                <DialogDescription>
                  Share an event or announcement with the RUET alumni network. Your post will be reviewed by an admin before appearing publicly.
                </DialogDescription>
              </DialogHeader>
              <EventForm onEventSubmitted={handleEventSubmitted} />
            </DialogContent>
          </Dialog>
        )}
      </motion.div>
      
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search events by name, type, location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full md:w-1/2"
        />
      </div>

      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <EventCard key={event.id} event={event} onClick={() => handleEventClick(event)} />
          ))}
        </div>
      ) : (
         <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-10"
        >
          <CalendarDays size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-xl text-muted-foreground">No events found matching your criteria. {events.length === 0 && "Check back later or post one if you're a verified alumni!"}</p>
        </motion.div>
      )}
      
      <EventDetailsModal 
        event={selectedEvent} 
        isOpen={isDetailsOpen} 
        onClose={() => setIsDetailsOpen(false)} 
      />
    </div>
  );
};

export default EventsPage;