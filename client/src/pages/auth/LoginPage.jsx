import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Added Tabs
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import {
    Hash,
    Lock,
    LogIn,
    Mail,
    ShieldCheck as UserShield,
} from "lucide-react"; // Added Hash and UserShield
import { useState,useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [alumniEmail, setAlumniEmail] = useState("");
    const [alumniRoll, setAlumniRoll] = useState(""); // New state for Alumni Roll
    const [alumniPassword, setAlumniPassword] = useState("");

    const [adminEmail, setAdminEmail] = useState("");
    const [adminPassword, setAdminPassword] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();
    const from = location.state?.from?.pathname || "/";
    const [activeTab, setActiveTab] = useState("alumni");
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch("http://localhost:5000/users");

                const result = await response.json();
                setUsers(result);
            } catch (err) {
                console.error("Failed to fetch users:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);
  console.log(users);

    const handleAlumniSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        
        const foundUser = users.find(
            (u) =>
                u.email === alumniEmail &&
                u.rollNo === alumniRoll && // Check roll number
                u.password === alumniPassword &&
                u.role === "alumni"
        );

        if (foundUser && foundUser.isVerified) {
          login({
              id: foundUser.id,
              name: foundUser.name,
              email: foundUser.email,
              password: foundUser.password,
              rollNo: foundUser.rollNo,
              series: foundUser.series,
              section: foundUser.section,
              department: foundUser.department,
              passingYear: foundUser.passingYear,
              contactNo: foundUser.contactNo,
              address: foundUser.address,
              currentJob: foundUser.currentJob,
              currentCompany: foundUser.currentCompany,
              skills: foundUser.skills,
              profilePhoto: foundUser.profilePhoto,
              coverPhoto: foundUser.coverPhoto,
              isVerified: true,
              role: foundUser.role,
              createdAt: foundUser.createdAt,
              bio: foundUser.bio,
              github: foundUser.github,
              linkedin: foundUser.linkedin,
            location: foundUser.location,
              address: foundUser.address
          });

            toast({
                title: "Login Successful!",
                description: `Welcome back, ${foundUser.name}!`,
                className: "bg-green-500 text-white",
            });
            navigate(from, { replace: true });
        } else if (foundUser && !foundUser.isVerified) {
            toast({
                variant: "destructive",
                title: "Account Pending Verification",
                description:
                    "Your account is awaiting admin approval. Please check back later or contact support.",
            });
        } else {
            toast({
                variant: "destructive",
                title: "Alumni Login Failed",
                description:
                    "Invalid credentials or account not found/verified. Please check your Email, Roll No., and Password.",
            });
        }
        setIsLoading(false);
    };

    const handleAdminSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Hardcoded admin credentials
        

        const foundAdmin = users.find(
            (admin) =>
                admin.email === adminEmail && admin.password === adminPassword
        );

        if (foundAdmin) {
            
            toast({
                title: "Admin Login Successful!",
                description: `Welcome, ${foundAdmin.name}!`,
                className: "bg-blue-500 text-white",
            });
            navigate("/admin", { replace: true });
        } else {
            toast({
                variant: "destructive",
                title: "Admin Login Failed",
                description: "Invalid admin credentials.",
            });
        }
        setIsLoading(false);
    };

    return (
        <div className="flex items-center justify-center py-12 min-h-[calc(100vh-15rem)] px-4">
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
                className="w-full max-w-md"
            >
                <Card className="shadow-2xl border-primary/20">
                    <CardHeader className="text-center space-y-3 pb-3">
                        <img
                            src="/rlogo.svg"
                            alt="RUET Alumni Logo"
                            className="w-20 h-20 mx-auto mb-2 drop-shadow-lg"
                        />
                        <CardTitle className="text-3xl font-extrabold text-primary tracking-tight">
                            RUET Alumni Portal
                        </CardTitle>
                    </CardHeader>

                    <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="w-full"
                    >
                        <TabsList className="grid w-full grid-cols-2 mb-4 h-12">
                            <TabsTrigger
                                value="alumni"
                                className="text-base h-10 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md"
                            >
                                Alumni Login
                            </TabsTrigger>
                            <TabsTrigger
                                value="admin"
                                className="text-base h-10 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md"
                            >
                                Admin Login
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="alumni">
                            <CardContent className="space-y-6 pt-2">
                                <CardDescription className="text-center text-md text-muted-foreground">
                                    Sign in to connect with the network.
                                </CardDescription>
                                <form
                                    onSubmit={handleAlumniSubmit}
                                    className="space-y-5"
                                >
                                    <div className="space-y-1.5">
                                        <Label
                                            htmlFor="alumniRoll"
                                            className="text-sm font-medium"
                                        >
                                            Roll No.
                                        </Label>
                                        <div className="relative">
                                            <Hash className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground/70" />
                                            <Input
                                                id="alumniRoll"
                                                type="text"
                                                placeholder="e.g., 1701001"
                                                value={alumniRoll}
                                                onChange={(e) =>
                                                    setAlumniRoll(
                                                        e.target.value
                                                    )
                                                }
                                                required
                                                className="pl-11 h-11 text-sm focus:shadow-outline-primary"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label
                                            htmlFor="alumniEmail"
                                            className="text-sm font-medium"
                                        >
                                            Email Address
                                        </Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground/70" />
                                            <Input
                                                id="alumniEmail"
                                                type="email"
                                                placeholder="your.email@example.com"
                                                value={alumniEmail}
                                                onChange={(e) =>
                                                    setAlumniEmail(
                                                        e.target.value
                                                    )
                                                }
                                                required
                                                className="pl-11 h-11 text-sm focus:shadow-outline-primary"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label
                                            htmlFor="alumniPassword"
                                            className="text-sm font-medium"
                                        >
                                            Password
                                        </Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground/70" />
                                            <Input
                                                id="alumniPassword"
                                                type="password"
                                                placeholder="Enter your password"
                                                value={alumniPassword}
                                                onChange={(e) =>
                                                    setAlumniPassword(
                                                        e.target.value
                                                    )
                                                }
                                                required
                                                className="pl-11 h-11 text-sm focus:shadow-outline-primary"
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full btn-primary-glow h-11 text-md gap-2"
                                        disabled={isLoading}
                                    >
                                        <LogIn size={18} />
                                        {isLoading
                                            ? "Authenticating..."
                                            : "Login as Alumni"}
                                    </Button>
                                </form>
                            </CardContent>
                            <CardFooter className="flex justify-center pt-3">
                                <p className="text-xs text-muted-foreground">
                                    New here?{" "}
                                    <Button
                                        variant="link"
                                        asChild
                                        className="text-accent p-0 h-auto font-semibold text-xs"
                                    >
                                        <Link to="/register">
                                            Create an Account
                                        </Link>
                                    </Button>
                                </p>
                            </CardFooter>
                        </TabsContent>

                        <TabsContent value="admin">
                            <CardContent className="space-y-6 pt-2">
                                <CardDescription className="text-center text-md text-muted-foreground">
                                    Access the administration panel.
                                </CardDescription>
                                <form
                                    onSubmit={handleAdminSubmit}
                                    className="space-y-5"
                                >
                                    <div className="space-y-1.5">
                                        <Label
                                            htmlFor="adminEmail"
                                            className="text-sm font-medium"
                                        >
                                            Admin Email
                                        </Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground/70" />
                                            <Input
                                                id="adminEmail"
                                                type="email"
                                                placeholder="admin@ruet.ac.bd"
                                                value={adminEmail}
                                                onChange={(e) =>
                                                    setAdminEmail(
                                                        e.target.value
                                                    )
                                                }
                                                required
                                                className="pl-11 h-11 text-sm focus:shadow-outline-primary"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label
                                            htmlFor="adminPassword"
                                            className="text-sm font-medium"
                                        >
                                            Admin Password
                                        </Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground/70" />
                                            <Input
                                                id="adminPassword"
                                                type="password"
                                                placeholder="Enter admin password"
                                                value={adminPassword}
                                                onChange={(e) =>
                                                    setAdminPassword(
                                                        e.target.value
                                                    )
                                                }
                                                required
                                                className="pl-11 h-11 text-sm focus:shadow-outline-primary"
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full btn-primary-glow h-11 text-md gap-2"
                                        disabled={isLoading}
                                    >
                                        <UserShield size={18} />
                                        {isLoading
                                            ? "Authenticating..."
                                            : "Login as Admin"}
                                    </Button>
                                </form>
                            </CardContent>
                            <CardFooter className="flex justify-center pt-3">
                                <p className="text-xs text-muted-foreground">
                                    For authorized personnel only.
                                </p>
                            </CardFooter>
                        </TabsContent>
                    </Tabs>
                </Card>
            </motion.div>
        </div>
    );
};

export default LoginPage;
