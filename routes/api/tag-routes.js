const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// GET route to fetch all tags, including associated Product data
router.get('/', async (req, res) => {
  try {
    // Find all tags, including associated Product data
    const tagData = await Tag.findAll({
      include: [{ model: Product, through: ProductTag }],
      order: [['id', 'ASC']]
    });
    res.status(200).json(tagData);
  } catch (err) {
    console.error('Error fetching tags:', err);
    res.status(500).json(err);
  }
});

// GET route to fetch a single tag by its `id`, including associated Product data
router.get('/:id', async (req, res) => {
  try {
    // Find a single tag by its `id`, including associated Product data
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product, through: ProductTag }],
    });

    if (!tagData) {
      res.status(404).json({ message: 'No tag found with this id.' });
      return;
    }

    res.status(200).json(tagData);
  } catch (err) {
    console.error('Error fetching tag:', err);
    res.status(500).json(err);
  }
});

// POST route to create a new tag
router.post('/', (req, res) => {
  Tag.create(req.body)
    .then((tag) => {
      res.status(200).json(tag);
    })
    .catch((err) => {
      console.error('Error creating tag:', err);
      res.status(400).json(err);
    });
});

// PUT route to update a tag's name by its `id` value
router.put('/:id', (req, res) => {
  Tag.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((tag) => {
      return res.json(`Number of rows updated: ${JSON.stringify(tag)}`);
    })
    .catch((err) => {
      console.error('Error updating tag:', err);
      res.status(400).json(err);
    });
});

// DELETE route to delete a tag by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!tagData) {
      res.status(404).json({ message: 'No tag found with this id.' });
      return;
    }

    res.status(200).json(`Number of rows deleted: ${JSON.stringify(tagData)}`);
  } catch (err) {
    console.error('Error deleting tag:', err);
    res.status(500).json(err);
  }
});

module.exports = router;
