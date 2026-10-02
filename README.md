# Job Board

**Job Board** — повноцінна інформаційна система для створення та пошуку вакансій.

Проєкт складається з **Web-додатку**, **мобільного застосунку**, **REST API** та **PostgreSQL**.

Користувачі можуть реєструватися як шукачі роботи або роботодавці, переглядати вакансії, подавати відгуки, керувати вакансіями та переглядати кандидатів.

---

# Демонстрація

## Web

### Головна сторінка
<img width="1460" height="872" alt="image" src="https://github.com/user-attachments/assets/360ab7eb-69d3-4728-a660-f33d2f63b356" />

### Список вакансій
<img width="1477" height="896" alt="image" src="https://github.com/user-attachments/assets/5b630393-121a-407c-bd16-ef691449107d" />

Cписок вакансій з пошуком та фільтрами.

<img width="1466" height="880" alt="image" src="https://github.com/user-attachments/assets/ed2d161f-e623-4934-8007-ddf25fb28e42" />

### Деталі вакансії

<img width="1434" height="815" alt="image" src="https://github.com/user-attachments/assets/b36e1ec8-89ba-4469-aaa5-2684cb0623b7" />

### Особистий кабінет роботодавця


<img width="1480" height="879" alt="image" src="https://github.com/user-attachments/assets/64e49c67-8351-4dc7-910c-6fe12c310a18" />

### Відгуки кандидатів
<img width="1434" height="815" alt="image" src="https://github.com/user-attachments/assets/a2994082-a941-448c-87ed-1b8f41f5c17f" />


# Mobile

Мобільний застосунок розроблений на **React Native + Expo** та використовує той самий REST API, що й Web-версія.

### Авторизація

<img width="590" height="1280" alt="image" src="https://github.com/user-attachments/assets/b07e7aaf-30cd-43b5-b6a8-821075b8601a" />

### Список вакансій
<img width="590" height="1280" alt="image" src="https://github.com/user-attachments/assets/31247f5c-0a63-4915-bdff-9cd4f1d1a499" />

### Вакансії

<img width="590" height="1280" alt="image" src="https://github.com/user-attachments/assets/5f710a9f-a27d-4de7-989e-d606d32c7202" />

### Мої відгуки

<img width="590" height="1280" alt="image" src="https://github.com/user-attachments/assets/e6f673e4-16a5-4ea8-8204-0412e425eaef" />

### Мої вакансії

<img width="590" height="1280" alt="image" src="https://github.com/user-attachments/assets/bcda0316-a81f-4a72-9f7d-1a40153a6476" />

### Відгуки роботодавця

<img width="590" height="1280" alt="image" src="https://github.com/user-attachments/assets/534856fe-5391-424d-bd96-938ef330058c" />

# Можливості

## Шукач роботи

* Реєстрація та авторизація
* Перегляд вакансій
* Пошук вакансій
* Фільтрація за локацією
* Фільтрація за типом зайнятості
* Перегляд деталей вакансії
* Відгук на вакансію
* Додавання резюме до відгуку
* Перегляд власних відгуків
* Перегляд статусу відгуку
* Скасування відгуку

## Роботодавець

* Реєстрація та авторизація
* Створення вакансій
* Редагування вакансій
* Видалення вакансій
* Перегляд власних вакансій
* Перегляд відгуків кандидатів
* Фільтрація відгуків за статусом
* Перегляд резюме кандидатів
* Зміна статусу відгуку

---

# Мобільний застосунок

Мобільна версія знаходиться в директорії:

```text
mobile/
```

Вона реалізована за допомогою:

* React Native
* Expo
* TypeScript
* React Navigation
* NativeWind
* i18next
* react-i18next

Мобільний застосунок використовує той самий Backend API, що й Web-версія.

### Додаткові можливості Mobile

* Світла тема
* Темна тема
* Українська локалізація
* Англійська локалізація
* Навігація залежно від ролі користувача
* Робота з резюме
* Перегляд та керування відгуками

---

# Технології

## Web

* React
* TypeScript
* Vite
* React Router
* Tailwind CSS
* Context API

## Mobile

* React Native
* Expo
* TypeScript
* React Navigation
* NativeWind
* i18next
* react-i18next
* Expo Document Picker
* Expo Sharing

## Backend

* Node.js
* Express
* TypeScript
* JWT
* bcrypt
* Zod
* Multer
* Helmet
* CORS
* express-rate-limit

## Database

* PostgreSQL

---

#  Архітектура

```text
                    ┌──────────────────┐
                    │   PostgreSQL     │
                    └────────▲─────────┘
                             │
                             │
                    ┌────────┴─────────┐
                    │     Backend      │
                    │  Node.js/Express │
                    └────────▲─────────┘
                             │
                    ┌────────┴─────────┐
                    │     REST API     │
                    └───────▲───▲──────┘
                            │   │
              ┌─────────────┘   └─────────────┐
              │                               │
      ┌───────┴────────┐             ┌────────┴────────┐
      │      Web       │             │      Mobile     │
      │ React + Vite   │             │ React Native    │
      └────────────────┘             └─────────────────┘
```

Web та Mobile використовують спільний Backend API та одну базу даних PostgreSQL.

---

# Авторизація та безпека

Для авторизації використовується **JWT**.

У Web-версії JWT зберігається в **HTTP-only cookie**.

Основний процес:

```text
Реєстрація / Вхід
        ↓
Перевірка даних
        ↓
Створення JWT
        ↓
HTTP-only cookie
        ↓
Запит до захищеного API
        ↓
Authentication middleware
        ↓
Перевірка користувача та ролі
```

Доступні ролі:

```text
jobseeker
employer
```

Backend перевіряє права доступу незалежно від frontend.

Використовуються:

* bcrypt для хешування паролів
* JWT
* HTTP-only cookies
* Zod validation
* Helmet
* CORS
* rate limiting
* перевірка ролей
* перевірка власника вакансії
* перевірка завантажених файлів

---

# Резюме

До відгуку можна додати резюме.

Підтримуються формати:

```text
PDF
DOC
DOCX
```

Максимальний розмір:

```text
5 MB
```

Файли проходять перевірку типу та розширення.

---

# База даних

Проєкт використовує PostgreSQL.

Основні сутності:

```text
Users
   │
   ├── Vacancies
   │
   └── Applications
           │
           └── Vacancies
```

У базі використовуються:

* Primary Keys
* Foreign Keys
* Unique Constraints
* Check Constraints
* Indexes
* Cascade Deletes

Для запобігання повторним відгукам використовується обмеження на пару:

```text
user_id + vacancy_id
```

---

# API

Основні API-розділи:

```text
/api/auth
/api/vacancies
/api/applications
```

## Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
```

## Vacancies

API підтримує:

* отримання вакансій
* отримання конкретної вакансії
* створення вакансій
* редагування вакансій
* видалення вакансій
* отримання власних вакансій роботодавця

## Applications

API підтримує:

* створення відгуку
* перегляд власних відгуків
* скасування відгуку
* перегляд відгуків роботодавцем
* зміну статусу
* отримання резюме кандидата

---

#  Структура проєкту

```text
job-board/
│
├── backend/
│   ├── src/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── db.ts
│   │   ├── schemas.ts
│   │   └── index.ts
│   └── package.json
│
├── database/
│   └── schema.sql
│
├── mobile/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── i18n/
│   │   ├── screens/
│   │   ├── services/
│   │   └── types/
│   ├── App.tsx
│   └── package.json
│
├── src/
│   ├── app/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── types/
│
├── package.json
└── README.md
```

---

# Встановлення

## 1. Клонування

```bash
git clone https://github.com/ilusha12321/job-board.git
cd job-board
```

## 2. Web

```bash
npm install
```

## 3. Backend

```bash
cd backend
npm install
cd ..
```

## 4. Mobile

```bash
cd mobile
npm install
cd ..
```

---

# Environment Variables

Для Backend створіть:

```text
backend/.env
```

Приклад:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:password@localhost:5432/job_board
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

Не додавайте `.env` та реальні секрети до Git.

---

# PostgreSQL

Створіть базу даних:

```text
job_board
```

Після цього застосуйте схему:

```text
database/schema.sql
```

PostgreSQL повинен бути запущений перед запуском Backend.

---

# Запуск

## Backend

```bash
cd backend
npm run dev
```

Backend:

```text
http://localhost:3000
```

## Web

У кореневій директорії:

```bash
npm run dev
```

## Mobile

```bash
cd mobile
npx expo start
```

Для тестування можна використовувати:

* Expo Go
* Android Emulator
* iOS Simulator

Під час запуску на фізичному смартфоні Backend має бути доступний у локальній мережі.

---

#  Мета проєкту

Проєкт створений як практична full-stack система для роботи з:

* React
* TypeScript
* React Native
* Node.js
* Express
* REST API
* PostgreSQL
* JWT
* авторизацією та ролями
* завантаженням файлів
* валідацією даних
* мобільною навігацією
* локалізацією
* світлою та темною темами

Основна мета — реалізувати повноцінний продукт із Web та Mobile клієнтами, спільним Backend API та базою даних.

---

# Подальший розвиток

Можливі подальші покращення:

* Production deployment
* Server-side pagination
* розширені фільтри вакансій
* автоматизовані тести
* CI/CD
* Production file storage
* push-сповіщення
* покращена offline-підтримка Mobile
* моніторинг та логування

---

#  Репозиторій

GitHub:

https://github.com/ilusha12321/job-board
