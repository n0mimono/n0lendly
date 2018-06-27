package infra

import (
	"fmt"
	"n0lendly/app/config"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

type User struct {
	gorm.Model
	Sub     string
	Name    string
	Picture string
	Email   string
}

type Token struct {
	gorm.Model
	User         User
	UserID       uint
	AccessToken  string
	RefreshToken string
	Expire       int64
}

type Link struct {
	gorm.Model
	User           User
	UserID         uint
	Address        string `type:varchar(128);gorm:"unique"`
	ShowName       string
	Description    string
	CalSummary     string
	CalDescription string
	RangeMin       int
	RangeMax       int
	VisibleWeek    int
	NextGuide      string
}

type Session struct {
	gorm.Model
	User   User
	UserID uint
	Hash   string `type:varchar(128);gorm:"unique"`
	Expire int64
}

type Reuse struct {
	gorm.Model
	Email        string
	RefreshToken string
}

func Connect() (*gorm.DB, error) {
	info := fmt.Sprintf(
		"host=%s port=%s user=%s dbname=%s password=%s sslmode=disable",
		config.DB_HOST,
		config.DB_PORT,
		config.DB_USER,
		config.DB_NAME,
		config.DB_PASSWORD,
	)
	db, err := gorm.Open("postgres", info)

	return db, err
}

func Migrate(db *gorm.DB, dropIfExists bool) {
	if dropIfExists {
		db.DropTableIfExists("tokens")
		db.DropTableIfExists("links")
		db.DropTableIfExists("sessions")
		db.DropTableIfExists("users")
	}

	if !db.HasTable(&User{}) {
		db.AutoMigrate(&User{})
		db.AutoMigrate(&Token{})
		db.AutoMigrate(&Link{})
		db.AutoMigrate(&Session{})
		db.AutoMigrate(&Reuse{})

		db.Table("tokens").
			AddForeignKey("user_id", "users(id)", "RESTRICT", "RESTRICT")
		db.Table("links").
			AddForeignKey("user_id", "users(id)", "RESTRICT", "RESTRICT")
		db.Table("sessions").
			AddForeignKey("user_id", "users(id)", "RESTRICT", "RESTRICT")
	}
}
