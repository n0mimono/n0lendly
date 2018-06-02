package main

import (
	"fmt"
	"n0lendly/app/application"
	"n0lendly/app/config"
	"n0lendly/app/domain"
	"n0lendly/app/infrastructure"
)

func main() {
	fmt.Println("n0lendly start!")
	// config
	config.Init()

	// db: connect
	db, err := infra.Connect()
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

	// db: migrate
	infra.Migrate(db, false)

	// infra
	repoAccount := &infra.AccountAccess{}
	repoAccount.Db = db
	repoLink := &infra.LinkAccess{}
	repoLink.Db = db
	repoSession := &infra.SessionAccess{}
	repoSession.Db = db
	repoReuse := &infra.ReuseAccess{}
	repoReuse.Db = db
	infAuth := infra.NewAuth()

	// domain
	service := domain.Service{
		Repo: domain.Repository{
			Account: repoAccount,
			Link:    repoLink,
			Session: repoSession,
			Reuse:   repoReuse,
		},
		Auth: &infAuth,
	}

	// handler
	uc := app.Usecase{Service: service}
	app.Init(&uc)
	app.ListenAndServe()

	fmt.Println("n0lendly fin...")
}
