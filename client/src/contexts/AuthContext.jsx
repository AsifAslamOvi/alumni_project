import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // ✅ Start as null
    const [loading, setLoading] = useState(true); // ✅ clear naming

    useEffect(() => {
        const storedUser = localStorage.getItem("ruetAlumniUser");
        
        if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Error parsing stored user:", error);
            }
        }
        setLoading(false);
    }, []); 

    if (loading) return <h1>Loading...</h1>;

  const login = (userData) => {
        setUser(userData);
        localStorage.setItem("ruetAlumniUser", JSON.stringify(userData));
    };

    const register = (userData) => {
        const newUser = {
            ...userData,
            id: Date.now().toString(),
            isVerified: false, // ✅ match backend naming
            role: userData.role || "alumni",
        };
        localStorage.setItem("ruetAlumniUser", JSON.stringify(newUser));
        setUser(newUser);
        return newUser;
    };

  const updateUser = async (updatedData) => {
      if(!user) return <h1>loading...</h1>
        if (user) {
          const newUserData = { ...user, ...updatedData };
          console.log(updateUser)
          try {
            setLoading(true);
                  const res = await fetch(
                      `http://localhost:5000/user/${updatedData.email}`,
                      {
                          method: "PATCH",
                          headers: {
                              "Content-Type": "application/json",
                          },
                          body: JSON.stringify(newUserData),
                      }
                  );

                  const data = await res.json();
                  if (res.ok) {
                      alert("User updated successfully:", data);
                  } else {
                      alert("Failed to update user:", data.message);
                  }
              } catch (error) {
                  console.error("Error updating user:", error);
          }
          finally {
            setLoading(false)
          }
            // localStorage.setItem("ruetAlumniUser", JSON.stringify(newUserData));
            setUser(newUserData);
        }
    };

    const logout = () => {
        localStorage.removeItem("ruetAlumniUser");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{ user, login,setUser, register, logout, updateUser, loading }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
