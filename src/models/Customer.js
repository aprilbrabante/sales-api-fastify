const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const CustomerSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        enum: ["customer", "admin"], 
        default: "customer" 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Hash password before save
CustomerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

// Method to compare passwords
CustomerSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Customer", CustomerSchema)