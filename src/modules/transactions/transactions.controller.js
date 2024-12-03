import Transaction from "../../../DB/model/transactions.model.js";
import budget from "../../../DB/model/budget.model.js";
//create transaction (user)
export const createTransaction = async (req, res) => {
    const { amount, type, category, date, description } = req.body;

    try {
      // Fetch the user's budgets
      const budgets = await budget.find({ userId: req.user.userId });
  
      // Check if the category exists in budgets
      const relevantBudget = budgets.find((budget) => budget.title === category);
  
      if (!relevantBudget) {
        return res.status(400).json({
          message: "Category does not match any existing budget title",
        });
      }
  
      // Check if the budget is expired
      if (relevantBudget.status === "expired") {
        return res.status(400).json({
          message: "The associated budget has expired and cannot be used for transactions.",
        });
      }
  
      // Check if the transaction exceeds the budget limit
      const remainingAmount = relevantBudget.amount - relevantBudget.spent;
      if (type === "expense" && amount > remainingAmount) {
        return res.status(400).json({
          message: "Transaction amount exceeds the available budget.",
        });
      }
  
      // Create the transaction
      const newTransaction = new Transaction({
        userId: req.user.userId,
        amount,
        type,
        category,
        date,
        description,
      });
  
      await newTransaction.save();
  
      // Update the budget's spent amount if it's an expense
      if (type === "expense") {
        relevantBudget.spent += amount;
        await relevantBudget.save();
      }
  
      res.status(201).json({
        message: "Transaction added successfully",
        transaction: newTransaction,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error adding transaction",
        error: error.message,
      });
    }
}

//view transactions (user own transaction --super admin all transactions)
export const viewTransactions = async (req, res) => {
    try {
        const query = req.user.role === "superadmin" && req.query.userId
            ? { userId: req.query.userId }
            : { userId: req.user.userId };

        const transactions = await Transaction.find(query);
        return res.status(200).json(transactions);

    } catch (error) {
        console.error("Error retrieving transactions:", error); // Log the error for debugging
        return res.status(500).json({ message: "Internal Server Error" }); // Send an error response
    }
}
//update transactions (user own transaction --super admin all transactions)
export const updateTransaction = async (req, res) => {
    const { transactionId } = req.params;
    const { amount, type, category, date, description } = req.body;
    try {
        const query = req.user.role === "superadmin" ? { _id: transactionId } : { _id: transactionId, userId: req.user.userId };

        const transaction = await Transaction.findOneAndUpdate(query, { amount, type, category, date, description }, { new: true });
        if (!transaction) return res.status(404).json({ message: "Transaction not found or unauthorized" });

        return res.status(200).json({ message: "Transaction updated successfully", transaction });
    } catch (error) {
        return res.status(500).json({ message: "error in updating", error });
    }
}
//delete transaction (user own transaction --super admin all transactions)  
export const deleteTransaction = async (req, res) => {
    const { transactionId } = req.params;
    try {
        // Find and delete the transaction only if it belongs to the logged-in user
        const transaction = await Transaction.findOneAndDelete({ 
          _id: transactionId, 
          userId: req.user.userId // Ensure the transaction belongs to the current user
        });
    
        if (!transaction) {
          // Transaction not found or unauthorized
          return res.status(404).json({ message: "Transaction not found or unauthorized" });
        }
    
        res.status(200).json({ message: "Transaction deleted successfully" });
      } catch (error) {
        console.error("Error deleting transaction:", error);
        res.status(500).json({ message: "Error deleting transaction", error: error.message });
      }
}