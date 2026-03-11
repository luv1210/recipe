const express = require('express');
const {getRecipes,getRecipe,createRecipe,updateRecipe,deleteRecipe,getMyRecipes} = require('../controllers/recipeController');

const {getComments,addComment} = require('../controllers/commentController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

// Recipe routes
router
  .route('/')
  .get(getRecipes)
  .post(protect, createRecipe);

router.get('/myrecipes', protect, getMyRecipes);

router
  .route('/:id')
  .get(getRecipe)
  .put(protect, updateRecipe)
  .delete(protect, deleteRecipe);

// Nested comment routes for recipes
router
  .route('/:recipeId/comments')
  .get(getComments)
  .post(protect, addComment);

module.exports = router;
