import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle, XCircle, CalendarCheck, Users, MapPin, Clock, FileText, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

const AdminVerifyEventsPage = () => {
  const [pendingEvents, setPendingEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [verifiedEvents, setVerifiedEvents] = useState([]);
  const [totalJobPosts, setTotalJobPosts] = useState(0);
  const [totalEventPosts, setTotalEventPosts] = useState(0);
  const { toast } = useToast();

  // Fetch events and update both pending and verified lists
  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5000/events");
      const result = await response.json();
      setEvents(result);
      setPendingEvents(result.filter(event => !event.isVerified));
      setVerifiedEvents(result.filter(event => event.isVerified));
      setTotalEventPosts(result.length);
      setTotalJobPosts(result.filter(event => event.type === "Job").length);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  console.log(events);

  useEffect(() => {
    setPendingEvents(events.filter(event => !event.isVerified));
  }, [events]);

  const updateLocalStorageAndState = (updatedEvents) => {
    setPendingEvents(updatedEvents.filter(event => !event.isVerified));
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleVerify = async (event) => {
    const res = await fetch(
      `http://localhost:5000/eventApprove/${event._id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...event, isVerified: true }),
      }
    );
    if (!res.ok) {
      toast({ variant: "destructive", title: "Error", description: "Failed to verify event." });
      return;
    }
    // After verification, fetch latest events to update all lists and counts
    await fetchEvents();
    setIsModalOpen(false);
    setSelectedEvent(null);
    toast({ title: "Event Verified", description: "The event is now live.", className: "bg-green-500 text-white" });

  };

  const handleReject = async (event) => {
    try {
      setIsLoading(true)
      const res = await fetch(
        `http://localhost:5000/eventRemove/${event._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert("Event deleted successfully!");
      } else {
        alert(data.message || "Failed to delete");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
    finally {
      setIsLoading(false)
    }
    // After rejection, fetch latest events to update all lists and counts
    await fetchEvents();
    setIsModalOpen(false);
    setSelectedEvent(null);
    toast({
      variant: "destructive",
      title: "Event Rejected",
      description: "The event has been removed.",
    });
  };

  const openDetailsModal = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const InfoRow = ({ icon, label, value, isLink }) => (
    <div className="flex items-start space-x-2 py-1.5 border-b border-border/50 last:border-b-0">
      {React.createElement(icon, { className: "h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" })}
      <span className="text-sm font-medium text-muted-foreground w-28">{label}:</span>
      {isLink && value ? (
        <a href={value.startsWith('http') ? value : value} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline break-all flex-1">
          {value} <ExternalLink size={12} className="inline ml-1" />
        </a>
      ) : (
        <span className="text-sm text-foreground break-words flex-1">{value || 'N/A'}</span>
      )}
    </div>
  );


  return (
    <div className="space-y-8">
      {/* Add summary section for total job/event posts */}
      <div className="flex gap-6 mb-4">
        <div className="bg-card rounded-lg p-4 shadow text-center">
          <div className="text-lg font-bold text-primary">Total Event Posts</div>
          <div className="text-2xl">{totalEventPosts}</div>
        </div>
        <div className="bg-card rounded-lg p-4 shadow text-center">
          <div className="text-lg font-bold text-primary">Total Job Posts</div>
          <div className="text-2xl">{totalJobPosts}</div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl shadow-lg"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2 tracking-tight">Verify Event Postings</h1>
        <p className="text-md text-muted-foreground">Review and approve or reject new event announcements from alumni.</p>
      </motion.div>

      {pendingEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingEvents.map((event) => (
            <motion.div
              key={event.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5, boxShadow: "0px 8px 20px hsla(var(--primary-foreground), 0.1)" }}
            >
              <Card className="bg-card/80 backdrop-blur-sm h-full flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-primary">{event.name}</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Type: {event.type}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm space-y-1.5 flex-grow">
                  <InfoRow icon={CalendarCheck} label="Date" value={new Date(event.date).toLocaleDateString()} />
                  <InfoRow icon={Clock} label="Time" value={event.time} />
                  <InfoRow icon={MapPin} label="Location" value={event.location} />
                  <InfoRow icon={Users} label="Posted By" value={event.postedBy} />
                  {event.attachedFile && <InfoRow icon={FileText} label="Attachment" value={event.attachedFile} />}
                </CardContent>
                <CardFooter className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" size="sm" onClick={() => openDetailsModal(event)} className="text-xs">Details</Button>
                  <Button variant="destructive" size="sm" onClick={() => handleReject(event)} className="text-xs gap-1">
                    <XCircle size={14} /> Reject
                  </Button>
                  <Button size="sm" onClick={() => handleVerify(event)} className="bg-green-600 hover:bg-green-700 text-xs gap-1">
                    <CheckCircle size={14} /> Verify
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-16 bg-card/50 rounded-xl shadow-md"
        >
          <CalendarCheck size={56} className="mx-auto text-muted-foreground mb-5" />
          <p className="text-2xl font-semibold text-foreground mb-2">All Clear!</p>
          <p className="text-md text-muted-foreground">No event postings are currently pending verification.</p>
        </motion.div>
      )}

      {selectedEvent && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-lg bg-card/90 backdrop-blur-md border-primary/30">
            <DialogHeader>
              <DialogTitle className="text-2xl text-primary flex items-center gap-2">
                <CalendarCheck size={26} /> Event Posting Details
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">Review full event details before taking action.</DialogDescription>
            </DialogHeader>
            <div className="py-5 space-y-2 max-h-[60vh] overflow-y-auto pr-2">
              <InfoRow icon={Users} label="Event Name" value={selectedEvent.name} />
              <InfoRow icon={CalendarCheck} label="Date" value={new Date(selectedEvent.date).toLocaleDateString()} />
              <InfoRow icon={Clock} label="Time" value={selectedEvent.time} />
              <InfoRow icon={MapPin} label="Location" value={selectedEvent.location} />
              <InfoRow icon={Users} label="Event Type" value={selectedEvent.type} />
              <div className="flex items-start space-x-2 py-1.5">
                <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span className="text-sm font-medium text-muted-foreground w-28">Description:</span>
                <p className="text-sm text-foreground break-words flex-1 whitespace-pre-wrap">{selectedEvent.description}</p>
              </div>
              <InfoRow icon={ExternalLink} label="RSVP Link" value={selectedEvent.rsvpLink} isLink={true} />
              {selectedEvent.attachedFile && <InfoRow icon={FileText} label="Attachment" value={selectedEvent.attachedFile} />}
              <InfoRow icon={Users} label="Posted By" value={selectedEvent.postedBy} />
            </div>

          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminVerifyEventsPage;