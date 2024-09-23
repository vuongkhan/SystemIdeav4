import React, { useEffect, useState } from "react";
import SideBar from "./SideBar.jsx";
import { getNotificationsOfUser, getOneUser } from "../api/apiService.js";
import { decodeJwt } from "../api/jwtDecode.js";
import femaleavatarImg from "../assets/img/femaleavatar.jpg"
import maleavatarImg from "../assets/img/maleavatar.jpg"
import logoideasystem from "../assets/img/logoideasystem.png"
import { Link } from "react-router-dom";


export default function NavBar() {
    const [isSideBarOpen, setIsSideBarOpen] = React.useState(false);
    let [isOpenNotification, setIsOpenNotification] = React.useState(false);
    let [isOpenAccount, setIsOpenAccount] = React.useState(false);
     const [userInfo, setUserInfo] = useState(null);
     useEffect(() => {
        getOneUser(decodeJwt().userId).then(res => {
            setUserInfo(res.data)
        })
    }, []);

    const handleOpenNotification = () => {
        setIsOpenNotification(!isOpenNotification);
        setIsOpenAccount(false);
    };

    const handleOpenAccount = () => {
        setIsOpenAccount(!isOpenAccount);
        setIsOpenNotification(false);
    };

    const handleOpenSideBar = () => {
        setIsSideBarOpen(!isSideBarOpen);
    };

    const logout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
      }


    const userId = decodeJwt().userId;
    const [notifications, setNotifications] =useState([]);
    useEffect(() => {
        getNotificationsOfUser(userId).then(res => {
            setNotifications(res.data)
        })
    }, []);

    function formatDateTimeDislay(inputString) {
        // Convert input string to JavaScript Date object
        var date = new Date(inputString);
    
        // Extract individual components (year, month, day, hours, minutes, seconds) from the Date object
        var year = date.getFullYear();
        var month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are zero-indexed, so we add 1 and pad with leading zero
        var day = ("0" + date.getDate()).slice(-2); // Pad with leading zero
        var hours = ("0" + date.getHours()).slice(-2); // Pad with leading zero
        var minutes = ("0" + date.getMinutes()).slice(-2); // Pad with leading zero
        var seconds = ("0" + date.getSeconds()).slice(-2); // Pad with leading zero
    
        // Format the date and time components into a user-friendly string
        var formattedDateTime = day + "/" + month + "/" + year + " " + hours + ":" + minutes + ":" + seconds;
    
        // Return the formatted date and time string
        return formattedDateTime;
    }


    return (
        <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div className="px-3 py-3 lg:px-5 lg:pl-3">
                <div className="flex items-center justify-between">
                     {/* Open sidebar */}
                    <div className="flex items-center justify-start">
                        <button onClick={handleOpenSideBar} data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                            <span className="sr-only">Open sidebar</span>
                            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                            </svg>
                            <SideBar isSideBarOpen={isSideBarOpen} />
                        </button>
                        <a href="#" className="flex ml-2 md:mr-24">
                        <img src={logoideasystem} className="h-10 mr-3" alt="" />
                        </a>
                    </div>
                <div className="flex items-center">

                {/* Notification button */}
                <button type="button" onClick={handleOpenNotification} className="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700">
                    <span className="absolute top-5 right-16 inline-flex items-center justify-center px-1.5 py-1 mr-2 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full"></span>
                    <span className="sr-only">View notifications</span>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
                   
                </button>

                {/* Drop down menu for notification button */}
                <div className={isOpenNotification ? "z-20 max-w-sm my-1 overflow-hidden text-base list-none bg-white divide-y divide-gray-100 rounded shadow-lg dark:divide-gray-600 dark:bg-gray-700" : "z-20 hidden max-w-sm my-1 overflow-hidden text-base list-none bg-white divide-y divide-gray-100 rounded shadow-lg dark:divide-gray-600 dark:bg-gray-700"} data-popper-placement="bottom" style={{position: "fixed", top: "50px", right: "60px"}}>
                    <div className="block px-4 py-2 text-base font-medium text-center text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        Notifications
                    </div>
                    <div className="overflow-y-auto lg:max-h-[30rem] 2xl:max-h-fit text-left">
                    {notifications? notifications.map(noti => (
                        noti.type === "Comment" ? (
                            <a href="#" className="flex px-4 py-3 border-b hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600">
                                <div className="flex-shrink-0">
                                <img className="rounded-full w-11 h-11" src={noti.other_user_id.gender === "Female" ? femaleavatarImg : maleavatarImg} alt="image" />
                                <div className="relative flex items-center justify-center w-5 h-5 ml-6 -mt-5 bg-green-400 border border-white rounded-full dark:border-gray-700">
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
                                </div>
                                </div>
                                <div className="w-full pl-3">
                                <div className="text-gray-500 font-normal text-sm mb-1.5 dark:text-gray-400"><span className="font-semibold text-gray-900 dark:text-white">{noti.other_user_id.fullname}</span> commented on your post: <span className="font-medium text-primary-700 dark:text-primary-500">{noti.idea_id.title}</span></div>
                                <div className="text-xs font-medium text-primary-700 dark:text-primary-400">{formatDateTimeDislay(noti.createdAt)}</div>
                                </div>
                            </a>
                        ) : (
                            <Link to={`/viewIdea/${noti.idea_id._id}`} className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600">
                            <div className="flex-shrink-0">
                            <img className="rounded-full w-11 h-11" src={noti.other_user_id.gender === "Female" ? femaleavatarImg : maleavatarImg} alt="Robert image" />
                            <div className="relative flex items-center justify-center w-5 h-5 ml-6 -mt-5 bg-purple-500 border border-white rounded-full dark:border-gray-700">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" /></svg>
                            </div>
                            </div>
                            <div className="w-full pl-3">
                            <div className="text-gray-500 font-normal text-sm mb-1.5 dark:text-gray-400"><span className="font-semibold text-gray-900 dark:text-white">{noti.other_user_id.fullname}</span> posted a new idea.</div>
                            <div className="text-xs font-medium text-primary-700 dark:text-primary-400">{formatDateTimeDislay(noti.createdAt)}</div>
                            </div>
                            </Link>
                        )
                        
                    )): ""}
                        
                    </div>

                </div>


                {userInfo ? (
                    <div className="flex items-center ml-3">
                                        
                    {/* Icon Account User */}
                    <div>
                        <button type="button" onClick={handleOpenAccount} className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600">
                            <span className="sr-only">Open user menu</span>
                            <img className="w-8 h-8 rounded-full" src={userInfo.gender === "Female" ? femaleavatarImg : maleavatarImg} alt="" />
                        </button>
                    </div>

                    <div className={isOpenAccount ? "z-20 max-w-sm my-1 overflow-hidden text-base list-none bg-white divide-y divide-gray-100 rounded shadow-lg dark:divide-gray-600 dark:bg-gray-700" : "z-20 hidden max-w-sm my-1 overflow-hidden text-base list-none bg-white divide-y divide-gray-100 rounded shadow-lg dark:divide-gray-600 dark:bg-gray-700"} style={{position: "fixed", top: "50px", right: "20px"}}>
                        <div className="px-4 py-3" role="none">
                            <p className="text-sm text-gray-900 dark:text-white" role="none">
                            {userInfo.fullname}
                            </p>
                            <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300" role="none">
                            {userInfo.email}
                            </p>
                            <p className="text-sm text-gray-900 dark:text-white" role="none">
                            Department: {userInfo.department}
                            </p>
                            <p className="text-sm text-gray-900 dark:text-white" role="none">
                            Role: {userInfo.permission}
                            </p>
                        </div>
                        <ul className="py-1" role="none">
                            <li>
                            <a href="/" onClick={logout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Sign out</a>
                            </li>
                        </ul>
                    </div>
                </div>
                ) : ""}
                    
                    </div>
                </div>
            </div>
        </nav>
    )
}