// JavaScript Example - Comment Lens Extension
// This file demonstrates how Comment Lens works with JavaScript

// @todo: Implement user authentication system
// @bug: Fix memory leak in event listeners
// @note: This function handles complex data processing
// @warn: Performance may be slow with large datasets
// @highlight: 15-20 This section contains critical business logic

function processUserData(users) {
    // @todo: Add input validation
    // @note: Using map for better performance than forEach
    const processedUsers = users.map(user => {
        // @bug: Handle null user gracefully
        if (!user) return null;
        
        // @highlight: 25-30 User data transformation logic
        return {
            id: user.id,
            name: user.name.toUpperCase(),
            email: user.email.toLowerCase(),
            // @note: Adding timestamp for audit trail
            processedAt: new Date().toISOString()
        };
    });
    
    // @warn: Filter out null values before returning
    return processedUsers.filter(user => user !== null);
}

// @todo: Add error handling
// @note: This is the main entry point
function main() {
    console.log("Application started");
    
    // @highlight: 40-45 Initialize application components
    const users = [
        { id: 1, name: "John Doe", email: "JOHN@EXAMPLE.COM" },
        { id: 2, name: "Jane Smith", email: "JANE@EXAMPLE.COM" }
    ];
    
    const result = processUserData(users);
    console.log("Processed users:", result);
}

// @bug: Missing error handling for main function
main();