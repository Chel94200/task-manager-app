import { Router } from 'express';
import prisma from '../prismaClient.js';
import bcrypt from 'bcrypt';

const router = Router();

// -------------------
// REGISTER NEW USER
// -------------------
router.post('/', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // 1️⃣ Check if username or email already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ username }, { email }],
            },
        });

        if (existingUser) {
            return res
                .status(400)
                .json({ error: 'Username or email already exists' });
        }

        // 2️⃣ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3️⃣ Validate role and default to 'USER'
        let userRole = 'USER'; // default
        if (role && ['USER', 'ADMIN'].includes(role.toUpperCase())) {
            userRole = role.toUpperCase();
        }

        // 4️⃣ Create user
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role: userRole,
            },
        });

        // 5️⃣ Respond WITHOUT password
        res.status(201).json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// -------------------
// LOGIN USER
// -------------------
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ error: 'Email and password are required' });
        }

        // Find user by email
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Respond WITHOUT password
        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// -------------------
// GET ALL USERS
// -------------------
router.get('/', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            include: { tasks: true },
        });
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
