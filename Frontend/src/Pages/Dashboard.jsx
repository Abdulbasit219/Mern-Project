import { Link } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// COMPONENTS
import { LineGraph } from '../components/LineGraph'
import { PieGraph } from '../components/PieGraph'

// ICONS
import { BsBell } from 'react-icons/Bs'

export const Dashboard = () => {

    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const id = localStorage.getItem('id');

        axios.get(`http://localhost:3001/user/${id}`)
            .then(response => {
                setUser(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });
    }, []);

    const handleClick = () => {
        if (user) {
            navigate('/Notifications', { state: { todaysOrders: getTodaysOrders() } });
        }
    };

    const getTodaysOrders = () => {
        if (user) {
            const today = new Date().toDateString();
            const status = 'Pending';
            return user.orders.filter(order => {
                const orderDate = new Date(order.delivery_date).toDateString();
                return orderDate === today && order.status === status;
            });
        }
        return [];
    };

    if (loading) {
        return <div className="items-center h-screen ml-96 mt-72 pl-52 text-3xl">
            <img className="h-28" src="https://i.gifer.com/ZKZg.gif" ></img>
            <p >Loading...</p>
        </div>

    }

    if (!user) {
        return <p>User data not found.</p>;
    }

    const allOrders = user.orders;
    const totalOrders = allOrders.length;
    const pendingOrders = allOrders.filter(order => order.status === 'Pending').length;
    const deliveredOrders = allOrders.filter(order => order.status === 'Delivered').length;
    const todaysOrders = getTodaysOrders();

    return (


        <div className="dark:bg-slate-700 m-2 border-black border-2 rounded-2xl  w-4/5 h-full shadow-xl shadow-black">

            <div className="flex dark:text-white m-2 w-fit text-xl font-semibold tracking-widest text-gray text-slate-800">
                <img style={{ width: 50, height: 50 }} src="https://hansjoerg.me/img/avatar.png" alt="" />
                <h1 className='mt-4 ml-2 mr-96 pr-36'>Hi,{user.firstname} {user.lastname}</h1>
                <Link
                    to="/Notifications"
                    onClick={handleClick}>
                    <BsBell className='ml-96 mt-4 text-2xl' />
                </Link>
                <span className='bg-red-700 rounded-full h-fit w-fit text-xs text-white  px-1.5 py-0.5'>{todaysOrders.length}</span>
            </div>


            <div className='flex justify-center '>

                <div className=' border-black border-4 rounded-3xl m-10 pl-10 pt-8 w-72 h-48 bg-slate-300 text-4xl text-bold '>
                    <h1 className='ml-2'>Total Orders </h1>
                    <h1 className='ml-20 mt-4'>{totalOrders}</h1>
                </div>

                <div className=' border-black border-4 rounded-3xl m-10 pl-2 pt-8 w-72 h-48 bg-gray-400 text-4xl text-bold'>
                    <h1 className='m-0'>Delivered Orders </h1>
                    <h1 className='ml-28 mt-4'>{deliveredOrders}</h1>
                </div>

                <div className=' border-black border-4 rounded-3xl m-10 pl-2 pt-8 w-72 h-48 bg-slate-400 text-4xl text-bold'>
                    <h1 className='ml-2'>Pending Orders </h1>
                    <h1 className='ml-28 mt-4'>{pendingOrders}</h1>
                </div>

            </div>

            <div className='flex'>
                <LineGraph user={user} />
                <PieGraph user={user} />
            </div>
        </div>
    )
}