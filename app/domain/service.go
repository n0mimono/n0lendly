package domain

import (
	"errors"
	"time"
)

type Service struct {
	Repo Repository
	Auth Auth
}

type Repository struct {
	Account AccountRepository
	Link    LinkRepository
	Session SessionRepository
	Reuse   ReuseRepository
}

func (service Service) GetAuthURL(force bool) string {
	return service.Auth.AuthURL(force)
}

func (service Service) GetLink(uid uint) (*Link, bool) {
	return service.Repo.Account.GetLink(ToUser(uid))
}

func (service Service) GetUserByAddress(address string) (*User, *Link, bool) {
	link, exist := service.Repo.Link.GetByAddress(address)
	if !exist {
		return &User{}, &Link{}, false
	}

	user, exist := service.Repo.Account.GetUser(ToUser(link.UserID))
	if !exist {
		return &User{}, link, false
	}

	return user, link, true
}

func (service Service) CheckAddressAvailable(uid uint, address string) (bool, int) {
	if len(address) < 2 {
		return false, CodeAddressTooShort
	}

	link, exist := service.Repo.Link.GetByAddress(address)
	if !exist {
		return true, CodeAddressAvailable
	} else if link.UserID == uid {
		return true, CodeAddressAvailable
	} else {
		return false, CodeAddressExist
	}
}

func (service Service) CheckSession(hash string) (*User, bool, int) {
	// check session
	session, exist := service.Repo.Account.GetSessionByHash(hash)
	if !exist {
		return &User{}, false, CodeSessionNotExist
	}

	// check expire
	if time.Now().Unix() > session.Expire {
		return &User{}, false, CodeSessionInvalidExpire
	}

	// get user
	user, exist := service.Repo.Account.GetUser(ToUser(session.UserID))
	if !exist {
		return user, false, CodeSessionAccountNotExist
	}

	// update session
	/*
		_, expire := GenerateSessionHash(string(user.Email))
		session.Expire = expire

		session, err := service.Repo.Session.Update(session)
		if err != nil {
			return user, false, CodeSessionUpdateFailure
		}
	*/

	return user, true, CodeSessionValid
}

func (service Service) SignIn(code string) (string, string) {
	// code to token
	auToken, giToken, _ := service.Auth.GetToken(code)
	email := giToken.Email

	// reuse refresh
	if auToken.RefreshToken == "" {
		reuse, _ := service.Repo.Reuse.GetByEmail(email)
		auToken.RefreshToken = reuse.RefreshToken
	} else {
		reuse := &Reuse{Email: email, RefreshToken: auToken.RefreshToken}
		_, _ = service.Repo.Reuse.Create(reuse)
	}

	// check account
	user, existAccount := service.Repo.Account.GetUserByEmail(email)
	if !existAccount {
		// create account
		user = &User{
			Sub:     giToken.Sub,
			Name:    giToken.Name,
			Picture: giToken.Picture,
			Email:   giToken.Email,
		}
		token := &Token{
			AccessToken:  auToken.AccessToken,
			RefreshToken: auToken.RefreshToken,
			Expire:       ToExpire(auToken.ExpiresIn),
		}
		user, _, _ = service.Repo.Account.Create(user, token)
	}

	// check session
	session, exist := service.Repo.Account.GetSession(user)

	// make sessoin
	hash, expire := GenerateSessionHash(string(user.Email))
	session.UserID = user.ID
	session.Hash = hash
	session.Expire = expire

	if exist {
		service.Repo.Session.Update(session)
	} else {
		service.Repo.Session.Create(session)
	}

	return user.Email, session.Hash
}

func (service Service) SignOut(uid uint) {
	session, _ := service.Repo.Account.GetSession(ToUser(uid))
	session.Expire = 10

	service.Repo.Session.Update(session)
}

func (service Service) DeleteAccount(uid uint) {
	service.Repo.Account.Delete(ToUser(uid))
}

func (service Service) RegisterLink(uid uint, address string) (*Link, bool, bool, int) {
	link, exist := service.Repo.Account.GetLink(ToUser(uid))

	if exist {
		// update link
		link.Address = address
		link, err := service.Repo.Link.Update(link)
		if err != nil {
			return link, true, false, CodeLinkUpdateFailure
		} else {
			return link, true, true, CodeLinkUpdateSuccess
		}
	} else {
		// create link
		link = &Link{
			UserID:      uid,
			Address:     address,
			Description: GenerateDefaultLinkDescription(),
		}
		link, err := service.Repo.Link.Create(link)
		if err != nil {
			return link, false, false, CodeLinkCreateFailure
		} else {
			return link, false, true, CodeLinkCreateSuccess
		}
	}
}

func (service Service) UpdateLinkDescription(uid uint, description string) (*Link, bool, int) {
	link, exist := service.Repo.Account.GetLink(ToUser(uid))
	if !exist {
		return link, false, CodeLinkUpdateFailure
	}

	link.Description = description

	link, err := service.Repo.Link.Update(link)
	if err != nil {
		return link, false, CodeLinkUpdateFailure
	}

	return link, true, CodeLinkUpdateSuccess
}

func (service Service) getTokenWithUpdate(user *User) (*Token, error) {
	// get token
	token, exist := service.Repo.Account.GetToken(user)
	if !exist {
		return &Token{}, errors.New("Token Not Exist")
	}

	// update token if it expire
	if time.Now().Unix() > token.Expire {
		auToken, err := service.Auth.UpdateToken(token.RefreshToken)
		if err != nil {
			return &Token{}, err
		}

		next := &Token{
			AccessToken:  auToken.AccessToken,
			RefreshToken: auToken.RefreshToken,
			Expire:       ToExpire(auToken.ExpiresIn),
		}
		next.ID = token.ID
		_, err = service.Repo.Account.UpdateToken(next)
		if err != nil {
			return &Token{}, err
		}

		token = next
	}

	return token, nil
}

func (service Service) GetCalender(user *User, offset int) (Calender, int) {
	token, err := service.getTokenWithUpdate(user)
	if err != nil {
		return Calender{}, CodeCalenderGetTokenFailure
	}

	// get calender
	evs, err := service.Auth.GetCalender(user, offset, token.AccessToken)
	if err != nil {
		return Calender{}, CodeCalenderGetFailure
	}

	events := []CalenderEvent{}
	for _, v := range evs.Items {
		events = append(events, CalenderEvent{
			Summary: v.Summary,
			Start:   v.Start.DateTime,
			End:     v.End.DateTime,
		})
	}
	calender := Calender{
		Events: events,
	}

	return calender, CodeCalenderGetSuccess
}

type InputReserveCalender struct {
	Email       string
	Start       string
	Summary     string
	Description string
}

func (service Service) ReserveCalender(user *User, in InputReserveCalender) (bool, int) {
	agent := user

	token, err := service.getTokenWithUpdate(agent)
	if err != nil {
		return false, CodeCalenderReserveTokenFailure
	}

	end, err := GetEnd(in.Start)
	if err != nil {
		return false, CodeCalenderReserveFailure
	}

	insert := &GoogleCalenderInsert{
		Email:       agent.Email,
		Token:       token,
		HostEmail:   user.Email,
		GuestEmail:  in.Email,
		Start:       in.Start,
		End:         end,
		Summary:     ToCalenderSummary(in.Summary),
		Description: ToCalenderDescription(in.Description),
	}
	_, err = service.Auth.InsertCalender(insert)

	if err != nil {
		return false, CodeCalenderReserveInsertFailure
	}

	return true, 0
}
