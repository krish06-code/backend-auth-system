const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/miniproject')
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

const userSchema = mongoose.Schema({
    username: String,
    name: String,
    password: String,
    email: String,
    age: Number,
    posts: [
        {type: mongoose.Schema.Types.ObjectId,
            ref: "post"

        }
    ]
})

module.exports = mongoose.model('user',userSchema)