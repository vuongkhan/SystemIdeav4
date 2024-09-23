import React, { useRef, useState, useEffect } from 'react';
import {
  HiGlobe,
  HiKey,
  HiTag
} from "react-icons/hi";
import NavbarSidebarLayout from "../layout/NavBar-SideBar";
import { createIdea, getUserInfoById, postNotification } from '../api/apiService';
import { useParams } from "react-router-dom";
import { getOneTag } from '../api/apiService';
import { decodeJwt } from '../api/jwtDecode';
import femaleavatarImg from "../assets/img/femaleavatar.jpg"
import maleavatarImg from "../assets/img/maleavatar.jpg"



export default function CreateIdea() {

  const { id } = useParams();
  console.log("tag id: "+id)

  const [tag, setTag] = useState(null);

  const [userInfo, setUserInfo] = useState(null);
  useEffect(() => {
    getUserInfoById(decodeJwt().userId)
    .then(res => {
      console.log(res.data);
      setUserInfo(res.data);

    })
    .catch(error => {
      console.error("Error getting user:", error);
    });
  }, []);
  
    

   useEffect(() => {
    getOneTag(id)
      .then(res => {
        console.log("Tag SUBJECT: "+res.data.subject);
        setTag(res.data);

      })
      .catch(error => {
        console.error("Error getting tag:", error);
      });
  }, []);


  const titleRef = useRef();
  const contentRef = useRef();

  



  const [files, setFiles] = useState([]);

  function handleFileUpload(e) {
    const file = e.target.files[0];
    setFiles([...files, file]);
  }

  const handleDeleteNewFileClick = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const [isGlobal, setIsGlobal] = useState(true);

  const handleClick = () => {
    setIsGlobal(!isGlobal);
  };



  const handleSubmit = async (event) => {
    event.preventDefault();
    const tagId = id;
    const userId = decodeJwt().userId; // lay tu token
    const title = titleRef.current.value;
    const content = contentRef.current.value;
    let isAnonymity = isGlobal ? false : true;
    
    const formData = new FormData();
    formData.append('tag_id', tagId);
    formData.append('user_id', userId);
    formData.append('title', title);
    formData.append('content', content);
    formData.append('isAnonymity', isAnonymity);

    // Append each file to formData
    files.forEach((file) => {
      formData.append('files', file);
    });

    try {
      await createIdea(formData)
        .then(async res => {
          console.log("new idea id: "+res.data._id)
          await postNotification("643684b3931cfa456a37aafe",decodeJwt().userId, res.data._id,"Post")
        })
        .catch(error => {
          console.error("Error getting tag:", error);
        });
      
      window.location.href = `/Profile/${userId}`; 
    }
    catch (error) {
      throw new Error(error);
    }
    
  }
  

return (
    <NavbarSidebarLayout>
      <div className="relative w-full h-full overfloe-y-auto lg:ml-64">
        <div className="px-4 pt-2 ">
            <div className="grid w-full grid-cols-1 ">
              <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 dark:border-gray-700 dark:bg-gray-800 xl:mb-0">
                

                {/* Form create idea */}
               {tag ?
                <form onSubmit={handleSubmit} className="overflow-y-auto lg:max-h-[60rem] 2xl:max-h-fit text-left">
                  <article className="mb-5">

                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                          {/* Avatar user */}
                        {userInfo ? (<p className="inline-flex items-center mr-3 text-md font-semibold text-gray-900 dark:text-white">
                          <img
                            className="w-8 h-8 mr-2 rounded-full"
                            src={userInfo.gender === "Female" ? femaleavatarImg : maleavatarImg}
                            alt="avatar"
                          />
                          {userInfo.fullname}
                        </p>): ""} 
                        


                          {/* Public mode or anyos */}
                      
                          <button id="globalButton"  onClick={handleClick} class="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:focus:ring-gray-600" type="button">
                              {isGlobal ? <HiGlobe size="1.3rem" /> : <HiKey size="1.3rem" />}
                          </button>
                        
                      </div>
                    </div>

                    {/* Subject tag/ tag name */}
                    <div className="flex items-center justify-start flex-1 text-md text-green-500 font-semibold dark:text-green-500 mb-6">
                      <HiTag size='1.3rem'/> {tag.subject}
                    </div>

                    {/* Title of idea */}
                    <p className="mb-3 text-gray-900 font-semibold dark:text-white">Title of idea</p>


                      <textarea
                      id="chat"
                      rows={1}
                      className="block mr-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      ref={titleRef}
                      data-gramm="false"
                      wt-ignore-input="true"
                      defaultValue={""}
                      />

                      {/* Content of idea */}
                    <p className="mb-3 text-gray-900 font-semibold dark:text-white mt-6">Content of idea</p>


                      <textarea
                      id="chat"
                      rows={10}
                      className="block mr-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      ref={contentRef}
                      data-gramm="false"
                      wt-ignore-input="true"
                      defaultValue={""}
                      />



                      <div class="flex items-center justify-center mt-5 mb-5">
                          <label class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                              <svg class="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M14 3a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2h8zm-1.41 2L10 9.41 7.41 7.01 6 8.42l3 3 3-3-1.41-1.41zM6 14v2h8v-2H6z"/></svg>
                              <span class="mt-2 text-base leading-normal" onClick={() => document.querySelector('input[type=file]')}>Select file</span>
                              <input type='file' class="hidden" onChange={handleFileUpload}/>
                          </label>
                      </div>


                  
                    <div className="items-center space-x-4 flex flex-wrap">
                      {/* Display upload file in the interface */}
                      {/* Item */}

                      {files.map((file, index) => (

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
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{file.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{file.type.split('/')[1]}, {file.size} MB</p>
                        </div>
                     
                        <button
                        onClick={handleDeleteNewFileClick.bind(null, index)}
                        className="relative top-0 right-0 transform translate-x-1/2 -translate-y-5 bg-red-400 text-white rounded-full w-5 h-5 flex items-center justify-center"
                        >
                            X
                        </button>
                      </div>
                      
                      ))}
                    </div>

                      {/* Check box terms and conditions */}
                    <div class="flex items-center mt-5">
                      <input type="checkbox" className="form-checkbox h-5 w-5 bg-primary-800" checked />
                      

                      <lable className="flex items-center ml-1 font-semibold text-gray-900 dark:text-white">Agree with Terms and Conditions
                        <button data-popover-target="popover-description" data-popover-placement="bottom-end" type="button"><svg className="w-4 h-4 ml-2 text-gray-400 hover:text-gray-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg><span className="sr-only">Show information</span></button>
                      </lable>
                      <div data-popover id="popover-description" role="tooltip" className="absolute z-10 invisible inline-block text-sm font-light text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 w-72 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400" data-popper-placement="bottom-end" style={{position: 'absolute', inset: '0px 0px auto auto', margin: '0px', transform: 'translate(-343px, 81px)'}}>
                        <div className="p-3 space-y-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">Terms and Conditions</h3>
                          <p>By checking this box you agreed with our Terms and Conditions</p>
                          <a href="/privacy" className="flex items-center font-medium text-primary-600 dark:text-primary-500 dark:hover:text-primary-600 hover:text-primary-700">Read more <svg className="w-4 h-4 ml-1" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg></a>
                        </div>
                        <div data-popper-arrow style={{position: 'absolute', left: '0px', transform: 'translate(271px, 0px)'}} />
                      </div>
                  </div>
                    

                    <div class="h-0 flex justify-center items-center border border-gray-300 rounded-lg mb-8 mt-5"></div>


                    {/* Button Post */}
                  <div className='flex items-center justify-center mt-5'>
                      <button type="submit" className="inline-flex items-center py-2.5 px-10 text-xs font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                          <span className="text-base leading-normal">Post</span>
                      </button>
                  </div>
                  
                    </article>
                      
                    
                </form> : ""}
                




              </div>
            </div>
        </div>
      </div>
    </NavbarSidebarLayout>
);
};