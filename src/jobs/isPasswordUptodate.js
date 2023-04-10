import cron from 'node-cron';
import "dotenv/config";
import events from 'events';
import {checkPasswordExpiration} from '../services/isPassword';

import { ExpiredProducts } from '../services/isProductEpired.service';

export const jobScheduling = ()=>{
    const job = cron.schedule(process.env.JOB_SCHEDULING_TIME,checkPasswordExpiration);
    job.start()
}

export const prodExpirationJobScheduler=()=>{
    const job=cron.schedule(process.env.JOB_SCHEDULING_TIME,ExpiredProducts);
    job.start()
}
