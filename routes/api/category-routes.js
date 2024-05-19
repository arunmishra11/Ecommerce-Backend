const router = require('express').Router();
const { Category, Product } = require('../../models');

// GET route to fetch all categories including associated products
router.get('/', async (req, res) => {
    try {
        const categoryData = await Category.findAll({
            include: [{ model: Product }],
            order: [['id', 'ASC']]
        });
        res.status(200).json(categoryData);
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).json(err);
    }
});

// GET route to fetch a single category by its `id`, including associated products
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
        console.error('Error fetching category:', err);
        res.status(500).json(err);
    }
});

// POST route to create a new category with a provided category_name
router.post('/', async (req, res) => {
    try {
        const newCategory = await Category.create(req.body);
        res.status(201).json(newCategory); // Use 201 status code for resource creation
    } catch (err) {
        console.error('Error creating category:', err);
        res.status(400).json(err);
    }
});

// PUT route to update a category by its `id` value, including associated products
router.put('/:id', async (req, res) => {
    try {
        const updatedCategory = await Category.update(req.body, {
            where: { id: req.params.id }
        });

        if (updatedCategory[0] === 0) {
            res.status(404).json({ message: 'No category found with this id.' });
            return;
        }

        if (req.body.productIds && req.body.productIds.length) {
            const categoryProducts = await Category.findAll({
                where: { category_id: req.params.id }
            });

            const existingProductIds = categoryProducts.map(({ product_id }) => product_id);
            const newProductIds = req.body.productIds
                .filter(product_id => !existingProductIds.includes(product_id))
                .map(product_id => ({
                    category_id: req.params.id,
                    product_id,
                }));

            const productIdsToRemove = existingProductIds
                .filter(product_id => !req.body.productIds.includes(product_id));

            await Category.destroy({ where: { id: productIdsToRemove } });
            await Category.bulkCreate(newProductIds);
        }

        res.json(`Number of rows updated: ${updatedCategory}`);
    } catch (err) {
        console.error('Error updating category:', err);
        res.status(400).json(err);
    }
});

// DELETE route to delete a category by its `id` value
router.delete('/:id', async (req, res) => {
    try {
        const categoryData = await Category.destroy({
            where: { id: req.params.id }
        });

        if (!categoryData) {
            res.status(404).json({ message: 'No category found with this id.' });
            return;
        }

        res.status(200).json(`Number of rows deleted: ${categoryData}`);
    } catch (err) {
        console.error('Error deleting category:', err);
        res.status(500).json(err);
    }
});

module.exports = router;
