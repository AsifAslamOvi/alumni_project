import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Briefcase,
  Building2,
  Camera,
  Edit3,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Save,
  User,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const defaultCoverPhoto =
  "https://images.unsplash.com/photo-1522071820081-009f0129c7da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80";

const ProfilePage = ({ self = false }) => {
  const { id } = useParams();
  const { user, setUser, updateUser, loading: authLoading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNo: "",
    address: "",
    currentJob: "",
    currentCompany: "",
    location: "",
    skills: "",
    bio: "",
    linkedin: "",
    github: "",
    profilePhoto: "",
    coverPhoto: defaultCoverPhoto,
  });
  const [isLoading, setIsLoading] = useState(true);

  const profilePictureInputRef = useRef(null);
  const coverPhotoInputRef = useRef(null);

  const profileIdToFetch = self && user ? user.id : id;
  useEffect(() => {
    setIsLoading(true);
    if (authLoading) return;

    if (!profileIdToFetch) {
      if (!self) navigate("/alumni");
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        // First try to fetch the specific user
        const userResponse = await fetch(
          `http://localhost:5000/user/${profileIdToFetch}`
        );

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setProfileData(userData);

          // Initialize form data properly
          const initialFormData = {
            name: userData.name || "",
            email: userData.email || "",
            contactNo: userData.contactNo || "",
            address: userData.address || "",
            currentJob: userData.currentJob || "",
            currentCompany: userData.currentCompany || "",
            location: userData.location || "",
            skills: userData.skills
              ? Array.isArray(userData.skills)
                ? userData.skills.join(", ")
                : userData.skills
              : "",
            bio: userData.bio || "",
            linkedin: userData.linkedin || "",
            github: userData.github || "",
            profilePhoto: userData.profilePhoto || "",
            coverPhoto: userData.coverPhoto || defaultCoverPhoto,
          };
          setFormData(initialFormData);
        } else {
          // If specific user fetch fails, fall back to getting all users
          const response = await fetch("http://localhost:5000/users");
          const result = await response.json();
          setUsers(result);

          let data = result.find((u) => u.id === profileIdToFetch);

          if (self && user && !data) {
            data = { ...user };
          }

          if (data) {
            setProfileData(data);
            // Initialize form data properly
            const initialFormData = {
              name: data.name || "",
              email: data.email || "",
              contactNo: data.contactNo || "",
              address: data.address || "",
              currentJob: data.currentJob || "",
              currentCompany: data.currentCompany || "",
              location: data.location || "",
              skills: data.skills
                ? Array.isArray(data.skills)
                  ? data.skills.join(", ")
                  : data.skills
                : "",
              bio: data.bio || "",
              linkedin: data.linkedin || "",
              github: data.github || "",
              profilePhoto: data.profilePhoto || "",
              coverPhoto: data.coverPhoto || defaultCoverPhoto,
            };
            setFormData(initialFormData);
          } else {
            toast({
              variant: "destructive",
              title: "Profile not found",
              description: "The requested alumni profile could not be located.",
            });
            navigate("/alumni");
          }
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile data.",
        });
        navigate("/alumni");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [profileIdToFetch, authLoading]);

  const handleEditToggle = () => {
    if (!isEditing && profileData) {
      // Re-initialize form data when starting edit mode
      const refreshedFormData = {
        name: profileData.name || "",
        email: profileData.email || "",
        contactNo: profileData.contactNo || "",
        address: profileData.address || "",
        currentJob: profileData.currentJob || "",
        currentCompany: profileData.currentCompany || "",
        location: profileData.location || "",
        skills: profileData.skills
          ? Array.isArray(profileData.skills)
            ? profileData.skills.join(", ")
            : profileData.skills
          : "",
        bio: profileData.bio || "",
        linkedin: profileData.linkedin || "",
        github: profileData.github || "",
        profilePhoto: profileData.profilePhoto || "",
        coverPhoto: profileData.coverPhoto || defaultCoverPhoto,
      };
      setFormData(refreshedFormData);
    }
    setIsEditing(!isEditing);
  };

  // Simple, direct handleChange function
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev };
      newData[name] = value;
      return newData;
    });
  };

  const handleImageChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => {
          const newData = { ...prev };
          newData[fieldName] = reader.result;
          return newData;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      const updatedProfile = {
        ...profileData,
        ...formData,
        skills: formData.skills
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),
      };

      // Remove fields that shouldn't be updated
      const { _id, id, password, createdAt, ...updateData } = updatedProfile;

      const res = await fetch(`http://localhost:5000/user/${profileData.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (res.ok) {
        // Fetch the updated user data
        const userResponse = await fetch(
          `http://localhost:5000/user/${profileIdToFetch}`
        );
        if (userResponse.ok) {
          const updatedUserData = await userResponse.json();
          setProfileData(updatedUserData);

          // If this is the current user's profile, update auth context
          if (self && user && user.id === profileIdToFetch) {
            login(updatedUserData);
          }

          setIsEditing(false);
          toast({
            title: "Profile Updated",
            description: "Your changes have been successfully saved.",
            className: "bg-green-500 text-white",
          });
        } else {
          throw new Error("Failed to fetch updated profile");
        }
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description:
          error.message || "Failed to update profile. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
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

  if (isLoading || authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <User className="h-16 w-16 animate-pulse text-primary" />{" "}
        <span className="ml-3 text-xl">Loading profile...</span>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="text-center py-16 text-xl text-muted-foreground">
        Profile not found.
      </div>
    );
  }

  const canEdit =
    (self && user && user.id === profileIdToFetch) ||
    (user && user.role === "admin" && !self);
  const isOwnProfile = self && user && user.id === profileIdToFetch;

  const InfoItem = ({ icon, label, value, link, isEmail = false }) => (
    <div className="flex items-start space-x-3 py-2">
      {React.createElement(icon, {
        className: "h-5 w-5 text-accent mt-1 flex-shrink-0",
      })}
      <div className="flex-grow">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {label}
        </p>
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline break-all"
          >
            {value}
          </a>
        ) : (
          <p
            className={cn(
              "text-sm font-medium break-words",
              isEmail ? "lowercase" : ""
            )}
          >
            {value || "N/A"}
          </p>
        )}
      </div>
    </div>
  );

  const handleSendMessage = () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Login Required",
        description: "Please login to send messages.",
      });
      navigate("/login", { state: { from: location } });
      return;
    }
    navigate(`/messages/new/${profileData.id}`, {
      state: { recipientName: profileData.name },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="max-w-5xl mx-auto shadow-2xl overflow-hidden border-primary/10">
        <div className="relative">
          {/* Cover Photo */}
          <div className="h-48 md:h-64 bg-secondary/50 relative group">
            <img
              src={
                isEditing
                  ? formData.coverPhoto
                  : profileData.coverPhoto || defaultCoverPhoto
              }
              alt={`${profileData.name}'s cover photo`}
              className="w-full h-full object-cover"
            />
            {canEdit && isEditing && (
              <Button
                variant="outline"
                size="sm"
                className="absolute bottom-3 right-3 bg-black/50 text-white hover:bg-black/70 border-white/50"
                onClick={() => coverPhotoInputRef.current?.click()}
              >
                <Camera size={16} className="mr-2" /> Change Cover
              </Button>
            )}
            <input
              type="file"
              accept="image/*"
              ref={coverPhotoInputRef}
              onChange={(e) => handleImageChange(e, "coverPhoto")}
              className="hidden"
            />
          </div>

          {/* Profile Picture */}
          <div className="absolute top-[calc(theme(spacing.48)-theme(spacing.16))] md:top-[calc(theme(spacing.64)-theme(spacing.20))] left-1/2 md:left-8 transform -translate-x-1/2 md:-translate-x-0 -translate-y-1/2 md:-translate-y-1/2 z-10">
            <div className="relative group">
              <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background shadow-xl">
                <AvatarImage
                  src={
                    isEditing
                      ? formData.profilePhoto
                      : profileData.profilePhoto ||
                        `https://avatar.vercel.sh/${profileData.email}.png?size=160`
                  }
                  alt={profileData.name}
                />
                <AvatarFallback className="text-5xl md:text-6xl bg-primary/20 text-primary font-semibold">
                  {getInitials(profileData.name)}
                </AvatarFallback>
              </Avatar>
              {canEdit && isEditing && (
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-black/60 text-white hover:bg-black/80 border-white/50"
                  onClick={() => profilePictureInputRef.current?.click()}
                >
                  <Camera size={14} />
                </Button>
              )}
              <input
                type="file"
                accept="image/*"
                ref={profilePictureInputRef}
                onChange={(e) => handleImageChange(e, "profilePhoto")}
                className="hidden"
              />
            </div>
          </div>

          {/* Edit/Save Button */}
          {canEdit && (
            <div className="absolute top-4 right-4 z-20">
              <Button
                onClick={isEditing ? handleSave : handleEditToggle}
                variant="secondary"
                size="sm"
                className="shadow-md gap-1.5"
                disabled={isLoading}
              >
                {isEditing ? (
                  <>
                    <Save size={16} />{" "}
                    {isLoading ? "Saving..." : "Save Changes"}
                  </>
                ) : (
                  <>
                    <Edit3 size={16} /> Edit Profile
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Content Area - Name, Details, Bio etc. */}
        <CardContent className="pt-20 md:pt-24 pb-6 px-6 md:px-8">
          {!isEditing && (
            <div className="text-center md:text-left md:ml-[calc(theme(spacing.40)+theme(spacing.4))] mt-[-40px] md:mt-[-60px] mb-6">
              <CardTitle className="text-2xl md:text-3xl font-bold text-foreground">
                {profileData.name}
              </CardTitle>
              <CardDescription className="text-md text-muted-foreground">
                {profileData.department} - Series {profileData.series} (Passed{" "}
                {profileData.passingYear})
              </CardDescription>
              <CardDescription className="text-sm text-muted-foreground/80">
                Roll: {profileData.rollNo}
              </CardDescription>
            </div>
          )}

          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 mt-4">
              {/* Name Field */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-muted-foreground flex items-center"
                >
                  <User className="h-4 w-4 mr-2 text-accent/80" /> Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full text-sm focus:shadow-outline-primary"
                  placeholder="Your full name"
                  autoComplete="off"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-muted-foreground flex items-center"
                >
                  <Mail className="h-4 w-4 mr-2 text-accent/80" /> Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full text-sm focus:shadow-outline-primary"
                  disabled
                  autoComplete="off"
                />
              </div>

              {/* Contact No Field */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="contactNo"
                  className="text-sm font-medium text-muted-foreground flex items-center"
                >
                  <Phone className="h-4 w-4 mr-2 text-accent/80" /> Contact No.
                </Label>
                <Input
                  id="contactNo"
                  name="contactNo"
                  type="text"
                  value={formData.contactNo}
                  onChange={handleChange}
                  className="w-full text-sm focus:shadow-outline-primary"
                  placeholder="e.g., 01xxxxxxxxx"
                  autoComplete="off"
                />
              </div>

              {/* Address Field */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="address"
                  className="text-sm font-medium text-muted-foreground flex items-center"
                >
                  <MapPin className="h-4 w-4 mr-2 text-accent/80" /> Address
                </Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full text-sm focus:shadow-outline-primary"
                  placeholder="Your current residential address"
                  rows={3}
                  autoComplete="off"
                />
              </div>

              {/* Current Job Field */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="currentJob"
                  className="text-sm font-medium text-muted-foreground flex items-center"
                >
                  <Briefcase className="h-4 w-4 mr-2 text-accent/80" /> Current
                  Role/Job Title
                </Label>
                <Input
                  id="currentJob"
                  name="currentJob"
                  type="text"
                  value={formData.currentJob}
                  onChange={handleChange}
                  className="w-full text-sm focus:shadow-outline-primary"
                  placeholder="e.g., Software Engineer"
                  autoComplete="off"
                />
              </div>

              {/* Current Company Field */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="currentCompany"
                  className="text-sm font-medium text-muted-foreground flex items-center"
                >
                  <Building2 className="h-4 w-4 mr-2 text-accent/80" /> Current
                  Company/Organization
                </Label>
                <Input
                  id="currentCompany"
                  name="currentCompany"
                  type="text"
                  value={formData.currentCompany}
                  onChange={handleChange}
                  className="w-full text-sm focus:shadow-outline-primary"
                  placeholder="e.g., Google"
                  autoComplete="off"
                />
              </div>

              {/* Location Field */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="location"
                  className="text-sm font-medium text-muted-foreground flex items-center"
                >
                  <MapPin className="h-4 w-4 mr-2 text-accent/80" /> Current
                  Location (City, Country)
                </Label>
                <Textarea
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full text-sm focus:shadow-outline-primary"
                  placeholder="e.g., Dhaka, Bangladesh"
                  rows={2}
                  autoComplete="off"
                />
              </div>

              {/* Skills Field */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="skills"
                  className="text-sm font-medium text-muted-foreground flex items-center"
                >
                  <GraduationCap className="h-4 w-4 mr-2 text-accent/80" />{" "}
                  Skills (comma-separated)
                </Label>
                <Textarea
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  className="w-full text-sm focus:shadow-outline-primary"
                  placeholder="e.g., React, Python, Project Management"
                  rows={2}
                  autoComplete="off"
                />
              </div>

              {/* LinkedIn Field */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="linkedin"
                  className="text-sm font-medium text-muted-foreground flex items-center"
                >
                  <Linkedin className="h-4 w-4 mr-2 text-accent/80" /> LinkedIn
                  Profile URL
                </Label>
                <Input
                  id="linkedin"
                  name="linkedin"
                  type="text"
                  value={formData.linkedin}
                  onChange={handleChange}
                  className="w-full text-sm focus:shadow-outline-primary"
                  placeholder="https://linkedin.com/in/yourprofile"
                  autoComplete="off"
                />
              </div>

              {/* GitHub Field */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="github"
                  className="text-sm font-medium text-muted-foreground flex items-center"
                >
                  <Github className="h-4 w-4 mr-2 text-accent/80" /> GitHub
                  Profile URL
                </Label>
                <Input
                  id="github"
                  name="github"
                  type="text"
                  value={formData.github}
                  onChange={handleChange}
                  className="w-full text-sm focus:shadow-outline-primary"
                  placeholder="https://github.com/yourusername"
                  autoComplete="off"
                />
              </div>

              {/* Bio Field */}
              <div className="md:col-span-2 space-y-1.5">
                <Label
                  htmlFor="bio"
                  className="text-sm font-medium text-muted-foreground flex items-center"
                >
                  <User className="h-4 w-4 mr-2 text-accent/80" /> Bio / About
                  Me
                </Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full text-sm focus:shadow-outline-primary"
                  placeholder="Tell us a bit about yourself, your work, and interests."
                  rows={4}
                  autoComplete="off"
                />
              </div>
            </div>
          ) : (
            <>
              <div className="border-t border-border/50 pt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
                <InfoItem
                  icon={Mail}
                  label="Email"
                  value={profileData.email}
                  isEmail
                />
                <InfoItem
                  icon={Phone}
                  label="Contact No."
                  value={profileData.contactNo}
                />
                <InfoItem
                  icon={MapPin}
                  label="Address"
                  value={profileData.address}
                />
                <InfoItem
                  icon={Briefcase}
                  label="Current Role"
                  value={profileData.currentJob}
                />
                <InfoItem
                  icon={Building2}
                  label="Company"
                  value={profileData.currentCompany}
                />
                <InfoItem
                  icon={MapPin}
                  label="Location"
                  value={profileData.location}
                />
                <InfoItem
                  icon={GraduationCap}
                  label="Degree"
                  value={
                    profileData.degree || `B.Sc. in ${profileData.department}`
                  }
                />
                <InfoItem
                  icon={User}
                  label="Skills"
                  value={
                    Array.isArray(profileData.skills)
                      ? profileData.skills.join(", ")
                      : profileData.skills
                  }
                />

                {profileData.linkedin && (
                  <InfoItem
                    icon={Linkedin}
                    label="LinkedIn"
                    value={profileData.linkedin}
                    link={
                      profileData.linkedin.startsWith("http")
                        ? profileData.linkedin
                        : `https://${profileData.linkedin}`
                    }
                  />
                )}
                {profileData.github && (
                  <InfoItem
                    icon={Github}
                    label="GitHub"
                    value={profileData.github}
                    link={
                      profileData.github.startsWith("http")
                        ? profileData.github
                        : `https://${profileData.github}`
                    }
                  />
                )}

                <div className="md:col-span-2 mt-3">
                  <InfoItem icon={User} label="Bio" value={profileData.bio} />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfilePage;
