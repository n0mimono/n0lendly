package infra

import (
	"n0lendly/app/domain"

	"github.com/jinzhu/gorm"
)

type Access struct {
	Db *gorm.DB
}

type AccountAccess struct {
	Access
}

type LinkAccess struct {
	Access
}

type SessionAccess struct {
	Access
}

type ReuseAccess struct {
	Access
}

func (user User) in(u *domain.User) User {
	ret := User{
		Sub:     u.Sub,
		Name:    u.Name,
		Picture: u.Picture,
		Email:   u.Email,
	}
	ret.ID = u.ID
	return ret
}

func (user User) out() *domain.User {
	return &domain.User{
		ID:      user.ID,
		Sub:     user.Sub,
		Name:    user.Name,
		Picture: user.Picture,
		Email:   user.Email,
	}
}

func (token Token) in(t *domain.Token) Token {
	ret := Token{
		UserID:       t.UserID,
		AccessToken:  t.AccessToken,
		RefreshToken: t.RefreshToken,
		Expire:       t.Expire,
	}
	ret.ID = t.ID
	return ret
}

func (token Token) out() *domain.Token {
	return &domain.Token{
		ID:           token.ID,
		UserID:       token.UserID,
		AccessToken:  token.AccessToken,
		RefreshToken: token.RefreshToken,
		Expire:       token.Expire,
	}
}

func (link Link) in(l *domain.Link) Link {
	ret := Link{
		UserID:         l.UserID,
		Address:        l.Address,
		ShowName:       l.ShowName,
		Description:    l.Description,
		CalSummary:     l.CalSummary,
		CalDescription: l.CalDescription,
		RangeMin:       l.RangeMin,
		RangeMax:       l.RangeMax,
		VisibleWeek:    l.VisibleWeek,
		NextGuide:      l.NextGuide,
	}
	ret.ID = l.ID
	return ret
}

func (link Link) out() *domain.Link {
	return &domain.Link{
		ID:             link.ID,
		UserID:         link.UserID,
		Address:        link.Address,
		ShowName:       link.ShowName,
		Description:    link.Description,
		CalSummary:     link.CalSummary,
		CalDescription: link.CalDescription,
		RangeMin:       link.RangeMin,
		RangeMax:       link.RangeMax,
		VisibleWeek:    link.VisibleWeek,
		NextGuide:      link.NextGuide,
	}
}

func (session Session) in(s *domain.Session) Session {
	ret := Session{
		UserID: s.UserID,
		Hash:   s.Hash,
		Expire: s.Expire,
	}
	ret.ID = s.ID
	return ret
}

func (session Session) out() *domain.Session {
	return &domain.Session{
		ID:     session.ID,
		UserID: session.UserID,
		Hash:   session.Hash,
		Expire: session.Expire,
	}
}

func (reuse Reuse) in(r *domain.Reuse) Reuse {
	ret := Reuse{
		Email:        r.Email,
		RefreshToken: r.RefreshToken,
	}
	ret.ID = r.ID
	return ret
}

func (reuse Reuse) out() *domain.Reuse {
	return &domain.Reuse{
		ID:           reuse.ID,
		Email:        reuse.Email,
		RefreshToken: reuse.RefreshToken,
	}
}

func (acc *AccountAccess) create(user User, token Token) (User, Token, error) {
	tx := acc.Db.Begin()

	tx.Create(&user)
	token.UserID = user.ID
	tx.Create(&token)

	err := tx.Commit().Error
	return user, token, err
}

func (acc *AccountAccess) Create(u *domain.User, t *domain.Token) (*domain.User, *domain.Token, error) {
	user := User{}.in(u)
	token := Token{}.in(t)

	user, token, err := acc.create(user, token)

	u = user.out()
	t = token.out()
	return u, t, err
}

func (acc *AccountAccess) delete(user User) error {
	tx := acc.Db.Begin()

	tokens := []Token{}
	acc.Db.Find(&tokens, "user_id=?", user.ID)

	links := []Link{}
	acc.Db.Find(&links, "user_id=?", user.ID)

	sessions := []Session{}
	acc.Db.Find(&sessions, "user_id=?", user.ID)

	tx.Delete(tokens)
	tx.Delete(links)
	tx.Delete(sessions)
	tx.Delete(user)

	return tx.Commit().Error
}

func (acc *AccountAccess) Delete(u *domain.User) error {
	user := User{}.in(u)

	return acc.delete(user)
}

func (acc *AccountAccess) getUser(user User) (User, bool) {
	notFound := acc.Db.First(&user).RecordNotFound()

	return user, !notFound
}

func (acc *AccountAccess) GetUser(u *domain.User) (*domain.User, bool) {
	user := User{}
	user.ID = u.ID

	user, exist := acc.getUser(user)

	return user.out(), exist
}

func (acc *AccountAccess) getUserByEmail(email string) (User, bool) {
	user := User{}
	notFound := acc.Db.Where("email=?", email).First(&user).RecordNotFound()

	return user, !notFound
}

func (acc *AccountAccess) GetUserByEmail(email string) (*domain.User, bool) {
	user, exist := acc.getUserByEmail(email)

	return user.out(), exist
}

func (acc *AccountAccess) getToken(user User) (Token, bool) {
	token := Token{}
	notFound := acc.Db.Where("user_id=?", user.ID).First(&token).RecordNotFound()

	return token, !notFound
}

func (acc *AccountAccess) GetToken(u *domain.User) (*domain.Token, bool) {
	user := User{}.in(u)
	token, exist := acc.getToken(user)

	return token.out(), exist
}

func (acc *AccountAccess) getLink(user User) (Link, bool) {
	link := Link{}
	notFound := acc.Db.Where("user_id=?", user.ID).First(&link).RecordNotFound()

	return link, !notFound
}

func (acc *AccountAccess) GetLink(u *domain.User) (*domain.Link, bool) {
	user := User{}.in(u)
	link, exist := acc.getLink(user)

	return link.out(), exist
}

func (acc *AccountAccess) getSession(user User) (Session, bool) {
	session := Session{}
	notFound := acc.Db.Where("user_id=?", user.ID).First(&session).RecordNotFound()

	return session, !notFound
}

func (acc *AccountAccess) GetSession(u *domain.User) (*domain.Session, bool) {
	user := User{}.in(u)
	session, exist := acc.getSession(user)

	return session.out(), exist
}

func (acc *AccountAccess) getSessionByHash(hash string) (Session, bool) {
	session := Session{}
	notFound := acc.Db.Where("hash=?", hash).First(&session).RecordNotFound()

	return session, !notFound
}

func (acc *AccountAccess) GetSessionByHash(hash string) (*domain.Session, bool) {
	session, exist := acc.getSessionByHash(hash)

	return session.out(), exist
}

func (acc *AccountAccess) updateToken(token Token) (Token, error) {
	tx := acc.Db.Begin()

	user := User{}
	user.ID = token.UserID

	prev, _ := acc.getToken(user)
	tx.Model(&prev).Update(&token)

	err := tx.Commit().Error
	return token, err
}

func (acc *AccountAccess) UpdateToken(t *domain.Token) (*domain.Token, error) {
	token := Token{}.in(t)
	token, err := acc.updateToken(token)

	return token.out(), err
}

func (acc *LinkAccess) create(link Link) (Link, error) {
	tx := acc.Db.Begin()

	tx.Create(&link)

	err := tx.Commit().Error
	return link, err
}

func (acc *LinkAccess) Create(l *domain.Link) (*domain.Link, error) {
	link := Link{}.in(l)

	link, err := acc.create(link)

	return link.out(), err
}

func (acc *LinkAccess) get(link Link) (Link, bool) {
	notFound := acc.Db.Where("id=?", link.ID).First(&link).RecordNotFound()

	return link, !notFound
}

func (acc *LinkAccess) update(link Link) (Link, error) {
	tx := acc.Db.Begin()

	prev, _ := acc.get(link)
	tx.Model(&prev).Update(&link)

	err := tx.Commit().Error
	return link, err
}

func (acc *LinkAccess) Update(l *domain.Link) (*domain.Link, error) {
	link := Link{}.in(l)

	link, err := acc.update(link)

	return link.out(), err
}

func (acc *LinkAccess) getkByAddress(address string) (Link, bool) {
	link := Link{}
	notFound := acc.Db.Where("address=?", address).First(&link).RecordNotFound()

	return link, !notFound
}

func (acc *LinkAccess) GetByAddress(address string) (*domain.Link, bool) {
	link, exist := acc.getkByAddress(address)

	return link.out(), exist
}

func (acc *SessionAccess) create(session Session) (Session, error) {
	tx := acc.Db.Begin()

	tx.Create(&session)

	err := tx.Commit().Error
	return session, err
}

func (acc *SessionAccess) Create(s *domain.Session) (*domain.Session, error) {
	session := Session{}.in(s)

	session, err := acc.create(session)
	return session.out(), err
}

func (acc *SessionAccess) get(session Session) (Session, bool) {
	notFound := acc.Db.Where("id=?", session.ID).First(&session).RecordNotFound()

	return session, !notFound
}

func (acc *SessionAccess) update(session Session) (Session, error) {
	tx := acc.Db.Begin()

	prev, _ := acc.get(session)
	tx.Model(&prev).Update(&session)

	err := tx.Commit().Error
	return session, err
}

func (acc *SessionAccess) Update(s *domain.Session) (*domain.Session, error) {
	session := Session{}.in(s)

	session, err := acc.update(session)

	return session.out(), err
}

func (acc *ReuseAccess) getByEmail(email string) (Reuse, bool) {
	reuse := Reuse{}
	notFound := acc.Db.Where("email=?", email).First(&reuse).RecordNotFound()

	return reuse, !notFound
}

func (acc *ReuseAccess) GetByEmail(email string) (*domain.Reuse, bool) {
	reuse, exist := acc.getByEmail(email)

	return reuse.out(), exist
}

func (acc *ReuseAccess) create(reuse Reuse) (Reuse, error) {
	tx := acc.Db.Begin()

	tx.Create(&reuse)

	err := tx.Commit().Error
	return reuse, err
}

func (acc *ReuseAccess) Create(r *domain.Reuse) (*domain.Reuse, error) {
	reuse := Reuse{}.in(r)

	reuse, err := acc.create(reuse)

	return reuse.out(), err
}
