import { useState,useEffect } from "react";
import { motion } from "framer-motion";
import Loading from "../../components/ui/loading"

const departments = [
    "Computer Science & Engineering (CSE)",
    "Electrical & Electronic Engineering (EEE)",
    "Mechanical Engineering (ME)",
    "Civil Engineering (CE)",
    "Electronics & Telecommunication Engineering (ETE)",
    "Industrial & Production Engineering (IPE)",
    "Glass & Ceramic Engineering (GCE)",
    "Urban & Regional Planning (URP)",
    "Architecture (Arch)",
    "Materials Science & Engineering (MTE)",
    "Chemical & Food Process Engineering (CFPE)",
    "Building Engineering & Construction Management (BECM)"
];

const currentYear = new Date().getFullYear();
const passingYears = Array.from({ length: 50 }, (_, i) => currentYear - i);
const seriesYears = Array.from({ length: currentYear - 1990 + 1 }, (_, i) =>
    Number((currentYear - i).toString().slice(-2))
);

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneNo: "",
        address: "",
        series: "",
        section: "",
        rollNo: "",
        department: "",
        passingYear: "",
        password: "",
        confirmPassword: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", type: "" });
    const [users, setUsers] = useState([]);
  useEffect(() => {
      const fetchData = async () => {
          try {
              setIsLoading(true);
              const response = await fetch(
                  "http://localhost:5000/users"
              );
             
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

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type: "" }), 4000);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (name, value) => {
        if (!value) return;
        setFormData((prev) => {
            const newData = { ...prev, [name]: value };
            return newData;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
        
        // Validation checks
        if (!formData.department) {
            showToast("Please select your department.", "error");
            return;
        }
        if (!formData.passingYear) {
            showToast("Please select your passing year.", "error");
            return;
        }
        if (!formData.series) {
            showToast("Please select your series.", "error");
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            showToast("Passwords do not match.", "error");
            return;
        }

        setIsLoading(true);

        // Simulate loading time
        await new Promise((resolve) => setTimeout(resolve, 1500));

        try {
            // Get existing users from localStorage or initialize empty array
            
            // Check if email already exists
            if (users.find(u => u.email === formData.email)) {
                showToast("Email already registered.", "error");
                setIsLoading(false);
                return;
            }
            
            // Check if roll number already exists for the same department
            if (users.find(u => u.rollNo === formData.rollNo && u.department === formData.department)) {
                showToast("Roll number already registered for this department.", "error");
                setIsLoading(false);
                return;
            }

            // Create new user object
            const newUserForStorage = {
                id: Date.now().toString(),
                name: formData.name,
                email: formData.email,
                password: formData.password,
                rollNo: formData.rollNo,
                series: formData.series,
                section: formData.section,
                department: formData.department,
                passingYear: parseInt(formData.passingYear),
                contactNo: formData.phoneNo,
                address: formData.address,
                currentJob: '',
                currentCompany: '',
                skills: [],
                profilePhoto: '',
                coverPhoto: '',
                isVerified: false,
                role: 'alumni',
                createdAt: new Date().toISOString(),
            };
            
            // Add new user to existing users array
            const newUser = await fetch("http://localhost:5000/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newUserForStorage),
            });
            if (newUser.insertedId) {
                
                // Show success message
                showToast(
                    "Registration submitted! Your registration is pending admin verification. You will be notified once approved.",
                    "success"
                );
            }
            
            // Reset form after successful registration
            setTimeout(() => {
                setFormData({
                    name: "",
                    email: "",
                    phoneNo: "",
                    address: "",
                    series: "",
                    section: "",
                    rollNo: "",
                    department: "",
                    passingYear: "",
                    password: "",
                    confirmPassword: "",
                });
            }, 2000);
            
        } catch (error) {
            showToast(error.message || "An unexpected error occurred.", "error");
        }
        
        setIsLoading(false);
    };

    if (isLoading) return <Loading />;

    return (
        <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4">
            {/* Toast Notification */}
            {toast.show && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
                    toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                }`}>
                    {toast.message}
                </div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
                className="w-full max-w-4xl"
            >
                <div className="bg-gray-900 rounded-2xl shadow-2xl border border-gray-800">
                    <div className="text-center p-8 border-b border-gray-800">
                        <img
                            src="/rlogo.svg"
                            alt="RUET Alumni Logo"
                            className="w-20 h-20 mx-auto mb-4 drop-shadow-lg"
                        />
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Create Your Alumni Account
                        </h1>
                        <p className="text-gray-400">
                            Join the RUET Alumni Network. All fields are required.
                        </p>
                    </div>
                    
                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">Full Name</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">👤</span>
                                    <input
                                        name="name"
                                        placeholder="e.g., John Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">Email Address</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">📧</span>
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="your.email@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">Phone No.</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">📱</span>
                                    <input
                                        name="phoneNo"
                                        type="tel"
                                        placeholder="e.g., 01xxxxxxxxx"
                                        value={formData.phoneNo}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                                    />
                                </div>
                            </div>

                            {/* Address */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">Address</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-4 text-gray-500">📍</span>
                                    <textarea
                                        name="address"
                                        placeholder="Your current address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                        rows={3}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 resize-none"
                                    />
                                </div>
                            </div>

                            {/* Series */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">Series</label>
                                <select
                                    name="series"
                                    value={formData.series}
                                    onChange={(e) => handleSelectChange("series", e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                                >
                                    <option value="" className="bg-gray-900">Select Series (e.g., 17 for 2017)</option>
                                    {seriesYears.map((year) => (
                                        <option key={year} value={year.toString()} className="bg-gray-900">
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Section */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">Section</label>
                                <select
                                    name="section"
                                    value={formData.section}
                                    onChange={(e) => handleSelectChange("section", e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                                >
                                    <option value="" className="bg-gray-900">Select Section</option>
                                    <option value="A" className="bg-gray-900">A</option>
                                    <option value="B" className="bg-gray-900">B</option>
                                    <option value="C" className="bg-gray-900">C</option>
                                    <option value="N/A" className="bg-gray-900">N/A (Not Applicable)</option>
                                </select>
                            </div>

                            {/* Roll No */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">Roll No.</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">#</span>
                                    <input
                                        name="rollNo"
                                        placeholder="e.g., 1701001"
                                        value={formData.rollNo}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                                    />
                                </div>
                            </div>

                            {/* Department */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">Department</label>
                                <select
                                    name="department"
                                    value={formData.department}
                                    onChange={(e) => handleSelectChange("department", e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                                >
                                    <option value="" className="bg-gray-900">Select Department</option>
                                    {departments.map((dept) => (
                                        <option key={dept} value={dept} className="bg-gray-900">
                                            {dept}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Passing Year */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">Passing Year</label>
                                <select
                                    name="passingYear"
                                    value={formData.passingYear}
                                    onChange={(e) => handleSelectChange("passingYear", e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                                >
                                    <option value="" className="bg-gray-900">Select Passing Year</option>
                                    {passingYears.map((year) => (
                                        <option key={year} value={year.toString()} className="bg-gray-900">
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">Create Password</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">🔒</span>
                                    <input
                                        name="password"
                                        type="password"
                                        placeholder="Choose a strong password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                                    />
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">Confirm Password</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">🔒</span>
                                    <input
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="Re-enter your password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="md:col-span-2 mt-6">
                                <button
                                    type="submit"
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className={`w-full py-4 rounded-lg text-lg font-semibold transition-all duration-200 ${
                                        isLoading 
                                            ? 'bg-gray-700 cursor-not-allowed' 
                                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] shadow-lg hover:shadow-xl'
                                    } text-white`}
                                >
                                    {isLoading ? "Processing Registration..." : "Register Account"}
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="text-center py-6 border-t border-gray-800">
                        <p className="text-gray-400">
                            Already have an account?{" "}
                            <a href="/login" className="text-blue-400 hover:text-blue-300 font-semibold">
                                Login Here
                            </a>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterPage;