import budget from "../../../DB/model/budget.model.js";


//add new budget
export const createBudget = async (req, res) => {[]
    const { title, type, amount, startDate,endDate, } = req.body;

    try {
        const newbudget = new budget({
            userId: req.user.userId,
            title,
            type,
            amount,
            startDate,
            endDate,
        });
        await newbudget.save();
        return res.status(201).json({ message: "Budget created successfully", newbudget });
    } catch (error) {
        return res.status(500).json({ message: "Error creating budget", error: error.message });
    }
}

//view budgets User: Views only their budgets //Super Admin: Can view all budgets or budgets of a specific user
export const viewBudgets = async (req, res) => {
    try {
        const query = req.user.role === "superadmin" && req.query.userId
            ? { userId: req.query.userId }
            : { userId: req.user.userId };

        const budgets = await budget.find(query);
        return res.status(200).json(budgets);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching budgets", error });
    }
}

//update budget User: Can update only their budgets. Super Admin: Can update any user’s budget.
export const updateBudget = async (req, res) => {
    const  { id } = req.params;
    const { title, type, amount, spent, startDate, endDate} = req.body;
    try {
        const query = req.user.role === "superadmin" ? { _id: budgetId } : { _id: budgetId, userId: req.user.userId };
    
        const budget = await budget.findOneAndUpdate(query, {  title, type, amount, spent, startDate, endDate}, { new: true });
        if (!budget) return res.status(404).json({ message: "Budget not found or unauthorized" });
    
        return res.status(200).json({ message: "Budget updated successfully", budget });
      } catch (error) {
        return res.status(500).json({ message: "Error updating budget", error });
      }

}

//Delete Budget User: Can delete only their budgets. Super Admin: Can delete any user’s budget
export const deleteBudget = async (req, res) => {
    const { budgetId } = req.params;
  
    try {
      const query = req.user.role === "superadmin" ? { _id: budgetId } : { _id: budgetId, userId: req.user.userId };
  
      const budget = await budget.findOneAndDelete(query);
      if (!budget) return res.status(404).json({ message: "Budget not found or unauthorized" });
  
     return res.status(200).json({ message: "Budget deleted successfully" });
    } catch (error) {
     return res.status(500).json({ message: "Error deleting budget", error });
    }
  };
  

//Track Spending (User)
export const trackSpending = async (req, res) => {
    const { budgetId } = req.params;
    const { spendingAmount } = req.body;
  
    try {
      const budget = await budget.findOne({ _id: budgetId, userId: req.user.userId });
      if (!budget) return res.status(404).json({ message: "Budget not found" });
  
      budget.currentSpending += spendingAmount;
      await budget.save();
  
     return res.status(200).json({ message: "Spending tracked successfully", budget });
    } catch (error) {
      return res.status(500).json({ message: "Error tracking spending", error });
    }
  };
  
