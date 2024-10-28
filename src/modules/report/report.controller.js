import Report from "../../../DB/model/report.model.js";
import budget from "../../../DB/model/budget.model.js";
import goal from "../../../DB/model/goal.model.js";
import Transaction from "../../../DB/model/transactions.model.js";
//GENERATE REPORT
export const generateReport = async (req, res) => {
    const { reportType, startDate, endDate } = req.body;
  
    try {
      // Aggregate data for the report based on transactions, budgets, and goals
      const transactions = await Transaction.find({ 
        userId: req.user.userId, 
        date: { $gte: new Date(startDate), $lte: new Date(endDate) }
      });
  
      const budgets = await budget.find({ 
        userId: req.user.userId, 
        month: new Date(startDate).getMonth() + 1,
        year: new Date(startDate).getFullYear()
      });
  
      const goals = await goal.find({ userId: req.user.userId });
  
      // Create report data summary
      const reportData = {
        totalIncome: transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0),
        totalExpense: transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0),
        budgets,
        goals
      };
  
      // Save the report to the database
      const report = new Report({
        userId: req.user.userId,
        reportType,
        startDate,
        endDate,
        data: reportData
      });
  
      await report.save();
     return res.status(201).json({ message: "Report generated successfully", report });
    } catch (error) {
      console.error("Error generating report:", error);
     return res.status(500).json({ message: "Error generating report", error: error.message });
    }
  };
  
  //view report 
  export  const viewReport = async (req, res) => {
    try {
        const query = req.user.role === "superadmin" && req.query.userId
          ? { userId: req.query.userId }
          : { userId: req.user.userId };
    
        const reports = await Report.find(query);
        return res.status(200).json(reports);
      } catch (error) {
      return  res.status(500).json({ message: "Error fetching reports", error: error.message });
      }
  }
//delete report
export const deleteReport = async (req, res) => {
    const { reportId } = req.params;

    try {
      const query = req.user.role === "superadmin" 
        ? { _id: reportId } 
        : { _id: reportId, userId: req.user.userId };
  
      const report = await Report.findOneAndDelete(query);
  
      if (!report) return res.status(404).json({ message: "Report not found or unauthorized" });
  
     return res.status(200).json({ message: "Report deleted successfully" });
    } catch (error) {
     return res.status(500).json({ message: "Error deleting report", error: error.message });
    }
}