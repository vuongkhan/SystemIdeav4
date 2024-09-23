const Idea = require('../models/Idea');
const Grid = require("gridfs-stream");
const mongoose = require("mongoose");




// Get all ideas
const getIdeas = async (req, res) => {
    try {
        const ideas = await Idea.find().sort({ createdAt: -1 }).populate('user_id', 'fullname').populate('tag_id', 'subject');
        const shortIdeas = ideas.map(idea => {
            return {
              _id: idea._id,
              title: idea.title,
              tag_name: idea.tag_id.subject,
              content: getShortContent(idea.content),
              createdAt: formatDateTimeDislay(idea.createdAt),
              user_id: idea.user_id._id, // Lấy _id của user từ User Model
              user_name: idea.user_id.fullname // Lấy user_name từ User Model
            };
          });

          res.status(200).json(shortIdeas);
      
       
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get ideas by UserID
const getIdeasByUserID = async (req, res) => {
    try {
        const userID = req.params.id;
        const ideas = await Idea.find({user_id:userID}).sort({ createdAt: -1 }).populate('user_id', 'fullname').populate('tag_id', 'subject');
        const shortIdeas = ideas.map(idea => {
            return {
              _id: idea._id,
              title: idea.title,
              tag_name: idea.tag_id.subject,
              content: getShortContent(idea.content),
              createdAt: formatDateTimeDislay(idea.createdAt),
              user_id: idea.user_id._id, // Lấy _id của user từ User Model
              user_name: idea.user_id.fullname // Lấy user_name từ User Model
            };
          });

          res.status(200).json(shortIdeas);
      
       
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

function getShortContent(text) {
    var maxLength = Math.ceil(text.length * 2 / 3);
    var truncatedText = text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    return truncatedText;
}


// Get one idea
const getOneIdea = async (req, res) => {};

// Create new idea
const createIdea = async (req, res) => {}

// Update idea
const updateIdea = async (req, res) => {};

// Delete idea by ID
const deleteIdea = async (req, res) => {};

// Get Most Popular Ideas
const getMostPopularIdeas = async (req, res) => {
    try {
        // Lấy tất cả các Idea từ database và populate user_id để lấy thông tin của User Model
        const ideas = await Idea.find().populate('user_id', 'fullname');
    
        // Tính điểm (like - dislike) cho mỗi Idea
        const ideasWithScores = ideas.map(idea => {
          return {
            _id: idea._id,
            like: idea.like,
            dislike: idea.dislike,
            title: idea.title,
            createdAt: formatDateTimeDislay(idea.createdAt),
            user_id: idea.user_id._id, // Lấy _id của user từ User Model
            user_name: idea.user_id.fullname // Lấy user_name từ User Model
          };
        });
    
        // Sắp xếp mảng ideasWithScores theo điểm giảm dần
        ideasWithScores.sort((a, b) => (b.like - b.dislike) - (a.like - a.dislike));
    
        // Giới hạn danh sách ideasWithScores thành 6 phần tử
        const mostPopularIdeas = ideasWithScores.slice(0, 6);
    
        // Trả về danh sách 6 Idea phổ biến nhất kèm theo thông tin user_name
        res.status(200).json(mostPopularIdeas);
      } catch (error) {
        // Xử lý lỗi nếu có
        res.status(500).json({ error: 'Error' });
      }

};

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

// Get Most Viewed Ideas
const getMostViewIdeas = async (req, res) => {
    try {
        const ideas = await Idea.find().populate('user_id', 'fullname'); 
    
        const mostViewedIdeas = ideas.map(idea => {
            return {
                _id: idea._id,
                view_time: idea.view_time,
                title: idea.title,
                createdAt: formatDateTimeDislay(idea.createdAt),
                user_id: idea.user_id._id,
                user_name: idea.user_id.fullname
            }
        });

        mostViewedIdeas.sort((a, b) => b.view_time - a.view_time);

        const mostViewIdeas = mostViewedIdeas.slice(0, 6);

        res.status(200).json(mostViewIdeas);
      } catch (error) {
        // Xử lý lỗi nếu có
        res.status(500).json({ error: 'Error' });
      }
  };

// Get Latest Ideas
const getLastestIdeas = async (req, res) => {
    try {
        
        const ideas = await Idea.find().sort({ createdAt: -1 }).limit(6).populate('user_id', 'fullname');
    
        const lastdIdeas = ideas.map(idea => {
            return {
                _id: idea._id,
                title: idea.title,
                createdAt: formatDateTimeDislay(idea.createdAt),
                user_id: idea.user_id._id,
                user_name: idea.user_id.fullname
            }
        });

        res.status(200).json(lastdIdeas);
      } catch (error) {
        // Xử lý lỗi nếu có
        res.status(500).json({ error: 'Error' });
      }
};

// Get total ideas of each department
const getTotalIdeasOfEachDepartment = async (req, res) => {};

// Get percentage ideas of each department
const getPercentageIdeasOfEachDepartment = async (req, res) => {}

module.exports={
    getIdeas: getIdeas,
    getOneIdea: getOneIdea,
    createIdea: createIdea,
    updateIdea: updateIdea,
    deleteIdea: deleteIdea,
    getMostPopularIdeas: getMostPopularIdeas,
    getMostViewIdeas: getMostViewIdeas,
    getLastestIdeas: getLastestIdeas,
    getIdeasByUserID: getIdeasByUserID,
}