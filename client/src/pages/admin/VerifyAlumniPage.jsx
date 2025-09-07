import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"; // Removed DialogTrigger, DialogClose as we control open state
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import {
    BadgeInfo as BuildingIcon,
    CalendarDays,
    CheckCircle,
    Hash,
    MapPin as MapPinIcon,
    Phone,
    UserCheck,
    Users as UsersIcon,
    UserX,
    XCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";

const VerifyAlumniPage = () => {
    const [pendingAlumni, setPendingAlumni] = useState([]);
    const [selectedAlumni, setSelectedAlumni] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { toast } = useToast();
    const [allUsers, setAllUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch("http://localhost:5000/users");

                const result = await response.json();
                setAllUsers(result);
            } catch (err) {
                console.error("Failed to fetch users:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        
        setPendingAlumni(
            allUsers.filter(
                (user) => !user.isVerified && user.role === "alumni"
            )
        );
    }, [allUsers]);
  

    const updateLocalStorageAndState = (updatedUsers) => {
        
        setPendingAlumni(
            updatedUsers.filter(
                (user) => !user.isVerified && user.role === "alumni"
            )
        );
        setIsModalOpen(false);
        setSelectedAlumni(null);
    };

const handleVerify = async (alumni) => {
  try {
        setIsLoading(true);
        const response = await fetch(
            `http://localhost:5000/userVerify/${alumni._id}`,
            {
                method: "PATCH", 
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    // const data = await response.json();
    //   if (!data.modifiedCount) {
    //     throw new Error("Failed to verify alumni. Please try again.");
    //     return;
    //   }

        

        // Update frontend state
        const updatedUsers = allUsers.map((user) =>
            user.id === alumni.id ? { ...user, isVerified: true } : user
        );
        updateLocalStorageAndState(updatedUsers);

        toast({
            title: "Alumni Verified",
            description: "The alumni account has been successfully verified.",
            className: "bg-green-500 text-white",
        });
    } catch (err) {
        console.error(err);
        toast({
            title: "Verification Failed",
            description: err.message,
            className: "bg-red-500 text-white",
        });
  }
  finally {
      setIsLoading(false);
  }
};


  const handleReject = async (alumni) => {
        
                    try {
                        setIsLoading(true);
                        const res = await fetch(
                            `http://localhost:5000/userRemove/${alumni._id}`,
                            {
                                method: "DELETE",
                            }
                        );

                        const data = await res.json();
                        // console.log(data);

                        if (res.ok) {
                            alert("user deleted successfully!");
                        } else {
                            alert(data.message || "Failed to delete");
                        }
                    } catch (error) {
                        console.error("Error deleting event:", error);
                    } finally {
                        setIsLoading(false);
                    }
      const updatedUsers = allUsers.filter((user) => user.id !== alumni.id);
      updateLocalStorageAndState(updatedUsers);
        
        toast({
            variant: "destructive",
            title: "Alumni Rejected",
            description:
                "The alumni registration has been rejected and removed.",
        });
    };

    const getInitials = (name) => {
        if (!name) return "U";
        const names = name.split(" ");
        if (names.length === 1) return names[0].charAt(0).toUpperCase();
        return (
            names[0].charAt(0).toUpperCase() +
            names[names.length - 1].charAt(0).toUpperCase()
        );
    };

    const openDetailsModal = (alumni) => {
        setSelectedAlumni(alumni);
        setIsModalOpen(true);
    };

    const InfoRow = ({ icon, label, value }) => (
        <div className="flex items-start space-x-2 py-1.5 border-b border-border/50 last:border-b-0">
            {React.createElement(icon, {
                className: "h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0",
            })}
            <span className="text-sm font-medium text-muted-foreground w-28">
                {label}:
            </span>
            <span className="text-sm text-foreground break-words flex-1">
                {value || "N/A"}
            </span>
        </div>
    );
  
  if(isLoading) return <h1>loading...</h1>

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl shadow-lg"
            >
                <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2 tracking-tight">
                    Verify Alumni Registrations
                </h1>
                <p className="text-md text-muted-foreground">
                    Review and approve or reject new alumni applications.
                </p>
            </motion.div>

            {pendingAlumni.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingAlumni.map((alumni) => (
                        <motion.div
                            key={alumni.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            whileHover={{
                                y: -5,
                                boxShadow:
                                    "0px 8px 20px hsla(var(--primary-foreground), 0.1)",
                            }}
                        >
                            <Card className="bg-card/80 backdrop-blur-sm h-full flex flex-col">
                                <CardHeader className="flex flex-row items-center space-x-4">
                                    <Avatar className="h-14 w-14 border-2 border-primary/50">
                                        <AvatarImage
                                            src={
                                                alumni.profilePhoto ||
                                                `https://avatar.vercel.sh/${alumni.email}.png`
                                            }
                                            alt={alumni.name}
                                        />
                                        <AvatarFallback className="text-xl bg-primary/20 text-primary">
                                            {getInitials(alumni.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <CardTitle className="text-lg text-primary">
                                            {alumni.name}
                                        </CardTitle>
                                        <CardDescription className="text-xs text-muted-foreground">
                                            {alumni.email}
                                        </CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="text-sm space-y-1.5 flex-grow">
                                    <InfoRow
                                        icon={Hash}
                                        label="Roll"
                                        value={alumni.rollNo}
                                    />
                                    <InfoRow
                                        icon={UsersIcon}
                                        label="Series"
                                        value={alumni.series}
                                    />
                                    <InfoRow
                                        icon={BuildingIcon}
                                        label="Dept"
                                        value={alumni.department}
                                    />
                                    <InfoRow
                                        icon={CalendarDays}
                                        label="Pass Year"
                                        value={alumni.passingYear}
                                    />
                                    <InfoRow
                                        icon={Phone}
                                        label="Contact"
                                        value={alumni.contactNo}
                                    />
                                </CardContent>
                                <CardFooter className="flex justify-end space-x-2 pt-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => openDetailsModal(alumni)}
                                        className="text-xs"
                                    >
                                        Details
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleReject(alumni)}
                                        className="text-xs gap-1"
                                    >
                                        <XCircle size={14} /> Reject
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={() => handleVerify(alumni)}
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
                    <UserCheck
                        size={56}
                        className="mx-auto text-muted-foreground mb-5"
                    />
                    <p className="text-2xl font-semibold text-foreground mb-2">
                        All Clear!
                    </p>
                    <p className="text-md text-muted-foreground">
                        There are no pending alumni verifications at the moment.
                    </p>
                </motion.div>
            )}

            {selectedAlumni && (
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="sm:max-w-lg bg-card/90 backdrop-blur-md border-primary/30">
                        <DialogHeader>
                            <DialogTitle className="text-2xl text-primary flex items-center gap-2">
                                <UserCheck size={26} /> Alumni Verification
                                Details
                            </DialogTitle>
                            <DialogDescription className="text-muted-foreground">
                                Review the full details before taking action.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-5 space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                            <div className="flex items-center space-x-4 mb-4 p-3 bg-secondary/50 rounded-lg">
                                <Avatar className="h-20 w-20 border-2 border-primary">
                                    <AvatarImage
                                        src={
                                            selectedAlumni.profilePhoto ||
                                            `https://avatar.vercel.sh/${selectedAlumni.email}.png`
                                        }
                                        alt={selectedAlumni.name}
                                    />
                                    <AvatarFallback className="text-3xl bg-primary/20 text-primary">
                                        {getInitials(selectedAlumni.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-xl font-bold text-foreground">
                                        {selectedAlumni.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedAlumni.email}
                                    </p>
                                </div>
                            </div>
                            <InfoRow
                                icon={Hash}
                                label="Roll No"
                                value={selectedAlumni.rollNo}
                            />
                            <InfoRow
                                icon={UsersIcon}
                                label="Series"
                                value={selectedAlumni.series}
                            />
                            <InfoRow
                                icon={UsersIcon}
                                label="Section"
                                value={selectedAlumni.section}
                            />
                            <InfoRow
                                icon={BuildingIcon}
                                label="Department"
                                value={selectedAlumni.department}
                            />
                            <InfoRow
                                icon={CalendarDays}
                                label="Passing Year"
                                value={selectedAlumni.passingYear}
                            />
                            <InfoRow
                                icon={Phone}
                                label="Contact No"
                                value={selectedAlumni.contactNo}
                            />
                            <InfoRow
                                icon={MapPinIcon}
                                label="Address"
                                value={selectedAlumni.address}
                            />
                            {/* Admin cannot see password, so it's not displayed */}
                        </div>
                        <DialogFooter className="sm:justify-end space-x-3 pt-4">
                            <Button
                                variant="destructive"
                                onClick={() => handleReject(selectedAlumni.id)}
                                className="gap-1.5"
                            >
                                <UserX size={16} /> Reject Alumni
                            </Button>
                            <Button
                                onClick={() => handleVerify(selectedAlumni.id)}
                                className="bg-green-600 hover:bg-green-700 gap-1.5"
                            >
                                <UserCheck size={16} /> Verify Alumni
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default VerifyAlumniPage;
