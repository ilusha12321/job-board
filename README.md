# hardwork

**Full-stack вебзастосунок для пошуку та створення вакансій.**

hardwork — інформаційна система створення та пошуку вакансій, яка об'єднує кандидатів і роботодавців в одному застосунку.

Кандидати можуть знаходити вакансії, переглядати детальну інформацію та подавати заявки з резюме. Роботодавці можуть створювати й керувати власними вакансіями, переглядати кандидатів та змінювати статуси заявок.

Проєкт побудований як full-stack застосунок із використанням **React, TypeScript, Node.js, Express та PostgreSQL**.

---

## Preview

<img width="1492" height="881" alt="image" src="https://github.com/user-attachments/assets/413392ac-916a-48b1-a400-4593e4ba8645" />

<img width="1425" height="904" alt="image" src="https://github.com/user-attachments/assets/c85a91a7-0580-4cc3-9ffc-fed40c69d5a3" />


## Features

### Authentication

* реєстрація та авторизація користувачів;
* JWT authentication;
* authentication через HTTP-only cookies;
* вихід із системи;
* дві ролі користувачів: `jobseeker` та `employer`;
* захист приватних маршрутів;
* role-based access control.

### Vacancies

* перегляд списку вакансій;
* пошук вакансій за назвою;
* фільтрація за локацією;
* фільтрація за типом зайнятості;
* перегляд детальної інформації;
* створення вакансій;
* редагування вакансій;
* видалення вакансій;
* доступ до редагування та видалення тільки для автора вакансії.

### Job Seeker

Користувач із роллю `jobseeker` може:

* переглядати вакансії;
* шукати та фільтрувати вакансії;
* переглядати детальну інформацію;
* подавати заявки;
* прикріплювати резюме у форматах PDF, DOC та DOCX;
* переглядати власні заявки;
* скасовувати власні заявки;
* відстежувати статус заявки.

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

### Applications

Система заявок пов'язує кандидата з конкретною вакансією.

Кожна заявка містить:

* користувача;
* вакансію;
* дату подачі;
* статус;
* прикріплене резюме, якщо воно було додане.

Доступні статуси:

* `delivered`
* `reviewed`
* `invite for interview`

---

## Technologies

### Frontend

* React 19
* TypeScript
* Vite
* React Router
* Tailwind CSS
* Context API
* Fetch API
* REST API

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

---

## Architecture

Проєкт розділений на frontend, backend та database частини:

```text
job-board
│
├── src
│   ├── app
│   │   ├── AuthContext
│   │   ├── ProtectedRoute
│   │   └── router
│   │
│   ├── components
│   │   ├── Layout
│   │   ├── VacancyCard
│   │   └── VacancyForm
│   │
│   ├── pages
│   │   ├── HomePage
│   │   ├── LoginPage
│   │   ├── RegisterPage
│   │   ├── VacanciesPage
│   │   ├── VacancyDetailsPage
│   │   ├── CreateVacancyPage
│   │   ├── EditVacancyPage
│   │   ├── MyApplicationsPage
│   │   └── EmployerApplicationsPage
│   │
│   ├── services
│   │   ├── authApi
│   │   ├── vacancyApi
│   │   └── applicationApi
│   │
│   └── types
│
├── backend
│   └── src
│       ├── routes
│       ├── middleware
│       ├── db
│       └── types
│
├── database
│   └── schema.sql
│
└── package.json
```

### Frontend

Frontend відповідає за UI, маршрутизацію, роботу зі станом та взаємодію з backend API.

#### `app`

Містить глобальну логіку застосунку:

* authentication context;
* protected routes;
* React Router configuration.

#### `components`

Перевикористовувані компоненти:

* `Layout`;
* `VacancyCard`;
* `VacancyForm`.

#### `pages`

Основні сторінки застосунку:

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

Містить логіку взаємодії frontend з REST API:

* authentication;
* vacancies;
* applications.

#### `types`

TypeScript-типи основних сутностей застосунку.

---

## Backend

Backend побудований на **Node.js + Express + TypeScript**.

Він відповідає за:

* authentication;
* authorization;
* роботу з PostgreSQL;
* CRUD операції з вакансіями;
* створення та керування заявками;
* перевірку прав доступу;
* завантаження резюме;
* отримання резюме кандидатів.

---

## Database

Для зберігання даних використовується **PostgreSQL**.

Основні таблиці:

```text
users
  │
  ├── vacancies
  │
  └── applications
          │
          └── vacancies
```

### `users`

Зберігає інформацію про користувачів та їхні ролі.

### `vacancies`

Зберігає вакансії та інформацію про роботодавця, який їх створив.

### `applications`

Зберігає заявки кандидатів на вакансії, статуси та інформацію про прикріплені резюме.

Зв'язки між таблицями використовуються для забезпечення цілісності даних та контролю доступу до ресурсів.

---

## Application Flow

Процес подачі заявки:

```text
Job Seeker
    │
    │ selects vacancy
    ▼
Vacancy Details
    │
    │ submit application
    ▼
POST /api/applications
    │
    ├── user_id
    ├── vacancy_id
    ├── status
    └── resume
    │
    ▼
PostgreSQL
    │
    ▼
Employer Applications
    │
    └── status update
```

Перед створенням заявки backend перевіряє, чи не подав користувач заявку на цю вакансію раніше.

Після подачі заявки роботодавець може переглянути кандидата та змінити статус заявки.

---

## API

Frontend взаємодіє з backend через REST API.

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### Vacancies

```http
GET    /api/vacancies
GET    /api/vacancies/:id
POST   /api/vacancies
PUT    /api/vacancies/:id
DELETE /api/vacancies/:id
```

### Applications

```http
POST   /api/applications
GET    /api/applications/my
GET    /api/applications/employer
DELETE /api/applications/:vacancyId
PATCH  /api/applications/:id/status
GET    /api/applications/:id/resume
```

Приватні API-операції захищені authentication та role-based authorization.

---

## Protected Routes

Frontend використовує `ProtectedRoute` для обмеження доступу до приватних сторінок.

```text
jobseeker
└── My Applications

employer
├── Create Vacancy
└── Edit Vacancy
```

Додатково backend перевіряє права користувача, тому захист не обмежується лише frontend.

---

## Resume Upload

Кандидат може прикріпити резюме під час подачі заявки.

Підтримувані формати:

* PDF
* DOC
* DOCX

Файл передається на backend через `multipart/form-data`.
<img width="1432" height="825" alt="image" src="https://github.com/user-attachments/assets/37ac2ee9-1740-4df4-ac0a-54ae2be64e46" />

Роботодавець може отримати резюме кандидата зі сторінки заявок.

<img width="1458" height="906" alt="image" src="https://github.com/user-attachments/assets/566142a2-e21d-49a2-8966-18e9c2839a4b" />


## Responsive Design

Інтерфейс адаптований для різних розмірів екрана:

* desktop;
* tablet;
* mobile.

UI побудований з використанням Tailwind CSS та responsive utilities.

---

## Installation

### 1. Clone repository

```bash
git clone https://github.com/ilusha12321/job-board.git
cd job-board
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd backend
npm install
```

### 4. Configure environment variables

Створіть файл:

```text
backend/.env
```

та додайте необхідні змінні середовища для PostgreSQL і JWT.

### 5. Configure PostgreSQL

Створіть базу даних PostgreSQL та виконайте SQL-скрипт:

```text
database/schema.sql
```

### 6. Start backend

У папці `backend`:

```bash
npm run dev
```

### 7. Start frontend

В іншому терміналі, з кореня проєкту:

```bash
npm run dev
```

Після запуску відкрийте адресу, яку покаже Vite.

---

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

---

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

---

## Future Improvements

* pagination для вакансій;
* сортування вакансій;
* сторінка профілю користувача;
* розширене керування профілем роботодавця;
* email notifications;
* password recovery;
* deployment frontend та backend;
* production database configuration.


