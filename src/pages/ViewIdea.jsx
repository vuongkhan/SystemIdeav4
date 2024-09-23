import React, { useState, useEffect, useRef } from 'react';
import { AiFillDislike, AiFillLike, AiOutlineDislike, AiOutlineLike } from 'react-icons/ai';
import {
  HiGlobe,
  HiKey,
    HiHashtag
} from "react-icons/hi";
import NavbarSidebarLayout from "../layout/NavBar-SideBar";
import { createCommentOfIdea, deleteOneIdea, getCommentsOfIdea, getOneIdea, deleteOneComment, postEmotionOfIdeaIdByUserId, deleteEmotion, getEmotionByUserIdIdeaId, downloadFile } from '../api/apiService';
import { useParams, Link } from "react-router-dom";
import { decodeJwt } from '../api/jwtDecode';
import femaleavatarImg from "../assets/img/femaleavatar.jpg"
import maleavatarImg from "../assets/img/maleavatar.jpg"


export default function ViewIdea() {
  const today = new Date();
  const { id } = useParams();
  const replyContentRef = useRef();

   const [idea, setIdea] = useState(null);
   const [comments, setComments] = useState([]);

   const [isLiked, setIsLiked] = useState(false);
   const [isDisliked, setIsDisliked] = useState(false);

   const [likeCount, setLikeCount] = useState(0);
    const [dislikeCount, setDislikeCount] = useState(0);




    useEffect(() => {
      const fetchIdea = async () => {
        try {
          getOneIdea(id)
          .then(res => {
            setIdea(res.data);
          })
          .catch(error => {
            console.error("Error getting idea:", error);
          });
        } catch (error) {
          // Handle error if needed
        }
      };

      fetchIdea();
    }, []);


    useEffect(() => {
      if(idea) {
        setLikeCount(idea.idea.like);
        setDislikeCount(idea.idea.dislike);
      }
    }, [idea]);

    useEffect(() => {
      if(idea) {
        try {
          getEmotionByUserIdIdeaId(id, decodeJwt().userId)
          .then(res => {
            console.log(res.data.isLike)
            if (res.data.isLike === true) {
              setIsLiked(true);
              setIsDisliked(false);
            }
            if (res.data.isLike === false) {
              setIsDisliked(true);
              setIsLiked(false);
            }
          })
          .catch(error => {
            console.error("Error getting idea:", error);
          });
        } catch (error) {
          // Handle error if needed
        }
      }
    }, [idea]);

    let [isOpenIdeaSetting, setIsOpenIdeaSetting] = React.useState(false);


    const handleOpenIdeaSetting = () => {
      setIsOpenIdeaSetting(!isOpenIdeaSetting);
  };


    const fetchComment = async () => {
      try {
        getCommentsOfIdea(id)
        .then(res => {
          setComments(res.data);

        })
        .catch(error => {
          console.error("Error getting comments:", error);
        });
      } catch (error) {
        // Handle error if needed
      }
    };

    useEffect(() => {
      fetchComment();
    }, []);

    



    const handleLikeClick = async () => {
      if (isLiked) {
        setIsLiked(false);
        setIsDisliked(false);
        
        const resLikeCount = await deleteEmotion(id, decodeJwt().userId);
        setLikeCount(resLikeCount.data.like);
        setDislikeCount(resLikeCount.data.dislike);
        
      }
      else {
        setIsLiked(true);
        setIsDisliked(false);
      
        const resLikeCount = await postEmotionOfIdeaIdByUserId(id, decodeJwt().userId, true);
        
        setLikeCount(resLikeCount.data.like);
        setDislikeCount(resLikeCount.data.dislike);

        
      }
        
        
    };

    const handleDislikeClick = async () => {
      if (isDisliked) {
        setIsDisliked(false);
        setIsLiked(false);
        
        const resDisLikeCount = await deleteEmotion(id, decodeJwt().userId);
        
        setDislikeCount(resDisLikeCount.data.dislike);
        setLikeCount(resDisLikeCount.data.like);

      }
      else {
        setIsDisliked(true);
        setIsLiked(false);
        
        const resDisLikeCount = await postEmotionOfIdeaIdByUserId(id, decodeJwt().userId, false);
        setDislikeCount(resDisLikeCount.data.dislike);
        setLikeCount(resDisLikeCount.data.like);
      }
    };

    const handleRemoveIdea = async () => {
      await deleteOneIdea(id);
      window.location.href = `/profile/${idea.user_id}`; 
    }

    const handleDeleteCommentClick = async (cmtId) => {
      await deleteOneComment(cmtId);
      fetchComment();
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

    const [isGlobal, setIsGlobal] = useState(true);

    const handleClick = () => {
      setIsGlobal(!isGlobal);
    };


    const handleSubmit = async (event) => {
      event.preventDefault();
      const userId = decodeJwt().userId;
      const comment = replyContentRef.current.value;
      let isAnonymity = isGlobal ? false : true;


      const formCommentData = new FormData();
      formCommentData.append('user_id', userId);
      formCommentData.append('comment', comment);
      formCommentData.append('isAnonymous', isAnonymity);

      try {
        await createCommentOfIdea(id, formCommentData);
        replyContentRef.current.value = '';
        fetchComment();
      }
      catch(error){
        throw new Error(error);
      }
    };

    const handleDownloadFile = async (fileId) => {
      await downloadFile(fileId);
    };

return (
    <NavbarSidebarLayout>
      <div className="relative w-full h-full">
       <div className="px-4 pt-2 sm:ml-64">
        <div className="grid w-full grid-cols-1 ">
            <div className="p-4 mb-5 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 dark:border-gray-700 dark:bg-gray-800 xl:mb-0">
              
          {idea ? 
            <div className="overflow-y-auto 2xl:max-h-fit text-left">
                <article className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                         {/* Avatar user */}

                      <p className="inline-flex items-center mr-3 text-md font-semibold text-gray-900 dark:text-white">
                        <img className="w-8 h-8 mr-2 rounded-full" 
                        src={idea.idea.user_id.gender === "Female" ? femaleavatarImg : maleavatarImg} alt="avatar" />
                        {idea.isAnonymity ? "Anonymity User" : idea.idea.user_id.fullname}
                      </p>
                      {/* Created At */}
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <time pubdate dateTime="2022-02-08" title="February 8th, 2022">
                          {" "}
                          {formatDateTimeDislay(idea.idea.createdAt)}
                        </time>
                      </p>
                    </div>

                    {idea.idea.user_id._id === decodeJwt().userId && (
                      <>
                        <button onClick={handleOpenIdeaSetting} class="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:focus:ring-gray-600" type="button">
                            <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path>
                            </svg>
                            <span className="sr-only">Idea settings</span>
                        </button>

                        <div className={isOpenIdeaSetting ? "z-10  bg-white divide-y divide-gray-100 rounded shadow w-30 dark:bg-gray-700 dark:divide-gray-600 block" :  "z-10 hidden  bg-white divide-y divide-gray-100 rounded shadow w-30 dark:bg-gray-700 dark:divide-gray-600 block"} style={{position: 'fixed', top: "120px", right: "60px" }} data-popper-placement="top" >
                            <ul className="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconHorizontalButton">
                                <li>
                                    <Link to={`/editIdea/${id}`} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Edit</Link>
                                </li>
                                <li>
                                    <a href="#" onClick={handleRemoveIdea} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Remove</a>
                                </li>
                            </ul>
                        </div>
                      </>
                    )}
                    
                  </div>

                  {/* Subject tag/ tag name */}
                  <div className="flex items-center justify-start flex-1 text-md text-green-500 font-semibold dark:text-green-500">
                    <HiHashtag size='1.3rem'/> {idea.idea.tag_id.subject}
                  </div>

                  {/* Title of idea */}
                  <p className="mb-3 text-gray-900 font-semibold dark:text-white">{idea.idea.title}</p>


                  {/* content */}
                  <p className="mb-2 text-gray-900 dark:text-white text-justify">
                    {idea.idea.content}
                  </p>
                  <p className="mb-3 text-gray-900 dark:text-white">Looking forward to it! Thanks.</p>


                  <div className="items-center space-x-4 flex flex-wrap">
                    {/* Item */}
                    {idea.files.map(f => (
                    <div className="flex items-center p-3 mb-3.5 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center justify-center w-10 h-10 mr-3 rounded-lg bg-primary-100 dark:bg-primary-900">
                        <svg
                          className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true">
                          <path
                            clipRule="evenodd"
                            fillRule="evenodd"
                            d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z"
                          />
                          <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
                        </svg>
                      </div>
                      <div className="mr-4">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{f.filename}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{f.contentType.split('/')[1]}, {(f.length / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                      <div className="flex items-center ml-auto">
                        <button onClick={handleDownloadFile.bind(f._id)} type="button" className="p-2 rounded hover:bg-gray-100">
                          <svg
                            className="w-5 h-5 text-gray-500 dark:text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true">
                            <path
                              clipRule="evenodd"
                              fillRule="evenodd"
                              d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z"
                            />
                          </svg>
                          <span className="sr-only">Download</span>
                        </button>
                      </div>

                      
                    </div>
                    ))}
                    
                  </div>

                  <div className="flex justify-end items-center mb-2 space-x-2">
                    <button type="button" onClick={handleDislikeClick.bind()} className="py-1.5 px-3 inline-flex items-center rounded-lg bg-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 dark:bg-gray-700">
                       
                       {isDisliked ? <AiFillDislike size="2rem" style={{ color: "red" }} /> : <AiOutlineDislike size="2rem" />}
                      <span className="text-md font-medium text-gray-500 dark:text-gray-400 ml-1">{dislikeCount}</span>
                    </button>

                    <button type="button" onClick={handleLikeClick.bind(null)} className="py-1.5 px-3 inline-flex items-center rounded-lg bg-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 dark:bg-gray-700">
                    {isLiked ? <AiFillLike size="2rem" style={{ color: "blue" }} /> : <AiOutlineLike size="2rem" />}
                      <span className="text-md font-medium text-gray-500 dark:text-gray-400 ml-1">{likeCount}</span>
                    </button>
                  </div>

                  <div class="h-0 flex justify-center items-center border border-gray-300 rounded-lg mb-8"></div>



                {comments ? comments.map(cmt => (

                  <div>
                    <article className="pl-12 mb-5 my-1">
                    <footer className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        
                        <p className="inline-flex items-center mr-3 text-md font-semibold text-gray-900 dark:text-white">
                          <img className="w-8 h-8 mr-2 rounded-full" 
                          src={cmt.user_id.gender === "Female" ? femaleavatarImg : maleavatarImg} alt="avatar" />
                          {cmt.isAnonymity ? "Anonymity User" : cmt.user_id.fullname}
                        </p>

                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <time pubdate dateTime="2022-02-08" title="February 8th, 2022">
                            {" "}
                            {formatDateTimeDislay(cmt.createdAt)}
                          </time>
                        </p>
                      </div>

                      {/* Neu cmt do la cua minh thi cho nhan xoa */}

                      {cmt.user_id._id == decodeJwt().userId && (
                        <>
                          <button  data-dropdown-toggle="dropdownComment5" class="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:focus:ring-gray-600" type="button">
                              <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path>
                              </svg>
                              <span class="sr-only">Comment settings</span>
                          </button>

                          <div id="dropdownComment5" class="z-10 bg-white divide-y divide-gray-100 rounded shadow w-30 dark:bg-gray-700 dark:divide-gray-600 block" style={{position: 'absolute', inset: 'auto auto 0px 0px', margin: '0px', transform: 'translate3d(834px, -3987.5px, 0px)'}} data-popper-placement="top" data-popper-reference-hidden="" data-popper-escaped="">
                              <ul class="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconHorizontalButton">
                                  <li>
                                      <a onClick={handleDeleteCommentClick.bind(null, cmt._id)} class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Remove</a>
                                  </li>
                              </ul>
                          </div>
                       </>
                      )}
                      

                    </footer>

                    <p className="mb-0 text-gray-900 dark:text-white">
                      {cmt.comment}
                    </p>

                        
                    </article>

                    
                  </div>

                )) : ""}

  
                {/* Your comment */}
                {(today>new Date(idea.idea.tag_id.end_dateOfIdea)) ? "" : (
                  <>
                  <label htmlFor="chat" className="sr-only">
                  Your message
                </label>
                    <form onSubmit={handleSubmit} className="flex items-center mb-5">
                      <button id="globalButton"  onClick={handleClick} class="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:focus:ring-gray-600" type="button">
                          {isGlobal ? <HiGlobe size="1.3rem" /> : <HiKey size="1.3rem" />}
                      </button>
                      <textarea
                        id="chat"
                        rows={1}
                        ref={replyContentRef}
                        className="block mr-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Comment ..."
                        data-gramm="false"
                        wt-ignore-input="true"
                        defaultValue={""}
                      />
                      <button
                        type="submit"
                        className="inline-flex justify-center p-2 rounded-lg cursor-pointer text-primary-600 hover:bg-primary-100 dark:text-primary-500 dark:hover:bg-gray-600">
                        <svg
                          aria-hidden="true"
                          className="w-6 h-6 rotate-90"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg">
                          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                        <span className="sr-only">Send message</span>
                      </button>
                    </form>
                  </>
                )}
                
                   
                    


                    
                    
                    
                    


                </article>
              </div>
        : ""}
           
              




            </div>
          </div>
       </div>
       </div>
    </NavbarSidebarLayout>
);
};