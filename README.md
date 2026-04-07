<a id="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]
[![Java][java-shield]][java-url]
[![Spring Boot][spring-shield]][spring-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/ManoGuzman/expense-tracker-springboot">
    <img src="https://img.icons8.com/?size=100&id=ArlsSOzBs4a2&format=png&color=000000" alt="Money Logo" width="80" height="80">
  </a>

  <h3 align="center">Expense Tracker API</h3>

  <p align="center">
    A RESTful API for tracking personal expenses with user authentication and secure data management.
    <br />
    <a href="https://github.com/ManoGuzman/expense-tracker-springboot"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/ManoGuzman/expense-tracker-springboot/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/ManoGuzman/expense-tracker-springboot/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#features">Features</a></li>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#api-endpoints">API Endpoints</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

A secure RESTful API backend for managing personal expenses. Built with Spring Boot, it provides user authentication via JWT tokens and comprehensive expense management including creation, updates, deletion, and filtering by various date ranges.

### Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Expense Management**: Full CRUD operations for expenses
- **Date Filtering**: Filter expenses by week, month, 3 months, or custom date ranges
- **Category Support**: Organize expenses by predefined categories
- **Secure**: Password hashing, JWT authentication, and protected endpoints
- **Production Ready**: Configured for deployment on Railway with MySQL

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* [![Java][Java]][java-url]
* [![Spring Boot][Spring Boot]][spring-url]
* [![Spring Security][Spring Security]][spring-security-url]
* [![JWT][JWT]][jwt-url]
* [![MySQL][MySQL]][mysql-url]
* [![H2 Database][H2]][h2-url]
* [![Lombok][Lombok]][lombok-url]
* [![Gradle][Gradle]][gradle-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

Instructions for setting up the project locally.

### Prerequisites

- Java 17 or higher
- Gradle (or use the included gradlew wrapper)
- MySQL 8.0+ (for production) or H2 (for development)

### Installation

1. Clone the repository
   ```sh
   git clone https://github.com/ManoGuzman/expense-tracker-springboot.git
   ```
2. Navigate to the project directory
   ```sh
   cd expense-tracker-springboot
   ```
3. Configure environment variables or update `application.yml`

   **For Development (H2 - in-memory):**
   No configuration needed. The application uses H2 by default.

   **For Production (MySQL):**
   Set the following environment variables:
   ```sh
   export DB_HOST=your_mysql_host
   export DB_PORT=3306
   export DB_NAME=expense_tracker
   export DB_USERNAME=your_username
   export DB_PASSWORD=your_password
   export JWT_SECRET=your_jwt_secret_key
   export JWT_EXPIRATION=86400000
   export PORT=8080
   export DDL_AUTO=update
   export SHOW_SQL=false
   ```

4. Build the project
   ```sh
   ./gradlew build
   ```
5. Run the application
   ```sh
   ./gradlew bootRun
   ```

   Or run the JAR file directly:
   ```sh
   java -jar build/libs/expense-tracker-1.0.0.jar
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- API ENDPOINTS -->
## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |

### Expenses (Requires Authentication)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/expenses` | Get all expenses (supports filtering) |
| GET | `/api/expenses/{id}` | Get expense by ID |
| POST | `/api/expenses` | Create a new expense |
| PUT | `/api/expenses/{id}` | Update an expense |
| DELETE | `/api/expenses/{id}` | Delete an expense |

### Query Parameters for GET /api/expenses

| Parameter | Description |
|-----------|-------------|
| `filter` | Predefined filter: `week`, `month`, `3months` |
| `startDate` | Start date (ISO format: YYYY-MM-DD) |
| `endDate` | End date (ISO format: YYYY-MM-DD) |

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

### Register a New User

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "yourPassword123",
    "name": "John Doe"
  }'
```

### Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "yourPassword123"
  }'
```

### Create an Expense

```bash
curl -X POST http://localhost:8080/api/expenses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Groceries",
    "amount": 45.99,
    "category": "FOOD",
    "date": "2026-03-15",
    "description": "Weekly grocery shopping"
  }'
```

### Get Expenses (Last Week)

```bash
curl -X GET "http://localhost:8080/api/expenses?filter=week" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [x] User registration and login
- [x] JWT authentication
- [x] CRUD operations for expenses
- [x] Date-based filtering (week, month, 3 months, custom range)
- [x] Expense categories
- [x] H2 database for development
- [x] MySQL support for production
- [x] Railway deployment
- [ ] Add expense statistics and summaries
- [ ] Add expense recurring transactions
- [ ] Add export functionality (CSV/Excel)
- [ ] Add multi-currency support
- [ ] Add budget management

See the [open issues](https://github.com/ManoGuzman/expense-tracker-springboot/issues) for a full list of proposed features.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Top Contributors

<a href="https://github.com/ManoGuzman/expense-tracker-springboot/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ManoGuzman/expense-tracker-springboot" alt="contrib.rocks image" />
</a>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Manuel Guzman - [LinkedIn][linkedin-url] - manoguzman.dev@gmail.com

Project Link: [https://github.com/ManoGuzman/expense-tracker-springboot](https://github.com/ManoGuzman/expense-tracker-springboot)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [Spring Boot Documentation](https://spring.io/projects/spring-boot)
* [JWT Documentation](https://jwt.io/)
* [Best-README-Template](https://github.com/othneildrew/Best-README-Template)
* [Shields.io](https://shields.io)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/ManoGuzman/expense-tracker-springboot.svg?style=for-the-badge
[contributors-url]: https://github.com/ManoGuzman/expense-tracker-springboot/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/ManoGuzman/expense-tracker-springboot.svg?style=for-the-badge
[forks-url]: https://github.com/ManoGuzman/expense-tracker-springboot/network/members
[stars-shield]: https://img.shields.io/github/stars/ManoGuzman/expense-tracker-springboot.svg?style=for-the-badge
[stars-url]: https://github.com/ManoGuzman/expense-tracker-springboot/stargazers
[issues-shield]: https://img.shields.io/github/issues/ManoGuzman/expense-tracker-springboot.svg?style=for-the-badge
[issues-url]: https://github.com/ManoGuzman/expense-tracker-springboot/issues
[license-shield]: https://img.shields.io/github/license/ManoGuzman/expense-tracker-springboot.svg?style=for-the-badge
[license-url]: https://github.com/ManoGuzman/expense-tracker-springboot/blob/master/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/manuel-guzman-b87b841bb/

<!-- Technology Badges -->
[java-shield]: https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white
[java-url]: https://www.java.com/
[spring-shield]: https://img.shields.io/badge/Spring%20Boot-3.2.0-6DB33F?style=for-the-badge&logo=springboot&logoColor=white
[spring-url]: https://spring.io/projects/spring-boot
[spring-security-url]: https://spring.io/projects/spring-security
[jwt-url]: https://jwt.io/
[mysql-url]: https://www.mysql.com/
[h2-url]: https://www.h2database.com/
[lombok-url]: https://projectlombok.org/
[gradle-url]: https://gradle.org/

<!-- Technology Names -->
[Java]: https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white
[Spring Boot]: https://img.shields.io/badge/Spring%20Boot-3.2.0-6DB33F?style=for-the-badge&logo=springboot&logoColor=white
[Spring Security]: https://img.shields.io/badge/Spring%20Security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white
[JWT]: https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white
[MySQL]: https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white
[H2]: https://img.shields.io/badge/H2-005572?style=for-the-badge&logo=h2&logoColor=white
[Lombok]: https://img.shields.io/badge/Lombok-FF5722?style=for-the-badge&logo=lombok&logoColor=white
[Gradle]: https://img.shields.io/badge/Gradle-02303A?style=for-the-badge&logo=gradle&logoColor=white
