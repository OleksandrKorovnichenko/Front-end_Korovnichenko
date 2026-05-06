"use strict";

const labOutput =
    typeof document !== "undefined"
        ? document.getElementById("lab-output")
        : null;

function out(...args) {
    console.log(...args);
    if (labOutput) {
        const text = args
            .map((a) => {
                if (typeof a === "object" && a !== null) {
                    try {
                        return JSON.stringify(a, null, 2);
                    } catch {
                        return String(a);
                    }
                }
                return String(a);
            })
            .join(" ");
        labOutput.textContent += `${text}\n`;
    }
}

out("========== Завдання 1. Змінні та типи даних ==========");

const strPrimitive = "Портфоліо";
const numPrimitive = 2026;
const boolPrimitive = true;
const nullPrimitive = null;
let undefinedPrimitive;
const symbolPrimitive = Symbol("studentId");
const bigintPrimitive = 42n;

const primitives = [
    ["string", strPrimitive],
    ["number", numPrimitive],
    ["boolean", boolPrimitive],
    ["null", nullPrimitive],
    ["undefined", undefinedPrimitive],
    ["symbol", symbolPrimitive],
    ["bigint", bigintPrimitive],
];

for (const [label, val] of primitives) {
    out(`${label}:`, val, "| typeof:", typeof val);
}

out("Примітка: typeof null ===", typeof null, "(особливість JS)");

out("\n--- Явні перетворення ---");
out('String(42):', String(42), String(true));
out(
    'Number("123"):',
    Number("123"),
    'Number(""):',
    Number(""),
    "Number(true/false):",
    Number(true),
    Number(false),
    "Number(null):",
    Number(null),
    "Number(undefined):",
    Number(undefined),
);

out("\nBoolean (falsy):");
[false, 0, "", null, undefined, NaN].forEach((v) => {
    out(`Boolean(${String(v)}):`, Boolean(v));
});
out("Boolean (truthy приклади):");
["0", [], {}, "false", 42, -1].forEach((v) => {
    out(`Boolean:`, v, "→", Boolean(v));
});

const name = "Олександр";
const age = 22;
const university = "ХАІ";
out(
    `\nШаблонний рядок: Студент: ${name}, вік: ${age}, університет: ${university}`,
);

out("\n== проти === (мінімум 3 приклади):");
out("0 == false:", 0 == false, "| 0 === false:", 0 === false);
out('"" == false:', "" == false, '| "" === false:', "" === false);
out(
    "null == undefined:",
    null == undefined,
    "| null === undefined:",
    null === undefined,
);

out("\n========== Завдання 2. Умови та логіка ==========");

function getGrade(score) {
    const n = Number(score);
    if (!Number.isFinite(n) || n < 0 || n > 100) {
        return "невалідний бал";
    }
    if (n < 60) return "незадовільно";
    if (n < 75) return "задовільно";
    if (n < 90) return "добре";
    return "відмінно";
}

function getSeasonUA(month) {
    const m = Number(month);
    switch (m) {
        case 12:
        case 1:
        case 2:
            return "зима";
        case 3:
        case 4:
        case 5:
            return "весна";
        case 6:
        case 7:
        case 8:
            return "літо";
        case 9:
        case 10:
        case 11:
            return "осінь";
        default:
            return "невідомий місяць";
    }
}

const demoAge = 19;
const status = demoAge >= 18 ? "повнолітній" : "неповнолітній";
out("Тернарник (вік 19):", status);

out("getGrade(45):", getGrade(45));
out("getGrade(68):", getGrade(68));
out("getGrade(82):", getGrade(82));
out("getGrade(95):", getGrade(95));
out("getGrade(-1):", getGrade(-1));
out('getGrade("abc"):', getGrade("abc"));

out("getSeasonUA(3):", getSeasonUA(3));
out("getSeasonUA(7):", getSeasonUA(7));
out("getSeasonUA(13):", getSeasonUA(13));

out("\n========== Завдання 3. Масиви ==========");

let students = [
    {
        name: "Олена Коваленко",
        grade: 87,
        courses: ["JavaScript", "HTML", "CSS"],
    },
    {
        name: "Іван Петренко",
        grade: 58,
        courses: ["Python", "HTML"],
    },
    {
        name: "Марія Шевченко",
        grade: 93,
        courses: ["JavaScript", "React"],
    },
    {
        name: "Петро Бондар",
        grade: 74,
        courses: ["CSS", "Figma"],
    },
    {
        name: "Софія Лисенко",
        grade: 41,
        courses: ["JavaScript"],
    },
    {
        name: "Дмитро Гончар",
        grade: 90,
        courses: ["Node.js", "JavaScript", "HTML"],
    },
];

out("Початковий масив (6 студентів):", students.length);

students.push({
    name: "Новий Студент",
    grade: 65,
    courses: ["Git", "HTML"],
});
out("Після push:", students.length);

students.pop();
out("Після pop (видалено останнього):", students.length);

students.splice(2, 1);
out("Після splice(2,1) — видалено з середини:", students.length);

students.splice(1, 0, {
    name: "Вставлений Кандидат",
    grade: 88,
    courses: ["JavaScript", "CSS"],
});
out("Після splice(1,0,obj) — додано на індекс 1:", students.length);

const topStudent = students.find((s) => s.grade > 90);
out("Перший з оцінкою > 90 (find):", topStudent?.name, topStudent?.grade);

const jsLearners = students.filter((s) => s.courses.includes("JavaScript"));
out(
    'Студенти з курсом "JavaScript" (filter):',
    jsLearners.map((s) => s.name),
);

const avgGrade =
    students.reduce((acc, s) => acc + s.grade, 0) / students.length;
out("Середня оцінка (reduce):", avgGrade.toFixed(2));

out("\n========== Завдання 4. Функції ==========");

function rectAreaDecl(width, height) {
    return width * height;
}

const rectAreaExpr = function (width, height) {
    return width * height;
};

const rectAreaArrow = (width, height) => width * height;

out("Площа (declaration):", rectAreaDecl(4, 5));
out("Площа (expression):", rectAreaExpr(3, 6));
out("Площа (arrow):", rectAreaArrow(2, 8));

function createCounter() {
    let value = 0;
    return {
        increment() {
            value += 1;
            return value;
        },
        decrement() {
            value -= 1;
            return value;
        },
        getValue() {
            return value;
        },
    };
}

const counter = createCounter();
out("counter.increment:", counter.increment());
out("counter.increment:", counter.increment());
out("counter.decrement:", counter.decrement());
out("counter.getValue:", counter.getValue());

function createUser(name, role = "student", isActive = true) {
    return { name, role, isActive };
}

out("createUser('Анна'):", createUser("Анна"));
out("createUser('Богдан','mentor',false):", createUser("Богдан", "mentor", false));

const sum = (...numbers) =>
    numbers.reduce((acc, n) => acc + Number(n), 0);

out("sum(1,2,3):", sum(1, 2, 3));
out("sum(10,20):", sum(10, 20));

function printStudentInfo({ name: studentName, grade, courses }) {
    out(`${studentName} має оцінку ${grade}`);
    out(`Курси: ${courses.join(", ")}`);
}

printStudentInfo(students[0]);

out("\n========== Завдання 5. Об'єкти ==========");

const studentProfile = {
    firstName: "Олександр",
    lastName: "Коровніченко",
    age: 22,
    university: "ХАІ",
    grades: { math: 85, physics: 92, programming: 88 },
    isActive: true,
    getFullName() {
        return `${this.firstName} ${this.lastName}`;
    },
    getAverageGrade() {
        const vals = Object.values(this.grades);
        return vals.reduce((a, b) => a + b, 0) / vals.length;
    },
};

out("Крапкова нотація:", studentProfile.university);
const key = "isActive";
out("Дужки [змінна]:", studentProfile[key]);
out("Динамічний ключ 'grades':", studentProfile["grades"]);

out("Object.keys:", Object.keys(studentProfile));
out("Object.values (уривок):", Object.values(studentProfile.grades));
out("Object.entries (grades):", Object.entries(studentProfile.grades));

const profileCopy = { ...studentProfile };
profileCopy.age = 23;
out("Копія: змінено age у копії на", profileCopy.age);
out("Оригінал age без змін:", studentProfile.age);

const labScore = studentProfile.grades?.lab;
const mentorName = studentProfile.mentor?.name ?? "Не призначено";
out("optional chaining grades?.lab:", labScore);
out("mentor?.name ?? fallback:", mentorName);

out("\n========== Завдання 6. Ланцюжки масивів ==========");

const products = [
    {
        name: "Ноутбук",
        price: 25000,
        category: "electronics",
        inStock: true,
        quantity: 5,
    },
    {
        name: "Миша",
        price: 800,
        category: "electronics",
        inStock: true,
        quantity: 12,
    },
    {
        name: "Книга JS",
        price: 950,
        category: "books",
        inStock: true,
        quantity: 20,
    },
    {
        name: "Монітор",
        price: 12000,
        category: "electronics",
        inStock: false,
        quantity: 3,
    },
    {
        name: "Кава",
        price: 320,
        category: "food",
        inStock: true,
        quantity: 50,
    },
    {
        name: "Навушники",
        price: 4500,
        category: "electronics",
        inStock: true,
        quantity: 7,
    },
    {
        name: "Блокнот",
        price: 120,
        category: "books",
        inStock: true,
        quantity: 100,
    },
    {
        name: "Клавіатура",
        price: 2100,
        category: "electronics",
        inStock: false,
        quantity: 4,
    },
];

const totalInStockValue = products
    .filter((p) => p.inStock)
    .map((p) => p.price * p.quantity)
    .reduce((acc, v) => acc + v, 0);
out("Загальна вартість (на складі, filter→map→reduce):", totalInStockValue);

const electronicsNamesByPrice = [...products]
    .filter((p) => p.category === "electronics")
    .sort((a, b) => a.price - b.price)
    .map((p) => p.name);
out("Electronics за ціною (назви):", electronicsNamesByPrice);

const countByCategory = products.reduce((acc, p) => {
    const c = p.category;
    acc[c] = (acc[c] ?? 0) + 1;
    return acc;
}, {});
out("Кількість товарів по категоріях (reduce):", countByCategory);

const sortedByGradeDesc = [...students].sort((a, b) => b.grade - a.grade);
const sortedByName = [...students].sort((a, b) =>
    a.name.localeCompare(b.name, "uk"),
);
out("Студенти за оцінкою (↓):", sortedByGradeDesc.map((s) => `${s.name}: ${s.grade}`));
out("Студенти за ім'ям (А-Я):", sortedByName.map((s) => s.name));

out("\n========== Завдання 7. Рядки ==========");

function capitalize(str) {
    const s = String(str);
    if (s.length === 0) return "";
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function countWords(str) {
    return String(str)
        .trim()
        .split(/\s+/)
        .filter(Boolean).length;
}

function truncate(str, maxLength) {
    const s = String(str);
    if (s.length <= maxLength) return s;
    return `${s.slice(0, maxLength)}...`;
}

function isValidEmail(email) {
    if (typeof email !== "string") return false;
    if (!email.includes("@")) return false;
    const firstAt = email.indexOf("@");
    const lastAt = email.lastIndexOf("@");
    if (firstAt !== lastAt) return false;
    if (firstAt < 1) return false;
    const domain = email.slice(firstAt + 1);
    if (!domain.includes(".")) return false;
    const dotIdx = domain.lastIndexOf(".");
    const afterDot = domain.slice(dotIdx + 1);
    const beforeLastDot = domain.slice(0, dotIdx);
    if (afterDot.length < 2) return false;
    if (beforeLastDot.length < 1) return false;
    return true;
}

out('capitalize("javaScript"):', capitalize("javaScript"));
out('capitalize("hello world"):', capitalize("hello world"));

out('countWords("JavaScript це круто"):', countWords("JavaScript це круто"));
out(
    'countWords(" пробіли між словами "):',
    countWords(" пробіли між словами "),
);

out(
    "truncate довгий:",
    truncate("Це довгий текст для прикладу", 15),
);
out("truncate короткий:", truncate("Короткий", 20));

out("isValidEmail user@example.com:", isValidEmail("user@example.com"));
out("isValidEmail invalid-email:", isValidEmail("invalid-email"));
out("isValidEmail @example.com:", isValidEmail("@example.com"));
out("isValidEmail user@.com:", isValidEmail("user@.com"));
