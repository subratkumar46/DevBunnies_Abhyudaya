
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const http = require('http').createServer(app)


const PORT = process.env.PORT || 3000

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

// const bcrypt = require("bcrypt");
// const saltRounds = 10;




app.use('*/css', express.static('public/css'));
app.use('*/images', express.static('public/images'));
app.use('*/js', express.static('public/js'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/abhyudayaDB");

const studentSchema = new mongoose.Schema({
    name:String,
    email: String,
    password: String,
    secret:String
});

studentSchema.plugin(passportLocalMongoose);

const Student = new mongoose.model("Student", studentSchema);

passport.use(Student.createStrategy());
passport.serializeUser(Student.serializeUser());
passport.deserializeUser(Student.deserializeUser());

app.get("/", function (req, res) {
    res.render("index");
});
app.get("/about", function (req, res) {
    res.render("about");
});
app.get("/login", function (req, res) {
    res.render("login");
});
app.get("/course", function (req, res) {
    res.render("course");
});
app.get("/class7", function (req, res) {
    res.render("class7th");
});
app.get("/class6", function (req, res) {
    res.render("class6th");
});
app.get("/register", function (req, res) {
    res.render("login");
});
app.get("/contact", function (req, res) {
    res.render("contact");
});
app.get("/submit", function (req, res) {
    if (req.isAuthenticated()){
        res.render("submit");
      } else {
        res.redirect("/login");
      }
});
app.get("/logout", function (req, res) {
    req.logout(function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect("course");
        }
    });
});
app.get("/community", function (req, res) {
    if (req.isAuthenticated()){
        res.render("community");
      } else {
        res.redirect("/login");
      }
    // Student.find({"secret":{$ne:null}},function(err,foundStudent){
    //     if(err){
    //         console.log(err);
    //     }else{
    //         if(foundStudent){
    //             res.render("community",{studentsWithSecrets:foundStudent});
    //         }
    //     }
    // });
});


app.post("/register", function (req, res) {

    Student.register({name:req.body.personName,username:req.body.username},req.body.password,function(err,student){
        if(err){
            console.log(err);
            res.redirect("/register");
        }else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/community");
            });
        }
    });

    // bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    //     const newStudent = new Student({
    //         email: req.body.username,
    //         password: hash
    //     });
    //     newStudent.save(function (err) {
    //         if (err) {
    //             console.log(err);
    //         } else {
    //             res.render("community");
    //         }
    //     });
    // });

});
app.post("/login", function (req, res) {

    const student = new Student({
    username : req.body.username,
    password : req.body.password
    });

    req.login(student, function(err){
        if(err){
            console.log(err);
        }else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/community");
            });
        }
    });

    // Student.findOne({ email: username }, function (err, foundStudent) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         if (foundStudent) {
    //             bcrypt.compare(password, foundStudent.password, function (err, result) {
    //                 if (result === true) {
    //                     res.render("community");
    //                 }
    //             });
    //         }
    //     }
    // });
});

// app.post("/submit",function(req,res){
//     const submittedSecret = req.body.secret;

//     Student.findById(req.user.id , function(err,foundStudent){
//         if(err){
//             console.log(err)
//         }else{
//             if(foundStudent){
//                 foundStudent.secret=submittedSecret;
//                 foundStudent.save(function(){
//                     res.redirect("/community");
//                 });
//             }
//         }
//     })
// });

// Socket 
const io = require('socket.io')(http)

io.on('connection', (socket) => {
    console.log('Connected...')
    socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg)
    })

})

// app.listen(3000, function () {
//     console.log("Server started on post 3000. ");
// });