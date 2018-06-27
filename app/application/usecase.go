package app

import (
	"n0lendly/app/domain"
)

type Usecase struct {
	Service domain.Service
}

type InputPreAuth struct {
	Force bool
}

type OutputPreAuth struct {
	URL string
}

func (uc Usecase) PreAuth(in InputPreAuth) OutputPreAuth {
	url := uc.Service.GetAuthURL(in.Force)
	return OutputPreAuth{URL: url}
}

type InputCheckLink struct {
	Uid uint
}

type OutputCheckLink struct {
	Exist          bool
	Address        string
	ShowName       string
	Description    string
	CalSummary     string
	CalDescription string
	RangeMin       int
	RangeMax       int
}

func (uc Usecase) CheckLink(in InputCheckLink) OutputCheckLink {
	link, exist := uc.Service.GetLink(in.Uid)
	return OutputCheckLink{
		Exist:          exist,
		Address:        link.Address,
		ShowName:       link.ShowName,
		Description:    link.Description,
		CalSummary:     link.CalSummary,
		CalDescription: link.CalDescription,
		RangeMin:       link.RangeMin,
		RangeMax:       link.RangeMax,
	}
}

type InputCheckSession struct {
	Hash string
}

type OutputCheckSession struct {
	Ok   bool
	User *domain.User
	Code int
}

func (uc Usecase) CheckSession(in InputCheckSession) OutputCheckSession {
	user, ok, code := uc.Service.CheckSession(in.Hash)
	return OutputCheckSession{Ok: ok, User: user, Code: code}
}

type InputSignIn struct {
	Code string
}

type OutputSignIn struct {
	Email string
	Hash  string
}

func (uc Usecase) SignIn(in InputSignIn) OutputSignIn {
	email, hash := uc.Service.SignIn(in.Code)
	return OutputSignIn{Email: email, Hash: hash}
}

type InputSignOut struct {
	Uid uint
}

func (uc Usecase) SignOut(in InputSignOut) {
	uc.Service.SignOut(in.Uid)
}

type InputDeleteAccount struct {
	Uid uint
}

func (uc Usecase) DeleteAccount(in InputDeleteAccount) {
	uc.Service.DeleteAccount(in.Uid)
}

type InputCheckAddressAvailable struct {
	Uid     uint
	Address string
}

type OutputCheckAddressAvailable struct {
	Ok   bool
	Code int
}

func (uc Usecase) CheckAddressAvailable(in InputCheckAddressAvailable) OutputCheckAddressAvailable {
	ok, code := uc.Service.CheckAddressAvailable(in.Uid, in.Address)
	return OutputCheckAddressAvailable{Ok: ok, Code: code}
}

type InputRegisterLink struct {
	Uid            uint
	Address        string
	ShowName       string
	Description    string
	CalSummary     string
	CalDescription string
	RangeMin       int
	RangeMax       int
}

type OutputRegisterLink struct {
	Address        string
	ShowName       string
	Description    string
	CalSummary     string
	CalDescription string
	RangeMin       int
	RangeMax       int
	Valid          bool
	Success        bool
}

func (uc Usecase) RegisterLink(in InputRegisterLink) OutputRegisterLink {
	if in.Address != "" {
		ok, _ := uc.Service.CheckAddressAvailable(in.Uid, in.Address)
		if !ok {
			return OutputRegisterLink{}
		}

		link, exist, success, _ := uc.Service.RegisterLink(in.Uid, in.Address)
		return OutputRegisterLink{
			Address:     link.Address,
			Description: link.Description,
			Valid:       exist || success,
			Success:     success,
		}
	}

	next := &domain.Link{
		ID:             0,
		UserID:         0,
		Address:        "",
		ShowName:       in.ShowName,
		Description:    in.Description,
		CalSummary:     in.CalSummary,
		CalDescription: in.CalDescription,
		RangeMin:       in.RangeMin,
		RangeMax:       in.RangeMax,
	}
	link, success, _ := uc.Service.UpdateLinkOptions(in.Uid, next)

	return OutputRegisterLink{
		Address:        link.Address,
		ShowName:       link.ShowName,
		Description:    link.Description,
		CalSummary:     link.CalSummary,
		CalDescription: link.CalDescription,
		RangeMin:       link.RangeMin,
		RangeMax:       link.RangeMax,
		Valid:          true,
		Success:        success,
	}
}

type InputVisit struct {
	Address string
}

type OutputVisit struct {
	Exist          bool
	Name           string
	Address        string
	ShowName       string
	Description    string
	CalSummary     string
	CalDescription string
	RangeMin       int
	RangeMax       int
}

func (uc Usecase) Visit(in InputVisit) OutputVisit {
	user, link, exist := uc.Service.GetUserByAddress(in.Address)
	return OutputVisit{
		Exist:          exist,
		Name:           user.Name,
		Address:        link.Address,
		ShowName:       link.ShowName,
		Description:    link.Description,
		CalSummary:     link.CalSummary,
		CalDescription: link.CalDescription,
		RangeMin:       link.RangeMin,
		RangeMax:       link.RangeMax,
	}
}

type InputCheckCalender struct {
	Address string
	Offset  int
}

type OutputCheckCalender struct {
	Exist    bool
	Calender domain.Calender
	Code     int
}

func (uc Usecase) CheckCalender(in InputCheckCalender) OutputCheckCalender {
	user, _, exist := uc.Service.GetUserByAddress(in.Address)
	if !exist {
		return OutputCheckCalender{
			Exist:    false,
			Calender: domain.Calender{},
			Code:     domain.CodeAddressNotFound,
		}
	}

	calender, code := uc.Service.GetCalender(user, in.Offset)
	return OutputCheckCalender{
		Exist:    true,
		Calender: calender,
		Code:     code,
	}
}

type InputReserveCalender struct {
	Address     string
	Time        string
	SenderName  string
	SenderEmail string
	Summary     string
	Description string
}

type OutputReserveCalender struct {
	Success bool
	Code    int
}

func (uc Usecase) ReserveCalender(in InputReserveCalender) OutputReserveCalender {
	user, _, exist := uc.Service.GetUserByAddress(in.Address)
	if !exist {
		return OutputReserveCalender{
			Success: false,
			Code:    domain.CodeAddressNotFound,
		}
	}

	success, code := uc.Service.ReserveCalender(user, domain.InputReserveCalender{
		Email:       in.SenderEmail,
		Start:       in.Time,
		Summary:     in.Summary,
		Description: in.Description,
	})
	return OutputReserveCalender{
		Success: success,
		Code:    code,
	}
}
