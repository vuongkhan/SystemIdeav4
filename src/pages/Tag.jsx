import React, { useState, useEffect } from 'react';
import {
  HiHashtag,
  HiPlusCircle
} from "react-icons/hi";
import NavbarSidebarLayout from "../layout/NavBar-SideBar";
import { getTags } from '../api/apiService';
import { Link } from 'react-router-dom';
import femaleavatarImg from "../assets/img/femaleavatar.jpg"
import maleavatarImg from "../assets/img/maleavatar.jpg"
import { decodeJwt } from '../api/jwtDecode';

export default function Tag() {

  const [tags, setTags] = useState([]);
  useEffect(() => {
    getTags().then(res => {
      setTags(res.data);
    });
  }, []);

  const today = new Date();

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
    <NavbarSidebarLayout>
      <div className="relative w-full h-full overfloe-y-auto">
       <div className="px-4 pt-2 sm:ml-64">
       <div className="grid w-full grid-cols-1 ">
        {tags.map(t => (

        <>
          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 dark:border-gray-700 dark:bg-gray-800 xl:mb-0">
              
          {/* Chat */}
          
          <form className="overflow-y-auto lg:max-h-[60rem] 2xl:max-h-fit text-left mb-0">
            <article className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                     {/* Avatar user */}
                  <p className="inline-flex items-center mr-3 text-md font-semibold text-gray-900 dark:text-white">
                    <img
                      className="w-8 h-8 mr-2 rounded-full"
                      src={t.user_id.gender === "Female" ? femaleavatarImg : maleavatarImg}
                      alt="avatar"
                    />
                    {t.user_id.fullname}
                  </p>

                  {/* Created At */}
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <time pubdate dateTime="2022-02-08" title="February 8th, 2022">
                      {" "}
                      {formatDateTimeDislay(t.createdAt)}
                    </time>
                  </p>
                </div>

                {(today<new Date(t.start_dateOfTag) || today>new Date(t.end_dateOfTag))? (
                    ""
                ): (
                  <Link to={`/createIdea/${t._id}`} class="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:focus:ring-gray-600" type="button">
                    <HiPlusCircle size='1.7rem'/>
                  </Link>
                )}
               
              </div>

              {/* Subject tag/ tag name */}
              <Link to={`/ideasOfTag/${t._id}`} className="flex items-center justify-start flex-1 text-md text-green-500 font-semibold dark:text-green-500">
                <HiHashtag size='1.3rem'/> {t.subject}
              </Link>


              {/* content */}
              <p className="mb-2 text-gray-900 dark:text-white text-justify">
                {t.description}
              </p>
              <p className="mb-3 text-gray-900 dark:text-white">Looking forward to it! Thanks.</p>

              <div className='flex items-center justify-between'>

            
                  <p className="text-md text-green-500 font-semibold dark:text-green-500">
                      <time pubdate dateTime="2022-02-08" title="February 8th, 2022">
                        {" "}
                        Start Date: {formatDateTimeDislay(t.start_dateOfTag)}
                      </time>
                    </p>

              
                  <p className="text-md text-green-500 font-semibold dark:text-green-500">
                      <time pubdate dateTime="2022-02-08" title="February 8th, 2022">
                        {" "}
                        End Date: {formatDateTimeDislay(t.end_dateOfTag)}
                      </time>
                    </p>
            

                
                  <p className="text-md text-green-500 font-semibold dark:text-green-500">
                      <time pubdate dateTime="2022-02-08" title="February 8th, 2022">
                        {" "}
                        End Date for Discussion: {formatDateTimeDislay(t.end_dateOfIdea)}
                      </time>
                    </p>
             
              
              </div>

            </article>
          </form>

        </div>

        <div className="my-1"></div>
        </>
        ))}
        
          </div>
       </div>
       </div>
    </NavbarSidebarLayout>
);
};