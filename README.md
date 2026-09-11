# Job Board — pracya.ua

Вебзастосунок для пошуку та створення вакансій.

Проєкт розроблений на **React + TypeScript** з використанням **React Router** та **REST API**. Користувачі можуть переглядати, шукати та фільтрувати вакансії, а також створювати вакансії або подавати заявки на них залежно від своєї ролі.

## Preview



## About the project

**Job Board** — інформаційна система створення та пошуку вакансій.

Основна мета проєкту — реалізувати frontend-застосунок, який дозволяє взаємодіяти з вакансіями та користувачами залежно від їхньої ролі.

У застосунку передбачено дві ролі:

* **Job Seeker** — пошук вакансій та подача заявок.
* **Employer** — створення, редагування та видалення власних вакансій.

## Features

### Authentication

* Реєстрація користувача.
* Авторизація.
* Вихід із системи.
* Збереження поточного користувача в `localStorage`.
* Хешування пароля за допомогою Web Crypto API.
* Розподіл користувачів за ролями.

### Vacancies

* Отримання вакансій через REST API.
* Перегляд списку вакансій.
* Пошук вакансій за назвою.
* Фільтрація вакансій за типом зайнятості.
* Перегляд детальної інформації про вакансію.
* Відображення інформації про компанію та контактів.

### Employer

Користувач із роллю `employer` може:

* створювати вакансії;
* редагувати власні вакансії;
* видаляти власні вакансії.

Редагування та видалення доступні тільки автору вакансії.

### Job Seeker

Користувач із роллю `jobseeker` може:

* переглядати вакансії;
* шукати вакансії;
* фільтрувати вакансії;
* подавати заявку на вакансію;
* скасовувати власну заявку;
* переглядати власні заявки.

Повторна заявка на одну вакансію не створюється.

## Technologies

* React
* TypeScript
* Vite
* React Router
* REST API
* CSS
* Web Crypto API
* localStorage
* Git
* GitHub

## Architecture

Проєкт розділений на декілька логічних рівнів.

### app

Містить глобальну логіку застосунку:

* authentication context;
* protected routes;
* React Router configuration.

### components

Перевикористовувані UI-компоненти:

* Layout;
* VacancyCard;
* VacancyForm.

### pages

Компоненти окремих сторінок застосунку:

* HomePage;
* LoginPage;
* RegisterPage;
* VacanciesPage;
* VacancyDetailsPage;
* CreateVacancyPage;
* EditVacancyPage;
* MyApplicationsPage.

### services

Логіка взаємодії з API та робота з даними:

* authentication;
* vacancies;
* applications.

### types

TypeScript-типи основних сутностей:

* User;
* Vacancy;
* Company;
* Application.

## Application flow

Система заявок пов’язує користувача з вакансією:

```text
User
  │
  │ userId
  ▼
Application
  │
  │ vacancyId
  ▼
Vacancy
```

Кожна заявка містить інформацію про користувача та вакансію, на яку він подав заявку.

Перед створенням заявки виконується перевірка, чи не подавав користувач заявку на цю вакансію раніше.

## API

Для роботи з вакансіями використовується REST API:

`https://fakejobs-api.vercel.app/jobs`

API використовується для:

* отримання списку вакансій;
* отримання окремої вакансії;
* створення вакансії;
* редагування вакансії;
* видалення вакансії.

Authentication та applications реалізовані на frontend-рівні з використанням `localStorage`.

На поточному етапі проєкт не має власного backend та бази даних.

## Protected Routes

Для сторінок, доступних тільки авторизованим користувачам, використовується `ProtectedRoute`.

Неавторизований користувач автоматично перенаправляється на сторінку входу.

Додатково перевіряється роль користувача та доступ до відповідних дій.

## Responsive Design

Інтерфейс розроблений з урахуванням різних розмірів екрана та можливості використання застосунку на desktop і mobile пристроях.

## Installation

Клонуйте репозиторій:

```bash
git clone https://github.com/ilusha12321/job-board.git
```

Перейдіть у папку проєкту:

```bash
cd job-board
```

Встановіть залежності:

```bash
npm install
```

Запустіть development server:

```bash
npm run dev
```

Після запуску відкрийте адресу, яку покаже Vite у терміналі.

## Available scripts

### `npm run dev`

Запуск development server.

### `npm run build`

Створення production build.

### `npm run lint`

Перевірка коду за допомогою ESLint.

### `npm run preview`

Перегляд production build локально.

## Project Goals

Під час розробки проєкту я практикую:

* React Components;
* React Hooks;
* Context API;
* TypeScript;
* React Router;
* REST API;
* asynchronous JavaScript;
* authentication;
* role-based access;
* form handling;
* state management;
* reusable components;
* Git / GitHub;
* структурування frontend-проєкту.

## Future Improvements

Плануються подальші покращення:

* покращення UI/UX;
* повноцінна валідація форм;
* покращена обробка API-помилок;
* loading та error states;
* сторінка користувача;
* перегляд заявок роботодавцем;
* статуси заявок;
* власний backend;
* PostgreSQL database;
* deployment.

**Technologies:**
React · TypeScript · JavaScript · React Router · REST API · Git

