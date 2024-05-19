const router = require('express').Router();
const { Category, Product } = require('../../models');


  // find all categories
  // be sure to include its associated Products


// GET route to fetch all categories including associated products
router.get('/', async (req, res) => {
  try {
// Fetch all categories with associated products, ordered by category ID
      const categoryData = await Category.findAll({
          include: [{ model: Product }],
          order: [['id', 'ASC']]
      });
// Respond with the retrieved categories
      res.status(200).json(categoryData);
// Log the error and respond with a 500 status code
  } catch (err) {
      res.status(500).json(err);
  }
});


  // find one category by its `id` value
  // be sure to include its associated Products


// For request to /api/categories/id, GET route to get a single category (including associated products).
router.get('/:id', async (req, res) => {
  try {
      const categoryData = await Category.findByPk(req.params.id, {
          include: [{ model: Product }]
      });

      if (!categoryData) {
          res.status(404).json({ message: 'No category found with this id.' });
          return;
      }

      res.status(200).json(categoryData);

  } catch (err) {
      res.status(500).json(err);
  }
});

router.post('/', (req, res) => {
  // create a new category
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;
