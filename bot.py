import os
import threading
from http.server import BaseHTTPRequestHandler, HTTPServer

from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import Application, CommandHandler, ContextTypes


TOKEN = os.environ["BOT_TOKEN"]

GAME_URL = "https://mannequien.github.io/survive-and-pvp/"


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    button = InlineKeyboardButton(
        "🎮 ИГРАТЬ",
        web_app=WebAppInfo(url=GAME_URL)
    )

    keyboard = InlineKeyboardMarkup([[button]])

    await update.message.reply_text(
        "🔥 Добро пожаловать в Survive and PvP!\n\n"
        "Выживай, убивай крипов и прокачивай персонажа!",
        reply_markup=keyboard
    )


class HealthHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"Bot is alive!")

    def log_message(self, format, *args):
        pass


def run_server():
    port = int(os.environ.get("PORT", 10000))
    server = HTTPServer(("0.0.0.0", port), HealthHandler)
    server.serve_forever()


def main():
    threading.Thread(target=run_server, daemon=True).start()

    app = Application.builder().token(TOKEN).build()
    app.add_handler(CommandHandler("start", start))

    print("🤖 Survive and PvP bot started!")
    app.run_polling()


if __name__ == "__main__":
    main()