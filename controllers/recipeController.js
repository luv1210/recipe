const Recipe = require('../models/Recipe');
const User = require('../models/User');


exports.getRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.find().populate({
      path: 'user',
      select: 'username'
    });

    res.status(200).json({
      success: true,
      count: recipes.length,
      data: recipes
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};


exports.getRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate({
      path: 'user',
      select: 'username'
    });

    if (!recipe) {
      return res.status(404).json({ success: false, error: 'Recipe not found' });
    }

    res.status(200).json({
      success: true,
      data: recipe
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Create new recipe
// @route   POST /api/v1/recipes
// @access  Private
exports.createRecipe = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    const recipe = await Recipe.create(req.body);

    // Update user's recipes array
    await User.findByIdAndUpdate(req.user.id, {
      $push: { recipes: recipe._id }
    });

    res.status(201).json({
      success: true,
      data: recipe
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update recipe
// @route   PUT /api/v1/recipes/:id
// @access  Private
exports.updateRecipe = async (req, res, next) => {
  try {
    let recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ success: false, error: 'Recipe not found' });
    }

    // Make sure user is recipe owner or admin
    if (recipe.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, error: 'User not authorized to update this recipe' });
    }

    recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: recipe
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete recipe
// @route   DELETE /api/v1/recipes/:id
// @access  Private
exports.deleteRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ success: false, error: 'Recipe not found' });
    }

    // Make sure user is recipe owner or admin
    if (recipe.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, error: 'User not authorized to delete this recipe' });
    }

    await recipe.deleteOne();

    // Remove recipe from user's recipes array
    await User.findByIdAndUpdate(recipe.user, {
      $pull: { recipes: recipe._id }
    });

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get user-specific recipes
// @route   GET /api/v1/recipes/myrecipes
// @access  Private
exports.getMyRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.find({ user: req.user.id });

    res.status(200).json({
      success: true,
      count: recipes.length,
      data: recipes
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
