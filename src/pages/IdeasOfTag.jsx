import {
    HiHashtag
  } from "react-icons/hi";
  import NavbarSidebarLayout from "../layout/NavBar-SideBar";
  import { useParams, Link } from "react-router-dom";
  import { getIdeasByTagId, getIdeasByUserId, updateViewTime } from "../api/apiService";
  import { useState, useEffect } from "react";
  import femaleavatarImg from "../assets/img/femaleavatar.jpg"
  import maleavatarImg from "../assets/img/maleavatar.jpg"
  
  export default function IdeasOfTag() {
  
    const { tagId } = useParams();
  
    const [idea, setIdea] = useState([]);
     
  
    useEffect(() => {
     getIdeasByTagId(tagId)
       .then(res => {
         setIdea(res.data);
       })
       .catch(error => {
         console.error("Error getting idea:", error);
       });
   }, []);
  
   const handLeViewIdea = async (ideaId) => {
    await updateViewTime(ideaId).then((res) => {
      window.location.href = `/viewIdea/${ideaId}`; 
    });
    
  }
  
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
            {/* Idea */}
            <div className="grid w-full grid-cols-1 ">
  
  {idea.map(i => (
    <>
              <div className="my-1"></div>
              <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 dark:border-gray-700 dark:bg-gray-800 xl:mb-0">
                
                {/* One short idea */}
                <form className="overflow-y-auto lg:max-h-[60rem] 2xl:max-h-fit text-left">
                  <article className="mb-5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        {/* Avatar user */}
                        <p className="inline-flex items-center mr-3 text-md font-semibold text-gray-900 dark:text-white"><img className="w-8 h-8 mr-2 rounded-full" src={i.user_id.gender === "Female" ? femaleavatarImg : maleavatarImg} alt="avatar" />{i.user_id.fullname}</p>
                        {/* Created At */}
                        <p className="text-sm text-gray-600 dark:text-gray-400"><time pubdate dateTime="2022-02-08" title="February 8th, 2022"> {formatDateTimeDislay(i.createdAt)}</time></p>
                      </div>                    
                    </div>
  
                      {/* Subject tag/ tag name */}
                    <div className="flex items-center justify-start flex-1 text-md text-green-500 font-semibold dark:text-green-500">
                      <HiHashtag size='1.3rem'/> {i.tag_id.subject}
                    </div>
  
                    {/* Title of idea */}
                    <p className="mb-3 text-gray-900 font-semibold dark:text-white">{i.title}</p>
  
                  
                    {/* Short content */}
                    <p className="mb-2 text-gray-900 dark:text-white text-justify">
                      {i.content}
                    </p>
                    
                    {/* Call id */}
                    <a onClick={handLeViewIdea.bind(null, i._id)} className="inline-flex items-center text-xs font-medium text-primary-700 sm:text-sm dark:text-primary-500">
                      Read more ...
                    </a>
                 
                    
                  </article>
                </form>
  
              </div>
              </>
  ))}
              
  
  
  
              
            </div>
          </div>
          </div>
      </NavbarSidebarLayout>
  );
  };