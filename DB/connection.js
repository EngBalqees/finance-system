import mongoose from "mongoose";

const connection = ()=>{
    return mongoose.connect(process.env.DbConnection).then(result =>{
        console.log(`connect to DataBase`);
    }).catch(error =>{
        console.log(`not connect to data base :${error}`);
    })
}
export default connection;