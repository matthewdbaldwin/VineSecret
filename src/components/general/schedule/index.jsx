import React from 'react';
import './schedule.css';
import schedule from './data/schedule.json';

const Schedule = () => (
    <div className="schedule">
        {schedule.schedule.map((v) => (
            <div key={v.pid} className="schedule-row">
                <div className="schedule-day">{v.day}</div>
                <div className="schedule-hours">{v.open} - {v.close}</div>
            </div>
        ))}
    </div>
);

export default Schedule;
