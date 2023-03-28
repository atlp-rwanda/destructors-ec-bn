import cron from 'node-cron';
import {checkPasswordExpiration} from '../services/isPassword';
import "dotenv/config";

export const jobScheduling = ()=>{
    const job = cron.schedule(process.env.JOB_SCHEDULING_TIME,checkPasswordExpiration);
    job.start()
}