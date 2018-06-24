package app

import (
	"n0lendly/app/domain"
	"net/http"
)

type Hello1 struct {
	Value string `json:"value"`
}

func ApiHello1(w http.ResponseWriter, r *http.Request) {
	ApiRouter{
		"GET": &ApiHello1Get{},
	}.ServeHTTP(w, r)
}

type ApiHello1Get struct{}

func (in *ApiHello1Get) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	data := Hello1{
		Value: "Hello, world!",
	}
	executeJson(w, data)
}

func (in *ApiHello1Get) Validate() bool {
	return true
}

type Hello2 struct {
	Value string `json:"value"`
}

func ApiHello2(w http.ResponseWriter, r *http.Request, user *domain.User) {
	ApiRouterWithKey{
		"GET": &ApiHello2Get{},
	}.ServeHTTP(w, r, user)
}

type ApiHello2Get struct{}

func (in *ApiHello2Get) ServeHTTP(w http.ResponseWriter, r *http.Request, user *domain.User) {
	data := Hello2{
		Value: "Hello, world!",
	}
	executeJson(w, data)
}

func (in *ApiHello2Get) Validate() bool {
	return true
}
