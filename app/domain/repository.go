package domain

type User struct {
	ID      uint
	Sub     string
	Name    string
	Picture string
	Email   string
}

type Token struct {
	ID           uint
	UserID       uint
	AccessToken  string
	RefreshToken string
	Expire       int64
}

type Link struct {
	ID          uint
	UserID      uint
	Address     string
	Description string
}

type Session struct {
	ID     uint
	UserID uint
	Hash   string
	Expire int64
}

type Reuse struct {
	ID           uint
	Email        string
	RefreshToken string
}

type AccountRepository interface {
	Create(*User, *Token) (*User, *Token, error)
	Delete(*User) error
	GetUser(*User) (*User, bool)
	GetUserByEmail(string) (*User, bool)
	GetToken(*User) (*Token, bool)
	GetLink(*User) (*Link, bool)
	GetSession(*User) (*Session, bool)
	GetSessionByHash(string) (*Session, bool)
	UpdateToken(*Token) (*Token, error)
}

type LinkRepository interface {
	Create(*Link) (*Link, error)
	Update(*Link) (*Link, error)
	GetByAddress(string) (*Link, bool)
}

type SessionRepository interface {
	Create(*Session) (*Session, error)
	Update(*Session) (*Session, error)
}

type ReuseRepository interface {
	GetByEmail(string) (*Reuse, bool)
	Create(*Reuse) (*Reuse, error)
}
