// ==========================================
// PVP SURVIVAL
// ==========================================

// ==========================================
// ИГРОК
// ==========================================

let hp = 100;
let baseHP = 100;

let strength = 0;
let agility = 0;
let armor = 0;

let kills = 0;

// Монеты храним целым числом.
// 10 = 1 монета.
let coins = 0;


// ==========================================
// ПРЕДМЕТЫ
// ==========================================

let hasIronSword = false;
let hasIronArmor = false;
let hasRunningBoots = false;


// ==========================================
// ВОЛНЫ
// ==========================================

let wave = 1;

const WAVE_TIME = 300;

let waveTimeLeft = WAVE_TIME;


// ==========================================
// СОСТОЯНИЕ ИГРЫ
// ==========================================

let gameRunning = true;

let autoAttack = false;

let canAttack = true;

let enemies = [];


// ==========================================
// ЭЛЕМЕНТЫ
// ==========================================

const arena =
    document.getElementById("arena");

const player =
    document.getElementById("player");

const attackButton =
    document.getElementById("attackButton");

const autoAttackButton =
    document.getElementById("autoAttackButton");

const gameOver =
    document.getElementById("gameOver");

const finalKills =
    document.getElementById("finalKills");

const restartButton =
    document.getElementById("restartButton");


// ==========================================
// ПОЛУЧИТЬ ЭЛЕМЕНТ
// ==========================================

function get(id) {

    return document.getElementById(id);

}


// ==========================================
// МАКСИМАЛЬНЫЙ HP
// ==========================================

function getMaxHP() {

    return baseHP + strength * 5;

}


// ==========================================
// МОНЕТЫ НА ЭКРАНЕ
// ==========================================

function getCoins() {

    return (coins / 10).toFixed(1);

}


// ==========================================
// ОБНОВЛЕНИЕ ИНТЕРФЕЙСА
// ==========================================

function updateStats() {

    const hpElement =
        get("hp");

    const strengthElement =
        get("strength");

    const agilityElement =
        get("agility");

    const armorElement =
        get("armor");

    const coinsElement =
        get("coins");

    const killsElement =
        get("kills");

    const waveElement =
        get("wave");

    const timerElement =
        get("waveTimer");

    const rewardElement =
        get("coinReward");


    // HP

    if (hpElement) {

        hpElement.textContent =
            Math.max(
                0,
                hp
            ).toFixed(1);

    }


    // Сила

    if (strengthElement) {

        strengthElement.textContent =
            strength.toFixed(1);

    }


    // Ловкость

    if (agilityElement) {

        agilityElement.textContent =
            agility.toFixed(1);

    }


    // Броня

    if (armorElement) {

        armorElement.textContent =
            armor.toFixed(1);

    }


    // Монеты

    if (coinsElement) {

        coinsElement.textContent =
            getCoins();

    }


    // Убийства

    if (killsElement) {

        killsElement.textContent =
            kills;

    }


    // Волна

    if (waveElement) {

        waveElement.textContent =
            wave;

    }


    // Таймер

    if (timerElement) {

        const minutes =
            Math.floor(
                waveTimeLeft / 60
            );

        const seconds =
            waveTimeLeft % 60;


        timerElement.textContent =
            String(minutes).padStart(2, "0")
            +
            ":"
            +
            String(seconds).padStart(2, "0");

    }


    // Награда за 10 киллов

    if (rewardElement) {

        rewardElement.textContent =
            "10 убийств = 1.0";

    }


    updateShopButtons();


    // ==========================================
    // ВАЖНО:
    // СОХРАНЯЕМ СРАЗУ
    // ==========================================

    saveGame();

}


// ==========================================
// СОЗДАНИЕ МОБА
// ==========================================

function createEnemy() {

    if (!gameRunning) {

        return;

    }


    const element =
        document.createElement("div");


    element.className =
        "enemy";


    // ======================================
    // ТИП
    // ======================================

    const random =
        Math.random();

    let type;


    if (random < 0.6) {

        type = "normal";

    }

    else if (random < 0.85) {

        type = "runner";

    }

    else {

        type = "tank";

    }


    // ======================================
    // ВИД МОБА
    // ======================================

    if (type === "normal") {

        element.textContent =
            "🤖";

    }


    if (type === "runner") {

        element.textContent =
            "🐇";

    }


    if (type === "tank") {

        element.textContent =
            "🗿";

    }


    // ======================================
    // УСКОРЕНИЕ
    // ======================================

    const speedMultiplier =
        1 +
        Math.floor(
            wave / 20
        ) * 0.15;


    // ======================================
    // СТАРТОВАЯ ПОЗИЦИЯ
    // ======================================

    let x;
    let y;


    const side =
        Math.floor(
            Math.random() * 4
        );


    if (side === 0) {

        x = -60;

        y =
            Math.random() *
            arena.clientHeight;

    }


    if (side === 1) {

        x =
            arena.clientWidth + 60;

        y =
            Math.random() *
            arena.clientHeight;

    }


    if (side === 2) {

        x =
            Math.random() *
            arena.clientWidth;

        y = -60;

    }


    if (side === 3) {

        x =
            Math.random() *
            arena.clientWidth;

        y =
            arena.clientHeight + 60;

    }


    // ======================================
    // ХАРАКТЕРИСТИКИ
    // ======================================

    let enemyHP;
    let enemySpeed;
    let enemyDamage;


    if (type === "normal") {

        enemyHP =
            5 +
            (wave - 1) * 2;

        enemySpeed =
            0.7 *
            speedMultiplier;

        enemyDamage =
            2;

    }


    if (type === "runner") {

        enemyHP =
            2 +
            (wave - 1);

        enemySpeed =
            1.6 *
            speedMultiplier;

        enemyDamage =
            1;

    }


    if (type === "tank") {

        enemyHP =
            15 +
            (wave - 1) * 4;

        enemySpeed =
            0.35 *
            speedMultiplier;

        enemyDamage =
            4;

    }


    // ======================================
    // ОБЪЕКТ
    // ======================================

    const enemy = {

        element: element,

        type: type,

        x: x,

        y: y,

        hp: enemyHP,

        speed: enemySpeed,

        damage: enemyDamage

    };


    element.style.left =
        x + "px";


    element.style.top =
        y + "px";


    arena.appendChild(
        element
    );


    enemies.push(
        enemy
    );

}


// ==========================================
// КОЛИЧЕСТВО МОБОВ
// ==========================================

function getMaxEnemies() {

    return Math.min(

        5 +
        Math.floor(
            wave / 10
        ),

        15

    );

}


// ==========================================
// ПОДДЕРЖИВАЕМ МОБОВ
// ==========================================

function maintainEnemies() {

    if (!gameRunning) {

        return;

    }


    const maxEnemies =
        getMaxEnemies();


    while (

        enemies.length <
        maxEnemies

    ) {

        createEnemy();

    }

}


// ==========================================
// ДВИЖЕНИЕ МОБОВ
// ==========================================

function moveEnemies() {

    if (!gameRunning) {

        return;

    }


    const playerX =
        arena.clientWidth / 2;


    const playerY =
        arena.clientHeight / 2;


    for (

        let i =
            enemies.length - 1;

        i >= 0;

        i--

    ) {

        const enemy =
            enemies[i];


        const dx =
            playerX -
            enemy.x;


        const dy =
            playerY -
            enemy.y;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        // Двигаем моба

        if (

            distance > 55

        ) {

            enemy.x +=

                (
                    dx /
                    distance
                ) *

                enemy.speed;


            enemy.y +=

                (
                    dy /
                    distance
                ) *

                enemy.speed;

        }


        enemy.element.style.left =
            enemy.x + "px";


        enemy.element.style.top =
            enemy.y + "px";


        // ==================================
        // МОБ ДОШЁЛ ДО ИГРОКА
        // ==================================

        if (

            distance <= 55

        ) {

            const reduction =
                armor * 0.02;


            const multiplier =
                Math.max(

                    0.1,

                    1 - reduction

                );


            const damage =
                enemy.damage *
                multiplier;


            hp -=
                damage;


            enemy.element.remove();


            enemies.splice(

                i,

                1

            );


            updateStats();


            if (

                hp <= 0

            ) {

                endGame();

                return;

            }

        }

    }

}


// ==========================================
// НАЙТИ БЛИЖАЙШЕГО МОБА
// ==========================================

function findNearestEnemy() {

    if (

        enemies.length === 0

    ) {

        return null;

    }


    const playerX =
        arena.clientWidth / 2;


    const playerY =
        arena.clientHeight / 2;


    let nearest = null;


    let nearestDistance =
        Infinity;


    for (

        const enemy of enemies

    ) {

        const dx =
            enemy.x -
            playerX;


        const dy =
            enemy.y -
            playerY;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (

            distance <
            nearestDistance

        ) {

            nearestDistance =
                distance;


            nearest =
                enemy;

        }

    }


    return nearest;

}


// ==========================================
// ЭФФЕКТ УДАРА
// ==========================================

function createHitEffect(

    x,
    y

) {

    const effect =
        document.createElement("div");


    effect.className =
        "hit-effect";


    effect.textContent =
        "💥";


    effect.style.left =
        x + "px";


    effect.style.top =
        y + "px";


    arena.appendChild(
        effect
    );


    setTimeout(

        function () {

            effect.remove();

        },

        350

    );

}


// ==========================================
// ТЕКСТ НА ЭКРАНЕ
// ==========================================

function createDamageText(

    x,
    y,
    value

) {

    const text =
        document.createElement("div");


    text.className =
        "damage-text";


    text.textContent =
        value;


    text.style.left =
        x + "px";


    text.style.top =
        y + "px";


    arena.appendChild(
        text
    );


    setTimeout(

        function () {

            text.remove();

        },

        600

    );

}


// ==========================================
// ОТБРАСЫВАНИЕ МОБА
// ==========================================

function knockbackEnemy(

    enemy

) {

    const playerX =
        arena.clientWidth / 2;


    const playerY =
        arena.clientHeight / 2;


    const dx =
        enemy.x -
        playerX;


    const dy =
        enemy.y -
        playerY;


    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    if (

        distance === 0

    ) {

        return;

    }


    const knockback =
        90;


    enemy.x +=

        (
            dx /
            distance
        ) *

        knockback;


    enemy.y +=

        (
            dy /
            distance
        ) *

        knockback;

}


// ==========================================
// УБИЙСТВО
// ==========================================

function killEnemy(

    enemy

) {

    // Удаляем моба

    enemy.element.remove();


    // Убираем из массива

    const index =
        enemies.indexOf(
            enemy
        );


    if (

        index !== -1

    ) {

        enemies.splice(

            index,

            1

        );

    }


    // ======================================
    // +1 KILL
    // ======================================

    kills++;


    // ======================================
    // +0.1 СИЛЫ
    // ======================================

    strength +=
        0.1;


    // ======================================
    // +0.1 ЛОВКОСТИ
    // ======================================

    agility +=
        0.1;


    // ======================================
    // КАЖДЫЕ 10 KILL = 1 МОНЕТА
    // ======================================

    if (

        kills % 10 === 0

    ) {

        coins +=
            10;


        createDamageText(

            enemy.x,

            enemy.y - 30,

            "+1 🪙"

        );

    }

    else {

        createDamageText(

            enemy.x,

            enemy.y - 30,

            "+0"

        );

    }


    updateStats();


    console.log(

        "Убийств:",

        kills,

        "Монет:",

        getCoins()

    );

}


// ==========================================
// АТАКА
// ==========================================

function attack() {

    if (!gameRunning) {

        return;

    }


    if (!canAttack) {

        return;

    }


    const enemy =
        findNearestEnemy();


    if (!enemy) {

        return;

    }


    canAttack =
        false;


    // Ловкость = скорость атаки

    const cooldown =
        Math.max(

            150,

            700 -
            agility * 20

        );


    setTimeout(

        function () {

            canAttack =
                true;

        },

        cooldown

    );


    // Сила = урон

    const damage =
        1 +
        strength;


    enemy.hp -=
        damage;


    // Эффект

    createHitEffect(

        enemy.x,

        enemy.y

    );


    // Урон

    createDamageText(

        enemy.x,

        enemy.y,

        "-" +
        damage.toFixed(1)

    );


    // Отбрасывание

    knockbackEnemy(
        enemy
    );


    // Анимация игрока

    if (player) {

        player.style.transform =
            "translate(-50%, -50%) scale(1.15)";


        setTimeout(

            function () {

                player.style.transform =
                    "translate(-50%, -50%) scale(1)";

            },

            80

        );

    }


    // Проверяем смерть

    if (

        enemy.hp <= 0

    ) {

        killEnemy(
            enemy
        );

    }

}


// ==========================================
// КНОПКА БИТЬ
// ==========================================

if (attackButton) {

    attackButton.addEventListener(

        "click",

        attack

    );

}


// ==========================================
// АВТОАТАКА
// ==========================================

if (autoAttackButton) {

    autoAttackButton.addEventListener(

        "click",

        function () {

            autoAttack =
                !autoAttack;


            if (autoAttack) {

                autoAttackButton.textContent =
                    "⚔️ АВТОАТАКА: ВКЛ";

            }

            else {

                autoAttackButton.textContent =
                    "⚔️ АВТОАТАКА: ВЫКЛ";

            }

        }

    );

}


// ==========================================
// ЦИКЛ АВТОАТАКИ
// ==========================================

setInterval(

    function () {

        if (

            gameRunning &&
            autoAttack

        ) {

            attack();

        }

    },

    100

);


// ==========================================
// ТАЙМЕР ВОЛН
// ==========================================

setInterval(

    function () {

        if (!gameRunning) {

            return;

        }


        waveTimeLeft--;


        if (

            waveTimeLeft <= 0

        ) {

            wave++;


            waveTimeLeft =
                WAVE_TIME;


            // Удаляем старых мобов

            for (

                const enemy of enemies

            ) {

                enemy.element.remove();

            }


            enemies = [];


            maintainEnemies();


            saveGame();

        }


        updateStats();

    },

    1000

);


// ==========================================
// ЖЕЛЕЗНЫЙ МЕЧ
// ==========================================

function buyIronSword() {

    if (

        hasIronSword

    ) {

        return;

    }


    // 1500 монет

    if (

        coins < 15000

    ) {

        alert(

            "❌ Нужно 1500 монет!"

        );

        return;

    }


    coins -=
        15000;


    strength +=
        20;


    hasIronSword =
        true;


    alert(

        "⚔️ Железный меч куплен!\n+20 силы"

    );


    updateStats();

}


// ==========================================
// ЖЕЛЕЗНАЯ БРОНЯ
// ==========================================

function buyIronArmor() {

    if (

        hasIronArmor

    ) {

        return;

    }


    // 2000 монет

    if (

        coins < 20000

    ) {

        alert(

            "❌ Нужно 2000 монет!"

        );

        return;

    }


    coins -=
        20000;


    armor +=
        10;


    hasIronArmor =
        true;


    alert(

        "🛡️ Железная броня куплена!\n+10 брони"

    );


    updateStats();

}


// ==========================================
// БЕГОВЫЕ БОТИНКИ
// ==========================================

function buyRunningBoots() {

    if (

        hasRunningBoots

    ) {

        return;

    }


    // 1200 монет

    if (

        coins < 12000

    ) {

        alert(

            "❌ Нужно 1200 монет!"

        );

        return;

    }


    coins -=
        12000;


    agility +=
        15;


    hasRunningBoots =
        true;


    alert(

        "👟 Беговые ботинки куплены!\n+15 ловкости"

    );


    updateStats();

}


// ==========================================
// ОБНОВЛЕНИЕ КНОПОК МАГАЗИНА
// ==========================================

function updateShopButtons() {

    const sword =
        get("buyIronSword");


    const armorButton =
        get("buyIronArmor");


    const boots =
        get("buyRunningBoots");


    if (sword) {

        sword.textContent =

            hasIronSword

                ? "✅ КУПЛЕНО"

                : "КУПИТЬ — 1500 🪙";


        sword.disabled =
            hasIronSword;

    }


    if (armorButton) {

        armorButton.textContent =

            hasIronArmor

                ? "✅ КУПЛЕНО"

                : "КУПИТЬ — 2000 🪙";


        armorButton.disabled =
            hasIronArmor;

    }


    if (boots) {

        boots.textContent =

            hasRunningBoots

                ? "✅ КУПЛЕНО"

                : "КУПИТЬ — 1200 🪙";


        boots.disabled =
            hasRunningBoots;

    }

}


// ==========================================
// GAME OVER
// ==========================================

function endGame() {

    gameRunning =
        false;


    autoAttack =
        false;


    // Сохраняем прогресс перед Game Over

    saveGame();


    // Удаляем мобов

    for (

        const enemy of enemies

    ) {

        enemy.element.remove();

    }


    enemies = [];


    if (finalKills) {

        finalKills.textContent =
            "Убийства: " +
            kills;

    }


    if (gameOver) {

        gameOver.style.display =
            "flex";

    }


    if (autoAttackButton) {

        autoAttackButton.textContent =
            "⚔️ АВТОАТАКА: ВЫКЛ";

    }

}


// ==========================================
// RESTART
// ==========================================

if (restartButton) {

    restartButton.addEventListener(

        "click",

        function () {

            hp =
                100;


            baseHP =
                100;


            strength =
                0;


            agility =
                0;


            armor =
                0;


            kills =
                0;


            coins =
                0;


            wave =
                1;


            waveTimeLeft =
                WAVE_TIME;


            hasIronSword =
                false;


            hasIronArmor =
                false;


            hasRunningBoots =
                false;


            gameRunning =
                true;


            autoAttack =
                false;


            canAttack =
                true;


            // Удаляем старых мобов

            for (

                const enemy of enemies

            ) {

                enemy.element.remove();

            }


            enemies = [];


            if (gameOver) {

                gameOver.style.display =
                    "none";

            }


            if (autoAttackButton) {

                autoAttackButton.textContent =
                    "⚔️ АВТОАТАКА: ВЫКЛ";

            }


            updateStats();


            // Создаём мобов

            for (

                let i = 0;

                i < 5;

                i++

            ) {

                createEnemy();

            }


            saveGame();

        }

    );

}


// ==========================================
// СОХРАНЕНИЕ ПРОГРЕССА
// ==========================================

function saveGame() {

    const saveData = {

        hp: hp,

        baseHP: baseHP,

        strength: strength,

        agility: agility,

        armor: armor,

        kills: kills,

        coins: coins,

        wave: wave,

        waveTimeLeft: waveTimeLeft,

        hasIronSword: hasIronSword,

        hasIronArmor: hasIronArmor,

        hasRunningBoots: hasRunningBoots

    };


    localStorage.setItem(

        "pvpSurvivalSave",

        JSON.stringify(saveData)

    );


    console.log(
        "💾 Игра сохранена!"
    );

}


// ==========================================
// ЗАГРУЗКА ПРОГРЕССА
// ==========================================

function loadGame() {

    const saved =
        localStorage.getItem(
            "pvpSurvivalSave"
        );


    // Если сохранения нет

    if (!saved) {

        console.log(
            "🆕 Сохранение не найдено"
        );

        return;

    }


    try {

        const data =
            JSON.parse(saved);


        hp =
            data.hp ?? 100;


        baseHP =
            data.baseHP ?? 100;


        strength =
            data.strength ?? 0;


        agility =
            data.agility ?? 0;


        armor =
            data.armor ?? 0;


        kills =
            data.kills ?? 0;


        coins =
            data.coins ?? 0;


        wave =
            data.wave ?? 1;


        waveTimeLeft =
            data.waveTimeLeft ?? WAVE_TIME;


        hasIronSword =
            data.hasIronSword ?? false;


        hasIronArmor =
            data.hasIronArmor ?? false;


        hasRunningBoots =
            data.hasRunningBoots ?? false;


        console.log(
            "💾 Сохранение загружено!"
        );


        updateStats();

    }

    catch (error) {

        console.error(

            "❌ Ошибка загрузки:",

            error

        );

    }

}


// ==========================================
// АВТОСОХРАНЕНИЕ
// ==========================================

setInterval(

    function () {

        if (gameRunning) {

            saveGame();

        }

    },

    5000

);


// ==========================================
// ПОКУПКА HP
// ==========================================

function buyHP() {

    const price =
        1000; // 100 монет


    if (

        coins < price

    ) {

        return;

    }


    coins -=
        price;


    baseHP +=
        10;


    hp +=
        10;


    updateStats();

}


// ==========================================
// ЗАПУСК
// ==========================================

loadGame();


updateStats();


// Первые 5 мобов

for (

    let i = 0;

    i < 5;

    i++

) {

    createEnemy();

}


// Движение

setInterval(

    moveEnemies,

    16

);


// Поддержание мобов

setInterval(

    maintainEnemies,

    1000

);


console.log(

    "🔥 PVP SURVIVAL ЗАПУЩЕНА!"

);