package app

import (
	"n0lendly/app/config"
	"n0lendly/app/domain"
	"net/http"
)

var Uc = &Usecase{}

func Init(uc *Usecase) {
	Uc = uc
}

type HandlerFuncWithSession func(http.ResponseWriter, *http.Request, *domain.User)

func ListenAndServe() {
	// http: register handlers
	http.Handle("/assets/", http.StripPrefix("/assets/", http.FileServer(http.Dir("tsx/dist/assets"))))
	http.Handle("/imgs/", http.StripPrefix("/imgs/", http.FileServer(http.Dir("tsx/dist/imgs"))))

	http.HandleFunc("/", Index)
	http.HandleFunc("/start/", withKey(Start, "/login/"))
	http.HandleFunc("/login/", SignIn)
	http.HandleFunc("/logout/", withKey(SignOut, "/"))
	http.HandleFunc("/dashboard/", withKey(Dashboard, "/"))

	// http: register apis
	http.HandleFunc("/api/account/", withKeyAPI(ApiAccount))
	http.HandleFunc("/api/available/", withKeyAPI(ApiAvailable))
	http.HandleFunc("/api/visit/", ApiVisit)
	http.HandleFunc("/api/visit/calender/", ApiVisitCalender)
	http.HandleFunc("/api/visit/calender/reserve/", ApiVisitCalenderReserve)

	// http: listen
	port := config.PORT
	http.ListenAndServe(":"+port, nil)
}

func withKey(fn HandlerFuncWithSession, url string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		session := Uc.CheckSession(toInputCheckSession(r))

		if session.Ok {
			fn(w, r, session.User)
		} else {
			http.Redirect(w, r, url, 303)
		}
	}
}

func withKeyAPI(fn HandlerFuncWithSession) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		session := Uc.CheckSession(toInputCheckSession(r))

		if session.Ok {
			fn(w, r, session.User)
		} else {
			executeJson(w, getError(domain.ErrorSessionDisConnect))
		}
	}
}

func Index(w http.ResponseWriter, r *http.Request) {
	filename := "top.html"
	if r.URL.Path != "/" {
		filename = "visit.html"
	}

	tmpl := parseTemplate(filename)
	executeTemplate(w, tmpl)
}

func Start(w http.ResponseWriter, r *http.Request, user *domain.User) {
	http.Redirect(w, r, "/dashboard/", 303)
}

func SignIn(w http.ResponseWriter, r *http.Request) {
	queries := getValues(r)

	if len(queries) == 0 {
		preAuth := Uc.PreAuth(InputPreAuth{Force: false})
		http.Redirect(w, r, preAuth.URL, 303)
	} else if _, ok := queries["force"]; ok {
		preAuth := Uc.PreAuth(InputPreAuth{Force: true})
		http.Redirect(w, r, preAuth.URL, 303)
	} else if val, ok := queries["code"]; ok {
		signIn := Uc.SignIn(InputSignIn{Code: val[0]})

		http.SetCookie(w, &http.Cookie{Name: "Hash", Value: signIn.Hash, Path: "/"})
		http.Redirect(w, r, "/dashboard/", 303)
	}
}

func SignOut(w http.ResponseWriter, r *http.Request, user *domain.User) {
	Uc.SignOut(InputSignOut{Uid: user.ID})
	http.Redirect(w, r, "/", 303)
}

func Dashboard(w http.ResponseWriter, r *http.Request, user *domain.User) {
	tmpl := parseTemplate("dashboard.html")
	executeTemplate(w, tmpl)
}
