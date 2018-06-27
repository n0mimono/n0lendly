package app

import (
	"n0lendly/app/domain"
	"net/http"
)

type ApiRouter map[string]ApiHandler

type ApiHandler interface {
	ServeHTTP(http.ResponseWriter, *http.Request)
	Validate() bool
}

func (router ApiRouter) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if m := router[r.Method]; m != nil {
		ok := decodeValues(getValues(r), m)
		if ok && m.Validate() {
			m.ServeHTTP(w, r)
		} else {
			executeJson(w, getError(domain.ErrorInvalidQuery))
		}
	} else {
		executeJson(w, getError(domain.ErrorInvalidMethod))
	}
}

type ApiRouterWithKey map[string]ApiHandlerWithKey

type ApiHandlerWithKey interface {
	ServeHTTP(http.ResponseWriter, *http.Request, *domain.User)
	Validate() bool
}

func (router ApiRouterWithKey) ServeHTTP(w http.ResponseWriter, r *http.Request, user *domain.User) {
	if m := router[r.Method]; m != nil {
		ok := decodeValues(getValues(r), m)
		if ok && m.Validate() {
			m.ServeHTTP(w, r, user)
		} else {
			executeJson(w, getError(domain.ErrorInvalidQuery))
		}
	} else {
		executeJson(w, getError(domain.ErrorInvalidMethod))
	}
}

type OutAccount struct {
	Name           string `json:"name"`
	Picture        string `json:"picture"`
	Email          string `json:"email"`
	Address        string `json:"address"`
	AddressValid   bool   `json:"address_valid"`
	ShowName       string `json:"show_name"`
	Description    string `json:"description"`
	CalSummary     string `json:"cal_summary"`
	CalDescription string `json:"cal_description"`
	RangeMin       int    `json:"range_min"`
	RangeMax       int    `json:"range_max"`
	VisibleWeek    int    `json:"visible_week"`
	NextGuide      string `json:"next_guide"`
	Success        bool   `json:"success"`
}

func ApiAccount(w http.ResponseWriter, r *http.Request, user *domain.User) {
	ApiRouterWithKey{
		"GET":    &ApiAccountGet{},
		"POST":   &ApiAccountPost{},
		"DELETE": &ApiAccountDelete{},
	}.ServeHTTP(w, r, user)
}

type ApiAccountGet struct{}

func (in *ApiAccountGet) ServeHTTP(w http.ResponseWriter, r *http.Request, user *domain.User) {
	link := Uc.CheckLink(InputCheckLink{Uid: user.ID})
	data := OutAccount{
		Name:           user.Name,
		Picture:        user.Picture,
		Email:          user.Email,
		Address:        link.Address,
		AddressValid:   link.Exist,
		ShowName:       link.ShowName,
		Description:    link.Description,
		CalSummary:     link.CalSummary,
		CalDescription: link.CalDescription,
		RangeMin:       link.RangeMin,
		RangeMax:       link.RangeMax,
		VisibleWeek:    link.VisibleWeek,
		NextGuide:      link.NextGuide,
		Success:        true,
	}
	executeJson(w, data)
}

func (in *ApiAccountGet) Validate() bool {
	return true
}

type ApiAccountPost struct {
	Address        string `json:"address"`
	ShowName       string `json:"show_name"`
	Description    string `json:"description"`
	CalSummary     string `json:"cal_summary"`
	CalDescription string `json:"cal_description"`
	RangeMin       int    `json:"range_min"`
	RangeMax       int    `json:"range_max"`
	VisibleWeek    int    `json:"visible_week"`
	NextGuide      string `json:"next_guide"`
}

func (in *ApiAccountPost) ServeHTTP(w http.ResponseWriter, r *http.Request, user *domain.User) {
	link := Uc.RegisterLink(InputRegisterLink{
		Uid:            user.ID,
		Address:        in.Address,
		ShowName:       in.ShowName,
		Description:    in.Description,
		CalSummary:     in.CalSummary,
		CalDescription: in.CalDescription,
		RangeMin:       in.RangeMin,
		RangeMax:       in.RangeMax,
		VisibleWeek:    in.VisibleWeek,
		NextGuide:      in.NextGuide,
	})
	data := OutAccount{
		Name:           user.Name,
		Picture:        user.Picture,
		Email:          user.Email,
		Address:        link.Address,
		AddressValid:   link.Valid,
		ShowName:       link.ShowName,
		Description:    link.Description,
		CalSummary:     link.CalDescription,
		CalDescription: link.CalDescription,
		RangeMin:       link.RangeMin,
		RangeMax:       link.RangeMax,
		VisibleWeek:    link.VisibleWeek,
		NextGuide:      link.NextGuide,
		Success:        link.Success,
	}
	executeJson(w, data)
}

func (in *ApiAccountPost) Validate() bool {
	return in.Address != "" || in.Description != ""
}

type ApiAccountDelete struct{}

func (in *ApiAccountDelete) ServeHTTP(w http.ResponseWriter, r *http.Request, user *domain.User) {
	Uc.DeleteAccount(InputDeleteAccount{Uid: user.ID})
}

func (in *ApiAccountDelete) Validate() bool {
	return true
}

type OutAvailable struct {
	Address string `json:"address"`
	Ok      bool   `json:"ok"`
	Code    int    `json:"code"`
}

func ApiAvailable(w http.ResponseWriter, r *http.Request, user *domain.User) {
	ApiRouterWithKey{
		"GET": &ApiAvailableGet{},
	}.ServeHTTP(w, r, user)
}

type ApiAvailableGet struct {
	Address string `json:"address"`
}

func (in *ApiAvailableGet) ServeHTTP(w http.ResponseWriter, r *http.Request, user *domain.User) {
	available := Uc.CheckAddressAvailable(InputCheckAddressAvailable{
		Uid:     user.ID,
		Address: in.Address,
	})
	data := OutAvailable{
		Address: in.Address,
		Ok:      available.Ok,
		Code:    available.Code,
	}
	executeJson(w, data)
}

func (in *ApiAvailableGet) Validate() bool {
	return in.Address != ""
}

type OutVisit struct {
	Address        string `json:"address"`
	Exist          bool   `json:"exist"`
	Name           string `json:"name"`
	ShowName       string `json:"show_name"`
	Description    string `json:"description"`
	CalSummary     string `json:"cal_summary"`
	CalDescription string `json:"cal_description"`
	RangeMin       int    `json:"range_min"`
	RangeMax       int    `json:"range_max"`
	VisibleWeek    int    `json:"visible_week"`
	NextGuide      string `json:"next_guide"`
}

func ApiVisit(w http.ResponseWriter, r *http.Request) {
	ApiRouter{
		"GET": &ApiVisitGet{},
	}.ServeHTTP(w, r)
}

type ApiVisitGet struct {
	Address string `json:"address"`
}

func (in *ApiVisitGet) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	visit := Uc.Visit(InputVisit{Address: in.Address})
	data := OutVisit{
		Address:        in.Address,
		Exist:          visit.Exist,
		Name:           visit.Name,
		ShowName:       visit.ShowName,
		Description:    visit.Description,
		CalSummary:     visit.CalSummary,
		CalDescription: visit.CalDescription,
		RangeMin:       visit.RangeMin,
		RangeMax:       visit.RangeMax,
		VisibleWeek:    visit.VisibleWeek,
		NextGuide:      visit.NextGuide,
	}
	executeJson(w, data)
}

func (in *ApiVisitGet) Validate() bool {
	return in.Address != ""
}

type OutVisitCalender struct {
	Address  string          `json:"address"`
	Exist    bool            `json:"exist"`
	Calender domain.Calender `json:"calender"`
	Code     int             `json:"code"`
}

func ApiVisitCalender(w http.ResponseWriter, r *http.Request) {
	ApiRouter{
		"GET": &ApiVisitCalenderGet{},
	}.ServeHTTP(w, r)
}

type ApiVisitCalenderGet struct {
	Address string `json:"address"`
	Offset  int    `json:"offset"`
}

func (in *ApiVisitCalenderGet) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	calender := Uc.CheckCalender(InputCheckCalender{
		Address: in.Address,
		Offset:  in.Offset,
	})
	data := OutVisitCalender{
		Address:  in.Address,
		Exist:    calender.Exist,
		Calender: calender.Calender,
		Code:     calender.Code,
	}
	executeJson(w, data)
}

func (in *ApiVisitCalenderGet) Validate() bool {
	return in.Address != ""
}

type OutVisitCalenderReserve struct {
	Success bool `json:"success"`
	Code    int  `json:"code"`
}

func ApiVisitCalenderReserve(w http.ResponseWriter, r *http.Request) {
	ApiRouter{
		"POST": &ApiVisitCalenderReservePost{},
	}.ServeHTTP(w, r)
}

type ApiVisitCalenderReservePost struct {
	Address     string `json:"address"`
	Time        string `json:"time"`
	SenderName  string `json:"senderName"`
	SenderEmail string `json:"senderEmail"`
	Summary     string `json:"summary"`
	Description string `json:"description"`
}

func (in *ApiVisitCalenderReservePost) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	reserve := Uc.ReserveCalender(InputReserveCalender{
		Address:     in.Address,
		Time:        in.Time,
		SenderName:  in.SenderName,
		SenderEmail: in.SenderEmail,
		Summary:     in.Summary,
		Description: in.Description,
	})

	data := OutVisitCalenderReserve{
		Success: reserve.Success,
		Code:    reserve.Code,
	}
	executeJson(w, data)
}

func (in *ApiVisitCalenderReservePost) Validate() bool {
	return in.Address != ""
}
