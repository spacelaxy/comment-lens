/// Represents a user in the system.
/// 
/// This struct contains basic user information including
/// personal data and access permissions.
pub struct Usuario {
    /// Unique identifier for the user
    pub id: u32,
    /// Full name of the user
    pub nome: String,
    /// Email address of the user
    pub email: String,
    /// Age of the user in years
    pub idade: u8,
    /// Whether the user is active
    pub ativo: bool,
    /// List of user permissions
    pub permissoes: Vec<String>,
}

impl Usuario {
    /// Creates a new user instance.
    ///
    /// # Arguments
    ///
    /// * `id` - Unique identifier for the user
    /// * `nome` - Full name of the user
    /// * `email` - Email address of the user
    /// * `idade` - Age of the user in years
    ///
    /// # Returns
    ///
    /// A new `Usuario` instance with the provided data.
    ///
    /// # Example
    ///
    /// ```
    /// let user = Usuario::new(1, "João Silva".to_string(), "joao@email.com".to_string(), 30);
    /// ```
    pub fn new(id: u32, nome: String, email: String, idade: u8) -> Self {
        Usuario {
            id,
            nome,
            email,
            idade,
            ativo: true,
            permissoes: Vec::new(),
        }
    }

    /// Activates the user account.
    ///
    /// This method sets the `ativo` field to `true`.
    ///
    /// # Example
    ///
    /// ```
    /// let mut user = Usuario::new(1, "João".to_string(), "joao@email.com".to_string(), 30);
    /// user.ativar();
    /// assert!(user.ativo);
    /// ```
    pub fn ativar(&mut self) {
        self.ativo = true;
    }

    /// Deactivates the user account.
    ///
    /// This method sets the `ativo` field to `false`.
    ///
    /// # Example
    ///
    /// ```
    /// let mut user = Usuario::new(1, "João".to_string(), "joao@email.com".to_string(), 30);
    /// user.desativar();
    /// assert!(!user.ativo);
    /// ```
    pub fn desativar(&mut self) {
        self.ativo = false;
    }

    /// Adds a permission to the user.
    ///
    /// # Arguments
    ///
    /// * `permissao` - Permission to be added to the user
    ///
    /// # Example
    ///
    /// ```
    /// let mut user = Usuario::new(1, "João".to_string(), "joao@email.com".to_string(), 30);
    /// user.adicionar_permissao("admin".to_string());
    /// assert!(user.permissoes.contains(&"admin".to_string()));
    /// ```
    pub fn adicionar_permissao(&mut self, permissao: String) {
        if !self.permissoes.contains(&permissao) {
            self.permissoes.push(permissao);
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
    /// let mut user = Usuario::new(1, "João".to_string(), "joao@email.com".to_string(), 30);
    /// user.adicionar_permissao("read".to_string());
    /// let permissoes = user.listar_permissoes();
    /// assert_eq!(permissoes.len(), 1);
    /// ```
    pub fn listar_permissoes(&self) -> &Vec<String> {
        &self.permissoes
    }

    /// Checks if the user has a specific permission.
    ///
    /// # Arguments
    ///
    /// * `permissao` - Permission to check
    ///
    /// # Returns
    ///
    /// `true` if the user has the permission, `false` otherwise.
    ///
    /// # Example
    ///
    /// ```
    /// let mut user = Usuario::new(1, "João".to_string(), "joao@email.com".to_string(), 30);
    /// user.adicionar_permissao("admin".to_string());
    /// assert!(user.tem_permissao("admin"));
    /// assert!(!user.tem_permissao("write"));
    /// ```
    pub fn tem_permissao(&self, permissao: &str) -> bool {
        self.permissoes.iter().any(|p| p == permissao)
    }
}

/// Represents different user roles in the system.
#[derive(Debug, Clone, PartialEq)]
pub enum TipoUsuario {
    /// Regular user with basic permissions
    Usuario,
    /// Administrator with full system access
    Administrador,
    /// Moderator with limited administrative access
    Moderador,
}

impl TipoUsuario {
    /// Returns the display name for the user type.
    ///
    /// # Returns
    ///
    /// A string representation of the user type.
    ///
    /// # Example
    ///
    /// ```
    /// let tipo = TipoUsuario::Administrador;
    /// assert_eq!(tipo.nome_display(), "Administrador");
    /// ```
    pub fn nome_display(&self) -> &'static str {
        match self {
            TipoUsuario::Usuario => "Usuário",
            TipoUsuario::Administrador => "Administrador",
            TipoUsuario::Moderador => "Moderador",
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
    /// let tipos = TipoUsuario::todos();
    /// assert_eq!(tipos.len(), 3);
    /// ```
    pub fn todos() -> Vec<TipoUsuario> {
        vec![
            TipoUsuario::Usuario,
            TipoUsuario::Administrador,
            TipoUsuario::Moderador,
        ]
    }
}

/// Utility functions for user management.
pub mod utils {
    use super::Usuario;

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
    /// assert!(utils::validar_email("user@example.com"));
    /// assert!(!utils::validar_email("invalid-email"));
    /// ```
    pub fn validar_email(email: &str) -> bool {
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
    /// let id = utils::gerar_id();
    /// assert!(id > 0);
    /// ```
    pub fn gerar_id() -> u32 {
        // Simple ID generation - in real app, use proper UUID
        use std::time::{SystemTime, UNIX_EPOCH};
        SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs() as u32
    }
}