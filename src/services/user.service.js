const { User, Note } = require('../models');
const { NotFoundError, ValidationError } = require('../utils/errors');

class UserService {
  async getUserProfile(userId) {
    const user = await User.findByPk(userId, {
      attributes: ['id', 'username', 'email', 'fullName', 'createdAt'],  // Updated attributes
      include: [
        {
          model: Note,
          as: 'sharedNotes',
          attributes: ['id', 'title', 'createdAt'],
          through: { attributes: [] }
        }
      ]
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  async updateUserProfile(userId, updateData) {
    const user = await User.findByPk(userId);
    
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Prevent updating email to an existing one
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await User.findOne({ where: { email: updateData.email } });
      if (existingUser) {
        throw new ValidationError('Email already in use');
      }
    }

    return user.update(updateData);
  }

  // Change this method
  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findByPk(userId);
    
    if (!user) {
      throw new NotFoundError('User not found');
    }
  
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new ValidationError('Current password is incorrect');
    }
  
    // Update password - this will trigger the beforeUpdate hook
    await user.update({ password: newPassword });
  
    return { success: true };
  }
}

module.exports = new UserService();