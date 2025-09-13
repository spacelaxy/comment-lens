/// Represents a user in the system.
/// 
/// This struct contains basic user information including
/// personal data and access permissions.
pub struct User {
    /// Unique identifier for the user
    pub id: u32,
    /// Full name of the user
    pub name: String,
    /// Email address of the user
    pub email: String,
    /// Age of the user in years
    pub age: u8,
    /// Whether the user is active
    pub active: bool,
    /// List of user permissions
    pub permissions: Vec<String>,
}

impl User {
    /// Creates a new user instance.
    ///
    /// # Arguments
    ///
    /// * `id` - Unique identifier for the user
    /// * `name` - Full name of the user
    /// * `email` - Email address of the user
    /// * `age` - Age of the user in years
    ///
    /// # Returns
    ///
    /// A new `User` instance with the provided data.
    ///
    /// # Example
    ///
    /// ```
    /// let user = User::new(1, "John Doe".to_string(), "john@email.com".to_string(), 30);
    /// ```
    pub fn new(id: u32, name: String, email: String, age: u8) -> Self {
        User {
            id,
            name,
            email,
            age,
            active: true,
            permissions: Vec::new(),
        }
    }

    /// Activates the user account.
    ///
    /// This method sets the `active` field to `true`.
    ///
    /// # Example
    ///
    /// ```
    /// let mut user = User::new(1, "John".to_string(), "john@email.com".to_string(), 30);
    /// user.activate();
    /// assert!(user.active);
    /// ```
    pub fn activate(&mut self) {
        self.active = true;
    }

    /// Deactivates the user account.
    ///
    /// This method sets the `active` field to `false`.
    ///
    /// # Example
    ///
    /// ```
    /// let mut user = User::new(1, "John".to_string(), "john@email.com".to_string(), 30);
    /// user.deactivate();
    /// assert!(!user.active);
    /// ```
    pub fn deactivate(&mut self) {
        self.active = false;
    }

    /// Adds a permission to the user.
    ///
    /// # Arguments
    ///
    /// * `permission` - Permission to be added to the user
    ///
    /// # Example
    ///
    /// ```
    /// let mut user = User::new(1, "John".to_string(), "john@email.com".to_string(), 30);
    /// user.add_permission("admin".to_string());
    /// assert!(user.permissions.contains(&"admin".to_string()));
    /// ```
    pub fn add_permission(&mut self, permission: String) {
        if !self.permissions.contains(&permission) {
            self.permissions.push(permission);
        }
    }

    /// Returns the list of user permissions.
    ///
    /// # Returns
    ///
    /// A reference to the vector containing all user permissions.
    ///
    /// # Example
    ///
    /// ```
    /// let mut user = User::new(1, "John".to_string(), "john@email.com".to_string(), 30);
    /// user.add_permission("read".to_string());
    /// let permissions = user.list_permissions();
    /// assert_eq!(permissions.len(), 1);
    /// ```
    pub fn list_permissions(&self) -> &Vec<String> {
        &self.permissions
    }

    /// Checks if the user has a specific permission.
    ///
    /// # Arguments
    ///
    /// * `permission` - Permission to check
    ///
    /// # Returns
    ///
    /// `true` if the user has the permission, `false` otherwise.
    ///
    /// # Example
    ///
    /// ```
    /// let mut user = User::new(1, "John".to_string(), "john@email.com".to_string(), 30);
    /// user.add_permission("admin".to_string());
    /// assert!(user.has_permission("admin"));
    /// assert!(!user.has_permission("write"));
    /// ```
    pub fn has_permission(&self, permission: &str) -> bool {
        self.permissions.iter().any(|p| p == permission)
    }
}

/// Represents different user roles in the system.
#[derive(Debug, Clone, PartialEq)]
pub enum UserType {
    /// Regular user with basic permissions
    User,
    /// Administrator with full system access
    Admin,
    /// Moderator with limited administrative access
    Moderator,
}

impl UserType {
    /// Returns the display name for the user type.
    ///
    /// # Returns
    ///
    /// A string representation of the user type.
    ///
    /// # Example
    ///
    /// ```
    /// let user_type = UserType::Admin;
    /// assert_eq!(user_type.display_name(), "Admin");
    /// ```
    pub fn display_name(&self) -> &'static str {
        match self {
            UserType::User => "User",
            UserType::Admin => "Admin",
            UserType::Moderator => "Moderator",
        }
    }

    /// Returns all available user types.
    ///
    /// # Returns
    ///
    /// A vector containing all user types.
    ///
    /// # Example
    ///
    /// ```
    /// let types = UserType::all();
    /// assert_eq!(types.len(), 3);
    /// ```
    pub fn all() -> Vec<UserType> {
        vec![
            UserType::User,
            UserType::Admin,
            UserType::Moderator,
        ]
    }
}

/// Utility functions for user management.
pub mod utils {
    use super::User;

    /// Validates an email address format.
    ///
    /// # Arguments
    ///
    /// * `email` - Email address to validate
    ///
    /// # Returns
    ///
    /// `true` if the email format is valid, `false` otherwise.
    ///
    /// # Example
    ///
    /// ```
    /// assert!(utils::validate_email("user@example.com"));
    /// assert!(!utils::validate_email("invalid-email"));
    /// ```
    pub fn validate_email(email: &str) -> bool {
        email.contains('@') && email.contains('.')
    }

    /// Generates a unique user ID.
    ///
    /// # Returns
    ///
    /// A new unique user ID.
    ///
    /// # Example
    ///
    /// ```
    /// let id = utils::generate_id();
    /// assert!(id > 0);
    /// ```
    pub fn generate_id() -> u32 {
        // Simple ID generation - in real app, use proper UUID
        use std::time::{SystemTime, UNIX_EPOCH};
        SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs() as u32
    }
}