import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const defaultUsers = [
  {
    id: "admin_1",
    email: "admin@carpool.com",
    password: "admin123",
    name: "Adeel Ahmed",
    phone: "+92 300 9999999",
    department: "Administration",
    role: "admin",
    verified: true,
    carDetails: null,
    isAdmin: true,
    city: "Lahore"
  },
  {
    id: "user_1",
    email: "driver@carpool.com",
    password: "driver123",
    name: "Danish Ahmed",
    phone: "+92 300 1234567",
    department: "Computer Science",
    role: "driver",
    verified: true,
    carDetails: {
      carModel: "Toyota Corolla",
      carColor: "White",
      plateNumber: "LAH-1234",
      seatsAvailable: "4",
      carYear: "2020"
    },
    city: "Lahore"
  },
  {
    id: "user_2",
    email: "hassan@carpool.com",
    password: "hassan123",
    name: "Hassan Ali",
    phone: "+92 300 5555555",
    department: "Engineering",
    role: "driver",
    verified: false,
    carDetails: {
      carModel: "Honda Civic",
      carColor: "Silver",
      plateNumber: "LHR-5678",
      seatsAvailable: "4",
      carYear: "2021"
    },
    city: "Lahore"
  },
  {
    id: "user_3",
    email: "fatima@carpool.com",
    password: "fatima123",
    name: "Fatima Khan",
    phone: "+92 300 4444444",
    department: "Business",
    role: "driver",
    verified: true,
    carDetails: {
      carModel: "Suzuki Alto",
      carColor: "Red",
      plateNumber: "LHR-9012",
      seatsAvailable: "4",
      carYear: "2019"
    },
    city: "Lahore"
  }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // ✅ IMPORTANT FIX: purane localStorage data ko default users ke sath MERGE karo
    // taake admin account hamesha guaranteed exist kare, chahe pehle se data ho ya na ho
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");

    const mergedUsers = [...defaultUsers];
    storedUsers.forEach((su) => {
      const idx = mergedUsers.findIndex((u) => u.email.toLowerCase() === su.email.toLowerCase());
      if (idx === -1) {
        mergedUsers.push(su); // naya user (signup se aya) add kar do
      }
      // agar email already defaultUsers mein hai (admin/driver), to default hi rakho
      // (isse admin ka email/password hamesha valid rahega)
    });

    localStorage.setItem("users", JSON.stringify(mergedUsers));
    setUsers(mergedUsers);

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Driver Sign In
  const signIn = async (email, password) => {
    await new Promise((resolve) => setTimeout(resolve, 900));

    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");

    const foundUser = allUsers.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password &&
        (u.role === "driver" || u.role === "admin")
    );

    if (!foundUser) {
      throw new Error("Invalid credentials. Please check your email and password.");
    }

    const { password: _, ...userWithoutPassword } = foundUser;

    const userData = {
      ...userWithoutPassword,
      carDetails: foundUser.carDetails || null,
      isAdmin: foundUser.role === "admin"
    };

    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    return userData;
  };

  // Admin Sign In
  const adminSignIn = async (email, password) => {
    await new Promise((resolve) => setTimeout(resolve, 900));

    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");

    const foundUser = allUsers.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password &&
        u.role === "admin"
    );

    if (!foundUser) {
      throw new Error("Invalid admin credentials. Please check email and password.");
    }

    const { password: _, ...userWithoutPassword } = foundUser;

    const userData = {
      ...userWithoutPassword,
      isAdmin: true
    };

    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    return userData;
  };

  // Driver Sign Up
  const signUp = async (userData) => {
    await new Promise((resolve) => setTimeout(resolve, 900));

    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    if (allUsers.find((u) => u.email.toLowerCase() === userData.email.toLowerCase())) {
      throw new Error("A user with this email already exists");
    }

    const newUser = {
      id: "user_" + Date.now(),
      email: userData.email,
      password: userData.password,
      name: userData.fullName,
      phone: userData.phone || "",
      department: userData.department || "",
      role: "driver",
      verified: false,
      carDetails: null,
      isAdmin: false,
      city: userData.city || "Lahore",
      createdAt: new Date().toISOString()
    };

    allUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(allUsers));

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem("user", JSON.stringify(userWithoutPassword));

    return userWithoutPassword;
  };

  const updateUser = async (updatedData) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const userIndex = allUsers.findIndex((u) => u.id === user.id);

    if (userIndex !== -1) {
      allUsers[userIndex] = { ...allUsers[userIndex], ...updatedData };
      localStorage.setItem("users", JSON.stringify(allUsers));

      const updatedUser = { ...user, ...updatedData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      return updatedUser;
    }
    throw new Error("User not found");
  };

  // Admin Functions
  const getAllUsers = () => {
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    return allUsers.filter((u) => u.role !== "admin");
  };

  const verifyUser = async (userId) => {
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const userIndex = allUsers.findIndex((u) => u.id === userId);
    if (userIndex !== -1) {
      allUsers[userIndex].verified = true;
      localStorage.setItem("users", JSON.stringify(allUsers));
      return allUsers[userIndex];
    }
    throw new Error("User not found");
  };

  const deleteUser = async (userId) => {
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const filteredUsers = allUsers.filter((u) => u.id !== userId);
    localStorage.setItem("users", JSON.stringify(filteredUsers));
    return filteredUsers;
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    adminSignIn,
    signOut,
    updateUser,
    getAllUsers,
    verifyUser,
    deleteUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isDriver: user?.role === "driver"
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}