# hardwork

Вебзастосунок для пошуку та створення вакансій.

**hardwork** — інформаційна система створення та пошуку вакансій, яка дозволяє користувачам знаходити актуальні вакансії, подавати заявки, а роботодавцям — створювати та керувати власними вакансіями і переглядати заявки кандидатів.

Проєкт розроблений як full-stack застосунок з використанням **React, TypeScript, Node.js, Express та PostgreSQL**.

## Preview


## About the project

Основна мета проєкту — створити повноцінну платформу для взаємодії між кандидатами та роботодавцями.

У застосунку передбачено дві основні ролі:

* **Job Seeker** — пошук вакансій та подача заявок.
* **Employer** — створення, редагування та керування власними вакансіями, а також перегляд заявок кандидатів.

Frontend відповідає за інтерфейс та взаємодію з користувачем, а backend — за authentication, роботу з базою даних, вакансіями та заявками.

## Features

### Authentication

* Реєстрація користувача.
* Авторизація.
* Вихід із системи.
* JWT authentication.
* Зберігання JWT у `httpOnly` cookie.
* Розподіл користувачів за ролями.
* Захист приватних маршрутів.
* Role-based access control.

### Vacancies

* Отримання списку вакансій через REST API.
* Перегляд детальної інформації про вакансію.
* Пошук вакансій за назвою.
* Фільтрація за location.
* Фільтрація за типом зайнятості.
* Створення вакансій.
* Редагування вакансій.
* Видалення вакансій.
* Доступ до редагування та видалення тільки для автора вакансії.

### Job Seeker

Користувач із роллю `jobseeker` може:

* переглядати вакансії;
* шукати вакансії;
* фільтрувати вакансії;
* переглядати детальну інформацію;
* подавати заявку на вакансію;
* прикріплювати резюме у форматах PDF, DOC та DOCX;
* скасовувати власну заявку;
* переглядати власні заявки.

Повторна заявка одного користувача на одну вакансію не створюється.

### Employer

Користувач із роллю `employer` може:

* створювати вакансії;
* редагувати власні вакансії;
* видаляти власні вакансії;
* переглядати заявки на власні вакансії;
* переглядати інформацію про кандидатів;
* завантажувати резюме кандидатів;
* змінювати статус заявки.

Доступ до вакансій та заявок обмежений відповідно до ролі та власника ресурсу.

### Applications

Система заявок пов'язує користувача з вакансією.

Кожна заявка містить:

* користувача;
* вакансію;
* дату подачі;
* статус;
* прикріплене резюме, якщо воно було додане.

Доступні статуси заявки:

* `delivered`
* `reviewed`
* `invite for interview`

Роботодавець може змінювати статус заявки через інтерфейс застосунку.

## Technologies

### Frontend

* React 19
* TypeScript
* Vite
* React Router
* Tailwind CSS
* REST API
* Context API
* Fetch API

### Backend

* Node.js
* Express
* TypeScript
* PostgreSQL
* JWT
* HTTP-only cookies
* REST API
* Multer

### Development

* Git
* GitHub
* ESLint
* npm

## Architecture

Проєкт розділений на frontend та backend частини.

```text
hardwork
│
├── frontend
│   └── src
│       ├── app
│       ├── components
│       ├── pages
│       ├── services
│       ├── types
│       └── index.css
│
└── backend
    └── src
        ├── routes
        ├── middleware
        ├── db
        ├── types
        └── server
```

### Frontend

#### `app`

Містить глобальну логіку застосунку:

* authentication context;
* protected routes;
* React Router configuration.

#### `components`

Перевикористовувані UI-компоненти:

* `Layout`;
* `VacancyCard`;
* `VacancyForm`.

#### `pages`

Сторінки застосунку:

* `HomePage`;
* `LoginPage`;
* `RegisterPage`;
* `VacanciesPage`;
* `VacancyDetailsPage`;
* `CreateVacancyPage`;
* `EditVacancyPage`;
* `MyApplicationsPage`;
* `EmployerApplicationsPage`.

#### `services`

Містить логіку взаємодії frontend з backend API:

* authentication;
* vacancies;
* applications.

#### `types`

TypeScript-типи основних сутностей:

* `User`;
* `Vacancy`;
* `Application`;
* `EmployerApplication`.

### Backend

Backend побудований на **Node.js + Express + TypeScript**.

Він відповідає за:

* authentication;
* authorization;
* роботу з PostgreSQL;
* CRUD операції з вакансіями;
* створення та керування заявками;
* перевірку прав доступу;
* завантаження та отримання резюме.

## Database

Для зберігання даних використовується **PostgreSQL**.

Основні сутності:

```text
User
 │
 ├── Vacancy
 │
 └── Application
        │
        └── Vacancy
```

Основні таблиці:

* `users`
* `vacancies`
* `applications`

Зв'язки між сутностями забезпечують цілісність даних та обмежують доступ користувачів до ресурсів.

Наприклад, роботодавець може редагувати або видаляти тільки власні вакансії, а кандидат — переглядати та скасовувати тільки власні заявки.

## Application flow

Процес подачі заявки:

```text
Job Seeker
    │
    │ POST /applications
    ▼
Application
    │
    ├── user_id
    ├── vacancy_id
    ├── status
    └── resume
```

Перед створенням заявки backend перевіряє, чи не існує вже заявки цього користувача на цю вакансію.

Після подачі заявки роботодавець може переглянути її у власному розділі та змінити статус кандидата.

## API

Frontend взаємодіє з backend через REST API.

Основні API endpoints:

```text
Authentication
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

Vacancies
GET    /api/vacancies
GET    /api/vacancies/:id
POST   /api/vacancies
PUT    /api/vacancies/:id
DELETE /api/vacancies/:id

Applications
POST   /api/applications
GET    /api/applications/my
GET    /api/applications/employer
DELETE /api/applications/:vacancyId
PATCH  /api/applications/:id/status
GET    /api/applications/:id/resume
```

API використовує authentication та role-based authorization для захисту приватних операцій.

## Protected Routes

Для захисту frontend-маршрутів використовується `ProtectedRoute`.

Неавторизований користувач не може отримати доступ до сторінок, які потребують authentication.

Додатково перевіряється роль користувача.

Наприклад:

```text
jobseeker
    └── My Applications

employer
    ├── Create Vacancy
    ├── Edit Vacancy
    └── Employer Applications
```

Backend також перевіряє права доступу, тому frontend-обмежень недостатньо для виконання захищених операцій.

## Resume Upload

Кандидат може прикріпити резюме під час подачі заявки.

Підтримувані формати:

* PDF
* DOC
* DOCX

Файл передається на backend через `multipart/form-data`.

Роботодавець може отримати прикріплене резюме зі сторінки заявок.

## Responsive Design

Інтерфейс адаптований для різних розмірів екрана.

Основна увага приділена:

* desktop;
* tablet;
* mobile.

UI побудований на Tailwind CSS із використанням responsive utilities.

## Installation

Клонуйте репозиторій:

```bash
git clone https://github.com/ilusha12321/job-board.git
```

Перейдіть у папку проєкту:

```bash
cd job-board
```

Встановіть frontend залежності:

```bash
npm install
```

Перейдіть до backend:

```bash
cd backend
npm install
```

Створіть файл `.env` у папці `backend` та додайте необхідні змінні середовища для PostgreSQL і JWT.

Після налаштування бази даних запустіть backend:

```bash
npm run dev
```

В іншому терміналі запустіть frontend:

```bash
npm run dev
```

Після запуску frontend відкрийте адресу, яку покаже Vite у терміналі.

## Available Scripts

### Frontend

```bash
npm run dev
```

Запуск development server.

```bash
npm run build
```

Створення production build.

```bash
npm run lint
```

Перевірка коду за допомогою ESLint.

```bash
npm run preview
```

Перегляд production build локально.

### Backend

```bash
npm run dev
```

Запуск backend у development mode.

```bash
npm run build
```

Створення production build.

## Project Goals

Під час розробки проєкту я практикую:

* React Components;
* React Hooks;
* Context API;
* TypeScript;
* React Router;
* REST API;
* asynchronous JavaScript;
* Node.js;
* Express;
* PostgreSQL;
* JWT authentication;
* HTTP-only cookies;
* role-based access control;
* CRUD operations;
* file upload;
* form handling;
* state management;
* reusable components;
* Git / GitHub;
* структурування full-stack проєкту.

## Future Improvements

Подальший розвиток проєкту може включати:

* покращену валідацію форм;
* розширену обробку API-помилок;
* pagination для вакансій;
* сортування вакансій;
* сторінку профілю користувача;
* розширене керування профілем роботодавця;
* email notifications;
* password recovery;
* deployment frontend та backend;
* production database configuration.

