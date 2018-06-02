package infra

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"errors"
	"io/ioutil"
	"n0lendly/app/config"
	"n0lendly/app/domain"
	"net/http"
	"net/url"
	"strings"
	"time"
)

type Auth struct {
	ClientID     string
	ClientSecret string
	RedirectURI  string
}

func NewAuth() Auth {
	auth := Auth{}
	auth.ClientID = config.AUTH_CLIENT_ID
	auth.ClientSecret = config.AUTH_CLIENT_SECRET
	auth.RedirectURI = config.AUTH_REDIRECT_URI
	return auth
}

func (auth *Auth) AuthURL(force bool) string {
	authURL := "https://accounts.google.com/o/oauth2/auth"

	values := url.Values{}
	values.Set("response_type", "code")
	values.Set("client_id", auth.ClientID)
	values.Set("redirect_uri", auth.RedirectURI)
	values.Set("scope", "profile email openid https://www.googleapis.com/auth/calendar")
	values.Set("access_type", "offline")
	if force {
		values.Set("approval_prompt", "force")
	}

	return authURL + "?" + values.Encode()
}

func (auth *Auth) GetToken(code string) (*domain.OAuthToken, *domain.GoogleIDToken, error) {
	values := url.Values{}
	values.Set("code", code)
	values.Set("client_id", auth.ClientID)
	values.Set("client_secret", auth.ClientSecret)
	values.Set("redirect_uri", auth.RedirectURI)
	values.Set("grant_type", "authorization_code")
	values.Set("access_type", "offline")

	tokenURL := "https://www.googleapis.com/oauth2/v4/token"

	req, err := http.NewRequest("POST", tokenURL, strings.NewReader(values.Encode()))
	if err != nil {
		return &domain.OAuthToken{}, &domain.GoogleIDToken{}, err
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	client := new(http.Client)
	resp, err := client.Do(req)
	if err != nil {
		return &domain.OAuthToken{}, &domain.GoogleIDToken{}, err
	}
	defer resp.Body.Close()

	if resp.StatusCode == 400 {
		return &domain.OAuthToken{}, &domain.GoogleIDToken{}, errors.New("400 Bad Request")
	}

	bytes, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return &domain.OAuthToken{}, &domain.GoogleIDToken{}, err
	}

	token := &domain.OAuthToken{}
	err = json.Unmarshal(bytes, token)
	if err != nil {
		return &domain.OAuthToken{}, &domain.GoogleIDToken{}, err
	}
	idToken := strings.Split(token.IDToken, ".")[1]

	repl := strings.NewReplacer("_", "+", "-", "/")
	idToken = repl.Replace(idToken)
	if i := len(idToken) % 4; i != 0 {
		idToken += strings.Repeat("=", 4-i)
	}

	bytes, err = base64.StdEncoding.DecodeString(idToken)
	if err != nil {
		return token, &domain.GoogleIDToken{}, err
	}

	giToken := &domain.GoogleIDToken{}
	err = json.Unmarshal(bytes, giToken)
	if err != nil {
		return token, &domain.GoogleIDToken{}, err
	}

	return token, giToken, nil
}

func (auth *Auth) UpdateToken(refreshToken string) (*domain.OAuthToken, error) {
	values := url.Values{}
	values.Set("refresh_token", refreshToken)
	values.Set("client_id", auth.ClientID)
	values.Set("client_secret", auth.ClientSecret)
	values.Set("grant_type", "refresh_token")

	tokenURL := "https://www.googleapis.com/oauth2/v4/token"

	req, err := http.NewRequest("POST", tokenURL, strings.NewReader(values.Encode()))
	if err != nil {
		return &domain.OAuthToken{}, err
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	client := new(http.Client)
	resp, err := client.Do(req)
	if err != nil {
		return &domain.OAuthToken{}, err
	}
	defer resp.Body.Close()

	if resp.StatusCode == 400 {
		return &domain.OAuthToken{}, errors.New("400 Bad Request")
	}

	bytes, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return &domain.OAuthToken{}, err
	}

	token := &domain.OAuthToken{}
	err = json.Unmarshal(bytes, token)
	if err != nil {
		return &domain.OAuthToken{}, err
	}
	token.RefreshToken = refreshToken

	return token, nil
}

func (auth *Auth) GetCalender(user *domain.User, offset int, accessToken string) (*domain.GoogleCalenderEvents, error) {
	calenderURL := "https://www.googleapis.com/calendar/v3" +
		"/calendars/" + url.QueryEscape(user.Email) + "/events"

	values := url.Values{}
	values.Set("singleEvents", "true")
	values.Set("orderBy", "startTime")
	values.Set("timeMin", time.Now().AddDate(0, 0, -1+offset).Format(time.RFC3339))
	values.Set("timeMax", time.Now().AddDate(0, 0, 7+offset).Format(time.RFC3339))
	calenderURL = calenderURL + "?" + values.Encode()

	req, err := http.NewRequest("GET", calenderURL, nil)
	if err != nil {
		return &domain.GoogleCalenderEvents{}, err
	}
	req.Header.Set("Authorization", "Bearer "+accessToken)

	client := new(http.Client)
	resp, err := client.Do(req)
	if err != nil {
		return &domain.GoogleCalenderEvents{}, err
	}
	defer resp.Body.Close()

	if resp.StatusCode == 400 {
		return &domain.GoogleCalenderEvents{}, errors.New("400 Bad Request")
	}

	bytes, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return &domain.GoogleCalenderEvents{}, err
	}

	events := &domain.GoogleCalenderEvents{}
	err = json.Unmarshal(bytes, events)
	if err != nil {
		return &domain.GoogleCalenderEvents{}, err
	}

	return events, nil
}

func (auth *Auth) InsertCalender(in *domain.GoogleCalenderInsert) (*domain.GoogleCalenderEvents, error) {
	calenderURL := "https://www.googleapis.com/calendar/v3" +
		"/calendars/" + url.QueryEscape(in.Email) + "/events" +
		"?sendNotifications=true"

	values := map[string]interface{}{
		"end": map[string]interface{}{
			"dateTime": in.End,
		},
		"start": map[string]interface{}{
			"dateTime": in.Start,
		},
		"attendees": []map[string]interface{}{
			{
				"email": in.HostEmail,
			},
			{
				"email": in.GuestEmail,
			},
		},
		"description": in.Description,
		"summary":     in.Summary,
		"visibility":  "default",
	}
	m, err := json.Marshal(values)
	if err != nil {
		return &domain.GoogleCalenderEvents{}, err
	}

	req, err := http.NewRequest("POST", calenderURL, bytes.NewBuffer(m))
	if err != nil {
		return &domain.GoogleCalenderEvents{}, err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+in.Token.AccessToken)

	client := new(http.Client)
	resp, err := client.Do(req)
	if err != nil {
		return &domain.GoogleCalenderEvents{}, err
	}

	if resp.StatusCode == 400 {
		return &domain.GoogleCalenderEvents{}, errors.New("400 Bad Request")
	}

	bytes, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return &domain.GoogleCalenderEvents{}, err
	}

	events := &domain.GoogleCalenderEvents{}
	err = json.Unmarshal(bytes, events)
	if err != nil {
		return &domain.GoogleCalenderEvents{}, err
	}

	return events, nil
}
