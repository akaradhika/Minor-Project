const express = require('express');
const app = express();
const PORT = process.env.PORT || 5001;
const mongoose=require('mongoose')
const path=require('path')
const cors=require('cors')
const cookieparser=require('cookie-parser')
const expressSession=require('express-session')
const { connectToDB } = require('./database/connection')
const User = require('./models/userModel');
const upload = require('./config/multer-config');


connectToDB()


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret:"MANIT"
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));


app.get('/', (req, res) => {
    res.send('Hello, World!');
});
app.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        } else {
            const newUser = new User({ name, email, password });
            await newUser.save();
            res.status(200).json({ message: 'Signup successful',newUser});
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        return res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/upload-files', upload.array('images', 10), async (req, res) => {
    try {
        const userId = req.query.userId; // Get user ID from query parameters
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Add each image buffer to the user's arts array
        req.files.forEach(file => {
            user.arts.push(file.buffer);
        });

        await user.save(); // Save the user with the updated arts array
        res.status(200).json({ message: 'Files uploaded and saved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/fetchusers',async(req,res)=>{
    try {
        const users = await User.find();
        return res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

app.get('/profile/:userid', async (req, res) => {
    try {
        const userId = req.params.userid; // Get user ID from route parameters
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(user); // Return the user data
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.post('/collaboration/:id', async (req, res) => {
    try {
        const userId = req.params.id; // Get user ID from route parameters
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Assuming the collaboration information is sent in the request body
        const { collaboratorId, collaboratorName, collaboratorGoal, collaboratorMessage } = req.body;

        // Add the collaboration information to the user's collaborations array
        user.collaborations.push({
            collaboratorId,
            collaboratorName,
            collaboratorGoal,
            collaboratorMessage,
            collaboratorStatus: false
        });

        await user.save(); // Save the user with the updated collaborations array
        res.status(200).json({ message: 'Collaboration information saved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/accept/:requestid', async (req, res) => {
    try {
        const requestId = req.params.requestid;
        const collab = await User.findById(requestId);

        if (!collab) {
            return res.status(404).json({ message: 'Collaboration request not found' });
        }

       
        res.status(200).json({ message: 'Collaboration request accepted successfully',collab });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/accept/:id', async (req, res) => {
    const { id } = req.params;
    const { collaboratorStatus } = req.body;
  
    try {
      
      const updatedCollaboration = await User.findByIdAndUpdate(
        id,
        { collaboratorStatus: collaboratorStatus },
        { new: true }
      );
  
      if (!updatedCollaboration) {
        return res.status(404).json({ message: 'Collaboration not found' });
      }
  
      res.status(200).json(updatedCollaboration);
    } catch (error) {
      console.error('Error updating collaboration:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });





app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
