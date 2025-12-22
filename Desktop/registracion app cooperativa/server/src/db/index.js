const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/db.json');

// Helper to read DB
const readDb = () => {
    if (!fs.existsSync(DB_PATH)) {
        return { users: [], official_documents: [], votes: [], transactions: [] };
    }
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
};

// Helper to write DB
const writeDb = (data) => {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

module.exports = {
    // Users
    createUser: (userData) => {
        const db = readDb();
        const newUser = {
            id: db.users.length + 1,
            ...userData,
            created_at: new Date().toISOString()
        };
        db.users.push(newUser);
        writeDb(db);
        return newUser;
    },
    getUserById: (id) => {
        const db = readDb();
        return db.users.find(u => u.id === parseInt(id));
    },
    getUserByEmail: (email) => {
        const db = readDb();
        return db.users.find(u => u.email === email);
    },
    updateUserAvatar: (id, avatarUrl) => {
        const db = readDb();
        const user = db.users.find(u => u.id === parseInt(id));
        if (user) {
            user.profile_image = avatarUrl;
            writeDb(db);
        }
        return user;
    },

    // Governance Documents
    getDocuments: () => {
        const db = readDb();
        return db.official_documents || [];
    },
    addDocument: (docData) => {
        const db = readDb();
        const newDoc = {
            id: (db.official_documents.length || 0) + 1,
            ...docData,
            uploaded_at: new Date().toISOString()
        };
        if (!db.official_documents) db.official_documents = [];
        db.official_documents.push(newDoc);
        writeDb(db);
        return newDoc;
    },
    deleteDocument: (id) => {
        const db = readDb();
        if (db.official_documents) {
            db.official_documents = db.official_documents.filter(d => d.id !== parseInt(id));
            writeDb(db);
        }
    },

    // Votes
    vote: (voteData) => {
        const db = readDb();
        if (!db.votes) db.votes = [];

        // NOTE: Duplication check removed for demo - allows multiple votes
        // const exists = db.votes.find(v => v.user_id === voteData.user_id && v.poll_id === voteData.poll_id);
        // if (exists) throw new Error('User already voted');

        const newVote = {
            id: db.votes.length + 1,
            ...voteData,
            timestamp: new Date().toISOString()
        };
        db.votes.push(newVote);
        writeDb(db);
        return newVote;
    },
    getVoteStats: (pollId) => {
        const db = readDb();
        const votes = db.votes ? db.votes.filter(v => v.poll_id === pollId) : [];
        const stats = { favor: 0, contra: 0, abstencion: 0, total: 0 };
        votes.forEach(v => {
            if (stats[v.vote_option] !== undefined) {
                stats[v.vote_option]++;
                stats.total++;
            }
        });
        return stats;
    },

    // Dashboard
    getTransactions: (userId) => {
        const db = readDb();
        return db.transactions ? db.transactions.filter(t => t.user_id === parseInt(userId)) : [];
    }
};
