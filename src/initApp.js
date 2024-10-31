import connection from "../DB/connection.js";
import budget from "../src/modules/budget/budget.router.js";
import user from '../src/modules/user/user.router.js';
import goal from '../src/modules/goal/goal.router.js';
import report from "../src/modules/report/report.router.js";
import Transaction from "../src/modules/transactions/transactions.router.js";
import setting from "../src/modules/setting/setting.router.js";
export const initApp = (app,express) =>{
    connection();
    app.use(express.json());
    app.use('/user',user);
    app.use('/transaction',Transaction);
    app.use('/budget',budget);
    app.use('/goal',goal);
    app.use('/report',report);
    app.use('/setting',setting);
    app.get('/api/data', (req, res) => {
        res.json({ message: 'Data fetched successfully' });
      });
    app.use('*', (req, res) => {
        return res.status(404).json({ message: "page not found" });
    });
    app.use((err, req, res, next) => {
        res.json({ message: err.message });
    });
}