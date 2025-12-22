const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');

const { generateMemberId } = require('../utils/idGenerator');

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `avatar-${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage });

// Create User (Registration)
router.post('/', async (req, res) => {
    try {
        const { fullName, email, password, birthDate } = req.body;

        // Check existence
        const existing = await db.getUserByEmail(email);
        if (existing) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Simple name split for ID gen
        const nameParts = fullName.split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ');

        const memberId = generateMemberId(firstName, lastName, birthDate);

        const newUser = await db.createUser({
            full_name: fullName,
            email,
            password_hash: password, // In real app, hash this!
            birth_date: birthDate,
            member_id: memberId,
            role: 'member',
            profile_image: 'https://via.placeholder.com/150'
        });

        res.status(201).json(newUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Get User Profile
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await db.getUserById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Profile Image
router.post('/:id/avatar', upload.single('avatar'), async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const avatarUrl = `/uploads/${req.file.filename}`;

        const updatedUser = await db.updateUserAvatar(id, avatarUrl);
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Avatar updated', avatarUrl });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
