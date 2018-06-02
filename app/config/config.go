package config

import (
	"os"
)

var PORT string

var AUTH_CLIENT_ID string
var AUTH_CLIENT_SECRET string
var AUTH_REDIRECT_URI string

var DB_HOST string
var DB_PORT string
var DB_USER string
var DB_NAME string
var DB_PASSWORD string

func Init() {
	PORT = os.Getenv("PORT")

	AUTH_CLIENT_ID = os.Getenv("AUTH_CLIENT_ID")
	AUTH_CLIENT_SECRET = os.Getenv("AUTH_CLIENT_SECRET")
	AUTH_REDIRECT_URI = os.Getenv("AUTH_REDIRECT_URI")

	DB_HOST = os.Getenv("DB_HOST")
	DB_PORT = os.Getenv("DB_PORT")
	DB_USER = os.Getenv("DB_USER")
	DB_NAME = os.Getenv("DB_NAME")
	DB_PASSWORD = os.Getenv("DB_PASSWORD")
}
