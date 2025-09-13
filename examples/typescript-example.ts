// TypeScript Example - Comment Lens Extension
// This file demonstrates how Comment Lens works with TypeScript

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

interface UserManagerConfig {
  maxUsers: number;
  enableValidation: boolean;
}

// @todo: Implement proper error handling system
// @bug: Fix type safety issues in user operations
// @note: This class manages user data and operations
// @warn: Performance may degrade with large user datasets
// @highlight: 15-20 Core user management class

class UserManager {
  private users: Map<number, User> = new Map();
  private nextId: number = 1;
  private config: UserManagerConfig;

  constructor(config: Partial<UserManagerConfig> = {}) {
    // @todo: Add configuration validation
    // @note: Initialize with default configuration
    this.config = {
      maxUsers: 1000,
      enableValidation: true,
      ...config
    };
  }

  // @highlight: 25-30 User creation logic
  public addUser(name: string, email: string): User {
    // @warn: Check user limit before adding
    if (this.users.size >= this.config.maxUsers) {
      throw new Error('Maximum user limit reached');
    }

    // @bug: Validate email format properly
    if (this.config.enableValidation && !this.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }

    const user: User = {
      id: this.nextId,
      name,
      email,
      createdAt: new Date().toISOString()
    };

    // @note: Store user in map
    this.users.set(this.nextId, user);
    this.nextId++;

    return user;
  }

  // @todo: Optimize user lookup performance
  public getUser(id: number): User | undefined {
    // @highlight: 40-45 User retrieval logic
    return this.users.get(id);
  }

  // @warn: Handle large user lists efficiently
  public getAllUsers(): User[] {
    // @note: Convert map to array
    return Array.from(this.users.values());
  }

  // @bug: Add proper error handling for updates
  public updateUser(id: number, updates: Partial<Omit<User, 'id' | 'createdAt'>>): User | null {
    const user = this.users.get(id);
    if (!user) {
      return null;
    }

    // @highlight: 55-60 User update logic
    const updatedUser: User = {
      ...user,
      ...updates
    };

    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // @todo: Implement user deletion with cascade
  public deleteUser(id: number): boolean {
    // @note: Remove user from map
    return this.users.delete(id);
  }

  // @warn: Add input validation
  private isValidEmail(email: string): boolean {
    // @highlight: 70-75 Email validation logic
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // @note: Export users to JSON format
  public exportToJSON(): string {
    // @bug: Handle circular references
    return JSON.stringify(this.getAllUsers(), null, 2);
  }
}

// @todo: Implement user data processing utilities
// @note: Utility functions for user operations
export function processUserData(users: User[]): Array<{
  id: number;
  nameUpper: string;
  emailDomain: string;
  createdAt: Date;
}> {
  // @highlight: 85-90 Data processing logic
  return users.map(user => ({
    id: user.id,
    nameUpper: user.name.toUpperCase(),
    emailDomain: user.email.split('@')[1] || 'unknown',
    createdAt: new Date(user.createdAt)
  }));
}

// @warn: Add proper error handling
// @note: Main function entry point
async function main(): Promise<void> {
  console.log('Starting TypeScript application');

  // @highlight: 95-100 Application initialization
  const userManager = new UserManager({
    maxUsers: 100,
    enableValidation: true
  });

  try {
    // Add some test users
    const user1 = userManager.addUser('John Doe', 'john@example.com');
    const user2 = userManager.addUser('Jane Smith', 'jane@example.com');

    console.log('Added users:', user1.name, user2.name);

    // Process user data
    const allUsers = userManager.getAllUsers();
    const processedData = processUserData(allUsers);

    console.log('Processed data:');
    processedData.forEach(data => {
      console.log(`  ${data.nameUpper} (${data.emailDomain})`);
    });

    // Export to JSON
    const jsonData = userManager.exportToJSON();
    console.log('JSON export:', jsonData);

  } catch (error) {
    console.error('Error:', error);
  }
}

// @todo: Add command line argument parsing
if (require.main === module) {
  main().catch(console.error);
}
