package domain

type OAuthToken struct {
	AccessToken  string `json:"access_token"`
	IDToken      string `json:"id_token"`
	ExpiresIn    int    `json:"expires_in"`
	TokenType    string `json:"token_type"`
	RefreshToken string `json:"refresh_token"`
}

type GoogleIDToken struct {
	Iss        string `json:"iss"`
	Sub        string `json:"sub"`
	Azp        string `json:"azp"`
	Iat        int    `json:"iat"`
	Exp        int    `json:"exp"`
	Name       string `json:"name"`
	GivenName  string `json:"given_name"`
	FamilyName string `json:"family_name"`
	Picture    string `json:"picture"`
	Email      string `json:"email"`
	Local      string `json:"locale"`
}

type GoogleCalenderEvents struct {
	Kind       string                `json:"kind"`
	Etag       string                `json:"etag"`
	Summary    string                `json:"summary"`
	Updated    string                `json:"updated"`
	TimeZone   string                `json:"timeZone"`
	AccessRole string                `json:"accessRole"`
	Items      []GoogleCalenderEvent `json:"items"`
}

type GoogleCalenderEvent struct {
	Kind        string `json:"kind"`
	Etag        string `json:"etag"`
	Id          string `json:"id"`
	Status      string `json:"status"`
	HtmlLink    string `json:"htmlLink"`
	Created     string `json:"created"`
	Updated     string `json:"updated"`
	Summary     string `json:"summary"`
	Description string `json:"description"`
	Creater     struct {
		Email       string `json:"email"`
		DisplayName string `json:"displayName"`
		self        bool   `json:"self"`
	} `json:"creater"`
	Organizer struct {
		Email       string `json:"email"`
		DisplayName string `json:"displayName"`
		self        bool   `json:"self"`
	} `json:"organizer"`
	Start struct {
		DateTime string `json:"dateTime"`
	} `json:"start"`
	End struct {
		DateTime string `json:"dateTime"`
	} `json:"end"`
	Visibility string `json:"visibility"`
	ICalUID    string `json:"iCalUID"`
}

type GoogleCalenderInsert struct {
	Email       string
	Token       *Token
	HostEmail   string
	GuestEmail  string
	Start       string
	End         string
	Summary     string
	Description string
}

type Auth interface {
	AuthURL(bool) string
	GetToken(string) (*OAuthToken, *GoogleIDToken, error)
	UpdateToken(string) (*OAuthToken, error)

	GetCalender(*User, int, string) (*GoogleCalenderEvents, error)
	InsertCalender(*GoogleCalenderInsert) (*GoogleCalenderEvents, error)
}
