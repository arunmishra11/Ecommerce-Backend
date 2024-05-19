const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// GET route to fetch all products, including associated Category and Tag data
router.get('/', async (req, res) => {
  try {
    // Find all products, including associated Category and Tag data
    const productData = await Product.findAll({
      include: [{ model: Category }, { model: Tag }],
      order: [['id', 'ASC']]
    });
    res.status(200).json(productData);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json(err);
  }
});

// GET route to fetch one product by its `id`, including associated Category and Tag data
router.get('/:id', async (req, res) => {
  try {
    // Find a single product by its `id`, including associated Category and Tag data
    const productData = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag, through: ProductTag }]
    });

    if (!productData) {
      res.status(404).json({ message: 'No product found with this id.' });
      return;
    }

    res.status(200).json(productData);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json(err);
  }
});

// POST route to create a new product
router.post('/', async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);

    // If there are product tags, create pairings to bulk create in the ProductTag model
    if (req.body.tagIds && req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map(tag_id => ({
        product_id: newProduct.id,
        tag_id,
      }));
      await ProductTag.bulkCreate(productTagIdArr);
    }

    res.status(201).json(newProduct); // Use 201 status code for resource creation
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(400).json(err);
  }
});

// PUT route to update a product by its `id`
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await Product.update(req.body, {
      where: { id: req.params.id }
    });

    if (updated === 0) {
      res.status(404).json({ message: 'No product found with this id.' });
      return;
    }

    if (req.body.tagIds && req.body.tagIds.length) {
      // Fetch all productTags associated with this product
      const productTags = await ProductTag.findAll({
        where: { product_id: req.params.id }
      });

      // Create filtered list of new tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      const newProductTags = req.body.tagIds
        .filter(tag_id => !productTagIds.includes(tag_id))
        .map(tag_id => ({
          product_id: req.params.id,
          tag_id,
        }));

      // Figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // Run both actions
      await Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    }

    res.status(200).json({ message: 'Product updated successfully.' });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(400).json(err);
  }
});

// DELETE route to delete a product by its `id`
router.delete('/:id', async (req, res) => {
  try {
    const productData = await Product.destroy({
      where: { id: req.params.id }
    });

    if (!productData) {
      res.status(404).json({ message: 'No product found with this id.' });
      return;
    }

    res.status(200).json({ message: 'Product deleted successfully.', deletedRows: productData });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json(err);
  }
});

module.exports = router;
