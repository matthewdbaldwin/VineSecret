import React, { Component } from 'react';
<<<<<<< HEAD
import './schedule.css';
=======
<<<<<<< HEAD
import './schedule.scss';
=======
import './schedule.css';
>>>>>>> 5852e0babe86a6c74df179d7757ec81a2b36ff64
>>>>>>> main
import schedule from './data/schedule.json';

class Schedule extends Component {
    constructor(props) {
        super(props);

        this.state = {
            scheduleData: schedule.schedule,
        };
    }

    render() {
        const { scheduleData } = this.state;
        const day = scheduleData.map(v => (
            <div key={v.pid} className="w-100 m-2 inline">
                <div className='col-md-6 widthday center'>{v.day} </div>
                <div className='col-md-6 w-100 widthday float-right center'>{v.open} - {v.close}</div>
            </div>
        ));
        return (
            <>
                <div className='row'> {day}
                </div>
            </>
        );
    }
}

export default Schedule;
