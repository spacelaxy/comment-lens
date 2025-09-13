/**
 * @function processUserData
 * @description Processes user data and returns formatted results
 * @param {Array} users - Array of user objects
 * @param {Object} options - Processing options
 * @param {boolean} options.validate - Whether to validate data
 * @param {string} options.format - Output format ('json' | 'xml')
 * @returns {Array} Processed user data
 * @example
 * const users = [{ id: 1, name: 'John' }];
 * const result = processUserData(users, { validate: true });
 * console.log(result);
 * @throws {Error} When validation fails
 * @since 1.0.0
 * @author John Doe
 */
function processUserData(users, options = {}) {
    if (!Array.isArray(users)) {
        throw new Error('Users must be an array');
    }
    
    const { validate = true, format = 'json' } = options;
    
    if (validate) {
        users.forEach((user, index) => {
            if (!user.id || !user.name) {
                throw new Error(`Invalid user at index ${index}`);
            }
        });
    }
    
    return users.map(user => ({
        id: user.id,
        name: user.name.toUpperCase(),
        email: user.email?.toLowerCase() || '',
        processedAt: new Date().toISOString()
    }));
}

/**
 * @class UserManager
 * @description Manages user operations and data
 * @example
 * const manager = new UserManager();
 * manager.addUser('John', 'john@example.com');
 */
class UserManager {
    constructor() {
        this.users = [];
        this.nextId = 1;
    }
    
    /**
     * @method addUser
     * @description Adds a new user to the manager
     * @param {string} name - User's name
     * @param {string} email - User's email address
     * @returns {Object} Created user object
     * @throws {Error} When email is invalid
     * @example
     * const user = manager.addUser('Jane', 'jane@example.com');
     * console.log(user.id); // 1
     */
    addUser(name, email) {
        if (!email || !email.includes('@')) {
            throw new Error('Invalid email address');
        }
        
        const user = {
            id: this.nextId++,
            name,
            email,
            createdAt: new Date().toISOString()
        };
        
        this.users.push(user);
        return user;
    }
    
    /**
     * @method getUser
     * @description Retrieves a user by ID
     * @param {number} id - User ID
     * @returns {Object|undefined} User object or undefined if not found
     * @example
     * const user = manager.getUser(1);
     * if (user) {
     *   console.log(user.name);
     * }
     */
    getUser(id) {
        return this.users.find(user => user.id === id);
    }
    
    /**
     * @method getAllUsers
     * @description Gets all users
     * @returns {Array} Array of all users
     * @deprecated Use getUsers() instead
     * @since 1.0.0
     */
    getAllUsers() {
        return [...this.users];
    }
    
    /**
     * @method getUsers
     * @description Gets all users with optional filtering
     * @param {Object} filters - Optional filters
     * @param {string} filters.name - Filter by name
     * @param {string} filters.email - Filter by email domain
     * @returns {Array} Filtered users
     * @example
     * const gmailUsers = manager.getUsers({ email: 'gmail.com' });
     * const johnUsers = manager.getUsers({ name: 'John' });
     */
    getUsers(filters = {}) {
        let filteredUsers = [...this.users];
        
        if (filters.name) {
            filteredUsers = filteredUsers.filter(user => 
                user.name.toLowerCase().includes(filters.name.toLowerCase())
            );
        }
        
        if (filters.email) {
            filteredUsers = filteredUsers.filter(user => 
                user.email.includes(filters.email)
            );
        }
        
        return filteredUsers;
    }
}

/**
 * @interface UserConfig
 * @description Configuration options for user operations
 * @property {boolean} validateEmail - Whether to validate email format
 * @property {boolean} autoGenerateId - Whether to auto-generate IDs
 * @property {string} defaultDomain - Default email domain
 */
const UserConfig = {
    validateEmail: true,
    autoGenerateId: true,
    defaultDomain: 'example.com'
};

/**
 * @constant API_VERSION
 * @description Current API version
 * @type {string}
 * @since 1.0.0
 */
const API_VERSION = '1.0.0';

/**
 * @namespace Utils
 * @description Utility functions for user management
 */
const Utils = {
    /**
     * @method validateEmail
     * @description Validates email format
     * @param {string} email - Email to validate
     * @returns {boolean} True if valid
     * @example
     * const isValid = Utils.validateEmail('user@example.com');
     * console.log(isValid); // true
     */
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    /**
     * @method generateId
     * @description Generates a unique ID
     * @returns {string} Unique ID
     * @throws {Error} When ID generation fails
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        processUserData,
        UserManager,
        UserConfig,
        API_VERSION,
        Utils
    };
}
