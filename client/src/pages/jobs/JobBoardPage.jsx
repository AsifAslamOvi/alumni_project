import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import {
  Briefcase,
  MapPin,
  Building,
  Search,
  PlusCircle,
  ExternalLink,
  FileText,
  X,
  MessageSquare,
  Send,
  Eye,
  Download,
} from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const JobCard = ({ job, onClick, onFilePreview }) => (
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
        <CardTitle className="text-xl text-primary">{job.title}</CardTitle>
        <CardDescription className="text-sm">
          <Building size={14} className="inline mr-1 text-accent" />{" "}
          {job.company}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 flex-grow">
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin size={14} className="mr-2 text-accent" /> {job.location}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Briefcase size={14} className="mr-2 text-accent" /> {job.type}
        </div>
        <p className="text-sm text-foreground pt-2">
          {job.description.substring(0, 100)}
          {job.description.length > 100 ? "..." : ""}
        </p>
        {job.attachedFile && (
          <div className="flex items-center text-sm text-muted-foreground pt-1">
            <FileText size={14} className="mr-2 text-accent" />
            <span className="mr-1">Attached:</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFilePreview(job.attachedFile);
              }}
              className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 transition-colors"
            >
              {job.attachedFile}
              <Eye size={12} />
            </button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-3 border-t">
        <div className="text-xs text-muted-foreground">
          Posted: {new Date(job.datePosted).toLocaleDateString()} <br />
          By: {job.postedBy}
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
            DETAILS <ExternalLink size={14} className="ml-2" />
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
    <div className={`flex gap-3 ${isCurrentUser ? "justify-end" : ""}`}>
      {!isCurrentUser && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.userAvatar} />
          <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
        </Avatar>
      )}
      <div className={`flex flex-col ${isCurrentUser ? "items-end" : ""}`}>
        <div
          className={`rounded-lg px-4 py-2 ${
            isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"
          }`}
        >
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

const JobDetailsModal = ({ job, isOpen, onClose }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(job?.comments || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filePreviewOpen, setFilePreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  useEffect(() => {
    if (job) {
      setComments(job.comments || []);
    }
  }, [job]);

  const openFilePreview = (fileName) => {
    // In a real application, you would have the file URL or path
    // For now, we'll simulate the file preview
    const fileExtension = fileName.split(".").pop().toLowerCase();
    setPreviewFile({
      name: fileName,
      extension: fileExtension,
      // In a real app, this would be the actual file URL from your file storage
      url: `/uploads/${fileName}`, // This would be your actual file URL
    });
    setFilePreviewOpen(true);
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    return <FileText className="h-4 w-4 text-blue-600" />;
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to comment.",
      });
      return;
    }
    if (!commentText.trim()) return;

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const newComment = {
      id: Date.now().toString(),
      text: commentText,
      userName: user.name || "Anonymous",
      userEmail: user.email,
      userAvatar: user.avatar,
      timestamp: new Date().toISOString(),
    };

    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:5000/jobComment/${job._id}`,
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
    } finally {
      setIsLoading(false);
    }

    // const updatedComments = [...comments, newComment];
    // setComments(updatedComments);

    // const storedJobs = JSON.parse(localStorage.getItem('ruetAlumniJobs')) || [];
    // const updatedJobs = storedJobs.map(j =>
    //   j.id === job.id ? { ...j, comments: updatedComments } : j
    // );
    // localStorage.setItem('ruetAlumniJobs', JSON.stringify(updatedJobs));

    setCommentText("");
    setIsSubmitting(false);
  };

  if (!job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl flex justify-between items-center">
            <span>{job.title}</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X size={18} />
            </Button>
          </DialogTitle>
          <DialogDescription className="flex items-center">
            <Building size={14} className="mr-1 text-accent" /> {job.company}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <MapPin size={16} className="mr-2 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p>{job.location}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Briefcase size={16} className="mr-2 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Job Type</p>
                  <p>{job.type}</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Description</p>
              <p className="whitespace-pre-line">{job.description}</p>
            </div>

            {job.attachedFile && (
              <div className="flex items-center">
                <FileText size={16} className="mr-2 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Attached File</p>
                  <button
                    onClick={() => openFilePreview(job.attachedFile)}
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline break-all flex items-center gap-1 transition-colors"
                  >
                    {getFileIcon(job.attachedFile)}
                    <span>{job.attachedFile}</span>
                    <Eye size={12} className="ml-1" />
                  </button>
                </div>
              </div>
            )}

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Posted By: {job.postedBy}
              </p>
              <p className="text-sm text-muted-foreground">
                Posted On: {new Date(job.datePosted).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium flex items-center mb-4">
              <MessageSquare size={18} className="mr-2 text-accent" />
              Comments ({comments.length})
            </h3>

            <div className="space-y-4 mb-4">
              {comments.length > 0 ? (
                comments.map((comment) => (
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

        {job.applyLink && (
          <DialogFooter>
            <Button asChild className="w-full">
              <a href={job.applyLink} target="_blank" rel="noopener noreferrer">
                Apply Now <ExternalLink size={14} className="ml-2" />
              </a>
            </Button>
          </DialogFooter>
        )}
      </DialogContent>

      {/* File Preview Modal */}
      {previewFile && (
        <Dialog open={filePreviewOpen} onOpenChange={setFilePreviewOpen}>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] bg-card/95 backdrop-blur-md">
            <DialogHeader>
              <DialogTitle className="text-xl text-primary flex items-center gap-2">
                <FileText size={24} />
                File Preview: {previewFile.name}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Preview of the attached file
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-hidden">
              {previewFile.extension === "pdf" ? (
                <div className="w-full h-[70vh] border rounded-lg bg-muted/20 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <FileText size={48} className="mx-auto text-red-600" />
                    <div>
                      <p className="text-lg font-medium">PDF Document</p>
                      <p className="text-sm text-muted-foreground">
                        {previewFile.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        PDF preview is not available in this demo. In a real
                        application, you would embed a PDF viewer here.
                      </p>
                    </div>
                    <Button asChild variant="outline">
                      <a
                        href={previewFile.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download size={16} className="mr-2" />
                        Open in New Tab
                      </a>
                    </Button>
                  </div>
                </div>
              ) : previewFile.extension === "doc" ||
                previewFile.extension === "docx" ? (
                <div className="w-full h-[70vh] border rounded-lg bg-muted/20 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <FileText size={48} className="mx-auto text-blue-600" />
                    <div>
                      <p className="text-lg font-medium">Word Document</p>
                      <p className="text-sm text-muted-foreground">
                        {previewFile.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Word document preview is not available in this demo. In
                        a real application, you would use a document viewer.
                      </p>
                    </div>
                    <Button asChild variant="outline">
                      <a
                        href={previewFile.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download size={16} className="mr-2" />
                        Download Document
                      </a>
                    </Button>
                  </div>
                </div>
              ) : ["jpg", "jpeg", "png", "gif"].includes(
                  previewFile.extension
                ) ? (
                <div className="w-full h-[70vh] border rounded-lg bg-muted/20 flex items-center justify-center p-4">
                  <div className="text-center space-y-4">
                    <div className="max-w-full max-h-full bg-white rounded-lg p-4 shadow-lg">
                      <img
                        src={previewFile.url}
                        alt={previewFile.name}
                        className="max-w-full max-h-[60vh] object-contain rounded"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextElementSibling.style.display = "block";
                        }}
                      />
                      <div
                        style={{ display: "none" }}
                        className="text-center space-y-2"
                      >
                        <FileText
                          size={48}
                          className="mx-auto text-green-600"
                        />
                        <p className="text-lg font-medium">Image File</p>
                        <p className="text-sm text-muted-foreground">
                          {previewFile.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Image could not be loaded. This is expected in the
                          demo environment.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-[70vh] border rounded-lg bg-muted/20 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <FileText size={48} className="mx-auto text-gray-600" />
                    <div>
                      <p className="text-lg font-medium">File Preview</p>
                      <p className="text-sm text-muted-foreground">
                        {previewFile.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Preview not available for this file type.
                      </p>
                    </div>
                    <Button asChild variant="outline">
                      <a
                        href={previewFile.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download size={16} className="mr-2" />
                        Download File
                      </a>
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="flex justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText size={14} />
                <span>File: {previewFile.name}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setFilePreviewOpen(false)}
                >
                  Close
                </Button>
                <Button asChild>
                  <a
                    href={previewFile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink size={16} className="mr-2" />
                    Open in New Tab
                  </a>
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
};

const JobForm = ({ onJobSubmitted }) => {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "Full-time",
    description: "",
    applyLink: "",
    attachedFile: null,
    comments: [],
  });
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState("");
  const formRef = useRef(null);
  const formContentRef = useRef(null);
  const [IsLoading, setIsLoading] = useState(false);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:5000/jobs");

        const result = await response.json();
        setJobs(result);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("File selected:", file); // Debug log

    if (file) {
      // Check file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        toast({
          variant: "destructive",
          title: "File Too Large",
          description: "Please select a file smaller than 5MB.",
        });
        return;
      }

      // Check file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/jpg",
        "image/png",
      ];

      if (!allowedTypes.includes(file.type)) {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please select a PDF, DOCX, or image file.",
        });
        return;
      }

      setFormData({ ...formData, attachedFile: file });
      setFileName(file.name);
      console.log("File name set to:", file.name); // Debug log
    } else {
      setFormData({ ...formData, attachedFile: null });
      setFileName("");
      console.log("File cleared"); // Debug log
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to post a job.",
      });
      return;
    }
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const newJob = {
      ...formData,
      id: Date.now().toString(),
      postedBy: user.name || "Alumni",
      datePosted: new Date().toISOString(),
      isVerified: false,
      attachedFile: fileName,
      comments: [],
    };

    try {
      setIsLoading(true);
      const res = await fetch("http://localhost:5000/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newJob),
      });

      if (!res.ok) {
        throw new Error("Failed to add event");
      }

      // const data = await res.json();
      // console.log("Event added:", data);
    } catch (error) {
      console.error("Error submitting event:", error);
    } finally {
      setIsLoading(false);
    }

    onJobSubmitted(newJob);
    toast({
      title: "Job Submitted!",
      description:
        "Your job listing has been submitted for admin verification.",
    });
    setFormData({
      title: "",
      company: "",
      location: "",
      type: "Full-time",
      description: "",
      applyLink: "",
      attachedFile: null,
      comments: [],
    });
    setFileName("");
    setIsSubmitting(false);
  };

  if (IsLoading) return <h1>Loading...</h1>;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex flex-col h-full"
    >
      <div
        ref={formContentRef}
        className="flex-1 overflow-y-auto pr-2 space-y-4 pb-4"
        style={{ maxHeight: "calc(80vh - 150px)" }}
        onWheel={(e) => {
          e.stopPropagation();
        }}
      >
        <div>
          <Label htmlFor="title">Job Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="type">Job Type</Label>
          <Input
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            placeholder="e.g., Full-time, Part-time, Contract"
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="applyLink">Application Link/Email</Label>
          <Input
            id="applyLink"
            name="applyLink"
            value={formData.applyLink}
            onChange={handleChange}
            placeholder="https://careers.example.com/apply or jobs@example.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="attachedFile">Attach File (Optional)</Label>
          {!fileName ? (
            <div className="flex items-center gap-2">
              <label
                htmlFor="attachedFile"
                className="flex flex-col items-center justify-center w-full px-4 py-6 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors"
              >
                <FileText size={24} className="mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-primary">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  PDF, DOCX, or image files (max 5MB)
                </p>
                <Input
                  id="attachedFile"
                  name="attachedFile"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </label>
            </div>
          ) : (
            <div className="space-y-2">
              {/* File Preview */}
              <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50 border-green-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-md">
                    <FileText size={20} className="text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-800">
                      {fileName}
                    </p>
                    <p className="text-xs text-green-600">
                      {formData.attachedFile?.size
                        ? `${(formData.attachedFile.size / 1024 / 1024).toFixed(
                            2
                          )} MB`
                        : "File selected"}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFormData({ ...formData, attachedFile: null });
                    setFileName("");
                    // Reset the file input
                    const fileInput = document.getElementById("attachedFile");
                    if (fileInput) fileInput.value = "";
                  }}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X size={16} className="mr-1" />
                  Remove
                </Button>
              </div>

              {/* Option to change file */}
              <div className="flex items-center gap-2">
                <label
                  htmlFor="attachedFile"
                  className="flex items-center gap-2 px-3 py-2 text-sm border border-dashed rounded-md cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <FileText size={16} className="text-muted-foreground" />
                  <span className="text-muted-foreground">Change file</span>
                  <Input
                    id="attachedFile"
                    name="attachedFile"
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      <DialogFooter className="border-t pt-4 bg-background sticky bottom-0">
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Submitting for Review..." : "Submit Job for Review"}
        </Button>
      </DialogFooter>
    </form>
  );
};

const JobBoardPage = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [filePreviewOpen, setFilePreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const { user } = useAuth();
  const dialogContentRef = useRef(null);
  const [Alljobs, setAllJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:5000/jobs");

        const result = await response.json();
        setAllJobs(result);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setJobs(Alljobs.filter((job) => job.isVerified));
  }, [Alljobs]);

  const handleJobSubmitted = (newJob) => {
    setIsFormOpen(false);
    // setJobs(prev => [{ ...newJob, comments: [] }, ...prev]);
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setIsDetailsOpen(true);
  };

  const handleFilePreview = (fileName) => {
    // In a real application, you would have the file URL or path
    const fileExtension = fileName.split(".").pop().toLowerCase();
    setPreviewFile({
      name: fileName,
      extension: fileExtension,
      url: `/uploads/${fileName}`, // This would be your actual file URL
    });
    setFilePreviewOpen(true);
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-4xl font-bold text-primary mb-3">Job Board</h1>
          <p className="text-muted-foreground mb-4 md:mb-0">
            Find your next career opportunity or share one with the community.
          </p>
        </div>
        {user && user.isVerified && (
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <PlusCircle size={18} className="mr-2" /> Post a Job
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
                <DialogTitle className="text-2xl">
                  Post a New Job Opportunity
                </DialogTitle>
                <DialogDescription>
                  Share a job opening with the RUET alumni network. Your post
                  will be reviewed by an admin before appearing publicly.
                </DialogDescription>
              </DialogHeader>
              <JobForm onJobSubmitted={handleJobSubmitted} />
            </DialogContent>
          </Dialog>
        )}
      </motion.div>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search jobs by title, company, location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full md:w-1/2"
        />
      </div>

      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onClick={() => handleJobClick(job)}
              onFilePreview={handleFilePreview}
            />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-10"
        >
          <Briefcase size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-xl text-muted-foreground">
            No job listings found matching your criteria.{" "}
            {jobs.length === 0 &&
              "Check back later or post one if you're a verified alumni!"}
          </p>
        </motion.div>
      )}

      <JobDetailsModal
        job={selectedJob}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />

      {/* Main File Preview Modal for Job Cards */}
      {previewFile && (
        <Dialog open={filePreviewOpen} onOpenChange={setFilePreviewOpen}>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] bg-card/95 backdrop-blur-md">
            <DialogHeader>
              <DialogTitle className="text-xl text-primary flex items-center gap-2">
                <FileText size={24} />
                File Preview: {previewFile.name}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Preview of the attached file
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-hidden">
              {previewFile.extension === "pdf" ? (
                <div className="w-full h-[70vh] border rounded-lg bg-muted/20 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <FileText size={48} className="mx-auto text-red-600" />
                    <div>
                      <p className="text-lg font-medium">PDF Document</p>
                      <p className="text-sm text-muted-foreground">
                        {previewFile.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        PDF preview is not available in this demo. In a real
                        application, you would embed a PDF viewer here.
                      </p>
                    </div>
                    <Button asChild variant="outline">
                      <a
                        href={previewFile.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download size={16} className="mr-2" />
                        Open in New Tab
                      </a>
                    </Button>
                  </div>
                </div>
              ) : previewFile.extension === "doc" ||
                previewFile.extension === "docx" ? (
                <div className="w-full h-[70vh] border rounded-lg bg-muted/20 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <FileText size={48} className="mx-auto text-blue-600" />
                    <div>
                      <p className="text-lg font-medium">Word Document</p>
                      <p className="text-sm text-muted-foreground">
                        {previewFile.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Word document preview is not available in this demo. In
                        a real application, you would use a document viewer.
                      </p>
                    </div>
                    <Button asChild variant="outline">
                      <a
                        href={previewFile.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download size={16} className="mr-2" />
                        Download Document
                      </a>
                    </Button>
                  </div>
                </div>
              ) : ["jpg", "jpeg", "png", "gif"].includes(
                  previewFile.extension
                ) ? (
                <div className="w-full h-[70vh] border rounded-lg bg-muted/20 flex items-center justify-center p-4">
                  <div className="text-center space-y-4">
                    <div className="max-w-full max-h-full bg-white rounded-lg p-4 shadow-lg">
                      <img
                        src={previewFile.url}
                        alt={previewFile.name}
                        className="max-w-full max-h-[60vh] object-contain rounded"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextElementSibling.style.display = "block";
                        }}
                      />
                      <div
                        style={{ display: "none" }}
                        className="text-center space-y-2"
                      >
                        <FileText
                          size={48}
                          className="mx-auto text-green-600"
                        />
                        <p className="text-lg font-medium">Image File</p>
                        <p className="text-sm text-muted-foreground">
                          {previewFile.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Image could not be loaded. This is expected in the
                          demo environment.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-[70vh] border rounded-lg bg-muted/20 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <FileText size={48} className="mx-auto text-gray-600" />
                    <div>
                      <p className="text-lg font-medium">File Preview</p>
                      <p className="text-sm text-muted-foreground">
                        {previewFile.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Preview not available for this file type.
                      </p>
                    </div>
                    <Button asChild variant="outline">
                      <a
                        href={previewFile.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download size={16} className="mr-2" />
                        Download File
                      </a>
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="flex justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText size={14} />
                <span>File: {previewFile.name}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setFilePreviewOpen(false)}
                >
                  Close
                </Button>
                <Button asChild>
                  <a
                    href={previewFile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink size={16} className="mr-2" />
                    Open in New Tab
                  </a>
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default JobBoardPage;
