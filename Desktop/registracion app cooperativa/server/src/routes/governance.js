const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');

// Multer Storage for Docs
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `doc-${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage });

// Get Official Documents
router.get('/documents', async (req, res) => {
    try {
        const docs = db.getDocuments();
        res.json(docs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Upload Official Document (Admin)
router.post('/documents', upload.single('document'), async (req, res) => {
    try {
        // Assume auth middleware checked role='admin'
        const { title } = req.body;
        const uploadedBy = 1; // Mock Admin ID

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const fileUrl = `/uploads/${req.file.filename}`;
        const fileSize = `${(req.file.size / 1024 / 1024).toFixed(1)} MB`; // Simple Mock Size format

        const newDoc = db.addDocument({
            title: title || req.file.originalname,
            filename: req.file.originalname,
            url: fileUrl,
            size: fileSize,
            uploaded_by: uploadedBy
        });

        res.json(newDoc);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete Document (Admin)
router.delete('/documents/:id', async (req, res) => {
    try {
        const { id } = req.params;
        db.deleteDocument(id);
        res.json({ message: 'Document deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Cast Vote
router.post('/vote', async (req, res) => {
    try {
        const { userId, option, note } = req.body;

        try {
            db.vote({
                user_id: parseInt(userId),
                poll_id: 'presupuesto_2024',
                vote_option: option,
                note
            });
            res.json({ message: 'Voto registrado exitosamente' });
        } catch (e) {
            return res.status(400).json({ message: e.message });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get Live Vote Stats
router.get('/stats', async (req, res) => {
    try {
        const stats = db.getVoteStats('presupuesto_2024');
        res.json(stats);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
