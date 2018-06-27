package domain

import (
	"crypto/sha256"
	"encoding/hex"
	"math/rand"
	"time"
)

func AppName() string {
	return "n0lendly"
}

func GenerateHash(str string) string {
	r := rand.New(rand.NewSource(1))
	r.Seed(time.Now().UnixNano())

	raw := str + string(r.Int31())
	bytes := sha256.Sum256([]byte(raw))
	hash := hex.EncodeToString(bytes[:])

	return hash
}

func GenerateSessionHash(str string) (string, int64) {
	hash := GenerateHash(str + time.Now().Format(time.RFC3339Nano))
	expire := time.Now().Add(time.Duration(3) * time.Hour).Unix()

	return hash, expire
}

func GenerateDefaultLink(uid uint, address string, name string) *Link {
	return &Link{
		UserID:         uid,
		Address:        address,
		ShowName:       name,
		Description:    "おいでやす",
		CalSummary:     "",
		CalDescription: "",
		RangeMin:       9,
		RangeMax:       23,
	}
}

func ToExpire(expiresIn int) int64 {
	return time.Now().Add(time.Duration(expiresIn) * time.Second).Unix()
}

func ToUser(uid uint) *User {
	user := User{}
	user.ID = uid
	return &user
}

func GetEnd(start string) (string, error) {
	t, err := time.Parse(time.RFC3339, start)
	if err != nil {
		return "", err
	}

	return t.Add(1 * time.Hour).Format(time.RFC3339), nil
}

func ToCalenderSummary(summary string) string {
	if summary == "" {
		return "Checked by " + AppName()
	} else {
		return summary
	}
}

func ToCalenderDescription(description string) string {
	if description == "" {
		return description + "Powered by " + AppName() + "."
	} else {
		return description + "\n\n\nPowered by " + AppName() + "."
	}
}
