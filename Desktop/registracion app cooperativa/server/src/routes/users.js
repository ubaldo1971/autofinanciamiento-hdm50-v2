const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { generateMemberId } = require('../utils/idGenerator');
const { hashPassword, comparePassword, generateToken, generateVerificationCode } = require('../utils/auth');
const {
    isValidCURP,
    isValidEmail,
    isValidPhone,
    isValidCLABE,
    isValidPassword,
    normalizePhone,
    isDocumentValid
} = require('../utils/validators');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

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

/**
 * POST /api/users/register-ine
 * Register with INE - ENHANCED WITH SECURITY
 */
router.post('/register-ine', async (req, res) => {
    try {
        const {
            // Document data
            fullName,
            curp,
            address,
            claveElector,
            fechaNacimiento,
            seccion,
            images,

            // NEW: Contact data
            email,
            phone,
            password,

            // NEW: Bank data
            clabe,
            bankName,

            // NEW: Emergency contact
            emergencyContactName,
            emergencyContactPhone,
            emergencyContactRelation,

            // NEW: Cooperativa selection
            cooperativa_id,
            cooperativa_name
        } = req.body;

        console.log('📥 Registro INE recibido:', { fullName, curp, email, phone });

        // ===== VALIDATIONS =====

        // Required fields
        if (!fullName) {
            return res.status(400).json({
                success: false,
                message: 'Nombre completo es obligatorio'
            });
        }

        if (!email || !phone || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email, teléfono y contraseña son obligatorios'
            });
        }

        // Validate CURP format
        if (curp && !isValidCURP(curp)) {
            return res.status(400).json({
                success: false,
                message: 'Formato de CURP inválido'
            });
        }

        // Validate email
        if (!isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Formato de email inválido'
            });
        }

        // Validate phone
        if (!isValidPhone(phone)) {
            return res.status(400).json({
                success: false,
                message: 'Formato de teléfono inválido (10 dígitos)'
            });
        }

        // Validate password strength
        if (!isValidPassword(password)) {
            return res.status(400).json({
                success: false,
                message: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número'
            });
        }

        // Validate CLABE if provided
        if (clabe && !isValidCLABE(clabe)) {
            return res.status(400).json({
                success: false,
                message: 'Formato de CLABE inválido (18 dígitos)'
            });
        }

        // ===== CHECK FOR DUPLICATES =====

        const existingByCURP = db.getUserByCURP(curp);
        if (existingByCURP) {
            return res.status(400).json({
                success: false,
                message: 'Este CURP ya está registrado'
            });
        }

        const existingByEmail = db.getUserByEmail(email);
        if (existingByEmail) {
            return res.status(400).json({
                success: false,
                message: 'Este email ya está registrado'
            });
        }

        const normalizedPhone = normalizePhone(phone);
        const existingByPhone = db.getUserByPhone(normalizedPhone);
        if (existingByPhone) {
            return res.status(400).json({
                success: false,
                message: 'Este teléfono ya está registrado'
            });
        }

        // ===== GENERATE MEMBER ID =====

        let memberId;
        if (curp && curp.length === 18) {
            memberId = curp;
        } else if (fullName) {
            const nameParts = fullName.split(' ');
            const firstName = nameParts[0] || 'SOCIO';
            const lastName = nameParts.slice(1).join(' ') || 'RAITE';
            const birthDate = fechaNacimiento
                ? fechaNacimiento.split('/').reverse().join('-')
                : new Date().toISOString().split('T')[0];
            memberId = generateMemberId(firstName, lastName, birthDate);
        } else {
            memberId = `RAITE${Date.now()}`;
        }

        // ===== HASH PASSWORD =====

        const passwordHash = await hashPassword(password);

        // ===== PARSE BIRTH DATE =====

        let birthDateISO = null;
        if (fechaNacimiento) {
            const parts = fechaNacimiento.split('/');
            if (parts.length === 3) {
                birthDateISO = `${parts[2]}-${parts[1]}-${parts[0]}`;
            }
        }

        // ===== SAVE IMAGES =====

        const uploadsDir = path.join(__dirname, '../../uploads/ine');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const timestamp = Date.now();
        let frontPath = null;
        let backPath = null;
        let selfiePath = null;

        if (images?.front) {
            const frontData = images.front.replace(/^data:image\/\w+;base64,/, '');
            const frontFilename = `${memberId}_front_${timestamp}.jpg`;
            fs.writeFileSync(path.join(uploadsDir, frontFilename), frontData, 'base64');
            frontPath = `/uploads/ine/${frontFilename}`;
        }

        if (images?.back) {
            const backData = images.back.replace(/^data:image\/\w+;base64,/, '');
            const backFilename = `${memberId}_back_${timestamp}.jpg`;
            fs.writeFileSync(path.join(uploadsDir, backFilename), backData, 'base64');
            backPath = `/uploads/ine/${backFilename}`;
        }

        if (images?.selfie) {
            const selfieData = images.selfie.replace(/^data:image\/\w+;base64,/, '');
            const selfieFilename = `${memberId}_selfie_${timestamp}.jpg`;
            fs.writeFileSync(path.join(uploadsDir, selfieFilename), selfieData, 'base64');
            selfiePath = `/uploads/ine/${selfieFilename}`;
        }

        console.log('📸 Imágenes guardadas:', { frontPath, backPath, selfiePath });

        // ===== CREATE USER =====

        const newUser = db.createUser({
            // Basic info
            full_name: fullName || '',
            email,
            phone: normalizedPhone,
            password_hash: passwordHash,
            birth_date: birthDateISO,
            member_id: memberId,
            role: 'member',
            profile_image: selfiePath || 'https://via.placeholder.com/150',

            // INE specific fields
            curp: curp || '',
            address: address || '',
            clave_elector: claveElector || '',
            seccion: seccion || '',
            ine_verified: false, // Will be verified by admin
            ine_front_image: frontPath,
            ine_back_image: backPath,
            selfie_image: selfiePath,
            document_type: 'ine',

            // NEW: Bank info
            clabe: clabe || '',
            bank_name: bankName || '',

            // NEW: Emergency contact
            emergency_contact_name: emergencyContactName || '',
            emergency_contact_phone: emergencyContactPhone || '',
            emergency_contact_relation: emergencyContactRelation || '',

            // NEW: Cooperativa
            cooperativa_id: cooperativa_id || null,
            cooperativa_name: cooperativa_name || '',

            // NEW: Status and verification
            status: 'pending', // pending -> approved -> active
            email_verified: false,
            phone_verified: false,

            // Balance
            balance: 0
        });

        console.log('✅ Usuario registrado:', newUser.member_id);

        // ===== GENERATE VERIFICATION CODES =====

        const emailCode = generateVerificationCode();
        const phoneCode = generateVerificationCode();

        db.addVerificationCode(newUser.id, emailCode, 'email');
        db.addVerificationCode(newUser.id, phoneCode, 'phone');

        console.log('📧 Código de verificación email:', emailCode);
        console.log('📱 Código de verificación SMS:', phoneCode);

        // TODO: Send actual email and SMS
        // For now, return codes in response (IN PRODUCTION, DON'T DO THIS!)

        // ===== GENERATE JWT TOKEN =====

        const token = generateToken(newUser.id, newUser.email);

        // Remove sensitive data from response
        const userResponse = { ...newUser };
        delete userResponse.password_hash;

        res.status(201).json({
            success: true,
            user: userResponse,
            token,
            message: 'Registro exitoso. Por favor verifica tu email y teléfono.',
            // TEMPORARY: Include codes for development
            verification: {
                emailCode,
                phoneCode
            }
        });
    } catch (err) {
        console.error('❌ Error en registro INE:', err);
        res.status(500).json({
            success: false,
            message: 'Error del servidor',
            error: err.message
        });
    }
});

/**
 * POST /api/users/register-license
 * Register with Driver's License - ENHANCED WITH SECURITY
 */
router.post('/register-license', async (req, res) => {
    try {
        const {
            fullName, curp, licenseNumber, licenseType, vigencia, fechaNacimiento, address, images,
            email, phone, password, clabe, bankName,
            emergencyContactName, emergencyContactPhone, emergencyContactRelation
        } = req.body;

        console.log('🚗 Registro con licencia:', { fullName, curp, licenseNumber, email, phone });

        // ===== VALIDATIONS =====

        if (!fullName || !licenseNumber) {
            return res.status(400).json({
                success: false,
                message: 'Nombre y número de licencia son obligatorios'
            });
        }

        if (!email || !phone || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email, teléfono y contraseña son obligatorios'
            });
        }

        if (curp && !isValidCURP(curp)) {
            return res.status(400).json({
                success: false,
                message: 'Formato de CURP inválido'
            });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Formato de email inválido'
            });
        }

        if (!isValidPhone(phone)) {
            return res.status(400).json({
                success: false,
                message: 'Formato de teléfono inválido'
            });
        }

        if (!isValidPassword(password)) {
            return res.status(400).json({
                success: false,
                message: 'La contraseña debe tener al menos 8 caracteres, con mayúscula, minúscula y número'
            });
        }

        if (clabe && !isValidCLABE(clabe)) {
            return res.status(400).json({
                success: false,
                message: 'Formato de CLABE inválido'
            });
        }

        // Check if license is expired
        if (vigencia && !isDocumentValid(vigencia)) {
            return res.status(400).json({
                success: false,
                message: 'La licencia de manejo está vencida'
            });
        }

        // ===== CHECK DUPLICATES =====

        const existingByCURP = db.getUserByCURP(curp);
        if (existingByCURP) {
            return res.status(400).json({
                success: false,
                message: 'Este CURP ya está registrado'
            });
        }

        const existingByEmail = db.getUserByEmail(email);
        if (existingByEmail) {
            return res.status(400).json({
                success: false,
                message: 'Este email ya está registrado'
            });
        }

        const normalizedPhone = normalizePhone(phone);
        const existingByPhone = db.getUserByPhone(normalizedPhone);
        if (existingByPhone) {
            return res.status(400).json({
                success: false,
                message: 'Este teléfono ya está registrado'
            });
        }

        // ===== GENERATE MEMBER ID =====

        const memberId = curp || `LIC${Date.now()}`;

        // ===== PARSE BIRTH DATE =====

        let birthDateISO = fechaNacimiento || '';
        if (!birthDateISO && curp && curp.length >= 10) {
            const year = curp.substring(4, 6);
            const month = curp.substring(6, 8);
            const day = curp.substring(8, 10);
            const fullYear = parseInt(year) > 50 ? `19${year}` : `20${year}`;
            birthDateISO = `${fullYear}-${month}-${day}`;
        }

        // ===== HASH PASSWORD =====

        const passwordHash = await hashPassword(password);

        // ===== SAVE IMAGES =====

        let frontPath = null;
        let backPath = null;
        let selfiePath = null;

        if (images) {
            const timestamp = Date.now();
            const licenseDir = path.join(__dirname, '../../uploads/license');

            if (!fs.existsSync(licenseDir)) {
                fs.mkdirSync(licenseDir, { recursive: true });
            }

            if (images.front) {
                const frontBase64 = images.front.replace(/^data:image\/\w+;base64,/, '');
                const frontFilename = `${memberId}_front_${timestamp}.jpg`;
                fs.writeFileSync(path.join(licenseDir, frontFilename), Buffer.from(frontBase64, 'base64'));
                frontPath = `/uploads/license/${frontFilename}`;
            }

            if (images.back) {
                const backBase64 = images.back.replace(/^data:image\/\w+;base64,/, '');
                const backFilename = `${memberId}_back_${timestamp}.jpg`;
                fs.writeFileSync(path.join(licenseDir, backFilename), Buffer.from(backBase64, 'base64'));
                backPath = `/uploads/license/${backFilename}`;
            }

            if (images.selfie) {
                const selfieBase64 = images.selfie.replace(/^data:image\/\w+;base64,/, '');
                const selfieFilename = `${memberId}_selfie_${timestamp}.jpg`;
                fs.writeFileSync(path.join(licenseDir, selfieFilename), Buffer.from(selfieBase64, 'base64'));
                selfiePath = `/uploads/license/${selfieFilename}`;
            }
        }

        console.log('📸 Imágenes de licencia guardadas:', { frontPath, backPath, selfiePath });

        // ===== CREATE USER =====

        const newUser = db.createUser({
            full_name: fullName || '',
            email,
            phone: normalizedPhone,
            password_hash: passwordHash,
            birth_date: birthDateISO,
            member_id: memberId,
            role: 'member',
            profile_image: selfiePath || 'https://via.placeholder.com/150',

            // License specific fields
            curp: curp || '',
            address: address || '',
            license_number: licenseNumber || '',
            license_type: licenseType || '',
            license_vigencia: vigencia || '',
            document_type: 'license',
            license_verified: false,
            ine_front_image: frontPath,
            ine_back_image: backPath,
            selfie_image: selfiePath,

            // Bank info
            clabe: clabe || '',
            bank_name: bankName || '',

            // Emergency contact
            emergency_contact_name: emergencyContactName || '',
            emergency_contact_phone: emergencyContactPhone || '',
            emergency_contact_relation: emergencyContactRelation || '',

            // Status
            status: 'pending',
            email_verified: false,
            phone_verified: false,
            balance: 0
        });

        console.log('✅ Usuario con licencia registrado:', newUser.member_id);

        // ===== VERIFICATION CODES =====

        const emailCode = generateVerificationCode();
        const phoneCode = generateVerificationCode();

        db.addVerificationCode(newUser.id, emailCode, 'email');
        db.addVerificationCode(newUser.id, phoneCode, 'phone');

        console.log('📧 Código email:', emailCode);
        console.log('📱 Código SMS:', phoneCode);

        // ===== GENERATE TOKEN =====

        const token = generateToken(newUser.id, newUser.email);

        const userResponse = { ...newUser };
        delete userResponse.password_hash;

        res.status(201).json({
            success: true,
            user: userResponse,
            token,
            message: 'Registro con licencia exitoso',
            verification: {
                emailCode,
                phoneCode
            }
        });
    } catch (err) {
        console.error('❌ Error en registro con licencia:', err);
        res.status(500).json({
            success: false,
            message: 'Error del servidor',
            error: err.message
        });
    }
});

/**
 * POST /api/users/login
 * Login with email/phone and password
 */
router.post('/login', async (req, res) => {
    try {
        const { identifier, emailOrPhone, password } = req.body; // Accept both parameter names
        const loginIdentifier = identifier || emailOrPhone; // Use whichever is provided

        if (!loginIdentifier || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email/teléfono y contraseña son requeridos'
            });
        }

        // Try to find user by email or phone
        let user = db.getUserByEmail(loginIdentifier);

        if (!user) {
            const normalizedPhone = normalizePhone(loginIdentifier);
            user = db.getUserByPhone(normalizedPhone);
        }

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Check password
        const isPasswordValid = await comparePassword(password, user.password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Check if account is active
        if (user.status === 'rejected') {
            return res.status(403).json({
                success: false,
                message: 'Tu cuenta ha sido rechazada. Contacta al administrador.'
            });
        }

        if (user.status === 'suspended') {
            return res.status(403).json({
                success: false,
                message: 'Tu cuenta está suspendida. Contacta al administrador.'
            });
        }

        // Generate token
        const token = generateToken(user.id, user.email);

        // Remove password from response
        const userResponse = { ...user };
        delete userResponse.password_hash;

        res.json({
            success: true,
            user: userResponse,
            token,
            message: 'Login exitoso'
        });

    } catch (err) {
        console.error('❌ Error en login:', err);
        res.status(500).json({
            success: false,
            message: 'Error del servidor',
            error: err.message
        });
    }
});

/**
 * POST /api/users/verify-email
 * Verify email with code
 */
router.post('/verify-email', authenticateToken, async (req, res) => {
    try {
        const { code } = req.body;
        const userId = req.user.userId;

        if (!code) {
            return res.status(400).json({
                success: false,
                message: 'Código de verificación requerido'
            });
        }

        const verified = db.verifyCode(userId, code, 'email');

        if (!verified) {
            return res.status(400).json({
                success: false,
                message: 'Código inválido o expirado'
            });
        }

        // Update user
        db.updateUserVerification(userId, 'email_verified', true);

        res.json({
            success: true,
            message: 'Email verificado exitosamente'
        });

    } catch (err) {
        console.error('❌ Error verificando email:', err);
        res.status(500).json({
            success: false,
            message: 'Error del servidor',
            error: err.message
        });
    }
});

/**
 * POST /api/users/verify-phone
 * Verify phone with code
 */
router.post('/verify-phone', authenticateToken, async (req, res) => {
    try {
        const { code } = req.body;
        const userId = req.user.userId;

        if (!code) {
            return res.status(400).json({
                success: false,
                message: 'Código de verificación requerido'
            });
        }

        const verified = db.verifyCode(userId, code, 'phone');

        if (!verified) {
            return res.status(400).json({
                success: false,
                message: 'Código inválido o expirado'
            });
        }

        // Update user
        db.updateUserVerification(userId, 'phone_verified', true);

        res.json({
            success: true,
            message: 'Teléfono verificado exitosamente'
        });

    } catch (err) {
        console.error('❌ Error verificando teléfono:', err);
        res.status(500).json({
            success: false,
            message: 'Error del servidor',
            error: err.message
        });
    }
});

/**
 * GET /api/users/me
 * Get current user profile
 */
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = db.getUserById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        const userResponse = { ...user };
        delete userResponse.password_hash;

        res.json({
            success: true,
            user: userResponse
        });

    } catch (err) {
        console.error('❌ Error obteniendo perfil:', err);
        res.status(500).json({
            success: false,
            message: 'Error del servidor',
            error: err.message
        });
    }
});

// Get User Profile (existing endpoint)
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = db.getUserById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove password
        const userResponse = { ...user };
        delete userResponse.password_hash;

        res.json(userResponse);
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

        const updatedUser = db.updateUserAvatar(id, avatarUrl);
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Avatar updated', avatarUrl });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * GET /api/users/by-cooperativa/:cooperativaId
 * Get all users/drivers belonging to a specific cooperative
 */
router.get('/by-cooperativa/:cooperativaId', async (req, res) => {
    try {
        const { cooperativaId } = req.params;
        const users = db.getUsersByCooperativa(cooperativaId);

        // Remove sensitive data
        const safeUsers = users.map(u => {
            const user = { ...u };
            delete user.password_hash;
            return user;
        });

        res.json({
            success: true,
            count: safeUsers.length,
            users: safeUsers
        });
    } catch (err) {
        console.error('❌ Error getting users by cooperativa:', err);
        res.status(500).json({
            success: false,
            message: 'Error del servidor',
            error: err.message
        });
    }
});

/**
 * GET /api/users
 * Get all users (for admin panel)
 */
router.get('/', async (req, res) => {
    try {
        const users = db.getAllUsers();

        // Remove sensitive data
        const safeUsers = users.map(u => {
            const user = { ...u };
            delete user.password_hash;
            return user;
        });

        res.json({
            success: true,
            count: safeUsers.length,
            users: safeUsers
        });
    } catch (err) {
        console.error('❌ Error getting all users:', err);
        res.status(500).json({
            success: false,
            message: 'Error del servidor',
            error: err.message
        });
    }
});

/**
 * PUT /api/users/:id
 * Update user (for admin panel)
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedUser = db.updateUser(id, updates);

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        const userResponse = { ...updatedUser };
        delete userResponse.password_hash;

        res.json({
            success: true,
            user: userResponse,
            message: 'Usuario actualizado'
        });
    } catch (err) {
        console.error('❌ Error updating user:', err);
        res.status(500).json({
            success: false,
            message: 'Error del servidor',
            error: err.message
        });
    }
});

module.exports = router;
