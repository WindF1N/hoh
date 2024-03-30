#!/bin/bash

# Загружаем переменные из .env файла
export $(grep -v '^#' .env | xargs)

# Проверяем значение START_MODE
if [ "$START_MODE" = "dev" ]; then
    # Запускаем контейнеры в режиме разработки, включая db
    MONGODB_URI=$MONGODB_URI FLASK_ENDPOINT=$FLASK_ENDPOINT docker-compose up --build
elif [ "$START_MODE" = "prod" ]; then
    # Запускаем контейнеры в режиме продакшена, не включая db
    # Используем переменную окружения для MONGODB_URI
    MONGODB_URI=$MONGODB_URI FLASK_ENDPOINT=$FLASK_ENDPOINT docker-compose up --build --scale db=0
else
    echo "Неизвестный режим START_MODE: $START_MODE"
    exit 1
fi
