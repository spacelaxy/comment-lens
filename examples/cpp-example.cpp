#include <iostream>
#include <string>
#include <vector>
#include <memory>

/**
 * @brief Classe que representa uma calculadora simples
 * 
 * Esta classe fornece operações básicas de matemática
 * incluindo soma, subtração, multiplicação e divisão.
 */
class Calculadora {
private:
    double ultimoResultado; ///< Armazena o último resultado calculado
    
public:
    /**
     * @brief Construtor da classe Calculadora
     * 
     * Inicializa a calculadora com resultado zero.
     */
    Calculadora() : ultimoResultado(0.0) {}
    
    /**
     * @brief Soma dois números
     * 
     * @param a Primeiro número
     * @param b Segundo número
     * @return Soma dos dois números
     */
    double somar(double a, double b) {
        ultimoResultado = a + b;
        return ultimoResultado;
    }
    
    /**
     * @brief Subtrai dois números
     * 
     * @param a Número minuendo
     * @param b Número subtraendo
     * @return Diferença entre os números
     */
    double subtrair(double a, double b) {
        ultimoResultado = a - b;
        return ultimoResultado;
    }
    
    /**
     * @brief Multiplica dois números
     * 
     * @param a Primeiro fator
     * @param b Segundo fator
     * @return Produto dos dois números
     * 
     * @note Esta operação pode resultar em overflow para números muito grandes
     */
    double multiplicar(double a, double b) {
        ultimoResultado = a * b;
        return ultimoResultado;
    }
    
    /**
     * @brief Divide dois números
     * 
     * @param a Dividendo
     * @param b Divisor
     * @return Quociente da divisão
     * 
     * @throws std::invalid_argument Se o divisor for zero
     */
    double dividir(double a, double b) {
        if (b == 0) {
            throw std::invalid_argument("Divisão por zero não é permitida");
        }
        ultimoResultado = a / b;
        return ultimoResultado;
    }
    
    /**
     * @brief Obtém o último resultado calculado
     * 
     * @return O último resultado armazenado
     */
    double getUltimoResultado() const {
        return ultimoResultado;
    }
    
    /**
     * @brief Limpa o último resultado
     */
    void limpar() {
        ultimoResultado = 0.0;
    }
};

/**
 * @brief Classe para gerenciar uma lista de calculadoras
 */
class GerenciadorCalculadoras {
private:
    std::vector<std::unique_ptr<Calculadora>> calculadoras;
    
public:
    /**
     * @brief Adiciona uma nova calculadora à lista
     * 
     * @return ID da calculadora adicionada
     */
    int adicionarCalculadora() {
        calculadoras.push_back(std::make_unique<Calculadora>());
        return static_cast<int>(calculadoras.size() - 1);
    }
    
    /**
     * @brief Obtém uma calculadora pelo ID
     * 
     * @param id ID da calculadora
     * @return Ponteiro para a calculadora ou nullptr se não encontrada
     */
    Calculadora* obterCalculadora(int id) {
        if (id >= 0 && id < static_cast<int>(calculadoras.size())) {
            return calculadoras[id].get();
        }
        return nullptr;
    }
    
    /**
     * @brief Conta o número de calculadoras
     * 
     * @return Número total de calculadoras
     */
    int contarCalculadoras() const {
        return static_cast<int>(calculadoras.size());
    }
};

/**
 * @brief Função utilitária para validar se um número é positivo
 * 
 * @param numero Número a ser validado
 * @return true se o número for positivo, false caso contrário
 */
bool ehPositivo(double numero) {
    return numero > 0;
}

/**
 * @brief Função para calcular o fatorial de um número
 * 
 * @param n Número para calcular o fatorial
 * @return Fatorial do número
 * 
 * @throws std::invalid_argument Se o número for negativo
 */
long long calcularFatorial(int n) {
    if (n < 0) {
        throw std::invalid_argument("Fatorial não é definido para números negativos");
    }
    
    long long resultado = 1;
    for (int i = 1; i <= n; ++i) {
        resultado *= i;
    }
    
    return resultado;
}

/**
 * @brief Função principal do programa
 * 
 * @param argc Número de argumentos da linha de comando
 * @param argv Array de argumentos da linha de comando
 * @return Código de saída do programa
 */
int main(int argc, char* argv[]) {
    std::cout << "=== Exemplo de Calculadora C++ ===" << std::endl;
    
    // Cria uma calculadora
    Calculadora calc;
    
    // Testa as operações
    std::cout << "5 + 3 = " << calc.somar(5, 3) << std::endl;
    std::cout << "10 - 4 = " << calc.subtrair(10, 4) << std::endl;
    std::cout << "6 * 7 = " << calc.multiplicar(6, 7) << std::endl;
    
    try {
        std::cout << "15 / 3 = " << calc.dividir(15, 3) << std::endl;
        std::cout << "10 / 0 = ";
        calc.dividir(10, 0); // Isso deve lançar uma exceção
    } catch (const std::invalid_argument& e) {
        std::cout << "Erro: " << e.what() << std::endl;
    }
    
    // Testa o gerenciador
    GerenciadorCalculadoras gerenciador;
    int id1 = gerenciador.adicionarCalculadora();
    int id2 = gerenciador.adicionarCalculadora();
    
    std::cout << "\nCalculadoras criadas: " << gerenciador.contarCalculadoras() << std::endl;
    
    // Testa fatorial
    std::cout << "Fatorial de 5 = " << calcularFatorial(5) << std::endl;
    
    return 0;
}
