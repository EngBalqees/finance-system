import Transaction from "../../../DB/model/transactions.model";

//create transaction (user)
export const createTransaction = async (req, res) => {
    const { amount, type, category, date, description } = req.body;
    try {
        const transaction = new Transaction({
            userId: req.user.userId,
            amount,
            type,
            category,
            date,
            description
        });
        await transaction.save();
        res.status(201).json({ message: "Transaction created successfully", transaction });
    } catch (error) {
        res.status(500).json({ message: "Error creating transaction", error });
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
        const query = req.user.role === "superadmin" ? { _id: transactionId } : { _id: transactionId, userId: req.user.userId };
        const transaction = await Transaction.findOneAndDelete(query);
        if (!transaction) return res.status(404).json({ message: "Transaction not found or unauthorized" });
        return res.status(200).json({ message: "Transaction deleted successfully" });

    } catch (error) {
        return res.status(500).json({ message: "error in deleting", error });
    }
}