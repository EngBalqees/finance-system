import goal from "../../../DB/model/goal.model.js";

//Create Goal (User Only)
export const createGoal = async (req, res) => {
    const { name, description, targetAmount, deadline, priority } = req.body;

    try {
        const newgoal = new goal({
            userId: req.user.userId,
            name,
            description,
            targetAmount,
            deadline,
            priority,
        });
        await newgoal.save();
        return res.status(201).json({ message: "Goal created successfully", newgoal });
    } catch (error) {
        console.error("Error creating goal:", error);
        return res.status(500).json({ message: "Error creating goal", error: error.message });
    }
}

//View Goals (User & Super Admin)
export const viewGoals = async (req, res) => {
    try {
        const query = req.user.role === "superadmin" && req.query.userId
            ? { userId: req.query.userId }
            : { userId: req.user.userId };

        const goals = await goal.find(query);
        return res.status(200).json(goals);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching goals", error: error.message });
    }
}

//Update Goal (User & Super Admin)
export const updateGoal = async (req, res) => {
    const { goalId } = req.params;
    const { name, description, targetAmount, deadline, currentAmount, priority } = req.body;

    try {
        const query = req.user.role === "superadmin" ? { _id: goalId } : { _id: goalId, userId: req.user.userId };

        const goal = await goal.findOneAndUpdate(query, { name, description, targetAmount, deadline, currentAmount, priority}, { new: true });
        if (!goal) return res.status(404).json({ message: "Goal not found or unauthorized" });

        return res.status(200).json({ message: "Goal updated successfully", goal });
    } catch (error) {
        return res.status(500).json({ message: "Error updating goal", error: error.message });
    }
}

//Delete Goal (User & Super Admin)
export const deleteGoal = async (req, res) => {
    const { goalId } = req.params;

    try {
      const query = req.user.role === "superadmin" ? { _id: goalId } : { _id: goalId, userId: req.user.userId };
  
      const deletegoal = await goal.findOneAndDelete(query);
      if (!deletegoal) return res.status(404).json({ message: "Goal not found or unauthorized" });
  
      return res.status(200).json({ message: "Goal deleted successfully" });
    } catch (error) {
        console.error("Error deleting goal:", error);
    return  res.status(500).json({ message: "Error deleting goal", error: error.message });
    }
}

//Update Saved Amount (User Only)
export const updateSavedAmount = async (req, res) => {
    const { goalId } = req.params;
    const { savedAmount } = req.body; // Amount to add towards the goal
  
    try {
      const goal = await goal.findOne({ _id: goalId, userId: req.user.userId });
      if (!goal) return res.status(404).json({ message: "Goal not found" });
  
      goal.savedAmount += savedAmount;
  
      // Mark goal as completed if target amount is reached or exceeded
      if (goal.savedAmount >= goal.targetAmount) {
        goal.isCompleted = true;
      }
  
      await goal.save();
     return res.status(200).json({ message: "Saved amount updated successfully", goal });
    } catch (error) {
     return res.status(500).json({ message: "Error updating saved amount", error: error.message });
    }
}