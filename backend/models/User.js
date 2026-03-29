
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone:{type:String, required:true},
    password: { type: String, required: true },
    status: { type: String, enum: ['active', 'suspended', 'inactive'], default: 'active' },
    role: { type: String, enum: ['admin', 'staff'], default: 'staff' },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);
