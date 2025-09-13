#include <iostream>
#include <string>
#include <vector>
#include <memory>

/**
 * @brief Class that represents a simple calculator
 * 
 * This class provides basic math operations
 * including addition, subtraction, multiplication and division.
 */
class Calculator {
private:
    double lastResult; ///< Stores the last calculated result
    
public:
    /**
     * @brief Constructor of the Calculator class
     * 
     * Initializes the calculator with zero result.
     */
    Calculator() : lastResult(0.0) {}
    
    /**
     * @brief Adds two numbers
     * 
     * @param a First number
     * @param b Second number
     * @return Sum of the two numbers
     */
    double add(double a, double b) {
        lastResult = a + b;
        return lastResult;
    }
    
    /**
     * @brief Subtracts two numbers
     * 
     * @param a Minuend number
     * @param b Subtrahend number
     * @return Difference between the numbers
     */
    double subtract(double a, double b) {
        lastResult = a - b;
        return lastResult;
    }
    
    /**
     * @brief Multiplies two numbers
     * 
     * @param a First factor
     * @param b Second factor
     * @return Product of the two numbers
     * 
     * @note This operation may result in overflow for very large numbers
     */
    double multiply(double a, double b) {
        lastResult = a * b;
        return lastResult;
    }
    
    /**
     * @brief Divides two numbers
     * 
     * @param a Dividend
     * @param b Divisor
     * @return Quotient of the division
     * 
     * @throws std::invalid_argument If the divisor is zero
     */
    double divide(double a, double b) {
        if (b == 0) {
            throw std::invalid_argument("Division by zero is not allowed");
        }
        lastResult = a / b;
        return lastResult;
    }
    
    /**
     * @brief Gets the last calculated result
     * 
     * @return The last stored result
     */
    double getLastResult() const {
        return lastResult;
    }
    
    /**
     * @brief Clears the last result
     */
    void clear() {
        lastResult = 0.0;
    }
};

/**
 * @brief Class to manage a list of calculators
 */
class CalculatorManager {
private:
    std::vector<std::unique_ptr<Calculator>> calculators;
    
public:
    /**
     * @brief Adds a new calculator to the list
     * 
     * @return ID of the added calculator
     */
    int addCalculator() {
        calculators.push_back(std::make_unique<Calculator>());
        return static_cast<int>(calculators.size() - 1);
    }
    
    /**
     * @brief Gets a calculator by ID
     * 
     * @param id Calculator ID
     * @return Pointer to the calculator or nullptr if not found
     */
    Calculator* getCalculator(int id) {
        if (id >= 0 && id < static_cast<int>(calculators.size())) {
            return calculators[id].get();
        }
        return nullptr;
    }
    
    /**
     * @brief Counts the number of calculators
     * 
     * @return Total number of calculators
     */
    int countCalculators() const {
        return static_cast<int>(calculators.size());
    }
};

/**
 * @brief Utility function to validate if a number is positive
 * 
 * @param number Number to be validated
 * @return true if the number is positive, false otherwise
 */
bool isPositive(double number) {
    return numero > 0;
}

/**
 * @brief Function to calculate the factorial of a number
 * 
 * @param n Number to calculate factorial
 * @return Factorial of the number
 * 
 * @throws std::invalid_argument If the number is negative
 */
long long calculateFactorial(int n) {
    if (n < 0) {
        throw std::invalid_argument("Factorial is not defined for negative numbers");
    }
    
    long long result = 1;
    for (int i = 1; i <= n; ++i) {
        result *= i;
    }
    
    return result;
}

/**
 * @brief Main function of the program
 * 
 * @param argc Number of command line arguments
 * @param argv Array of command line arguments
 * @return Program exit code
 */
int main(int argc, char* argv[]) {
    std::cout << "=== C++ Calculator Example ===" << std::endl;
    
    // Create a calculator
    Calculator calc;
    
    // Test operations
    std::cout << "5 + 3 = " << calc.add(5, 3) << std::endl;
    std::cout << "10 - 4 = " << calc.subtract(10, 4) << std::endl;
    std::cout << "6 * 7 = " << calc.multiply(6, 7) << std::endl;
    
    try {
        std::cout << "15 / 3 = " << calc.divide(15, 3) << std::endl;
        std::cout << "10 / 0 = ";
        calc.divide(10, 0); // This should throw an exception
    } catch (const std::invalid_argument& e) {
        std::cout << "Error: " << e.what() << std::endl;
    }
    
    // Test the manager
    CalculatorManager manager;
    int id1 = manager.addCalculator();
    int id2 = manager.addCalculator();
    
    std::cout << "\nCalculators created: " << manager.countCalculators() << std::endl;
    
    // Test factorial
    std::cout << "Factorial of 5 = " << calculateFactorial(5) << std::endl;
    
    return 0;
}
