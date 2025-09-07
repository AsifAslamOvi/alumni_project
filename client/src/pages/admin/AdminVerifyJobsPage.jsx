import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  CheckCircle,
  XCircle,
  Briefcase,
  Building,
  MapPin,
  FileText,
  ExternalLink,
  CalendarDays,
  Users,
  Eye,
  Download,
} from "lucide-react"; // Added Eye, Download
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const AdminVerifyJobsPage = () => {
  const [pendingJobs, setPendingJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allJobs, setallJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filePreviewOpen, setFilePreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:5000/jobs");

        const result = await response.json();
        setallJobs(result);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    setPendingJobs(allJobs.filter((job) => !job.isVerified));
  }, [allJobs]);

  const updateLocalStorageAndState = (updatedJobs) => {
    localStorage.setItem("ruetAlumniJobs", JSON.stringify(updatedJobs));
    setPendingJobs(updatedJobs.filter((job) => !job.isVerified));
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  const handleVerify = async (job) => {
    const res = await fetch(`http://localhost:5000/jobApprove/${job._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...job, isVerified: true }),
    });
    if (!res.ok) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to verify event.",
      });
      return;
    }
    const updatedJobs = allJobs.map((j) =>
      j.id === job.id ? { ...job, isVerified: true } : job
    );
    updateLocalStorageAndState(updatedJobs);
    toast({
      title: "Job Posting Verified",
      description: "The job posting is now live.",
      className: "bg-green-500 text-white",
    });
  };

  const handleReject = async (job) => {
    try {
      setIsLoading(true);
      const res = await fetch(`http://localhost:5000/jobRemove/${job._id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      // console.log(data);

      if (res.ok) {
        alert("job deleted successfully!");
      } else {
        alert(data.message || "Failed to delete");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      setIsLoading(false);
    }
    const updatedJobs = allJobs.filter((j) => j.id !== job.id); // Or mark as rejected
    updateLocalStorageAndState(updatedJobs);
    toast({
      variant: "destructive",
      title: "Job Posting Rejected",
      description: "The job posting has been removed.",
    });
  };

  const openDetailsModal = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

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

  const InfoRow = ({ icon, label, value, isLink, isFile, onFileClick }) => (
    <div className="flex items-start space-x-2 py-1.5 border-b border-border/50 last:border-b-0">
      {React.createElement(icon, {
        className: "h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0",
      })}
      <span className="text-sm font-medium text-muted-foreground w-28">
        {label}:
      </span>
      {isFile && value ? (
        <div className="flex items-center gap-2 flex-1">
          <button
            onClick={() => onFileClick(value)}
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline break-all flex items-center gap-1 transition-colors"
          >
            {getFileIcon(value)}
            <span>{value}</span>
            <Eye size={12} className="ml-1" />
          </button>
        </div>
      ) : isLink && value ? (
        <a
          href={value.startsWith("http") ? value : `mailto:${value}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline break-all flex-1"
        >
          {value} <ExternalLink size={12} className="inline ml-1" />
        </a>
      ) : (
        <span className="text-sm text-foreground break-words flex-1">
          {value || "N/A"}
        </span>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-xl shadow-lg"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2 tracking-tight">
          Verify Job Postings
        </h1>
        <p className="text-md text-muted-foreground">
          Review and approve or reject new job postings from alumni.
        </p>
      </motion.div>

      {pendingJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingJobs.map((job) => (
            <motion.div
              key={job.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              whileHover={{
                y: -5,
                boxShadow: "0px 8px 20px hsla(var(--primary-foreground), 0.1)",
              }}
            >
              <Card className="bg-card/80 backdrop-blur-sm h-full flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-primary">
                    {job.title}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    <Building size={12} className="inline mr-1" /> {job.company}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm space-y-1.5 flex-grow">
                  <InfoRow
                    icon={MapPin}
                    label="Location"
                    value={job.location}
                  />
                  <InfoRow icon={Briefcase} label="Type" value={job.type} />
                  <InfoRow
                    icon={CalendarDays}
                    label="Posted On"
                    value={new Date(job.datePosted).toLocaleDateString()}
                  />
                  <InfoRow
                    icon={Users}
                    label="Posted By"
                    value={job.postedBy}
                  />
                  {job.attachedFile && (
                    <InfoRow
                      icon={FileText}
                      label="Attachment"
                      value={job.attachedFile}
                      isFile={true}
                      onFileClick={openFilePreview}
                    />
                  )}
                </CardContent>
                <CardFooter className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDetailsModal(job)}
                    className="text-xs"
                  >
                    Details
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleReject(job)}
                    className="text-xs gap-1"
                  >
                    <XCircle size={14} /> Reject
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleVerify(job)}
                    className="bg-green-600 hover:bg-green-700 text-xs gap-1"
                  >
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
          <Briefcase size={56} className="mx-auto text-muted-foreground mb-5" />
          <p className="text-2xl font-semibold text-foreground mb-2">
            All Clear!
          </p>
          <p className="text-md text-muted-foreground">
            No job postings are currently pending verification.
          </p>
        </motion.div>
      )}

      {selectedJob && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-lg bg-card/90 backdrop-blur-md border-primary/30">
            <DialogHeader>
              <DialogTitle className="text-2xl text-primary flex items-center gap-2">
                <Briefcase size={26} /> Job Posting Details
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Review full job details before taking action.
              </DialogDescription>
            </DialogHeader>
            <div className="py-5 space-y-2 max-h-[60vh] overflow-y-auto pr-2">
              <InfoRow
                icon={Briefcase}
                label="Job Title"
                value={selectedJob.title}
              />
              <InfoRow
                icon={Building}
                label="Company"
                value={selectedJob.company}
              />
              <InfoRow
                icon={MapPin}
                label="Location"
                value={selectedJob.location}
              />
              <InfoRow
                icon={Briefcase}
                label="Job Type"
                value={selectedJob.type}
              />
              <div className="flex items-start space-x-2 py-1.5">
                <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span className="text-sm font-medium text-muted-foreground w-28">
                  Description:
                </span>
                <p className="text-sm text-foreground break-words flex-1 whitespace-pre-wrap">
                  {selectedJob.description}
                </p>
              </div>
              <InfoRow
                icon={ExternalLink}
                label="Apply Link"
                value={selectedJob.applyLink}
                isLink={true}
              />
              {selectedJob.attachedFile && (
                <InfoRow
                  icon={FileText}
                  label="Attachment"
                  value={selectedJob.attachedFile}
                  isFile={true}
                  onFileClick={openFilePreview}
                />
              )}
              <InfoRow
                icon={CalendarDays}
                label="Posted On"
                value={new Date(selectedJob.datePosted).toLocaleDateString()}
              />
              <InfoRow
                icon={Users}
                label="Posted By"
                value={selectedJob.postedBy}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

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
    </div>
  );
};

export default AdminVerifyJobsPage;
