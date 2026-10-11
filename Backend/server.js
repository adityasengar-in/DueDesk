require("dotenv").config();
const app=require("./src/app");
const ConnectDB=require("./DB/db");

ConnectDB();

const { startReminders, runReminders } = require("./jobs/reminders");
startReminders();
// runReminders(); just to check manually if the reminders are working

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log("Server is running of port" + PORT);
})