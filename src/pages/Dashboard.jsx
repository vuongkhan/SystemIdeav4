import NavbarSidebarLayout from "../layout/NavBar-SideBar";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { getOneUser, getTotalIdeasOfDepartment, getTotalIdeasTodayOfDepartment, getTotalUsersOfDepartment, getUsers, getUsersByDepartment } from "../api/apiService";
import { makeStyles } from '@mui/styles';
import { decodeJwt } from "../api/jwtDecode";



export default function Dashboard() {
  const [userInfo, setUserInfo] = useState(null);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalIdeas, setTotalIdeas] = useState(0);
  const [totalIdeasToday, setTotalIdeasToday] = useState(0);

  useEffect(() => {
    getOneUser(decodeJwt().userId)
      .then(res => {
        setUserInfo(res.data);
        getUsersByDepartment(res.data.department).then(res => {
          setUsers(res.data);
        });
        getTotalUsersOfDepartment(res.data.department).then(res => {
          setTotalUsers(res.data.total);
        });
        getTotalIdeasOfDepartment(res.data.department).then(res => {
          setTotalIdeas(res.data.total);
        });
        getTotalIdeasTodayOfDepartment(res.data.department).then(res => {
          setTotalIdeasToday(res.data.total);
        });
 
      })
      .catch(error => {
        console.error("Error getting idea:", error);
      });
  }, []);

  console.log(userInfo)

 
 

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

  const columns = [
  
    { field: 'email', headerName: 'Email', flex: 1, sortable: true, align: 'left', headerAlign: 'left' },
    { field: 'fullname', headerName: 'Fullname', flex: 1, sortable: true, align: 'left', headerAlign: 'left' },
    { field: 'gender', headerName: 'Gender', flex: 1, sortable: true, align: 'center', headerAlign: 'center' },
    { field: 'department', headerName: 'Department', flex: 1, sortable: true, align: 'center', headerAlign: 'center' },
    { field: 'permission', headerName: 'Permission', flex: 1, sortable: true, align: 'center', headerAlign: 'center' },
    { 
      field: 'createdAt', 
      headerName: 'Created At', 
      flex: 1, 
      sortable: true, 
      align: 'right', 
      headerAlign: 'right',
      renderCell: (params) => {
      let createdAt = formatDateTimeDislay(params.row.createdAt);
      return (
          <p>
              {createdAt}
          </p>
      );
      },
    },    
   
  ];

  

  const rows = users.map((item) => {
   
    return {
      id: item._id,
      email: item.email,
      fullname: item.fullname,
      gender: item.gender,
      department: item.department,
      permission: item.permission,
      createdAt: item.createdAt,
    };
  });

  


return (
    <NavbarSidebarLayout>
      <div className="relative w-full h-full overfloe-y-auto">
      <div className="px-4 pt-2 sm:ml-64">

          {/* Top commnet category */}
          <div className="grid w-full grid-cols-1 gap-4 mt-4 xl:grid-cols-3 2xl:grid-cols-3">
            <div className="items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:flex dark:border-gray-700 sm:p-6 dark:bg-gray-800">
              <div className="w-full">
                <h3 className="text-base font-normal text-gray-500 dark:text-gray-400">Users</h3>
                <span className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">{totalUsers}</span>
                <p className="flex items-center text-base font-normal text-gray-500 dark:text-gray-400">
                  <span className="flex items-center mr-1.5 text-sm text-green-500 dark:text-green-400">
                    staffs
                  </span>
                </p>
              </div>
            </div>
            <div className="items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:flex dark:border-gray-700 sm:p-6 dark:bg-gray-800">
              <div className="w-full">
                <h3 className="text-base font-normal text-gray-500 dark:text-gray-400">Contribution</h3>
                <span className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">{totalIdeas}</span>
                <p className="flex items-center text-base font-normal text-gray-500 dark:text-gray-400">
                  <span className="flex items-center mr-1.5 text-sm text-green-500 dark:text-green-400">
                    ideas
                  </span>
                </p>
              </div>
            </div>
            <div className="items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:flex dark:border-gray-700 sm:p-6 dark:bg-gray-800">
              <div className="w-full">
                <h3 className="text-base font-normal text-gray-500 dark:text-gray-400">Today's Ideas</h3>
                <span className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">{totalIdeasToday}</span>
                <p className="flex items-center text-base font-normal text-gray-500 dark:text-gray-400">
                  <span className="flex items-center mr-1.5 text-sm text-green-500 dark:text-green-400">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path clipRule="evenodd" fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" />
                    </svg>
                    ideas
                  </span>
                </p>
              </div>
            </div>
          
          </div>

          
          {/* Idea */}
          <div className="grid w-full grid-cols-1 my-4 ">
            <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 dark:border-gray-700 dark:bg-gray-800 xl:mb-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">User List</h3>
              </div>
              {/* Chat */}
              
              <div style={{ width: '100%'}}>
              <DataGrid 
                autoHeight 
                rows={rows} 
                columns={columns}
                slots={{ toolbar: GridToolbar }}
                disableColumnSelector
                disableDensitySelector
                initialState={{
                  pagination: {paginationModel: {pageSize: 10}},
                }}
                getRowHeight={() => 'auto'} 
                pageSizeOptions={[10, 25, 50]} />
              </div>

            </div>
          </div>
        </div>
        </div>
    </NavbarSidebarLayout>
);
};