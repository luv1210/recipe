const Comment = require('../models/Comment');
const Recipe = require('../models/Recipe');


exports.getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ recipe: req.params.recipeId }).populate({
      path: 'user',
      select: 'username'
    });

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};


exports.addComment = async (req, res, next) => {
  try {
    req.body.recipe = req.params.recipeId;
    req.body.user = req.user.id;

    const recipe = await Recipe.findById(req.params.recipeId);

    if (!recipe) {
      return res.status(404).json({ success: false, error: 'Recipe not found' });
    }

    const comment = await Comment.create(req.body);

    res.status(201).json({
      success: true,
      data: comment
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};


exports.updateComment = async (req, res, next) => {
  try {
    let comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ success: false, error: 'Comment not found' });
    }

    // Make sure user is comment owner or admin
    if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, error: 'User not authorized to update this comment' });
    }

    comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: comment
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};


exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ success: false, error: 'Comment not found' });
    }

    // Make sure user is comment owner or admin
    if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, error: 'User not authorized to delete this comment' });
    }

    await comment.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
