const express = require("express");
const router  = express.Router();
const Campground = require("../models/campground")
const Comment = require("../models/comment")
const middleware = require("../middleware")

router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req,res){
  //Find campground by id
  Campground.findById(req.params.id, function(err, campground){
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", {campground: campground});
    };
  })
});

// CREATE Route
router.post("/campgrounds/:id/comments", function (req,res){
  //lookup campground using id
  Campground.findById(req.params.id, function(err, campground){
    if (err) {
      console.log(err);
      redirect("/campgrounds")
    } else {
      //Create new comment when there is no error
      Comment.create(req.body.comment, function(err, comment){
        if (err) {
          req.flash("error", "Something went wrong.")
          console.log(err);
        } else {
          //Connect created comment to CampGroun
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          campground.comments.push(comment)
          campground.save();
          console.log(comment);
          //req.success("success","Successfully added comment")
          res.redirect('/campgrounds/' + campground._id);
        }
      });
    };
  });
});

//EDIT Route
router.get("/campgrounds/:id/comments/:comment_id/edit",middleware.checkCommentOwnership, function(req,res){
  Comment.findById(req.params.comment_id, function(err,foundComment){
    if (err) {
      res.redirect("back")
    } else {
      res.render("comments/edit",{campground_id:req.params.id, comment: foundComment});
    }
  });
});

//UPDATE Route
router.put("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership, function(req,res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if (err) {
      res.redirect("back")
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//Destroy Route

router.delete("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership , function(req,res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if (err) {
     res.redirect("back"); 
    } else {
      req.flash("success", "Comment is removed")
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});


module.exports = router;
