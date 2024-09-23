const express = require('express');
const router = express.Router();
const ideaController = require('../controllers/idea.controller');
const Idea = require('../models/Idea');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage'); 
const crypto = require('crypto');
const conn = mongoose.connection;



// Khởi tạo GridFS
let gfs;
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads'); // Tên của collection lưu trữ files
   
});

// Cấu hình multer storage engine
const storage = new GridFsStorage({
  url: "mongodb+srv://group1940:19401940@cluster0.txsa0qr.mongodb.net/IdeaSystem?retryWrites=true&w=majority", // Đường dẫn tới MongoDB Atlas
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        // const filename = buf.toString('hex') + path.extname(file.originalname);
        const filename = file.originalname;
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads' // Tên của collection lưu trữ files
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });


// Xử lý request POST /ideas
router.post('/', upload.array('files'), async (req, res) => {
    try {
        const { tag_id, user_id, title, content, isAnonymity } = req.body;
        const fileIds = req.files.map(file => file.id);
    
        const newIdea = new Idea({
          tag_id: tag_id,
          user_id: user_id,
          title: title,
          content: content,
          isAnonymity: isAnonymity,
          fileIds: fileIds
        });
    
        await newIdea.save();
        res.status(200).json({ message: 'Idea saved successfully' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    
  });


// GET /ideas
router.get('/',ideaController.getIdeas);

router.get('/profile/:id', ideaController.getIdeasByUserID);

router.get('/getMostPopularIdeas',ideaController.getMostPopularIdeas);

router.get('/getMostViewIdeas',ideaController.getMostViewIdeas);

router.get('/getLastIdeas',ideaController.getLastestIdeas);




router.get('/files/download/:fileId', async (req, res) => {

  const file = await gfs.files.findOne({ _id: new mongoose.Types.ObjectId(req.params.fileId) });
  console.log(file);
  
  if (!file) {
    return res.status(404).send('File not found');
  } 

  try {
    const bucket = new mongoose.mongo.GridFSBucket(conn.db,{
      bucketName: 'uploads'
    });
    const downloadStream = bucket.openDownloadStreamByName(file.filename);
    
    downloadStream.pipe(res);
  }
  catch (e) {
    console.error(e);
  }
    
});




router.get('/:id', async (req, res) => {
  const idea = await Idea.findById(req.params.id).populate('user_id', 'fullname').populate('tag_id', 'subject');

  // increate view time
  // idea.view_time +=1;
  await idea.save();

  const fileIds = idea.fileIds;

  const files = await Promise.all(
    fileIds.map(async (fileId) => {
      const file = await gfs.files.find({ _id: fileId }).toArray();
      return file[0]; // Assuming fileIDs are unique, so we expect only one file for each ID
    })
  );

  const ideaDetail = {
    _id: idea._id,
    title: idea.title,
    tag_id: idea.tag_id._id,
    tag_name: idea.tag_id.subject,
    content: idea.content,
    createdAt: formatDateTimeDislay(idea.createdAt),
    user_id: idea.user_id._id, // Lấy _id của user từ User Model
    user_name: idea.user_id.fullname, // Lấy user_name từ User Model
    isAnonymity: idea.isAnonymity,
    files: files,
    like: idea.like,
    dislike: idea.dislike,
  };

  res.json (ideaDetail);

    
});

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

// PUT /ideas/:id
router.put('/:id', upload.array('files'), async (req, res) => {
  try {
    const existIdea = await Idea.findById(req.params.id);
    if (!existIdea) {
      return res.status(404).json({ message: 'Idea not found' });
    }
    
      const { title, content, isAnonymity, restFileIds } = req.body;
      const newFileIds = req.files.map(file => file.id);
      console.log("Rest file ids: "+restFileIds);
      console.log("New file ids: "+newFileIds);
      var existFileIds = existIdea.fileIds || [];
      if (restFileIds.length < existFileIds.length){
        // delete exist files
        const fileIdsNotInRest = existFileIds.filter(fileId => !restFileIds.includes(fileId));
        await Promise.all(
          fileIdsNotInRest.map(async (notRestId) => {
            try {
              const file = await gfs.files.findOne({ _id: notRestId});
        
              conn.db.collection('uploads.files').findOneAndDelete({ _id: file._id }, (err, result) => {
                if (err) {
                  console.error(err);
                  return;
                }
            
                if (!result.value) {
                  console.error('File not found');
                  return;
                }
            
                conn.db.collection('uploads.chunks').deleteMany({ files_id: file._id }, (err) => {
                  if (err) {
                    console.error(err);
                    return;
                  }
            
                  console.log('File deleted successfully');
                });
              });
    
            } catch (error) {
              console.error(`Error deleting file with ID ${notRestId}:`, error);
            }
          })
        );
        existFileIds = restFileIds;
      } 
      

      if (newFileIds.length > 0){
        existFileIds = [...existFileIds, ...newFileIds];
      }
      

      

      existIdea.title = title;
      existIdea.content = content;
      existIdea.isAnonymity = isAnonymity;
       existIdea.fileIds = existFileIds;
    
      

      await existIdea.save();
      res.status(200).json({ message: 'Idea saved successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  
});

// DELETE /users/:id
router.delete('/:id', async (req, res) => {
  try {
    const existingIdea = await Idea.findById(req.params.id);

    const existFileIds = existingIdea.fileIds; // Filter out undefined or null values
   
    await Promise.all(
      existFileIds.map(async (existFileId) => {
        try {
          const file = await gfs.files.findOne({ _id: existFileId });
    
          conn.db.collection('uploads.files').findOneAndDelete({ _id: file._id }, (err, result) => {
            if (err) {
              console.error(err);
              return;
            }
        
            if (!result.value) {
              console.error('File not found');
              return;
            }
        
            conn.db.collection('uploads.chunks').deleteMany({ files_id: file._id }, (err) => {
              if (err) {
                console.error(err);
                return;
              }
        
              console.log('File deleted successfully');
            });
          });

        } catch (error) {
          console.error(`Error deleting file with ID ${existFileId}:`, error);
        }
      })
    );

    await Idea.findByIdAndDelete(req.params.id);

    if (!existingIdea) {
        return res.status(404).json({ message: 'Idea not found' });
    }

    res.json({ message: 'Idea deleted' });
} catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
}
});

router.put('/updateViewTime/:id', async (req, res) => {
  const findIdea = await Idea.findById(req.params.id);
  findIdea.view_time = findIdea.view_time +1;
  findIdea.save();
  res.json(findIdea);
})

module.exports = router;