import User from "../../../DB/model/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

//register new user
export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, process.env.SALTROUND);
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role: 'user',
        });
        return res.status(201).json({ message: "user account created successfully", user });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

//login 
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: "Invalid password" });

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
}

//super Admin functions
//view all users
export const viewAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json({ message: "Users retrieved successfully", users });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving users", error });
    }
}

//delete user
export const deleteUser = async (req, res) => {
    const { userId } = req.params;

    try {
        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error });
    }
}

//suspend or reactive user
export const updateUserStatus = async (req, res) => {
    const { userId } = req.params;
    const { status } = req.body; // status should be "active" or "suspended"
  
    try {
      await User.findByIdAndUpdate(userId, { status });
      res.status(200).json({ message: `User ${status} successfully` });
    } catch (error) {
      res.status(500).json({ message: "Error updating user status", error });
    }
  }

//promote/demote user to super admin
export const updateUserRole = async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body; // Role should be either "user" or "superAdmin"
  
    try {
      await User.findByIdAndUpdate(userId, { role });
      res.status(200).json({ message: `User role updated to ${role}` });
    } catch (error) {
      res.status(500).json({ message: "Error updating user role", error });
    }
  };
  
  //regular user function
  //update user profile
  export const updateProfile = async (req, res) => {
    const { username, email } = req.body;
  
    try {
      const updatedUser = await User.findByIdAndUpdate(req.user.userId, { username, email }, { new: true });
      res.status(200).json({ message: "Profile updated successfully", updatedUser });
    } catch (error) {
      res.status(500).json({ message: "Error updating profile", error });
    }
  };
  //change password (both)
  export const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
  
    try {
      const user = await User.findById(req.user.userId);
  
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) return res.status(401).json({ message: "Current password is incorrect" });
  
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
  
      res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error changing password", error });
    }
  };
  