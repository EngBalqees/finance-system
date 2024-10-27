import connection from "../DB/connection.js";
import user from '../src/modules/user/user.router.js';
import Transaction from "../DB/model/transactions.model.js";
export const initApp = (app,express) =>{
    connection();
    app.use(express.json());
    app.use('/user',user);
    app.use('/transaction',Transaction);
    app.use('*', (req, res) => {
        return res.status(404).json({ message: "page not found" });
    });
    app.use((err, req, res, next) => {
        res.json({ message: err.message });
    });
}