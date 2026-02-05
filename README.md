<img src="https://img.icons8.com/?size=100&id=v3CiDxsgQg3X&format=png&color=000000" alt="Expense Tracker" align="right">

# Expense Tracker &middot; [![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg?style=flat-square)]() [![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen.svg?style=flat-square)](https://spring.io/projects/spring-boot) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/ManoGuzman/expense-tracker/blob/master/LICENSE)

> Track your expenses efficiently with a secure RESTful API

A RESTful API for managing personal expenses with user authentication and authorization. Users can sign up, log in, and manage their own expense records through a complete set of CRUD operations.

## Installing / Getting started

To get the application running locally:

```shell
# Clone the repository
git clone https://github.com/ManoGuzman/expense-tracker.git
cd expense-tracker

# Build the project
./gradlew build

# Run the application
./gradlew bootRun


```

The application will start on `http://localhost:8080`. You can now make API requests to create users and manage expenses.

## Developing

### Built With

- **Java 17+** - Programming language
- **Spring Boot 3.x** - Application framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Data persistence with Hibernate
- **MySQL 8.x** - Relational database
- **Gradle** - Build tool and dependency management
- **Hibernate** - ORM framework

### Prerequisites

Before you begin, ensure you have the following installed:

- **JDK 17 or higher** - [Download OpenJDK](https://adoptium.net/)
- **MySQL 8.x** - [Download MySQL](https://dev.mysql.com/downloads/)
- **Gradle 7.x+** (or use the included wrapper)
- **Git** - [Download Git](https://git-scm.com/downloads)

### Setting up Dev

Follow these steps to set up your development environment:

```shell
# Clone the repository
git clone https://github.com/ManoGuzman/expense-tracker.git
cd expense-tracker

# Create MySQL database
mysql -u root -p
CREATE DATABASE expense_tracker;
CREATE USER 'expense_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON expense_tracker.* TO 'expense_user'@'localhost';
FLUSH PRIVILEGES;
exit;

# Configure application properties
cp src/main/resources/application.properties.example src/main/resources/application.properties
# Edit application.properties with your database credentials

# Install dependencies and build
./gradlew clean build
```

**Step-by-step breakdown:**
1. The repository is cloned to your local machine
2. A MySQL database named `expense_tracker` is created
3. A dedicated database user with appropriate privileges is set up
4. Application properties are configured with your database credentials
5. Gradle downloads all dependencies and compiles the project

### Building

To build the project for production:

```shell
# Clean previous builds and create a new build
./gradlew clean build

# Skip tests for faster builds (not recommended for production)
./gradlew clean build -x test

# Create a bootable JAR
./gradlew bootJar
```

This creates an executable JAR file in `build/libs/expense-tracker-{version}.jar` that contains all dependencies and can be run standalone.

### Deploying / Publishing

To deploy the application to a server:

```shell
# Build the production JAR
./gradlew clean bootJar

# Transfer to server (example using scp)
scp build/libs/expense-tracker-*.jar user@server.com:/path/to/deployment/

# On the server, run the application
java -jar expense-tracker-*.jar --spring.profiles.active=prod
```

## Versioning

This project uses [SemVer](http://semver.org/) for versioning. For available versions, see the [tags on this repository](https://github.com/ManoGuzman/expense-tracker/tags).

## Configuration

Configure the application through `src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/expense_tracker
spring.datasource.username=expense_user
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.jpa.properties.hibernate.format_sql=true

# JWT Configuration
jwt.secret=your_secret_key_here_min_256_bits
jwt.expiration=86400000

# Server Configuration
server.port=8080
server.servlet.context-path=/api

# Logging
logging.level.org.springframework=INFO
logging.level.com.yourpackage=DEBUG
```

**Environment-specific profiles:**
- `application-dev.properties` - Development settings
- `application-prod.properties` - Production settings
- `application-test.properties` - Testing configuration

## Tests

Run the test suite to ensure everything works correctly:

**Test coverage includes:**
- Unit tests for service layer business logic
- Integration tests for repository/database operations
- Controller tests for API endpoints
- Security tests for authentication/authorization

## API Reference

## Database

**Database:** MySQL 8.0+

**Relationships:**
- One User has Many Expenses (One-to-Many)
- Each Expense belongs to exactly One User
- Cascade delete: When a user is deleted, all their expenses are also deleted

**Download MySQL:** [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)

## Style Guide

This project follows **Google Java Style Guide** with Spring Boot best practices.

**Check code style:**
```shell
# Using Checkstyle plugin
./gradlew checkstyleMain checkstyleTest

# Format code (if using Spotless)
./gradlew spotlessApply
```

**Key conventions:**
- Use camelCase for variables and methods
- Use PascalCase for class names
- Use UPPER_SNAKE_CASE for constants
- Keep methods focused and single-purpose
- Write descriptive variable names
- Add JavaDoc for public APIs

## Licensing

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---