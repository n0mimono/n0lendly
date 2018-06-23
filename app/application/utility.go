package app

import (
	"encoding/json"
	"fmt"
	"html/template"
	"io"
	"io/ioutil"
	"log"
	"n0lendly/app/domain"
	"net/http"
	"net/url"
	"reflect"
	"strconv"
)

func indexFileName() string {
	return "index.html"
}

func src(filename string) string {
	return "tsx/dist/" + filename
}

func parseTemplate(filename string) *template.Template {
	tmpl, err := template.
		New(filename).
		Delims("[[", "]]").
		ParseFiles(src(filename))
	if err != nil {
		log.Fatal(err)
	}
	return tmpl
}

func executeTemplate(w io.Writer, t *template.Template) {
	data := map[string]interface{}{
		"AppName": domain.AppName(),
	}

	err := t.Execute(w, data)
	if err != nil {
		fmt.Fprintf(w, string(domain.ErrorTemplateExecute))
	}
}

func executeJson(w io.Writer, data interface{}) {
	json, err := json.Marshal(&data)
	if err != nil {
		fmt.Fprintf(w, string(domain.ErrorJsonMarshal))
	} else {
		fmt.Fprintf(w, string(json))
	}
}

func toInputCheckSession(r *http.Request) InputCheckSession {
	hash := r.Header.Get("Authorization")
	if hash != "" {
		return InputCheckSession{Hash: hash}
	}

	hash = r.URL.Query().Get("key")
	if hash != "" {
		return InputCheckSession{Hash: hash}
	}

	cookie, err := r.Cookie("Hash")
	if err != nil {
		return InputCheckSession{Hash: ""}
	}
	return InputCheckSession{Hash: cookie.Value}
}

func getError(code int) map[string]interface{} {
	name, msg := getErrorNameAndMessage(code)
	return map[string]interface{}{
		"error": name,
		"code":  code,
		"msg":   msg,
	}
}

func getValues(r *http.Request) url.Values {
	switch r.Method {
	case "GET":
		return r.URL.Query()
	case "POST":
		bytes, err := ioutil.ReadAll(r.Body)
		if err != nil {
			return url.Values{}
		}

		values, err := url.ParseQuery(string(bytes))
		if err != nil {
			return url.Values{}
		}

		return values
	}
	return url.Values{}
}

func decodeValues(values url.Values, in interface{}) bool {
	t := reflect.TypeOf(in).Elem()
	rin := reflect.ValueOf(in).Elem()

	for k, v := range values {
		found := false

		for i := 0; i < t.NumField(); i++ {
			field := t.Field(i)
			tag := field.Tag.Get("json")
			if tag == k {
				found = true
				switch field.Type.Kind() {
				case reflect.String:
					rin.Field(i).SetString(v[0])
					break
				case reflect.Int:
					z, _ := strconv.Atoi(v[0])
					rin.Field(i).Set(reflect.ValueOf(z))
					break
				}
				break
			}
		}

		if !found {
			return false
		}
	}

	return true
}
