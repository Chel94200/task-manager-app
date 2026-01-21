import { Router } from 'express';
import prisma from '../prismaClient.js';
const router = Router();
// Get all tasks
router.get('/', async (req, res) => {
    try {
        const { userId, role } = req.query;

        let whereClause = {};

        // USER → only own tasks
        if (role === 'USER') {
            whereClause = {
                ownerId: Number(userId),
            };
        }

        // ADMIN → all tasks (no filter)

        const tasks = await prisma.task.findMany({
            where: whereClause,
            include: { owner: true },
            orderBy: { createdAt: 'desc' },
        });

        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// Create a new task
router.post('/', async (req, res) => {
    const { text, ownerId } = req.body;
    if (!text || !ownerId) {
        return res.status(400).json({ error: 'text and ownerId are required' });
    }
    const task = await prisma.task.create({
        data: { text, ownerId },
        include: { owner: true },
    });
    res.status(201).json(task);
});
// Update a task
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { text, completed } = req.body;
    const task = await prisma.task.update({
        where: { id: Number(id) },
        data: { text, completed },
    });
    res.json(task);
});
// Delete a task
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await prisma.task.delete({ where: { id: Number(id) } });
    res.json({ message: 'Task deleted' });
});
export default router;
